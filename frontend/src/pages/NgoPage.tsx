import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Organization, Application, ReportDraft, Opportunity } from '../types';
import {
  Building2, ShieldCheck, CheckCircle2, Clock, Users,
  FileText, Sparkles, AlertCircle, Plus, Send, X, Check, Eye
} from 'lucide-react';

export const NgoPage: React.FC = () => {
  const { role, addToast } = useApp();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string>('org-green-canopy');
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [reportDraft, setReportDraft] = useState<ReportDraft | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [loading, setLoading] = useState(true);

  // New Attendance modal
  const [selectedAppForAttendance, setSelectedAppForAttendance] = useState<Application | null>(null);
  const [hoursToAdd, setHoursToAdd] = useState<number>(4.0);
  const [attendanceNotes, setAttendanceNotes] = useState<string>('Completed scheduled field shift with distinction.');

  // New Opportunity modal
  const [showNewOppModal, setShowNewOppModal] = useState(false);
  const [newOppTitle, setNewOppTitle] = useState('');
  const [newOppCategory, setNewOppCategory] = useState('Environment');
  const [newOppSkills, setNewOppSkills] = useState('Gardening, Teamwork');
  const [newOppHours, setNewOppHours] = useState(4);
  const [newOppSlots, setNewOppSlots] = useState(15);
  const [newOppSchedule, setNewOppSchedule] = useState('Weekends');
  const [newOppIsRemote, setNewOppIsRemote] = useState(false);

  const loadOrgData = async () => {
    try {
      const [orgs, apps, opps] = await Promise.all([
        api.getOrganizations(),
        api.getApplications({ org_id: activeOrgId }),
        api.getOpportunities({ category: undefined })
      ]);
      setOrganizations(orgs);
      setApplications(apps);
      setOpportunities(opps.filter(o => o.org_id === activeOrgId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgData();
  }, [activeOrgId]);

  const currentOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const handleApproveApp = async (appId: string) => {
    try {
      await api.updateApplicationStatus(appId, 'accepted');
      addToast({
        type: 'success',
        title: 'Application Accepted',
        message: 'Volunteer has been approved and notified.'
      });
      loadOrgData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error updating application' });
    }
  };

  const handleRejectApp = async (appId: string) => {
    try {
      await api.updateApplicationStatus(appId, 'rejected');
      addToast({
        type: 'info',
        title: 'Application Declined',
        message: 'Candidate status updated.'
      });
      loadOrgData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error updating application' });
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedAppForAttendance) return;
    try {
      await api.recordAttendance(selectedAppForAttendance.id, hoursToAdd, attendanceNotes);
      addToast({
        type: 'success',
        title: 'Hours Logged & Countersigned',
        message: `Successfully verified +${hoursToAdd} hours for ${selectedAppForAttendance.volunteer_name}.`
      });
      setSelectedAppForAttendance(null);
      loadOrgData();
    } catch (err) {
      addToast({ type: 'error', title: 'Error logging attendance' });
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const draft = await api.generateReport(activeOrgId, 'Q3 2026');
      setReportDraft(draft);
      addToast({
        type: 'success',
        title: 'Draft Report Generated',
        message: 'Strictly segregated measured facts from econometric estimates.'
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Report generation failed' });
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleSignoffReport = async () => {
    if (!reportDraft) return;
    try {
      const published = await api.signoffReport(reportDraft.id, 'Elena Vance (Lead Coordinator)');
      setReportDraft(published);
      addToast({
        type: 'success',
        title: 'Report Published',
        message: 'Human review sign-off applied and document published to public ledger.'
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Sign-off failed' });
    }
  };

  const handleAdminVerify = async (status: 'approved' | 'rejected') => {
    try {
      const updated = await api.verifyOrganization(activeOrgId, status, "Platform Admin Audit Check");
      setOrganizations(prev => prev.map(o => o.id === activeOrgId ? updated : o));
      addToast({
        type: 'success',
        title: `Organization ${status.toUpperCase()}`,
        message: `Status updated by Platform Admin.`
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Verification update failed' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header and Org Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest text-warmIvory text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-limeAccent" />
            <span>NGO Operations & Verified Reporting Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest mt-1.5">{currentOrg?.name}</h1>
          <p className="text-xs text-stone-500">{currentOrg?.location} • {currentOrg?.contact_email}</p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-bold text-stone-600">Active NGO:</label>
          <select
            value={activeOrgId}
            onChange={(e) => setActiveOrgId(e.target.value)}
            className="text-xs px-3.5 py-2 rounded-xl border border-stone-200 bg-white font-bold text-forest shadow-sm outline-none"
          >
            {organizations.map(o => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.verification_status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Status Banner */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        currentOrg?.verification_status === 'approved'
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : currentOrg?.verification_status === 'pending'
          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
          : 'bg-red-50/80 border-red-200 text-red-950'
      }`}>
        <div className="flex items-start space-x-3">
          {currentOrg?.verification_status === 'approved' ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
          )}
          <div>
            <div className="font-bold text-sm flex items-center space-x-2">
              <span>Verification Status: <strong className="capitalize">{currentOrg?.verification_status}</strong></span>
              {currentOrg?.verification_status === 'approved' && (
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
                  Verified by: {currentOrg.verified_by}
                </span>
              )}
            </div>
            <p className="text-xs opacity-80 mt-0.5">
              {currentOrg?.verification_notes || "All volunteer hours logged under this organization qualify for verified public impact credits."}
            </p>
          </div>
        </div>

        {/* Admin Quick Action */}
        {role === 'admin' ? (
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-[10px] uppercase font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">Admin Mode</span>
            <button
              onClick={() => handleAdminVerify('approved')}
              className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800"
            >
              Approve NGO
            </button>
            <button
              onClick={() => handleAdminVerify('rejected')}
              className="px-3 py-1.5 bg-red-700 text-white text-xs font-bold rounded-lg hover:bg-red-800"
            >
              Reject
            </button>
          </div>
        ) : (
          <div className="text-xs text-stone-500 font-medium italic">
            Switch persona to "Platform Auditor" in top bar to simulate admin verification actions.
          </div>
        )}
      </div>

      {/* Main NGO Workspace Tabs: Applications & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Applications & Attendance Recording */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-forest">Volunteer Applicants ({applications.length})</h3>
                <p className="text-xs text-stone-500">Review motivation, approve candidates, and countersign hours.</p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-500">
                No volunteer applications received for this organization yet.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 bg-warmIvory-50 rounded-2xl border border-warmIvory-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <div className="font-bold text-xs text-stone-900">{app.volunteer_name}</div>
                        <div className="text-[11px] text-stone-500">{app.volunteer_email} • Applying for: <strong>{app.opportunity_title}</strong></div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                        app.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 italic">
                      "{app.motivation}"
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-warmIvory-200 text-xs">
                      <span className="font-mono text-primaryGreen font-bold">
                        Logged: {app.hours_logged} hrs
                      </span>

                      <div className="flex items-center space-x-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveApp(app.id)}
                              className="px-2.5 py-1 bg-primaryGreen text-white text-[11px] font-bold rounded-lg hover:bg-primaryGreen-light flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectApp(app.id)}
                              className="px-2.5 py-1 bg-stone-200 text-stone-700 text-[11px] font-bold rounded-lg hover:bg-stone-300"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {app.status === 'accepted' && (
                          <button
                            onClick={() => setSelectedAppForAttendance(app)}
                            className="px-3 py-1 bg-forest text-warmIvory text-[11px] font-bold rounded-lg hover:bg-forest-700 flex items-center space-x-1"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Record & Verify Hours</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Automated Draft Impact Report Generator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <div className="flex items-center space-x-1 text-primaryGreen font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Report Engine</span>
                </div>
                <h3 className="text-base font-bold text-forest">Draft Impact Report</h3>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="px-3.5 py-1.5 bg-primaryGreen hover:bg-primaryGreen-light text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {generatingReport ? 'Synthesizing...' : '1-Click Draft'}
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Generates an auditable draft strictly separating measured facts, economic models, and AI synthesis. Human review is required before publication.
            </p>

            {reportDraft ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-warmIvory rounded-2xl border border-warmIvory-300 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-forest">
                    <span>{reportDraft.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      reportDraft.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {reportDraft.status}
                    </span>
                  </div>

                  {/* Section 1: Measured Facts */}
                  <div className="pt-2 border-t border-warmIvory-300 space-y-1">
                    <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider text-forest">
                      1. Measured Facts (Audited)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-stone-700">
                      <div>Verified Hours: <strong>{reportDraft.measured_facts.verified_volunteer_hours}</strong></div>
                      <div>Beneficiaries: <strong>{reportDraft.measured_facts.verified_beneficiaries_served}</strong></div>
                      <div>Events: <strong>{reportDraft.measured_facts.documented_field_events}</strong></div>
                      <div>Participating: <strong>{reportDraft.measured_facts.total_participating_volunteers}</strong></div>
                    </div>
                  </div>

                  {/* Section 2: Estimates */}
                  <div className="pt-2 border-t border-warmIvory-300 space-y-1">
                    <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider text-forest">
                      2. Econometric Estimates (Labeled)
                    </div>
                    <div className="text-stone-700">
                      Economic Value: <strong>${reportDraft.estimates_and_projections.estimated_economic_value_created_usd}</strong>
                      <div className="text-[10px] text-stone-500 font-normal">
                        Basis: {reportDraft.estimates_and_projections.labor_valuation_basis}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: AI Narrative */}
                  <div className="pt-2 border-t border-warmIvory-300 space-y-1">
                    <div className="font-bold text-stone-900 text-[11px] uppercase tracking-wider text-forest">
                      3. AI Narrative (Review Required)
                    </div>
                    <p className="text-stone-600 italic">
                      "{reportDraft.ai_generated_narrative}"
                    </p>
                  </div>

                  {/* Section 4: Human Sign-off */}
                  <div className="pt-2 border-t border-warmIvory-300">
                    {reportDraft.human_reviewer_signoff ? (
                      <div className="text-emerald-800 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Signed by: {reportDraft.human_reviewer_signoff}</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleSignoffReport}
                        className="w-full py-2 bg-forest hover:bg-forest-700 text-warmIvory text-xs font-bold rounded-xl transition-all"
                      >
                        Coordinator Sign-off & Publish to Public Ledger
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-warmIvory-50 rounded-2xl border border-dashed border-stone-300 text-center text-xs text-stone-500">
                Click "1-Click Draft" to aggregate field logs into a structured report.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Record Attendance Modal */}
      {selectedAppForAttendance && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-forest">Verify Volunteer Hours</h3>
              <button onClick={() => setSelectedAppForAttendance(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Log verified service hours for <strong className="text-stone-900">{selectedAppForAttendance.volunteer_name}</strong> on <strong className="text-stone-900">{selectedAppForAttendance.opportunity_title}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Hours to Credit</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="20"
                  value={hoursToAdd}
                  onChange={(e) => setHoursToAdd(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-primaryGreen outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Supervisor Audit Note</label>
                <textarea
                  rows={2}
                  value={attendanceNotes}
                  onChange={(e) => setAttendanceNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-200 focus:border-primaryGreen outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedAppForAttendance(null)}
                className="px-3 py-1.5 text-xs text-stone-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-2 bg-primaryGreen text-white text-xs font-bold rounded-xl hover:bg-primaryGreen-light"
              >
                Countersign & Credit Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
