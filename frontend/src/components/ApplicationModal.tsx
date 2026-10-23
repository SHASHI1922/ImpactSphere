import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Opportunity } from '../types';
import { X, CheckCircle2, ShieldCheck, Clock, MapPin, Sparkles, Send } from 'lucide-react';

interface Props {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplicationModal: React.FC<Props> = ({ opportunity, isOpen, onClose, onSuccess }) => {
  const { addToast } = useApp();
  const [volunteerName, setVolunteerName] = useState('Alex Chen');
  const [volunteerEmail, setVolunteerEmail] = useState('alex.chen@example.org');
  const [motivation, setMotivation] = useState('');
  const [availabilityNote, setAvailabilityNote] = useState('Available weekends and selected weekday evenings.');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  useEffect(() => {
    if (opportunity) {
      setSelectedSkills(opportunity.skills_required.slice(0, 2));
      setSubmittedAppId(null);
    }
  }, [opportunity]);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivation.trim() || motivation.length < 15) {
      addToast({
        type: 'error',
        title: 'Motivation Required',
        message: 'Please write at least 15 characters explaining your interest and qualifications.'
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createApplication({
        opportunity_id: opportunity.id,
        volunteer_name: volunteerName,
        volunteer_email: volunteerEmail,
        motivation: motivation,
        skills_offered: selectedSkills,
        availability_note: availabilityNote
      });

      setSubmittedAppId(res.id);
      addToast({
        type: 'success',
        title: 'Application Submitted!',
        message: `Your application to ${opportunity.org_name} has been received for review.`
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: 'Unable to submit application. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedAppId ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-primaryGreen/10 rounded-full flex items-center justify-center mx-auto text-primaryGreen">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-forest">Application Sent Successfully!</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Your application for <span className="font-semibold text-stone-900">{opportunity.title}</span> has been logged with reference <span className="font-mono font-bold bg-warmIvory px-2 py-0.5 rounded text-forest">{submittedAppId}</span>.
            </p>
            <div className="p-4 bg-warmIvory rounded-2xl text-xs text-stone-600 border border-warmIvory-300 text-left space-y-1">
              <div className="font-bold text-forest flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-primaryGreen" />
                <span>Next Steps in Verification:</span>
              </div>
              <p>1. The coordinator at {opportunity.org_name} will review your application.</p>
              <p>2. Once accepted, your orientation schedule and check-in codes will unlock in your Volunteer Hub.</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-forest text-warmIvory text-xs font-bold rounded-xl hover:bg-forest-700 transition-all"
            >
              Close & View in Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primaryGreen/10 text-primaryGreen mb-2">
                <span>{opportunity.category}</span>
                {opportunity.org_verified && (
                  <span className="flex items-center space-x-1 ml-1 text-emerald-700 font-medium">
                    • <ShieldCheck className="w-3 h-3 ml-0.5 inline" /> Verified NGO
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-forest">{opportunity.title}</h3>
              <p className="text-xs text-stone-500 font-medium">{opportunity.org_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-stone-100 text-xs text-stone-600">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primaryGreen" />
                <span>{opportunity.schedule_type} ({opportunity.commitment_hours} hrs/wk)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primaryGreen" />
                <span>{opportunity.is_remote ? 'Remote Opportunity' : opportunity.location}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-primaryGreen focus:ring-1 focus:ring-primaryGreen outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={volunteerEmail}
                    onChange={(e) => setVolunteerEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-primaryGreen focus:ring-1 focus:ring-primaryGreen outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Why are you interested in this cause? <span className="text-stone-400 font-normal">(min 15 chars)</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a brief statement on why you want to support this mission..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:border-primaryGreen focus:ring-1 focus:ring-primaryGreen outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Skills You Can Offer</label>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.skills_required.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSkills(selectedSkills.filter(s => s !== skill));
                          } else {
                            setSelectedSkills([...selectedSkills, skill]);
                          }
                        }}
                        className={`text-xs px-3 py-1 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-forest text-warmIvory border-forest font-semibold'
                            : 'bg-warmIvory text-stone-700 border-warmIvory-300 hover:border-stone-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Availability Window</label>
                <input
                  type="text"
                  value={availabilityNote}
                  onChange={(e) => setAvailabilityNote(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-primaryGreen focus:ring-1 focus:ring-primaryGreen outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center space-x-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Verified Application</span>
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
