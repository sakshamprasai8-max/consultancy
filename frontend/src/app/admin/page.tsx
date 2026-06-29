'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../providers/AuthProvider';
import ScrollReveal from '../../components/animations/ScrollReveal';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../lib/api';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  BarChart3, 
  UserCheck, 
  Mail, 
  FileText, 
  MessageSquare, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Trash2,
  CalendarCheck,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'applications' | 'appointments' | 'leads' | 'staff'>('analytics');

  // Loading states
  const [dataLoading, setDataLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Dashboard Data States
  const [metrics, setMetrics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [crmAnalytics, setCrmAnalytics] = useState<any>(null);

  // Status & Note update state (for individual applications)
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [appStatusUpdate, setAppStatusUpdate] = useState('');
  const [appNotesUpdate, setAppNotesUpdate] = useState('');

  // Lead Note state
  const [addingNoteLeadId, setAddingNoteLeadId] = useState<string | null>(null);
  const [leadNoteContent, setLeadNoteContent] = useState('');

  // Lead Followup state
  const [addingFollowupLeadId, setAddingFollowupLeadId] = useState<string | null>(null);
  const [followupForm, setFollowupForm] = useState({ title: '', description: '', dueDate: '' });

  // Selected student profile inspect state
  const [inspectedStudent, setInspectedStudent] = useState<any>(null);

  // Authentication Redirect
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/contact?tab=login&redirect=/admin');
      } else if (user?.role !== 'ADMIN' && user?.role !== 'CONSULTANT') {
        router.push('/portal'); // Redirect regular students
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Load all dashboard components
  useEffect(() => {
    if (isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'CONSULTANT')) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const fetchAdminData = async () => {
    setDataLoading(true);
    setError('');
    try {
      const [metricsRes, studentsRes, appsRes, apptsRes, leadsRes, staffRes, crmRes] = await Promise.all([
        api.get('/admin/dashboard').catch(() => ({ data: { data: {} } })),
        api.get('/admin/students').catch(() => ({ data: { data: [] } })),
        api.get('/admin/applications').catch(() => ({ data: { data: [] } })),
        api.get('/appointments').catch(() => ({ data: { data: [] } })),
        api.get('/leads').catch(() => ({ data: { data: [] } })),
        api.get('/admin/staff').catch(() => ({ data: { data: [] } })),
        api.get('/leads/analytics').catch(() => ({ data: { data: null } })),
      ]);

      setMetrics(metricsRes.data.data);
      setStudents(studentsRes.data.data);
      setApplications(appsRes.data.data);
      setAppointments(apptsRes.data.data);
      setLeads(leadsRes.data.data);
      setStaff(staffRes.data.data);
      setCrmAnalytics(crmRes.data.data);
    } catch (err: any) {
      setError('Error loading administrative workspace records.');
    } finally {
      setDataLoading(false);
    }
  };

  // Update application status
  const handleUpdateAppStatus = async (id: string) => {
    setDataLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await api.put(`/admin/applications/${id}/status`, {
        status: appStatusUpdate,
        notes: appNotesUpdate || null,
      });

      setApplications(applications.map(a => a.id === id ? { ...a, status: res.data.data.status, notes: res.data.data.notes } : a));
      setSuccess(res.data.message || 'Application pipeline updated and email notification sent.');
      setUpdatingAppId(null);
      setTimeout(() => setSuccess(''), 4500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setDataLoading(false);
    }
  };

  // Add a communication note on lead
  const handleAddLeadNote = async (id: string) => {
    if (!leadNoteContent.trim()) return;
    setDataLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await api.post(`/leads/${id}/notes`, { content: leadNoteContent });
      
      setLeads(leads.map(l => {
        if (l.id === id) {
          const notes = l.notes || [];
          return { ...l, notes: [res.data.data, ...notes], updatedAt: new Date().toISOString() };
        }
        return l;
      }));

      setSuccess('Communication note logged on lead.');
      setLeadNoteContent('');
      setAddingNoteLeadId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log note.');
    } finally {
      setDataLoading(false);
    }
  };

  // Add followup task
  const handleAddFollowup = async (id: string) => {
    if (!followupForm.title || !followupForm.dueDate) return;
    setDataLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await api.post(`/leads/${id}/followups`, {
        title: followupForm.title,
        description: followupForm.description || null,
        dueDate: new Date(followupForm.dueDate).toISOString(),
      });

      setLeads(leads.map(l => {
        if (l.id === id) {
          const followups = l.followups || [];
          return { ...l, followups: [...followups, res.data.data] };
        }
        return l;
      }));

      setSuccess('Follow-up scheduled successfully.');
      setFollowupForm({ title: '', description: '', dueDate: '' });
      setAddingFollowupLeadId(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule follow-up.');
    } finally {
      setDataLoading(false);
    }
  };

  // Mark followup task complete
  const handleCompleteFollowup = async (leadId: string, followupId: string) => {
    setDataLoading(true);
    setSuccess('');
    setError('');
    try {
      await api.put(`/leads/followups/${followupId}/complete`, { completed: true });
      
      setLeads(leads.map(l => {
        if (l.id === leadId) {
          return {
            ...l,
            followups: l.followups.map((f: any) => f.id === followupId ? { ...f, completed: true } : f)
          };
        }
        return l;
      }));
      setSuccess('Follow-up task marked completed.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to update follow-up task.');
    } finally {
      setDataLoading(false);
    }
  };

  // Update lead status
  const handleUpdateLeadStatus = async (id: string, status: string) => {
    setDataLoading(true);
    setSuccess('');
    setError('');
    try {
      const leadToUpdate = leads.find(l => l.id === id);
      const res = await api.put(`/leads/${id}`, {
        ...leadToUpdate,
        status,
      });

      setLeads(leads.map(l => l.id === id ? { ...l, status: res.data.data.status } : l));
      setSuccess('Lead status updated.');
      setTimeout(() => setSuccess(''), 3500);
    } catch (err: any) {
      setError('Failed to update lead status.');
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <Loader2 className="h-10 w-10 text-brand-gold animate-spin mx-auto mb-4" />
        <p className="text-brand-slate-light font-semibold">Loading administrative portal session...</p>
      </div>
    );
  }

  // Pre-calculated stats
  const colorsList = ['#1a237e', '#3f51b5', '#d4af37', '#00e5ff', '#aa7c11'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 min-h-[85vh]">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-indigo-light/10 pb-6 mb-8">
        <div>
          <span className="text-brand-gold font-bold uppercase tracking-wider text-[10px]">Operations & Management Center</span>
          <h1 className="text-3xl font-bold font-serif text-brand-blue-deep mt-1">Counselor Control Panel</h1>
          <p className="text-xs text-brand-slate-light mt-0.5">Session: <strong className="text-brand-blue-deep">{user?.firstName} {user?.lastName} ({user?.role})</strong></p>
        </div>
        
        <button 
          onClick={logout} 
          className="px-5 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: 'analytics', name: 'Dashboard Analytics', icon: BarChart3 },
            { id: 'students', name: 'Student Records', icon: Users },
            { id: 'applications', name: 'University Pipeline', icon: Briefcase },
            { id: 'appointments', name: 'Advisory Slots', icon: Calendar },
            { id: 'leads', name: 'CRM Leads', icon: UserCheck },
            { id: 'staff', name: 'Admissions Staff', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setSuccess('');
                  setError('');
                  setInspectedStudent(null);
                  setUpdatingAppId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === item.id ? 'bg-brand-blue-deep text-white shadow-md' : 'text-brand-slate-light hover:bg-brand-blue-deep/5 hover:text-brand-blue-deep'}`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Panels */}
        <div className="lg:col-span-4 min-h-[500px]">
          
          {dataLoading && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 text-brand-gold animate-spin mr-2" />
              <span className="text-xs text-brand-slate-light font-semibold">Updating database logs...</span>
            </div>
          )}

          {/* Feedback alerts */}
          {!dataLoading && success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-green-500" />
              <span>{success}</span>
            </div>
          )}
          {!dataLoading && error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Tab 1: Dashboard Analytics */}
          {!dataLoading && activeTab === 'analytics' && metrics && (
            <div className="flex flex-col gap-8">
              
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Total Registered Students</span>
                  <h3 className="text-3xl font-bold font-serif text-brand-blue-deep">{metrics.totalStudents || 0}</h3>
                  <p className="text-[9px] text-brand-slate-light">Active visa/course files</p>
                </GlassCard>
                <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">University Applications</span>
                  <h3 className="text-3xl font-bold font-serif text-brand-blue-deep">{metrics.activeApplications || 0}</h3>
                  <p className="text-[9px] text-brand-slate-light">Pending/Submitted status</p>
                </GlassCard>
                <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">Pending Consultations</span>
                  <h3 className="text-3xl font-bold font-serif text-brand-blue-deep">{metrics.pendingAppointments || 0}</h3>
                  <p className="text-[9px] text-brand-slate-light">Scheduled zoom slots</p>
                </GlassCard>
                <GlassCard className="flex flex-col gap-2 p-5 border border-brand-indigo-light/10">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-gold">CRM Conversion Rate</span>
                  <h3 className="text-3xl font-bold font-serif text-brand-blue-deep">{metrics.conversionRate || 0}%</h3>
                  <p className="text-[9px] text-brand-slate-light">Leads qualified to converted</p>
                </GlassCard>
              </div>

              {/* Recharts Graphical Visuals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Applications by Country */}
                <GlassCard className="border border-brand-indigo-light/10 h-72">
                  <h4 className="font-serif text-xs font-bold text-brand-blue-deep mb-4">Admissions Distribution by Country</h4>
                  {metrics.applicationsByCountry && metrics.applicationsByCountry.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie
                          data={metrics.applicationsByCountry}
                          dataKey="count"
                          nameKey="country"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          fill="#8884d8"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {metrics.applicationsByCountry.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={colorsList[index % colorsList.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[80%] items-center justify-center"><p className="text-xs text-brand-slate-light">No geographic data recorded.</p></div>
                  )}
                </GlassCard>

                {/* Applications by Month */}
                <GlassCard className="border border-brand-indigo-light/10 h-72">
                  <h4 className="font-serif text-xs font-bold text-brand-blue-deep mb-4">Intake Pipelines Trend (Monthly)</h4>
                  {metrics.applicationsByMonth && metrics.applicationsByMonth.length > 0 ? (
                    <ResponsiveContainer width="100%" height="80%">
                      <AreaChart data={metrics.applicationsByMonth}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1a237e" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#1a237e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#1a237e" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[80%] items-center justify-center"><p className="text-xs text-brand-slate-light">No timelines logs.</p></div>
                  )}
                </GlassCard>
              </div>

              {/* Funnel CRM analytics */}
              {crmAnalytics && crmAnalytics.funnel && (
                <GlassCard className="border border-brand-indigo-light/10 h-80">
                  <h4 className="font-serif text-xs font-bold text-brand-blue-deep mb-4">CRM Lead Stage Conversion Funnel</h4>
                  <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={crmAnalytics.funnel}>
                      <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3f51b5" radius={[4, 4, 0, 0]}>
                        {crmAnalytics.funnel.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={colorsList[index % colorsList.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>
              )}
            </div>
          )}

          {/* Tab 2: Students List */}
          {!dataLoading && activeTab === 'students' && (
            <div className="flex flex-col gap-6">
              {inspectedStudent ? (
                <GlassCard className="border border-brand-indigo-light/10 p-6 flex flex-col gap-6">
                  <button onClick={() => setInspectedStudent(null)} className="text-xs text-brand-indigo hover:text-brand-gold font-bold self-start">&larr; Back to Student Directory</button>
                  <div className="border-b border-brand-slate-light/5 pb-3">
                    <h3 className="font-serif text-lg font-bold text-brand-blue-deep">{inspectedStudent.firstName} {inspectedStudent.lastName}</h3>
                    <p className="text-xs text-brand-slate-light">{inspectedStudent.email} &bull; {inspectedStudent.phone || 'No phone logs'}</p>
                  </div>

                  {inspectedStudent.profile ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs text-brand-slate-light">
                      <div>
                        <strong className="text-brand-slate block">Date of Birth</strong>
                        {inspectedStudent.profile.dateOfBirth ? new Date(inspectedStudent.profile.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Gender</strong>
                        {inspectedStudent.profile.gender || 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Address</strong>
                        {inspectedStudent.profile.address || 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Passport Number</strong>
                        {inspectedStudent.profile.passportNumber || 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Academic Qualification</strong>
                        {inspectedStudent.profile.currentQualification || 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Preferred Destination</strong>
                        {inspectedStudent.profile.preferredCountry || 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Preferred Subject</strong>
                        {inspectedStudent.profile.preferredSubject || 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Language Test Results</strong>
                        {inspectedStudent.profile.testType ? `${inspectedStudent.profile.testType} (Score: ${inspectedStudent.profile.testScore})` : 'N/A'}
                      </div>
                      <div>
                        <strong className="text-brand-slate block">Visa Status</strong>
                        {inspectedStudent.profile.visaStatus || 'Not Applied'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-brand-slate-light italic">No academic profile has been initialized by this student.</p>
                  )}
                </GlassCard>
              ) : (
                <GlassCard className="border border-brand-indigo-light/10 overflow-hidden p-0">
                  <div className="p-6 border-b border-brand-indigo-light/10">
                    <h3 className="font-serif text-base font-bold text-brand-blue-deep">Student Directory ({students.length})</h3>
                  </div>
                  <div className="overflow-x-auto text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-brand-blue-deep/5 text-brand-blue-deep border-b border-brand-indigo-light/10 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Joined Date</th>
                          <th className="p-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((std) => (
                          <tr key={std.id} className="border-b border-brand-slate-light/5 hover:bg-brand-blue-deep/[0.01] transition-colors text-brand-slate-light">
                            <td className="p-4 font-semibold text-brand-slate">{std.firstName} {std.lastName}</td>
                            <td className="p-4">{std.email}</td>
                            <td className="p-4">{std.phone || '-'}</td>
                            <td className="p-4">{new Date(std.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-center">
                              <button 
                                onClick={() => setInspectedStudent(std)}
                                className="px-3 py-1 bg-brand-blue-deep/5 hover:bg-brand-blue-deep/10 text-brand-blue-deep font-bold rounded"
                              >
                                Inspect File
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* Tab 3: Applications Pipeline Management */}
          {!dataLoading && activeTab === 'applications' && (
            <GlassCard className="border border-brand-indigo-light/10 p-0 overflow-hidden">
              <div className="p-6 border-b border-brand-indigo-light/10">
                <h3 className="font-serif text-base font-bold text-brand-blue-deep">University Admission & Visa Pipeline</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-blue-deep/5 text-brand-blue-deep border-b border-brand-indigo-light/10 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Target University</th>
                      <th className="p-4">Program Course</th>
                      <th className="p-4">Status State</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <React.Fragment key={app.id}>
                        <tr className="border-b border-brand-slate-light/5 text-brand-slate-light">
                          <td className="p-4 font-semibold text-brand-slate">{app.student.firstName} {app.student.lastName}<br/><span className="text-[9px] text-brand-slate-light">{app.student.email}</span></td>
                          <td className="p-4 font-semibold text-brand-slate">{app.university.name}</td>
                          <td className="p-4">{app.program}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-brand-blue-deep/5 text-brand-blue-deep border border-brand-indigo-light/10">
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setUpdatingAppId(updatingAppId === app.id ? null : app.id);
                                setAppStatusUpdate(app.status);
                                setAppNotesUpdate(app.notes || '');
                              }}
                              className="px-3 py-1 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold-dark font-bold rounded"
                            >
                              Update Pipeline
                            </button>
                          </td>
                        </tr>
                        
                        {updatingAppId === app.id && (
                          <tr>
                            <td colSpan={5} className="bg-brand-blue-deep/[0.01] p-6 border-b border-brand-indigo-light/10">
                              <div className="flex flex-col gap-4 max-w-xl text-xs">
                                <h4 className="font-bold text-brand-blue-deep font-serif">Configure Application Pipeline Status</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[9px] font-bold text-brand-slate mb-1">State Selection</label>
                                    <select
                                      value={appStatusUpdate}
                                      onChange={(e) => setAppStatusUpdate(e.target.value)}
                                      className="w-full bg-white border border-brand-indigo-light/20 rounded-lg px-3 py-2 text-brand-slate"
                                    >
                                      <option value="PENDING">Pending Evaluation</option>
                                      <option value="DOCUMENT_SUBMITTED">Documents Submitted</option>
                                      <option value="ADMISSION_OFFERED">Admission Offered</option>
                                      <option value="VISA_APPLIED">Visa Applied</option>
                                      <option value="VISA_APPROVED">Visa Approved</option>
                                      <option value="VISA_REJECTED">Visa Rejected</option>
                                      <option value="COMPLETED">Completed/Enrolled</option>
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-brand-slate mb-1">Official Notes (Emailed to student)</label>
                                  <textarea
                                    rows={3}
                                    value={appNotesUpdate}
                                    onChange={(e) => setAppNotesUpdate(e.target.value)}
                                    placeholder="Explain milestones requirements, outstanding documents etc."
                                    className="w-full bg-white border border-brand-indigo-light/20 rounded-lg px-3 py-2 text-brand-slate resize-none"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleUpdateAppStatus(app.id)}
                                    className="px-4 py-2 bg-brand-blue-deep text-white rounded font-bold hover:bg-brand-indigo"
                                  >
                                    Save Pipeline Changes
                                  </button>
                                  <button
                                    onClick={() => setUpdatingAppId(null)}
                                    className="px-4 py-2 border border-brand-indigo-light/20 bg-white rounded font-semibold text-brand-slate-light"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* Tab 4: Appointments List */}
          {!dataLoading && activeTab === 'appointments' && (
            <GlassCard className="border border-brand-indigo-light/10 p-0 overflow-hidden">
              <div className="p-6 border-b border-brand-indigo-light/10">
                <h3 className="font-serif text-base font-bold text-brand-blue-deep">Scheduled Consultations List</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-blue-deep/5 text-brand-blue-deep border-b border-brand-indigo-light/10 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Assigned Consultant</th>
                      <th className="p-4">Inquiry / Purpose</th>
                      <th className="p-4">Time Slot</th>
                      <th className="p-4">State</th>
                      <th className="p-4">Video Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id} className="border-b border-brand-slate-light/5 text-brand-slate-light">
                        <td className="p-4 font-semibold text-brand-slate">{appt.student.firstName} {appt.student.lastName}<br/><span className="text-[9px] text-brand-slate-light">{appt.student.email}</span></td>
                        <td className="p-4">{appt.consultant.firstName} {appt.consultant.lastName}</td>
                        <td className="p-4 font-semibold text-brand-slate">{appt.title}</td>
                        <td className="p-4 font-bold">{new Date(appt.dateTime).toLocaleString()} ({appt.duration} Min)</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${appt.status === 'SCHEDULED' ? 'bg-blue-50 text-brand-blue-deep border border-brand-indigo-light/10' : appt.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {appt.meetLink ? (
                            <a 
                              href={appt.meetLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-brand-indigo font-bold hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Meet Link</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* Tab 5: CRM Leads Control */}
          {!dataLoading && activeTab === 'leads' && (
            <div className="flex flex-col gap-6">
              <GlassCard className="border border-brand-indigo-light/10 p-0 overflow-hidden">
                <div className="p-6 border-b border-brand-indigo-light/10">
                  <h3 className="font-serif text-base font-bold text-brand-blue-deep">Admissions Lead Inquiries</h3>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-blue-deep/5 text-brand-blue-deep border-b border-brand-indigo-light/10 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="p-4">Lead Client</th>
                        <th className="p-4">Source</th>
                        <th className="p-4">Inquiry Service</th>
                        <th className="p-4">Status Stage</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((ld) => (
                        <React.Fragment key={ld.id}>
                          <tr className="border-b border-brand-slate-light/5 text-brand-slate-light">
                            <td className="p-4 font-semibold text-brand-slate">{ld.firstName} {ld.lastName}<br/><span className="text-[9px] text-brand-slate-light">{ld.email} &bull; {ld.phone || '-'}</span></td>
                            <td className="p-4 font-bold">{ld.source}</td>
                            <td className="p-4">{ld.interestedService} ({ld.interestedCountry || 'Global'})</td>
                            <td className="p-4">
                              <select
                                value={ld.status}
                                onChange={(e) => handleUpdateLeadStatus(ld.id, e.target.value)}
                                className="bg-white border border-brand-indigo-light/20 rounded px-2 py-1 text-[10px] text-brand-slate font-bold"
                              >
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="QUALIFIED">Qualified</option>
                                <option value="PROPOSAL_SENT">Proposal Sent</option>
                                <option value="CONVERTED">Converted</option>
                                <option value="LOST">Lost</option>
                              </select>
                            </td>
                            <td className="p-4 flex gap-2">
                              <button
                                onClick={() => {
                                  setAddingNoteLeadId(addingNoteLeadId === ld.id ? null : ld.id);
                                  setAddingFollowupLeadId(null);
                                }}
                                className="px-2.5 py-1 bg-brand-blue-deep/5 hover:bg-brand-blue-deep/10 text-brand-blue-deep font-bold rounded"
                              >
                                Log Note
                              </button>
                              <button
                                onClick={() => {
                                  setAddingFollowupLeadId(addingFollowupLeadId === ld.id ? null : ld.id);
                                  setAddingNoteLeadId(null);
                                }}
                                className="px-2.5 py-1 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold-dark font-bold rounded"
                              >
                                Schedule Task
                              </button>
                            </td>
                          </tr>

                          {/* Logging notes interface */}
                          {addingNoteLeadId === ld.id && (
                            <tr>
                              <td colSpan={5} className="bg-brand-blue-deep/[0.01] p-6 border-b border-brand-indigo-light/10">
                                <div className="flex flex-col gap-4 text-xs">
                                  <h4 className="font-bold text-brand-blue-deep">Log Communication Note</h4>
                                  <textarea
                                    rows={3}
                                    value={leadNoteContent}
                                    onChange={(e) => setLeadNoteContent(e.target.value)}
                                    placeholder="Enter call notes or emails correspondence records..."
                                    className="w-full bg-white border border-brand-indigo-light/20 rounded-lg px-3 py-2 text-brand-slate max-w-xl"
                                  />
                                  <div className="flex gap-2">
                                    <button onClick={() => handleAddLeadNote(ld.id)} className="px-4 py-2 bg-brand-blue-deep text-white font-bold rounded hover:bg-brand-indigo">Submit Log</button>
                                    <button onClick={() => setAddingNoteLeadId(null)} className="px-4 py-2 border border-brand-indigo-light/20 bg-white rounded font-semibold text-brand-slate-light">Cancel</button>
                                  </div>
                                  
                                  {/* Past logs list */}
                                  {ld.notes && ld.notes.length > 0 && (
                                    <div className="mt-4 flex flex-col gap-2 max-w-xl">
                                      <span className="font-semibold text-brand-slate text-[10px] uppercase">Notes Log History</span>
                                      {ld.notes.map((n: any) => (
                                        <div key={n.id} className="p-3 bg-white border border-brand-indigo-light/10 rounded-lg">
                                          <p className="leading-relaxed">{n.content}</p>
                                          <span className="text-[8px] text-brand-slate-light/60 mt-1 block">Logged by {n.createdBy?.firstName} &bull; {new Date(n.createdAt).toLocaleString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}

                          {/* Adding followups interface */}
                          {addingFollowupLeadId === ld.id && (
                            <tr>
                              <td colSpan={5} className="bg-brand-blue-deep/[0.01] p-6 border-b border-brand-indigo-light/10">
                                <div className="flex flex-col gap-4 text-xs max-w-md">
                                  <h4 className="font-bold text-brand-blue-deep">Schedule Follow-up Task</h4>
                                  <div>
                                    <label className="block text-[9px] font-bold text-brand-slate mb-1">Task Title</label>
                                    <input
                                      type="text"
                                      value={followupForm.title}
                                      onChange={(e) => setFollowupForm({ ...followupForm, title: e.target.value })}
                                      placeholder="e.g. Call client to verify passport"
                                      className="w-full bg-white border border-brand-indigo-light/20 rounded-lg px-3 py-2 text-brand-slate"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-brand-slate mb-1">Due Date</label>
                                    <input
                                      type="datetime-local"
                                      value={followupForm.dueDate}
                                      onChange={(e) => setFollowupForm({ ...followupForm, dueDate: e.target.value })}
                                      className="w-full bg-white border border-brand-indigo-light/20 rounded-lg px-3 py-2 text-brand-slate"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => handleAddFollowup(ld.id)} className="px-4 py-2 bg-brand-blue-deep text-white font-bold rounded">Schedule Task</button>
                                    <button onClick={() => setAddingFollowupLeadId(null)} className="px-4 py-2 border border-brand-indigo-light/20 bg-white rounded font-semibold text-brand-slate-light">Cancel</button>
                                  </div>

                                  {/* Scheduled tasks list */}
                                  {ld.followups && ld.followups.length > 0 && (
                                    <div className="mt-4 flex flex-col gap-2">
                                      <span className="font-semibold text-brand-slate text-[10px] uppercase">Tasks Ledger</span>
                                      {ld.followups.map((f: any) => (
                                        <div key={f.id} className="p-3 bg-white border border-brand-indigo-light/10 rounded-lg flex justify-between items-center">
                                          <div>
                                            <p className={`font-bold ${f.completed ? 'line-through text-brand-slate-light/60' : 'text-brand-slate'}`}>{f.title}</p>
                                            <span className="text-[8px] text-brand-slate-light/60 block mt-0.5">Due: {new Date(f.dueDate).toLocaleString()}</span>
                                          </div>
                                          {!f.completed && (
                                            <button 
                                              onClick={() => handleCompleteFollowup(ld.id, f.id)}
                                              className="px-2 py-1 bg-green-50 text-green-700 font-bold border border-green-200 rounded text-[9px]"
                                            >
                                              Complete
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Tab 6: Staff Members Directory */}
          {!dataLoading && activeTab === 'staff' && (
            <GlassCard className="border border-brand-indigo-light/10 p-0 overflow-hidden">
              <div className="p-6 border-b border-brand-indigo-light/10">
                <h3 className="font-serif text-base font-bold text-brand-blue-deep">Active Admissions Advisory Staff</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-blue-deep/5 text-brand-blue-deep border-b border-brand-indigo-light/10 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Staff Member</th>
                      <th className="p-4">Email Coordinates</th>
                      <th className="p-4">Designated Role</th>
                      <th className="p-4">Assigned Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((stf) => (
                      <tr key={stf.id} className="border-b border-brand-slate-light/5 text-brand-slate-light">
                        <td className="p-4 font-semibold text-brand-slate">{stf.firstName} {stf.lastName}</td>
                        <td className="p-4">{stf.email}</td>
                        <td className="p-4 font-bold text-brand-blue-deep">{stf.role}</td>
                        <td className="p-4">{stf.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

        </div>

      </div>
    </div>
  );
}
