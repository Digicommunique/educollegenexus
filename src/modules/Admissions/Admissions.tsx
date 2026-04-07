import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  CreditCard,
  Edit2,
  Trash2,
  X,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from '../../lib/utils';

import { supabase } from '../../lib/supabase';

interface AdmissionApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Verified';
  score: string;
}

export const Admissions: React.FC = () => {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AdmissionApplication | null>(null);
  const [form, setForm] = useState<Partial<AdmissionApplication>>({});

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    console.log('Fetching applications from Supabase...');
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching applications:', error);
      const saved = localStorage.getItem('edunexus_admissions');
      if (saved) {
        console.log('Loading applications from localStorage fallback');
        setApplications(JSON.parse(saved));
      }
    } else if (data) {
      console.log(`Fetched ${data.length} applications`);
      const formatted: AdmissionApplication[] = data.map(a => ({
        id: a.id,
        name: a.name,
        email: a.email || '',
        phone: a.phone || '',
        branch: a.branch || '',
        date: a.date,
        status: a.status as any,
        score: a.score || '0%'
      }));
      setApplications(formatted);
      localStorage.setItem('edunexus_admissions', JSON.stringify(formatted));
    }
  };

  const handleSave = async () => {
    console.log('Attempting to save application...', form);
    try {
      if (!form.name || form.name.trim() === '') {
        alert('Applicant Name is required');
        return;
      }

      const appId = editingApp?.id || `ADM${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
      const appData = {
        id: appId,
        name: form.name.trim(),
        email: form.email?.trim() || '',
        phone: form.phone?.trim() || '',
        branch: form.branch || '',
        date: form.date || new Date().toISOString().split('T')[0],
        status: form.status || 'Pending',
        score: form.score || '0%'
      };

      console.log('Upserting application data:', appData);
      const { error } = await supabase
        .from('applications')
        .upsert(appData);

      if (error) {
        console.error('Supabase error saving application:', error);
        alert(`Failed to save application: ${error.message}`);
        return;
      }

      console.log('Application saved successfully');
      await fetchApplications();
      setIsModalOpen(false);
      setEditingApp(null);
      setForm({});
    } catch (err) {
      console.error('Unexpected error in handleSave:', err);
      alert('An unexpected error occurred. Please check the console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) {
        console.error('Error deleting application:', error);
        alert(`Failed to delete application: ${error.message}`);
      } else {
        await fetchApplications();
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Verified': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-3 h-3" />;
      case 'Rejected': return <XCircle className="w-3 h-3" />;
      case 'Verified': return <ShieldCheck className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Admission Portal</h1>
          <p className="text-slate-500">Review and process new student admission applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setEditingApp(null);
              setForm({});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <UserPlus className="w-5 h-5" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Applications', value: '1,284', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Pending Review', value: '156', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Approved', value: '842', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'Fee Paid', value: '612', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-primary/10 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name or application ID..." 
            className="w-full pl-12 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="px-4 py-3 bg-background border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Verified</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
          <button className="p-3 bg-background text-slate-600 rounded-xl hover:bg-primary/5 transition-all">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-8 py-4 text-xs font-bold text-primary uppercase tracking-wider">Applicant</th>
                <th className="px-8 py-4 text-xs font-bold text-primary uppercase tracking-wider">App ID</th>
                <th className="px-8 py-4 text-xs font-bold text-primary uppercase tracking-wider">Branch & Score</th>
                <th className="px-8 py-4 text-xs font-bold text-primary uppercase tracking-wider">Apply Date</th>
                <th className="px-8 py-4 text-xs font-bold text-primary uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-primary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="w-8 h-8 text-slate-300" />
                      <p>No applications found. New applications will appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{app.name}</p>
                        <p className="text-xs text-slate-500">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                      {app.id}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-700">{app.branch}</p>
                      <p className="text-xs text-slate-500 font-bold">Entrance Score: {app.score}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {formatDate(app.date)}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit",
                      getStatusColor(app.status)
                    )}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingApp(app);
                          setForm(app);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(app.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
              <div>
                <h2 className="text-2xl font-black text-primary">{editingApp ? 'Edit Application' : 'New Application'}</h2>
                <p className="text-slate-500 text-sm">Enter applicant details below.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    value={form.name || ''}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <input 
                    type="email" 
                    value={form.email || ''}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                  <input 
                    type="tel" 
                    value={form.phone || ''}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branch</label>
                  <select 
                    value={form.branch || ''}
                    onChange={(e) => setForm({...form, branch: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Branch</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Mechanical Engineering</option>
                    <option>Civil Engineering</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score</label>
                  <input 
                    type="text" 
                    value={form.score || ''}
                    onChange={(e) => setForm({...form, score: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select 
                    value={form.status || 'Pending'}
                    onChange={(e) => setForm({...form, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>Pending</option>
                    <option>Verified</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-slate-500 font-bold hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Save className="w-5 h-5" />
                {editingApp ? 'Update' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
