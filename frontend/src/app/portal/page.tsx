'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../lib/api';
import { 
  User, 
  Briefcase, 
  FileText, 
  Calendar, 
  Bell, 
  LayoutDashboard, 
  ChevronRight, 
  Edit3, 
  Upload, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ExternalLink,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function StudentPortalPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  // Active tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'applications' | 'documents' | 'appointments' | 'notifications'>('dashboard');

  // Shared loading state for tabs
  const [tabLoading, setTabLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data States
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    dateOfBirth: '',
    gender: '',
    address: '',
    passportNumber: '',
    currentQualification: '',
    preferredCountry: '',
    preferredSubject: '',
    testType: '',
    testScore: '',
    visaStatus: '',
  });

  // Document Upload State
  const [docType, setDocType] = useState('Transcript');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reschedule State
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Initial redirect if guest
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/contact?tab=login&redirect=/portal');
    }
  }, [isAuthenticated, loading, router]);

  // Load all user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    setTabLoading(true);
    setErrorMsg('');
    try {
      const [profileRes, appsRes, docsRes, apptsRes, notifsRes] = await Promise.all([
        api.get('/student/profile').catch(() => null),
        api.get('/student/applications').catch(() => ({ data: { data: [] } })),
        api.get('/student/documents').catch(() => ({ data: { data: [] } })),
        api.get('/appointments/my').catch(() => ({ data: { data: [] } })),
        api.get('/student/notifications').catch(() => ({ data: { data: [] } })),
      ]);

      if (profileRes?.data?.data) {
        const p = profileRes.data.data;
        setProfile(p);
        setProfileForm({
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.slice(0, 10) : '',
          gender: p.gender || '',
          address: p.address || '',
          passportNumber: p.passportNumber || '',
          currentQualification: p.currentQualification || '',
          preferredCountry: p.preferredCountry || '',
          preferredSubject: p.preferredSubject || '',
          testType: p.testType || '',
          testScore: p.testScore || '',
          visaStatus: p.visaStatus || '',
        });
      }
      setApplications(appsRes.data.data);
      setDocuments(docsRes.data.data);
      setAppointments(apptsRes.data.data);
      setNotifications(notifsRes.data.data);
    } catch (err: any) {
      setErrorMsg('Failed to synchronize some student database records.');
    } finally {
      setTabLoading(false);
    }
  };

  // Submit profile edit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTabLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/student/profile', profileForm);
      setProfile(res.data.data);
      setSuccessMsg('Academic Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update academic profile.');
    } finally {
      setTabLoading(false);
    }
  };

  // Document Upload
  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a file to upload first.');
      return;
    }

    setTabLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('type', docType);

    try {
      const res = await api.post('/student/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocuments([res.data.data, ...documents]);
      setSuccessMsg(res.data.message || 'Document uploaded successfully!');
      setSelectedFile(null);
      // Reset input
      const fileInput = document.getElementById('document-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Document upload failed. Make sure it is a PDF or Image.');
    } finally {
      setTabLoading(false);
    }
  };

  // Cancel Appointment
  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setTabLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put(`/appointments/${id}/cancel`);
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
      setSuccessMsg(res.data.message || 'Appointment cancelled successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setTabLoading(false);
    }
  };

  // Reschedule Appointment
  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleId || !rescheduleDate) return;

    setTabLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put(`/appointments/${rescheduleId}/reschedule`, {
        dateTime: new Date(rescheduleDate).toISOString(),
      });

      setAppointments(appointments.map(a => a.id === rescheduleId ? { ...a, dateTime: res.data.data.dateTime, status: 'RESCHEDULED' } : a));
      setSuccessMsg(res.data.message || 'Appointment rescheduled successfully.');
      setRescheduleId(null);
      setRescheduleDate('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to reschedule appointment.');
    } finally {
      setTabLoading(false);
    }
  };

  // Mark notification read
  const markNotificationRead = async (id: string) => {
    try {
      await api.put(`/student/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <Loader2 className="h-10 w-10 text-brand-gold animate-spin mx-auto mb-4" />
        <p className="text-brand-slate-light font-semibold">Synchronizing portal authentication credentials...</p>
      </div>
    );
  }

  // Helper stats
  const activeApps = applications.filter(a => a.status !== 'COMPLETED' && a.status !== 'VISA_REJECTED');
  const nextAppointment = appointments.find(a => a.status === 'SCHEDULED' || a.status === 'RESCHEDULED');
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-[85vh]">
      
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-indigo-light/10 pb-6 mb-8">
        <div>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-[10px]">Academic Operations Portal</span>
          <h1 className="text-3xl font-bold font-serif text-brand-blue-deep mt-1">Student Workspace</h1>
          <p className="text-xs text-brand-slate-light mt-0.5">Welcome back, <strong className="text-brand-blue-deep">{profile?.user?.firstName || user?.firstName} {profile?.user?.lastName || user?.lastName}</strong></p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/appointments" className="px-5 py-2 rounded-full bg-blue-gradient text-white text-xs font-semibold shadow hover:shadow-gold transition-all flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span>Book Consultation</span>
          </Link>
          <button 
            onClick={logout} 
            className="px-5 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard, badge: 0 },
            { id: 'profile', name: 'Academic Profile', icon: User, badge: 0 },
            { id: 'applications', name: 'University Applications', icon: Briefcase, badge: activeApps.length },
            { id: 'documents', name: 'Document Vault', icon: FileText, badge: documents.length },
            { id: 'appointments', name: 'Consultations', icon: Calendar, badge: nextAppointment ? 1 : 0 },
            { id: 'notifications', name: 'Notifications', icon: Bell, badge: unreadNotifs },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSuccessMsg('');
                  setErrorMsg('');
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === item.id ? 'bg-brand-blue-deep text-white shadow-md' : 'text-brand-slate-light hover:bg-brand-blue-deep/5 hover:text-brand-blue-deep'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === item.id ? 'bg-brand-gold text-brand-slate' : 'bg-brand-blue-deep/10 text-brand-blue-deep'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Workspace panel */}
        <div className="lg:col-span-3 min-h-[500px]">
          {tabLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-brand-gold animate-spin mr-2" />
              <span className="text-xs text-brand-slate-light font-semibold">Updating workspace records...</span>
            </div>
          )}

          {/* Feedback banners */}
          {!tabLoading && successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-green-500" />
              <span>{successMsg}</span>
            </div>
          )}
          {!tabLoading && errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <XCircle className="h-4.5 w-4.5 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tab Pages */}
          {!tabLoading && (
            <>
              {/* Tab 1: Dashboard Overview */}
              {activeTab === 'dashboard' && (
                <div className="flex flex-col gap-6">
                  {/* Quick Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Active Pipelines</span>
                      <h3 className="text-3xl font-bold font-serif text-brand-blue-deep">{activeApps.length}</h3>
                      <p className="text-[10px] text-brand-slate-light">University applications submitted</p>
                    </GlassCard>
                    <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Document Count</span>
                      <h3 className="text-3xl font-bold font-serif text-brand-blue-deep">{documents.length}</h3>
                      <p className="text-[10px] text-brand-slate-light">Academic files uploaded</p>
                    </GlassCard>
                    <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Next Session</span>
                      {nextAppointment ? (
                        <div>
                          <h4 className="text-xs font-bold text-brand-blue-deep truncate">{nextAppointment.title}</h4>
                          <p className="text-[10px] text-brand-slate-light mt-1">{new Date(nextAppointment.dateTime).toLocaleDateString()}</p>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-xs font-medium text-brand-slate-light">No booked slots</h4>
                          <Link href="/appointments" className="text-[10px] text-brand-indigo hover:text-brand-gold hover:underline mt-1 font-semibold block">Book Consultation &rarr;</Link>
                        </div>
                      )}
                    </GlassCard>
                  </div>

                  {/* Next appointment call out */}
                  {nextAppointment && (
                    <GlassCard className="bg-brand-slate text-white border-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold">Upcoming Advisory Session</span>
                        <h3 className="text-lg font-serif font-bold text-white mt-1">{nextAppointment.title}</h3>
                        <p className="text-xs text-brand-slate-light mt-2 leading-relaxed max-w-lg">
                          Time: **{new Date(nextAppointment.dateTime).toLocaleString()}** ({nextAppointment.duration} Mins)<br/>
                          Description: {nextAppointment.description || 'General study abroad evaluation.'}
                        </p>
                      </div>
                      {nextAppointment.meetLink && (
                        <a 
                          href={nextAppointment.meetLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-slate text-xs font-bold rounded-full shadow transition-colors inline-flex items-center gap-1.5"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Join Video Call</span>
                        </a>
                      )}
                    </GlassCard>
                  )}

                  {/* Quick Profile Overview */}
                  <GlassCard className="border border-brand-indigo-light/10">
                    <h3 className="text-base font-serif font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-4">Admissions Target Summary</h3>
                    {profile ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-brand-slate-light text-[10px] uppercase font-semibold">Study Destination</p>
                          <p className="font-bold text-brand-slate mt-1">{profile.preferredCountry || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-brand-slate-light text-[10px] uppercase font-semibold">Subject Area</p>
                          <p className="font-bold text-brand-slate mt-1">{profile.preferredSubject || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-brand-slate-light text-[10px] uppercase font-semibold">Test Type</p>
                          <p className="font-bold text-brand-slate mt-1">{profile.testType || 'Not taken'}</p>
                        </div>
                        <div>
                          <p className="text-brand-slate-light text-[10px] uppercase font-semibold">Test Score</p>
                          <p className="font-bold text-brand-slate mt-1">{profile.testScore || 'N/A'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-brand-slate-light">Please edit your academic profile to configure study abroad parameters.</p>
                    )}
                  </GlassCard>
                </div>
              )}

              {/* Tab 2: Profile Update Form */}
              {activeTab === 'profile' && (
                <GlassCard className="border border-brand-indigo-light/10 p-8">
                  <h3 className="text-base font-serif font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-6">Edit Academic Credentials</h3>
                  <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={profileForm.dateOfBirth}
                        onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Gender</label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Permanent Address</label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        placeholder="Street, City, State, ZIP"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Passport Number</label>
                      <input
                        type="text"
                        value={profileForm.passportNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, passportNumber: e.target.value })}
                        placeholder="Passport ID"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Current Highest Qualification</label>
                      <input
                        type="text"
                        value={profileForm.currentQualification}
                        onChange={(e) => setProfileForm({ ...profileForm, currentQualification: e.target.value })}
                        placeholder="e.g. High School Diploma (GPA 3.8), Bachelors in EE"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Preferred Destination Country</label>
                      <input
                        type="text"
                        value={profileForm.preferredCountry}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredCountry: e.target.value })}
                        placeholder="e.g. Canada, Germany, USA"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Preferred Subject Major</label>
                      <input
                        type="text"
                        value={profileForm.preferredSubject}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredSubject: e.target.value })}
                        placeholder="e.g. Computer Science, Finance"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Language Test Type</label>
                      <input
                        type="text"
                        value={profileForm.testType}
                        onChange={(e) => setProfileForm({ ...profileForm, testType: e.target.value })}
                        placeholder="e.g. IELTS, TOEFL, Duolingo"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Test score</label>
                      <input
                        type="text"
                        value={profileForm.testScore}
                        onChange={(e) => setProfileForm({ ...profileForm, testScore: e.target.value })}
                        placeholder="e.g. 7.5, 105"
                        className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-xs text-brand-slate"
                      />
                    </div>

                    <div className="md:col-span-2 text-right">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-gradient text-white text-xs font-semibold rounded-full shadow hover:shadow-gold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Update Academic Profile</span>
                      </button>
                    </div>
                  </form>
                </GlassCard>
              )}

              {/* Tab 3: Applications timelines */}
              {activeTab === 'applications' && (
                <div className="flex flex-col gap-6">
                  {applications.length === 0 ? (
                    <GlassCard className="border border-brand-indigo-light/10 text-center py-16 flex flex-col items-center gap-4">
                      <Briefcase className="h-12 w-16 text-brand-slate-light" />
                      <h4 className="font-serif text-lg font-bold text-brand-blue-deep">No University Applications Yet</h4>
                      <p className="text-xs text-brand-slate-light max-w-sm">Schedule a counseling consultation to evaluate transcripts and generate university matching choices.</p>
                      <Link href="/appointments" className="px-5 py-2 rounded-full bg-brand-indigo hover:bg-brand-indigo-dark text-white text-xs font-semibold">Book Consultation</Link>
                    </GlassCard>
                  ) : (
                    applications.map((app) => (
                      <GlassCard key={app.id} className="border border-brand-indigo-light/10 p-6 flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-brand-slate-light/5 pb-3">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-brand-blue-deep">{app.university.name}</h3>
                            <p className="text-xs text-brand-slate-light">{app.program} &bull; {app.university.country.name}</p>
                          </div>
                          <span className="px-3 py-1 bg-brand-blue-deep/5 rounded-full text-[10px] font-bold text-brand-blue-deep border border-brand-indigo-light/10">
                            {app.status.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Timeline Graphic */}
                        <div className="py-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold mb-3">Application Milestone Steps</p>
                          <div className="flex items-center justify-between relative">
                            {/* Line */}
                            <div className="absolute top-3 left-0 w-full h-[2px] bg-brand-slate-light/10 -z-10" />
                            
                            {[
                              { label: 'Registered', match: ['PENDING', 'DOCUMENT_SUBMITTED', 'ADMISSION_OFFERED', 'VISA_APPLIED', 'VISA_APPROVED', 'VISA_REJECTED', 'COMPLETED'] },
                              { label: 'Files Submitted', match: ['DOCUMENT_SUBMITTED', 'ADMISSION_OFFERED', 'VISA_APPLIED', 'VISA_APPROVED', 'VISA_REJECTED', 'COMPLETED'] },
                              { label: 'Admission Offer', match: ['ADMISSION_OFFERED', 'VISA_APPLIED', 'VISA_APPROVED', 'VISA_REJECTED', 'COMPLETED'] },
                              { label: 'Visa Applied', match: ['VISA_APPLIED', 'VISA_APPROVED', 'VISA_REJECTED', 'COMPLETED'] },
                              { label: 'Final Decision', match: ['VISA_APPROVED', 'VISA_REJECTED', 'COMPLETED'] },
                            ].map((step, idx) => {
                              const isPassed = step.match.includes(app.status);
                              return (
                                <div key={idx} className="flex flex-col items-center gap-1.5 z-10 bg-white px-2">
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${isPassed ? 'bg-brand-blue-deep border-brand-blue-deep text-white' : 'bg-white border-brand-slate-light/20 text-brand-slate-light'}`}>
                                    {isPassed ? '✓' : idx + 1}
                                  </div>
                                  <span className={`text-[9px] font-semibold text-center ${isPassed ? 'text-brand-slate font-bold' : 'text-brand-slate-light'}`}>{step.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Counselor Notes */}
                        {app.notes && (
                          <div className="bg-brand-blue-deep/5 border-l-2 border-brand-gold p-3 rounded-r-lg text-xs text-brand-slate-light">
                            <strong className="text-brand-slate block mb-1">Counselor Remarks:</strong>
                            {app.notes}
                          </div>
                        )}
                      </GlassCard>
                    ))
                  )}
                </div>
              )}

              {/* Tab 4: Document Upload Vault */}
              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* Upload Form */}
                  <GlassCard className="md:col-span-5 border border-brand-indigo-light/10 p-6 flex flex-col gap-4">
                    <h3 className="font-serif text-base font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-2 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-brand-gold" />
                      <span>Upload Document</span>
                    </h3>
                    <form onSubmit={handleDocUpload} className="flex flex-col gap-4 text-xs">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Document Category</label>
                        <select
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                          className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2.5 text-brand-slate"
                        >
                          <option value="Transcript">Academic Transcript</option>
                          <option value="Passport">Passport Copy</option>
                          <option value="SOP">Statement of Purpose (SOP)</option>
                          <option value="IELTS">Language Test results (IELTS/TOEFL)</option>
                          <option value="Recommendation Letter">Letter of Recommendation (LOR)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">Choose PDF or Image File</label>
                        <input
                          id="document-input"
                          type="file"
                          required
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="w-full bg-brand-slate-light/5 border border-brand-indigo-light/10 rounded-xl px-4 py-2.5 text-brand-slate-light"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-gradient text-white text-xs font-bold rounded-xl shadow hover:shadow-gold transition-colors inline-flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="h-4.5 w-4.5" />
                        <span>Upload File Vault</span>
                      </button>
                    </form>
                  </GlassCard>

                  {/* Documents List */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    <h3 className="font-serif text-base font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-2 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-brand-gold" />
                      <span>Document Vault ({documents.length})</span>
                    </h3>
                    
                    {documents.length === 0 ? (
                      <GlassCard className="border border-brand-indigo-light/10 text-center py-12">
                        <p className="text-xs text-brand-slate-light">No documents uploaded yet. Upload academic transcripts or passports to initiate university matching applications.</p>
                      </GlassCard>
                    ) : (
                      documents.map((doc) => (
                        <div key={doc.id} className="glass rounded-xl p-4 border border-brand-indigo-light/10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-brand-blue-deep/5 rounded-lg border border-brand-indigo-light/10 text-brand-indigo">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-brand-blue-deep truncate max-w-[200px] md:max-w-xs">{doc.name}</h4>
                              <p className="text-[10px] text-brand-slate-light mt-0.5">{doc.type} &bull; {new Date(doc.createdAt).toLocaleDateString()}</p>
                              {doc.remarks && <p className="text-[9px] text-brand-gold font-medium mt-1 leading-normal italic">*{doc.remarks}</p>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${doc.status === 'VERIFIED' ? 'bg-green-50 text-green-700 border border-green-200' : doc.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                              {doc.status}
                            </span>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-1 bg-brand-blue-deep/5 rounded hover:bg-brand-blue-deep/10 text-brand-indigo transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Consultations (Appointments) list */}
              {activeTab === 'appointments' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Reschedule Modal Box */}
                  {rescheduleId && (
                    <GlassCard className="border border-brand-indigo-light/15 bg-brand-gold/5 p-6 mb-2">
                      <h4 className="font-serif text-sm font-bold text-brand-blue-deep mb-4">Reschedule Consultation Slot</h4>
                      <form onSubmit={handleReschedule} className="flex flex-col md:flex-row gap-4 items-end text-xs">
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-brand-slate mb-1">New Date & Time</label>
                          <input
                            type="datetime-local"
                            required
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="w-full bg-white border border-brand-indigo-light/15 focus:border-brand-gold focus:outline-none rounded-xl px-4 py-2 text-brand-slate"
                          />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            type="submit"
                            className="px-5 py-2 bg-blue-gradient text-white text-xs font-bold rounded-xl shadow transition-colors w-full md:w-auto"
                          >
                            Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRescheduleId(null);
                              setRescheduleDate('');
                            }}
                            className="px-5 py-2 border border-brand-indigo-light/20 bg-white text-brand-slate-light text-xs font-semibold rounded-xl transition-colors w-full md:w-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </GlassCard>
                  )}

                  {appointments.length === 0 ? (
                    <GlassCard className="border border-brand-indigo-light/10 text-center py-16 flex flex-col items-center gap-4">
                      <Calendar className="h-12 w-16 text-brand-slate-light" />
                      <h4 className="font-serif text-lg font-bold text-brand-blue-deep">No Consultations Scheduled</h4>
                      <p className="text-xs text-brand-slate-light max-w-sm">Connect with a consultant in a virtual video meeting. Schedule an assessment study slot.</p>
                      <Link href="/appointments" className="px-5 py-2 rounded-full bg-brand-indigo hover:bg-brand-indigo-dark text-white text-xs font-semibold">Book Consultation</Link>
                    </GlassCard>
                  ) : (
                    appointments.map((appt) => (
                      <div key={appt.id} className="glass rounded-xl p-5 border border-brand-indigo-light/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-brand-blue-deep/5 rounded-xl border border-brand-indigo-light/10 text-brand-indigo mt-0.5">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-brand-blue-deep">{appt.title}</h4>
                            <p className="text-xs text-brand-slate-light mt-1">
                              <strong>Date:</strong> {new Date(appt.dateTime).toLocaleString()} &bull; <strong>Duration:</strong> {appt.duration} Mins
                            </p>
                            <p className="text-[10px] text-brand-slate-light mt-1">
                              <strong>Assigned Consultant:</strong> Arthur Pendleton ({appt.consultant?.email || 'consultant@educonsultpro.com'})
                            </p>
                            {appt.description && <p className="text-xs text-brand-slate-light mt-2 p-2 bg-brand-slate-light/5 border-l border-brand-gold rounded">{appt.description}</p>}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 self-stretch justify-between md:self-auto">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold self-end ${appt.status === 'SCHEDULED' ? 'bg-blue-50 text-brand-blue-deep border border-brand-indigo-light/10' : appt.status === 'RESCHEDULED' ? 'bg-purple-50 text-purple-700 border border-purple-200' : appt.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {appt.status}
                          </span>
                          
                          {/* Actions */}
                          {(appt.status === 'SCHEDULED' || appt.status === 'RESCHEDULED') && (
                            <div className="flex gap-2">
                              {appt.meetLink && (
                                <a
                                  href={appt.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-brand-blue-deep hover:bg-brand-indigo-dark text-white rounded text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Join Call</span>
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setRescheduleId(appt.id);
                                  setRescheduleDate(appt.dateTime.slice(0, 16));
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-3 py-1.5 border border-brand-indigo-light/20 hover:bg-brand-blue-deep/5 text-brand-slate text-[10px] rounded font-semibold transition-colors"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appt.id)}
                                className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 rounded text-[10px] font-semibold transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 6: Notifications List */}
              {activeTab === 'notifications' && (
                <div className="flex flex-col gap-4">
                  <h3 className="font-serif text-base font-bold text-brand-blue-deep border-b border-brand-indigo-light/10 pb-3 mb-2 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-brand-gold" />
                    <span>In-App Notifications Vault</span>
                  </h3>
                  
                  {notifications.length === 0 ? (
                    <GlassCard className="border border-brand-indigo-light/10 text-center py-12">
                      <p className="text-xs text-brand-slate-light">No notifications on record.</p>
                    </GlassCard>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`glass rounded-xl p-4 border border-brand-indigo-light/10 flex items-start justify-between gap-4 transition-all duration-300 ${!notif.read ? 'bg-brand-blue-deep/[0.02] border-brand-gold/30' : 'opacity-85'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg mt-0.5 ${!notif.read ? 'bg-brand-gold/10 text-brand-gold' : 'bg-brand-blue-deep/5 text-brand-slate-light'}`}>
                            <Bell className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className={`text-xs ${!notif.read ? 'font-bold text-brand-blue-deep' : 'font-medium text-brand-slate'}`}>{notif.title}</h4>
                            <p className="text-[10px] text-brand-slate-light mt-1 leading-normal">{notif.message}</p>
                            <span className="text-[8px] text-brand-slate-light/60 mt-1 block">{new Date(notif.createdAt).toLocaleString()}</span>
                          </div>
                        </div>

                        {!notif.read && (
                          <button
                            onClick={() => markNotificationRead(notif.id)}
                            className="px-2 py-1 bg-brand-blue-deep/5 hover:bg-brand-blue-deep/10 border border-brand-indigo-light/10 rounded text-[9px] font-semibold text-brand-blue-deep transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
