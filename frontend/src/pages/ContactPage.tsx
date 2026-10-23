import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Send, CheckCircle2, AlertCircle, Building2, User, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleType, setRoleType] = useState('Volunteer');
  const [subject, setSubject] = useState('Non-Profit Verification Inquiry');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }
    if (!message.trim()) {
      errs.message = 'Please provide a message.';
    } else if (message.trim().length < 20) {
      errs.message = 'Message must be at least 20 characters long to provide sufficient context.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please resolve form highlighted fields before submitting.'
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const ref = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(ref);
      setSubmitting(false);
      addToast({
        type: 'success',
        title: 'Inquiry Submitted',
        message: `Your ticket #${ref} has been received by our platform audit team.`
      });
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest text-warmIvory text-xs font-semibold">
          <Mail className="w-3.5 h-3.5 text-limeAccent" />
          <span>Community & Partner Support</span>
        </div>
        <h1 className="text-3xl font-extrabold text-forest">Get in Touch</h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Have questions about non-profit auditing, our grounded AI assistant, or registering an organization? We respond to all verified inquiries within 24 business hours.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-2xl mx-auto">
        {submittedRef ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-primaryGreen/10 rounded-full flex items-center justify-center mx-auto text-primaryGreen">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-forest">Message Received</h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Thank you for contacting ImpactSphere AI. Your inquiry has been routed to our coordination desk under reference ID <strong className="font-mono text-forest bg-warmIvory px-2 py-0.5 rounded">{submittedRef}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmittedRef(null);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="mt-4 px-5 py-2.5 bg-forest text-warmIvory text-xs font-bold rounded-xl hover:bg-forest-700 transition-all"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                    errors.name ? 'border-red-400 bg-red-50/30' : 'border-stone-200 focus:border-primaryGreen'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex@example.org"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                    errors.email ? 'border-red-400 bg-red-50/30' : 'border-stone-200 focus:border-primaryGreen'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Role / Organization</label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 outline-none"
                >
                  <option value="Volunteer">Individual Volunteer</option>
                  <option value="Non-Profit Lead">Non-Profit Coordinator (501c3)</option>
                  <option value="Corporate Partner">Corporate CSR Partner</option>
                  <option value="Academic">Academic / Research Institution</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subject / Inquiry Domain</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-medium text-stone-700 outline-none"
                >
                  <option value="Non-Profit Verification Inquiry">Non-Profit Verification Inquiry</option>
                  <option value="Volunteering Support">Volunteering Support & Hours Logging</option>
                  <option value="RAG Assistant Integration">RAG Assistant Document Integration</option>
                  <option value="Technical Bug Report">Technical Bug Report</option>
                  <option value="Other">General Question</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Detailed Message <span className="text-red-500">*</span>
                <span className="text-stone-400 font-normal ml-1">(min 20 characters)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe your inquiry or organization in detail..."
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                }}
                className={`w-full text-xs p-3.5 rounded-xl border outline-none transition-all ${
                  errors.message ? 'border-red-400 bg-red-50/30' : 'border-stone-200 focus:border-primaryGreen'
                }`}
              />
              {errors.message && <p className="text-[11px] text-red-600 mt-1">{errors.message}</p>}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                🔒 Protected by server-side input sanitization.
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
