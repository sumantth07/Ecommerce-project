import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Profile({ user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "", address: "", pincode: "",
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);

    const { data: profileData } = await supabase
      .from("profiles").select("*").eq("id", user.id).single();

    if (profileData) {
      setProfile(profileData);
      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        pincode: profileData.pincode || "",
      });
    }

    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setOrdersCount(count || 0);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: formData.name, phone: formData.phone, address: formData.address, pincode: formData.pincode })
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => ({ ...prev, ...formData }));
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || "", phone: profile?.phone || "",
      address: profile?.address || "", pincode: profile?.pincode || "",
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          <p style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-sm text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Account</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-4xl font-bold text-gray-900">
            My Profile
          </h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 text-center">
            <p className="text-2xl font-black text-gray-900">{ordersCount}</p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Orders</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 text-center">
            <p className="text-2xl font-black text-gray-900">
              {profile?.created_at ? Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24)) : 0}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Days Active</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4 text-center">
            <p className="text-sm font-bold text-gray-900">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">Member Since</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-bold text-lg">
                {profile?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile?.name || "—"}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="px-6 py-6 space-y-5">

            {/* Email — read only */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">Email</p>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="ml-auto text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Verified</span>
              </div>
            </div>

            <FieldRow label="Full Name" name="name" value={formData.name} editing={editing} onChange={handleChange} placeholder="Your full name"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
            />
            <FieldRow label="Phone Number" name="phone" value={formData.phone} editing={editing} onChange={handleChange} placeholder="10-digit phone number"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />}
            />
            <FieldRow label="Address" name="address" value={formData.address} editing={editing} onChange={handleChange} placeholder="Street address"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />}
            />
            <FieldRow label="Pincode" name="pincode" value={formData.pincode} editing={editing} onChange={handleChange} placeholder="6-digit pincode"
              icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />}
            />
          </div>

          {/* Save/Cancel */}
          {editing && (
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={handleCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:bg-gray-300 transition-colors">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button onClick={() => navigate("/orders")} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-gray-300 transition-colors text-left">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">My Orders</p>
              <p className="text-xs text-gray-400">{ordersCount} orders placed</p>
            </div>
          </button>

          <button
            onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-red-200 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-600">Sign Out</p>
              <p className="text-xs text-gray-400">Log out of your account</p>
            </div>
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${saveSuccess ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}>
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-3.5 flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-semibold">Profile updated!</p>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, name, value, editing, onChange, placeholder, icon }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
      {editing ? (
        <input name={name} value={value} onChange={onChange} placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      ) : (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
          <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icon}</svg>
          <p className="text-sm text-gray-700">{value || <span className="text-gray-300">Not set</span>}</p>
        </div>
      )}
    </div>
  );
}