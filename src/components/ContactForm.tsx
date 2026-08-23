import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { LinkedinIcon } from './Icons';
import confetti from 'canvas-confetti';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const subject = encodeURIComponent(
      `[Portfolio Enquiry] ${formData.enquiryType} — from ${formData.name}`
    );
    const body = encodeURIComponent(
      `Hi Sanjay,\n\nName: ${formData.name}\nEmail: ${formData.email}\nEnquiry Type: ${formData.enquiryType}\n\nMessage:\n${formData.message}\n\n---\nSent via portfolio contact form.`
    );

    // Open Gmail compose with pre-filled message directly in the visitor's mail client
    const mailtoLink = `mailto:kishorsanjay2005@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');

    // Fire celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
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
            Whether you have an open role, a freelance AI/data project, or just want to connect, send a direct message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              
              <h3 className="font-heading font-bold text-2xl text-white">
                Contact Information
              </h3>

              <div className="space-y-4 font-mono text-xs sm:text-sm">
                
                {/* Email */}
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

                {/* Phone */}
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

                {/* LinkedIn */}
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

                {/* Location */}
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

              {/* Secondary Helper Note */}
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/80 text-xs text-slate-400">
                <span className="text-slate-200 font-semibold block mb-1">Prefer direct email or LinkedIn?</span>
                Feel free to click any link above or drop your enquiry directly through the form.
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800">
              
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out, <strong>{formData.name}</strong>. Sanjay has received your enquiry and will respond shortly via <strong>{formData.email}</strong>.
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
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR NAME <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-950 rounded-xl border ${
                        errors.name ? 'border-pink-500' : 'border-slate-800 focus:border-cyan-500'
                      } text-slate-100 text-sm focus:outline-none transition-colors font-body`}
                    />
                    {errors.name && (
                      <span className="text-xs text-pink-400 mt-1 flex items-center space-x-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.name}</span>
                      </span>
                    )}
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR EMAIL ADDRESS <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-950 rounded-xl border ${
                        errors.email ? 'border-pink-500' : 'border-slate-800 focus:border-cyan-500'
                      } text-slate-100 text-sm focus:outline-none transition-colors font-body`}
                    />
                    {errors.email && (
                      <span className="text-xs text-pink-400 mt-1 flex items-center space-x-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.email}</span>
                      </span>
                    )}
                  </div>

                  {/* Enquiry Type Selector */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      TYPE OF ENQUIRY
                    </label>
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

                  {/* Message Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      YOUR MESSAGE <span className="text-pink-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell Sanjay about the role or project details..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className={`w-full px-4 py-3 bg-slate-950 rounded-xl border ${
                        errors.message ? 'border-pink-500' : 'border-slate-800 focus:border-cyan-500'
                      } text-slate-100 text-sm focus:outline-none transition-colors font-body resize-none`}
                    />
                    {errors.message && (
                      <span className="text-xs text-pink-400 mt-1 flex items-center space-x-1 font-mono">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.message}</span>
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-heading font-semibold text-sm rounded-xl shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Message</span>
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
