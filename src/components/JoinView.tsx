import React, { useState } from "react";
import { CheckCircle, AlertCircle, Sparkles, Send, GraduationCap, Mail, User, Info } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function JoinView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    interest: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const departments = [
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Metallurgical & Materials Engineering",
    "Basic Sciences & Humanities"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.interest.trim() || !formData.department) {
      setErrorMessage("Please complete all fields before registering.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("join_requests")
        .insert([{
          id: `req-${Date.now()}`,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          department: formData.department,
          interest: formData.interest.trim()
        }]);

      if (error) {
        throw new Error(error.message);
      }

      setSubmissionComplete(true);
      setFormData({ name: "", email: "", department: "", interest: "" });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="join-view-container">
      
      {/* Visual Header */}
      <div className="text-center space-y-4 mb-12 animate-fade-in">
        <span className="px-3.5 py-1 bg-[#EDE3CC] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          Volunteer Intake Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B2A4A] font-display">
          Be the Catalyst of Real Community Welfare
        </h1>
        <p className="text-sm sm:text-base text-[#1B2A4A]/80 max-w-xl mx-auto font-semibold font-sans leading-relaxed">
          Submit your application to be included in our local volunteer directories and emergency/social coordination grids.
        </p>
      </div>

      {submissionComplete ? (
        /* Success Screen State Toggle */
        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm animate-fade-in text-[#1B2A4A]">
          <div className="w-14 h-14 bg-[#1B2A4A] rounded-full flex items-center justify-center mx-auto text-[#F5EDD8] shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-[#1B2A4A] font-display">Application Received Successfully!</h3>
            <p className="text-sm text-[#1B2A4A]/85 font-sans leading-relaxed font-semibold">
              Congratulations! Your request has been securely recorded in the registry indices. The General Secretary or Admission Officer will contact you via your official email coordinates shortly regarding upcoming orientation.
            </p>
          </div>
          <button
            onClick={() => setSubmissionComplete(false)}
            className="text-xs sm:text-sm text-[#1B2A4A] font-extrabold hover:underline transition-colors cursor-pointer"
          >
            Submit Another Application &rarr;
          </button>
        </div>
      ) : (
        /* Form state card template */
        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-6 sm:p-10 shadow-xs max-w-2xl mx-auto hover:shadow-sm transition-shadow duration-350">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-600 shrink-0" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6" id="join-request-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#1B2A4A] uppercase tracking-wider font-mono">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1B2A4A]/50">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    id="join-form-name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Ahsan Malik"
                    className="w-full pl-10 pr-4 py-3.5 border border-[#D4C4A0] rounded-xl text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-[#1B2A4A] bg-[#F5EDD8] transition-all placeholder-[#1B2A4A]/40 font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-[#1B2A4A] uppercase tracking-wider font-mono">Official Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1B2A4A]/50">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="join-form-email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., ahsan@student.nitly.edu"
                    className="w-full pl-10 pr-4 py-3.5 border border-[#D4C4A0] rounded-xl text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-[#1B2A4A] bg-[#F5EDD8] transition-all placeholder-[#1B2A4A]/40 font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Department selection */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#1B2A4A] uppercase tracking-wider font-mono">Academic Department</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#1B2A4A]/50">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <select
                  name="department"
                  id="join-form-dept"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3.5 border border-[#D4C4A0] rounded-xl text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-[#1B2A4A] bg-[#F5EDD8] transition-all cursor-pointer font-semibold"
                  required
                >
                  <option value="">Select your department...</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statement of Interest */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#1B2A4A] uppercase tracking-wider font-mono">Statement of Interest & Skills</label>
              <div className="relative">
                <span className="absolute top-3.5 left-3 pointer-events-none text-[#1B2A4A]/50">
                  <Info className="h-4 w-4" />
                </span>
                <textarea
                  name="interest"
                  id="join-form-interest"
                  rows={4}
                  value={formData.interest}
                  onChange={handleInputChange}
                  placeholder="Detail why you want to volunteer, your past service experiences, or skills you want to leverage?"
                  className="w-full pl-10 pr-4 py-3.5 border border-[#D4C4A0] rounded-xl text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-[#1B2A4A] bg-[#F5EDD8] transition-all resize-y placeholder-[#1B2A4A]/40 font-semibold"
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit application trigger */}
            <button
              type="submit"
              id="btn-join-submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1B2A4A] hover:bg-[#D4C4A0] text-[#F5EDD8] hover:text-[#1B2A4A] font-extrabold rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-[#D4C4A0]/50 disabled:text-[#1B2A4A]/40 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 text-sm justify-center">
                  <span className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-[#F5EDD8] border-t-transparent inline-block"></span>
                  Transmitting request to directory...
                </span>
              ) : (
                <span className="flex items-center gap-2 justify-center">
                  <Send className="w-4 h-4" />
                  Submit Membership Application Form
                </span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
