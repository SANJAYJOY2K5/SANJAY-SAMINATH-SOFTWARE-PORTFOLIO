import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, AlertCircle, ExternalLink, Settings } from 'lucide-react';
import { LinkedinIcon } from './Icons';
import emailjs from '@emailjs/browser';
import confetti from 'canvas-confetti';

// ─── EmailJS Configuration ───────────────────────────────────────────────────
// To enable direct inbox delivery:
// 1. Go to https://www.emailjs.com and sign up for FREE
// 2. Add Email Service → connect your Gmail (kishorsanjay2005@gmail.com)
// 3. Create Email Template with variables: {{from_name}}, {{from_email}}, {{enquiry_type}}, {{message}}
// 4. Copy your Service ID, Template ID, and Public Key below
const EMAILJS_SERVICE_ID  = 'service_jkelz65';
const EMAILJS_TEMPLATE_ID = 'portfolio_enquiry';
const EMAILJS_PUBLIC_KEY  = 'EtO9TX1HD9huzwdNe';
// ─────────────────────────────────────────────────────────────────────────────

const isEmailJSConfigured =
  EMAILJS_SERVICE_ID  !== 'YOUR_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY  !== 'YOUR_PUBLIC_KEY';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    enquiryType: 'Hiring — Full-time',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const enquiryOptions = [
    "Hiring — Full-time",
    "Freelance project",
    "Just saying hi"
  ];

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) errs.message = 'Please enter a message.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    formData.name,
          from_email:   formData.email,
          enquiry_type: formData.enquiryType,
          message:      formData.message,
          to_email:     'kishorsanjay2005@gmail.com',
        },
        EMAILJS_PUBLIC_KEY
      );

      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('EmailJS error:', err);
      setSubmitError('Failed to send message. Please email directly at kishorsanjay2005@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#070a12] border-t border-slate-900">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Let's Build Something <span className="gradient-text">Great Together</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Whether you have an open role, a freelance AI/data project, or just want to connect — send a message directly to Sanjay's inbox.
          </p>
        </div>

        {/* EmailJS Setup Banner (only shown when not configured) */}
        {!isEmailJSConfigured && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Settings className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-amber-200 mb-1">⚡ EmailJS Setup Required — 3 Steps, 5 minutes, Free</p>
              <ol className="list-decimal list-inside space-y-0.5 text-amber-300/90">
                <li>Go to <a href="https://www.emailjs.com" target="_blank" rel="noreferrer" className="text-amber-200 underline inline-flex items-center gap-1">emailjs.com <ExternalLink className="w-3 h-3" /></a> → Sign up free</li>
                <li>Add Email Service → Connect Gmail (kishorsanjay2005@gmail.com)</li>
                <li>Create Email Template → Copy <strong>Service ID</strong>, <strong>Template ID</strong>, <strong>Public Key</strong> into <code className="bg-amber-500/10 px-1 rounded">src/components/ContactForm.tsx</code> lines 12–14</li>
              </ol>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              <h3 className="font-heading font-bold text-2xl text-white">Contact Information</h3>

              <div className="space-y-4 font-mono text-xs sm:text-sm">
                <a
                  href="mailto:kishorsanjay2005@gmail.com"
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-300 transition-colors group"
                >
                  <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Direct Email</span>
                    <span className="font-medium text-slate-200">kishorsanjay2005@gmail.com</span>
                  </div>
                </a>

                <a
                  href="tel:+917871350761"
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-green-500/40 text-slate-200 hover:text-green-300 transition-colors group"
                >
                  <div className="p-3 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Phone / WhatsApp</span>
                    <span className="font-medium text-slate-200">+91 78713 50761</span>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/sanjay-saminathan-6908202a3"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 text-slate-200 hover:text-blue-300 transition-colors group"
                >
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">LinkedIn Profile</span>
                    <span className="font-medium text-slate-200">linkedin.com/in/sanjay-saminathan</span>
                  </div>
                </a>

                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300">
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Location</span>
                    <span className="font-medium text-slate-200">Perambalur / Chennai, Tamil Nadu, India</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 text-xs text-slate-400">
                <span className="text-slate-200 font-semibold block mb-1">Prefer direct email or LinkedIn?</span>
                Click any link above — messages go straight to Sanjay.
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white">Message Delivered!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you <strong>{formData.name}</strong>! Your message has been sent directly to Sanjay's inbox. He'll respond to <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', enquiryType: 'Hiring — Full-time', message: '' });
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono rounded-xl border border-slate-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR NAME <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-950 rounded-xl border ${errors.name ? 'border-pink-500' : 'border-slate-800 focus:border-cyan-500'} text-slate-100 text-sm focus:outline-none transition-colors`}
                    />
                    {errors.name && (
                      <span className="text-xs text-pink-400 mt-1 flex items-center space-x-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /><span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR EMAIL ADDRESS <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-950 rounded-xl border ${errors.email ? 'border-pink-500' : 'border-slate-800 focus:border-cyan-500'} text-slate-100 text-sm focus:outline-none transition-colors`}
                    />
                    {errors.email && (
                      <span className="text-xs text-pink-400 mt-1 flex items-center space-x-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /><span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Enquiry Type */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">TYPE OF ENQUIRY</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {enquiryOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, enquiryType: opt })}
                          className={`py-2.5 px-3 rounded-xl text-xs font-mono border transition-all text-center ${
                            formData.enquiryType === opt
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] font-semibold'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR MESSAGE <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell Sanjay about the role or project details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-950 rounded-xl border ${errors.message ? 'border-pink-500' : 'border-slate-800 focus:border-cyan-500'} text-slate-100 text-sm focus:outline-none transition-colors resize-none`}
                    />
                    {errors.message && (
                      <span className="text-xs text-pink-400 mt-1 flex items-center space-x-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" /><span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit error */}
                  {submitError && (
                    <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-xl text-xs text-pink-300 font-mono flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isEmailJSConfigured}
                    className={`w-full py-4 font-heading font-semibold text-sm rounded-xl transition-all flex items-center justify-center space-x-2 ${
                      isEmailJSConfigured
                        ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <span>Sending to Sanjay's Inbox...</span>
                    ) : !isEmailJSConfigured ? (
                      <span className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Configure EmailJS to Enable Direct Inbox
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send to Sanjay's Inbox</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
