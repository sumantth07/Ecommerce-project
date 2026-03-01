"use client";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import logoImage from './assets/logo.jpg';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const InputField = ({ label, id, type = "text", name, value, onChange, disabled, error, placeholder }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-xs font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      required
      disabled={disabled}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`block w-full rounded-lg px-3 py-2 text-sm text-gray-900 border transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
        ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
    />
    {error && (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
);

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = !formData.name.trim() ? "Full name is required." : "At least 2 characters.";
      isValid = false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) { errors.phone = "Phone number is required."; isValid = false; }
    else if (!phoneRegex.test(formData.phone)) { errors.phone = "Enter a valid 10-digit number."; isValid = false; }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) { errors.email = "Email is required."; isValid = false; }
    else if (!emailRegex.test(formData.email)) { errors.email = "Enter a valid email."; isValid = false; }

    if (!formData.password) { errors.password = "Password is required."; isValid = false; }
    else if (formData.password.length < 6) { errors.password = "At least 6 characters."; isValid = false; }
    else if (!/[A-Z]/.test(formData.password)) { errors.password = "Need one uppercase letter."; isValid = false; }
    else if (!/[0-9]/.test(formData.password)) { errors.password = "Need one number."; isValid = false; }

    if (!formData.confirmPassword) { errors.confirmPassword = "Please confirm password."; isValid = false; }
    else if (formData.password !== formData.confirmPassword) { errors.confirmPassword = "Passwords do not match."; isValid = false; }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name, phone: formData.phone } },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err) {
      setGlobalError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-sm w-full text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 mb-5">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">You're almost in!</h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-semibold text-gray-800">{formData.email}</span>.
            Check your inbox to activate your account.
          </p>
          <button onClick={() => navigate('/login')} className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl p-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img src={logoImage} alt="Logo" className="h-12 w-auto" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create an account</h2>
            <p className="text-xs text-gray-500">Fill in your details to get started</p>
          </div>
        </div>

        {globalError && (
          <div className="mb-4 flex items-start gap-3 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Row 1 — Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} disabled={loading} error={fieldErrors.name} placeholder="John Doe" />
            <InputField label="Phone Number" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={loading} error={fieldErrors.phone} placeholder="9876543210" />
          </div>

          {/* Row 2 — Email full width */}
          <InputField label="Email Address" id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={loading} error={fieldErrors.email} placeholder="you@example.com" />

          {/* Row 3 — Password + Confirm */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} disabled={loading} error={fieldErrors.password} placeholder="Min 6 chars, 1 uppercase, 1 number" />
            <InputField label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} error={fieldErrors.confirmPassword} placeholder="Re-enter your password" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200">
            {loading && <Spinner />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button onClick={() => navigate('/login')} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}