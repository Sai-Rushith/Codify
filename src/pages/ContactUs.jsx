import React, { useEffect, useState } from "react";
import { apiConnector } from "../services/apiconnector";
import { contactusEndpoint } from "../services/apis";

// ContactForm.js
// Single-file React component (JavaScript) using Tailwind CSS — black & white theme
// Save as src/components/ContactForm.js and render <ContactForm />

export default function ContactForm() {
  // submitContactForm will receive the normalized payload and send it to your API
  const submitContactForm = async (payload) => {
    console.log("Payload to send - ", payload);
    try {
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        payload
      );
      // If your API returns a specific success structure, handle it here.
      // Example: if (res?.status === 200) { ... }
      console.log("API response - ", res);
      return { ok: true, res };
    } catch (error) {
      console.log("ERROR MESSAGE - ", error?.message ?? error);
      return { ok: false, error };
    }
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Simple email regex (reasonable, not perfect) and phone validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneDigits = (s = "") => String(s).replace(/\D/g, "");

  function validateValues(values) {
    const e = {};
    if (!values.firstName.trim()) e.firstName = "First name is required";
    if (!values.lastName.trim()) e.lastName = "Last name is required";
    if (!values.email.trim()) e.email = "Email is required";
    else if (!emailRegex.test(values.email.trim())) e.email = "Enter a valid email address";

    const digits = phoneDigits(values.phone);
    // If phone provided, check length; otherwise it's optional in this validation
    if (values.phone.trim()) {
      if (digits.length < 7 || digits.length > 15) e.phone = "Enter a valid phone number (7–15 digits)";
    }

    if (!values.message.trim()) e.message = "Message is required";
    else if (values.message.trim().length < 20) e.message = "Message should be at least 20 characters";

    if (!values.consent) e.consent = "You must agree to the privacy policy to contact us";

    return e;
  }

  // validate on change
  useEffect(() => {
    setErrors(validateValues(form));
  }, [form]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      message: true,
      consent: true,
    });

    const validation = validateValues(form);
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setSuccess("");
    setSubmitError("");

    // Build payload: normalize phone and trim strings
    const phoneOnlyDigits = phoneDigits(form.phone || "");
    const normalizedPhone = form.countryCode ? `${form.countryCode}${phoneOnlyDigits}` : phoneOnlyDigits;

    const payload = {
      firstname: (form.firstName || "").trim(),
      lastname: (form.lastName || "").trim(),
      email: (form.email || "").trim(),
      phone: normalizedPhone, // e.g. "+911234567890"
      message: (form.message || "").trim(),
    };

    try {
      const res = await submitContactForm(payload);
      if (res.ok) {
        // success
        setSuccess("Thanks — your message has been sent. We'll get back to you within 2 business days.");
        // reset form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "+91",
          phone: "",
          message: "",
          consent: false,
        });
        setTouched({});
      } else {
        setSubmitError("Something went wrong while sending your message. Please try again later.");
      }
    } catch (err) {
      setSubmitError("Something went wrong while sending your message. Please try again later.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 flex items-start justify-center mt-14">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full">
        <h1 className="text-4xl font-extrabold mb-3">Got an idea? Let's team up</h1>
        <p className="text-white/70 mb-8">Tell us more about yourself and what you're got in mind.</p>

        {/* Name row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-2 block">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-white/5 placeholder-white/40 px-4 py-3 rounded-lg border ${
                touched.firstName && errors.firstName ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Enter first name"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {touched.firstName && errors.firstName && (
              <p id="firstName-error" className="text-xs text-red-400 mt-2">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm mb-2 block">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-white/5 placeholder-white/40 px-4 py-3 rounded-lg border ${
                touched.lastName && errors.lastName ? "border-red-500" : "border-white/10"
              }`}
              placeholder="Enter last name"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {touched.lastName && errors.lastName && (
              <p id="lastName-error" className="text-xs text-red-400 mt-2">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mt-4">
          <label className="text-sm mb-2 block">Email Address</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full bg-white/5 placeholder-white/40 px-4 py-3 rounded-lg border ${
              touched.email && errors.email ? "border-red-500" : "border-white/10"
            }`}
            placeholder="Enter email address"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {touched.email && errors.email && (
            <p id="email-error" className="text-xs text-red-400 mt-2">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mt-4 grid grid-cols-4 gap-3 items-center">
          <div className="col-span-1">
            <label className="text-sm mb-2 block">Phone</label>
            <select
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
              className="w-full bg-white/5 px-3 py-3 rounded-lg border border-white/10 text-sm"
            >
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+61">+61</option>
              <option value="+91">+91</option>
              <option value="+92">+92</option>
              <option value="+93">+93</option>
            </select>
          </div>
          <div className="col-span-3">
            <label className="text-sm mb-2 block sr-only">Phone number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="12345 67890"
              className={`w-full mt-8 bg-white/5 placeholder-white/40 px-4 py-3 rounded-lg border ${
                touched.phone && errors.phone ? "border-red-500" : "border-white/10"
              }`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              type="tel" // use tel for better UX
            />
            {touched.phone && errors.phone && (
              <p id="phone-error" className="text-xs text-red-400 mt-2">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div className="mt-4">
          <label className="text-sm mb-2 block">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your message here"
            rows={8}
            className={`w-full bg-white/5 placeholder-white/40 px-4 py-3 rounded-lg border ${
              touched.message && errors.message ? "border-red-500" : "border-white/10"
            }`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {touched.message && errors.message && (
            <p id="message-error" className="text-xs text-red-400 mt-2">
              {errors.message}
            </p>
          )}
        </div>

        {/* Consent */}
        <div className="mt-4 flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={form.consent}
            onChange={handleChange}
            onBlur={handleBlur}
            className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5"
          />
          <label htmlFor="consent" className="text-sm text-white/70">
            I agree to the <a href="/privacy" className="underline">Privacy Policy</a> and to being contacted about my inquiry.
          </label>
        </div>
        {touched.consent && errors.consent && (
          <p className="text-xs text-red-400 mt-2">{errors.consent}</p>
        )}

        {/* Submit area */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full px-6 py-3 rounded-lg font-semibold ${submitting ? "opacity-70 cursor-wait" : "hover:opacity-95"} bg-white text-black`}
          >
            {submitting ? "Sending..." : "Send Message"}
          </button>

          {submitError && (
            <p className="text-xs text-red-400 mt-3">{submitError}</p>
          )}

          {success && (
            <div className="mt-4 rounded-md bg-white/5 border border-white/10 p-3 text-sm text-white/80">
              {success}
            </div>
          )}
        </div>

        <p className="text-xs text-white/50 mt-4">We respect your privacy. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}
