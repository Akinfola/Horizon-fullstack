import bcrypt from "bcryptjs";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { users } from "../../config/schema";
import { generateToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/mailer";
import { RegisterInput, LoginInput } from "./auth.types";
import { createAuditLog } from "../audit/audit.service";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 5;

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerService = async (input: RegisterInput) => {
  const normalizedEmail = input.email.toLowerCase().trim();

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
 
    const [newUser] = await db
      .insert(users)
      .values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: normalizedEmail,
        password: hashedPassword,
        address: input.address,
        state: input.state,
        postalCode: input.postalCode,
        dateOfBirth: input.dateOfBirth,
        ssn: input.ssn,
        isVerified: false,
        verificationToken,
        verificationTokenExpiry,
      })
      .returning();

    // Send verification email
    const verifyUrl = `${CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      newUser.email,
      "Verify Your Horizon Banking Account",
      `Hello ${newUser.firstName},\n\nPlease verify your email by clicking the link below:\n${verifyUrl}\n\nThis link expires in 5 minutes.\n\nIf you did not create an account, you can safely ignore this email.`,
      `<h2>Welcome to Horizon Banking, ${newUser.firstName}!</h2>
       <p>Please verify your email address to activate your account.</p>
       <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1a56db;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Verify Email</a>
       <p>Or copy and paste this link into your browser:<br/>${verifyUrl}</p>
       <p><strong>This link expires in 5 minutes.</strong></p>
       <p>If you did not create an account, you can safely ignore this email.</p>`
    );

    await createAuditLog({
      userId: newUser.id,
      action: "REGISTER",
      metadata: { email: newUser.email },
    });

    return {
      message: "Registration successful. Please check your email to verify your account before logging in.",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified,
      },
    };
  } catch (error: any) {
    console.error("🔴 Register Error:", error);
    if (error.message === "Email already in use") throw error;
    throw new Error("An account with these details already exists.");
  }
};

// ─── Resend Verification ──────────────────────────────────────────────────────

export const resendVerificationService = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    // Return generic success to avoid user enumeration
    return { message: "If an account with that email exists, a new verification link has been sent." };
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await db
    .update(users)
    .set({ verificationToken, verificationTokenExpiry })
    .where(eq(users.id, user.id));

  await createAuditLog({
    userId: user.id,
    action: "VERIFY_EMAIL",
    metadata: { note: "Verification link resent" },
  });

  const verifyUrl = `${CLIENT_URL}/verify-email?token=${verificationToken}`;
  await sendEmail(
    user.email,
    "Verify Your Horizon Banking Account (New Link)",
    `Hello ${user.firstName},\n\nYou requested a new verification link. Click the link below to verify your email:\n${verifyUrl}\n\nThis link expires in 5 minutes.\n\nIf you did not request this, you can safely ignore this email.`,
    `<h2>Account Verification Request</h2>
     <p>Hello ${user.firstName},</p>
     <p>You requested a new verification link for your Horizon Banking account.</p>
     <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#1a56db;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Verify Email</a>
     <p>Or copy and paste this link into your browser:<br/>${verifyUrl}</p>
     <p><strong>This link expires in 5 minutes.</strong></p>
     <p>If you did not request this, you can safely ignore this email.</p>`
  );

  return { message: "A new verification link has been sent to your email." };
};

// ─── Verify Email ──────────────────────────────────────────────────────────────

export const verifyEmailService = async (token: string) => {
  if (!token) throw new Error("Verification token is required");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.verificationToken, token))
    .limit(1);

  if (!user) throw new Error("Invalid or expired verification token");

  if (user.verificationTokenExpiry && new Date() > new Date(user.verificationTokenExpiry)) {
    // Clear the expired token
    await db
      .update(users)
      .set({ verificationToken: null, verificationTokenExpiry: null })
      .where(eq(users.id, user.id));
    throw new Error("Verification link has expired. Please register again.");
  }

  if (user.isVerified) throw new Error("Email is already verified");

  await db
    .update(users)
    .set({ isVerified: true, verificationToken: null, verificationTokenExpiry: null })
    .where(eq(users.id, user.id));

  await createAuditLog({
    userId: user.id,
    action: "VERIFY_EMAIL",
  });

  return { message: "Email verified successfully. You can now log in." };
};

// ─── Login ─────────────────────────────────────────────────────────────────────

export const loginService = async (input: LoginInput) => {
  const normalizedEmail = input.email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  // Use timing-safe generic message to avoid user enumeration
  if (!user) {
    await createAuditLog({
      action: "LOGIN_FAILED",
      metadata: { email: normalizedEmail, reason: "User not found" },
    });
    throw new Error("Invalid email or password");
  }

  // Check if account is locked
  if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
    const remainingMs = new Date(user.lockedUntil).getTime() - Date.now();
    const remainingMin = Math.ceil(remainingMs / 60000);
    throw new Error(`Account is locked. Too many failed attempts. Try again in ${remainingMin} minute(s).`);
  }

  // Check email verification
  if (!user.isVerified) {
    await createAuditLog({
      userId: user.id,
      action: "LOGIN_FAILED",
      metadata: { reason: "Email not verified" },
    });
    throw new Error("Please verify your email address before logging in. Check your inbox for the verification link.");
  }

  const isMatch = await bcrypt.compare(input.password, user.password);

  if (!isMatch) {
    const newFailedAttempts = (user.failedLoginAttempts ?? 0) + 1;

    if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      // Lock the account
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
      await db
        .update(users)
        .set({ failedLoginAttempts: newFailedAttempts, lockedUntil })
        .where(eq(users.id, user.id));
      
      await createAuditLog({
        userId: user.id,
        action: "ACCOUNT_LOCKED",
        metadata: { failedAttempts: newFailedAttempts },
      });

      throw new Error(`Too many failed attempts. Your account has been locked for ${LOCKOUT_DURATION_MINUTES} minutes.`);
    }

    await db
      .update(users)
      .set({ failedLoginAttempts: newFailedAttempts })
      .where(eq(users.id, user.id));

    const attemptsLeft = MAX_FAILED_ATTEMPTS - newFailedAttempts;
    throw new Error(`Invalid email or password. ${attemptsLeft} attempt(s) remaining before your account is locked.`);
  }

  // Successful login — reset failed attempts and lockout
  await db
    .update(users)
    .set({ failedLoginAttempts: 0, lockedUntil: null })
    .where(eq(users.id, user.id));

  await createAuditLog({
    userId: user.id,
    action: "LOGIN_SUCCESS",
  });

  const token = generateToken(user.id, user.role);

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken: token, // Still returning token so controller can set cookie
  };
};

// ─── Forgot Password ───────────────────────────────────────────────────────────

export const forgotPasswordService = async (email: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  // Always return a generic success message to prevent user enumeration
  if (!user) {
    return { message: "If an account with that email exists, a password reset link has been sent." };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db
    .update(users)
    .set({ resetPasswordToken: resetToken, resetPasswordExpiry })
    .where(eq(users.id, user.id));

  await createAuditLog({
    userId: user.id,
    action: "PASSWORD_RESET_REQUEST",
  });

  const resetUrl = `${CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendEmail(
    user.email,
    "Horizon Banking — Password Reset Request",
    `Hello ${user.firstName},\n\nWe received a request to reset your Horizon Banking password.\n\nClick the link below to reset it:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you did not request a password reset, you can safely ignore this email.`,
    `<h2>Password Reset Request</h2>
     <p>Hello ${user.firstName},</p>
     <p>We received a request to reset your Horizon Banking password.</p>
     <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#1a56db;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
     <p>Or copy and paste this link into your browser:<br/>${resetUrl}</p>
     <p><strong>This link expires in 1 hour.</strong></p>
     <p>If you did not request a password reset, ignore this email — your password will remain unchanged.</p>`
  );

  return { message: "If an account with that email exists, a password reset link has been sent." };
};

// ─── Reset Password ────────────────────────────────────────────────────────────

export const resetPasswordService = async (token: string, newPassword: string) => {
  if (!token || !newPassword) {
    throw new Error("Token and new password are required");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.resetPasswordToken, token))
    .limit(1);

  if (!user) throw new Error("Invalid or expired password reset token");

  if (!user.resetPasswordExpiry || new Date() > new Date(user.resetPasswordExpiry)) {
    // Clear the expired token
    await db
      .update(users)
      .set({ resetPasswordToken: null, resetPasswordExpiry: null })
      .where(eq(users.id, user.id));
    throw new Error("Password reset link has expired. Please request a new one.");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    })
    .where(eq(users.id, user.id));

  await createAuditLog({
    userId: user.id,
    action: "PASSWORD_RESET_SUCCESS",
  });

  return { message: "Password has been reset successfully. You can now log in with your new password." };
};

// ─── Get Me ────────────────────────────────────────────────────────────────────

export const getMeService = async (userId: string) => {
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      address: users.address,
      state: users.state,
      postalCode: users.postalCode,
      dateOfBirth: users.dateOfBirth,
      role: users.role,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) throw new Error("User not found");

  return user;
};