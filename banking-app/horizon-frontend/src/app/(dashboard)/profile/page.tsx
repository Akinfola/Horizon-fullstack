"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import AlertModal from "@/components/ui/AlertModal";
import { Mail, MapPin, Calendar, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    address: user?.address || "",
    state: user?.state || "",
    postalCode: user?.postalCode || "",
    dateOfBirth: user?.dateOfBirth || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call to update profile would go here
      // For now, just show success message
      setAlertMessage("Profile updated successfully!");
      setShowAlert(true);
      setIsEditing(false);
    } catch (error) {
      setAlertMessage("Failed to update profile. Please try again.");
      setShowAlert(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      state: user?.state || "",
      postalCode: user?.postalCode || "",
      dateOfBirth: user?.dateOfBirth || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isEditing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(user?.createdAt || "").toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon size={20} className="text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" />
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your street address"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter state"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter postal code"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEditing
                      ? "border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      : "border-gray-200 bg-gray-50 text-gray-600"
                  } outline-none transition-colors`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Alert Modal */}
      {showAlert && (
        <AlertModal
          type={alertMessage.includes("Failed") ? "error" : "success"}
          title={alertMessage.includes("Failed") ? "Error" : "Success"}
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}
