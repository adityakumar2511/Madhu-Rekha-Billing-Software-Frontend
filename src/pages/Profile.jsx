import { useState, useEffect } from "react";
import {
  Building2,
  User,
  Phone,
  Mail,
  Globe,
  Save,
  AlertCircle,
  Edit2,
  X,
} from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [profileExists, setProfileExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null); // for cancel/revert

  // start with empty values — no static defaults
  const [formData, setFormData] = useState({
    clinicName: "",
    address: "",
    pan: "",
    regNo: "",
    doctor1Name: "",
    doctor1RegNo: "",
    doctor2Name: "",
    doctor2RegNo: "",
    patientRepresentative: "",
    clinicRepresentative: "",
    phone: "",
    email: "",
    website: "",
    updatedAt: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch and interpret profile response flexibly:
  // - Accepts either { exists: true, ...profile } OR raw profile object
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/profile`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      // Normalize response: if API sends { exists: false } -> no profile.
      // If API sends { exists: true, ...profile } -> profile is rest.
      // If API sends raw profile object -> treat as profile exists.
      let exists = false;
      let profile = null;

      if (data == null) {
        exists = false;
      } else if (typeof data === "object" && "exists" in data) {
        exists = Boolean(data.exists);
        if (exists) {
          // remove the exists flag and treat rest as profile fields
          const { exists: _e, ...rest } = data;
          profile = rest;
        } else {
          profile = null;
        }
      } else {
        // treat entire response as profile (exists)
        exists = true;
        profile = data;
      }

      if (exists && profile) {
        setProfileExists(true);

        const filled = {
          clinicName: profile.clinicName || "",
          address: profile.address || "",
          pan: profile.pan || "",
          regNo: profile.regNo || "",
          doctor1Name: profile.doctor1Name || "",
          doctor1RegNo: profile.doctor1RegNo || "",
          doctor2Name: profile.doctor2Name || "",
          doctor2RegNo: profile.doctor2RegNo || "",
          patientRepresentative: profile.patientRepresentative || "",
          clinicRepresentative: profile.clinicRepresentative || "",
          phone: profile.phone || "",
          email: profile.email || "",
          website: profile.website || "",
          updatedAt: profile.updatedAt || "",
        };

        setFormData(filled);
        setOriginalProfile(filled); // save for revert
        setIsEditing(false); // view-only by default when profile exists
        setMessage({ type: "", text: "" });
      } else {
        // no profile exists -> start in editing (create) mode
        setProfileExists(false);
        setOriginalProfile(null);
        setFormData({
          clinicName: "",
          address: "",
          pan: "",
          regNo: "",
          doctor1Name: "",
          doctor1RegNo: "",
          doctor2Name: "",
          doctor2RegNo: "",
          patientRepresentative: "",
          clinicRepresentative: "",
          phone: "",
          email: "",
          website: "",
          updatedAt: "",
        });
        setIsEditing(true);
        setMessage({
          type: "info",
          text: "Welcome! Please fill in your clinic details to get started.",
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    setSaving(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.clinicName.trim()) {
      setMessage({ type: "error", text: "Clinic name is required" });
      setSaving(false);
      return;
    }
    if (!formData.address.trim()) {
      setMessage({ type: "error", text: "Address is required" });
      setSaving(false);
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || "Failed to update profile");
      }

      // server returns { success: true, profile: { ... } } in our backend
      const data = await res.json();

      // Immediately refresh profile from server to ensure canonical data (and updatedAt)
      await fetchProfile();

      setMessage({
        type: "success",
        text: "Profile saved.",
      });
    } catch (err) {
      console.error("Update profile error:", err);
      setMessage({ type: "error", text: "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    // keep a snapshot already in originalProfile
    setMessage({ type: "", text: "" });
  };

  const handleCancelEdit = () => {
    // revert to originalProfile if we have it, otherwise clear fields
    if (originalProfile) {
      setFormData(originalProfile);
    } else {
      setFormData({
        clinicName: "",
        address: "",
        pan: "",
        regNo: "",
        doctor1Name: "",
        doctor1RegNo: "",
        doctor2Name: "",
        doctor2RegNo: "",
        patientRepresentative: "",
        clinicRepresentative: "",
        phone: "",
        email: "",
        website: "",
        updatedAt: "",
      });
    }
    // if a saved profile existed, go back to view mode; if not, exit edit but remain create mode
    setIsEditing(profileExists ? false : true);
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const inputCommon =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                {profileExists ? "Clinic Profile" : "Setup Clinic Profile"}
              </h1>
            </div>
            <p className="text-gray-600">
              {profileExists
                ? "Manage your clinic information. These details will appear on invoices and receipts."
                : "Let's set up your clinic profile. Fill in the details below to get started."}
            </p>
          </div>

          {/* Edit / Cancel / Create controls */}
          <div className="flex items-center gap-2">
            {profileExists && !isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}

            {isEditing && profileExists && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : message.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-blue-50 text-blue-800 border border-blue-200"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Clinic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Clinic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Doctor 1 Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Doctor 1 Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="doctor1Name"
                  value={formData.doctor1Name}
                  onChange={handleChange}
                  placeholder="Dr. Name"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="doctor1RegNo"
                  value={formData.doctor1RegNo}
                  onChange={handleChange}
                  placeholder="12345"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Doctor 2 Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Doctor 2 Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="doctor2Name"
                  value={formData.doctor2Name}
                  onChange={handleChange}
                  placeholder="Dr. Name"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="doctor2RegNo"
                  value={formData.doctor2RegNo}
                  onChange={handleChange}
                  placeholder="12345"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="clinic@example.com"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Signature Labels */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Signature Labels (for PDFs)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient/Representative Label
                </label>
                <input
                  type="text"
                  name="patientRepresentative"
                  value={formData.patientRepresentative}
                  onChange={handleChange}
                  placeholder="Patient / Representative"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinic Representative Label
                </label>
                <input
                  type="text"
                  name="clinicRepresentative"
                  value={formData.clinicRepresentative}
                  onChange={handleChange}
                  placeholder="For Clinic"
                  disabled={!isEditing}
                  className={`${inputCommon} ${!isEditing ? "bg-gray-50" : ""}`}
                />
              </div>
            </div>
          </div>

          {/* Submit / Create Buttons */}
          <div className="flex justify-end gap-3">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  {saving ? "Saving..." : profileExists ? "Save changes" : "Create Profile"}
                </button>

                {/* Cancel for the case where profile didn't exist and user wants to clear */}
                {!profileExists && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </>
            ) : (
              // If not editing and profile doesn't exist (rare), show Create profile button to start editing
              !profileExists && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Create Profile
                </button>
              )
            )}
          </div>
        </form>

        {/* Last Updated */}
        {profileExists && formData.updatedAt && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Last updated: {new Date(formData.updatedAt).toLocaleString("en-IN")}
          </div>
        )}
      </div>
    </div>
  );
}
