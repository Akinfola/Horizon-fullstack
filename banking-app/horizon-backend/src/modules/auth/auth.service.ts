import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { users } from "../../config/schema";
import { generateToken } from "../../utils/jwt";
import { RegisterInput, LoginInput } from "./auth.types";

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
      })
      .returning();

    const token = generateToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken: token,
    };
  } catch (error: any) {
    console.error("🔴 FULL ERROR:", error);
    // If it's the error we manually threw, re-throw it
    if (error.message === "Email already in use") {
      throw error;
    }
    // Prevent SQL leakage and provide a clean error for unique constraints (like SSN)
    throw new Error("An account with these details already exists.");
  }
};

export const loginService = async (input: LoginInput) => {
  const normalizedEmail = input.email.toLowerCase().trim();
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(input.password, user.password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken: token,
    };
  } catch (error) {
    console.error("🔴 FULL ERROR:", error);
    throw error;
  }
};

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
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};