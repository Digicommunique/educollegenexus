import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save,
  UserPlus,
  Phone,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  FileText,
  Key,
  UserCheck,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';

import { supabase } from '../../lib/supabase';

interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  date: string;
  time: string;
  phone: string;
  reason: string;
  status: 'PENDING' | 'FOLLOW_UP' | 'CONVERTED' | 'CLOSED';
  isLead: boolean;
}

interface UserCredential {
  id: string;
  password: string;
  role: string;
  name: string;
  created_at?: string;
}

export const FrontOffice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'credentials'>('enquiries');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [credentials, setCredentials] = useState<UserCredential[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCredModalOpen, setIsCredModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [editingCred, setEditingCred] = useState<UserCredential | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<Partial<Enquiry>>({
    status: 'PENDING',
    isLead: false
  });

  const [credForm, setCredForm] = useState<Partial<UserCredential>>({
    role: 'STUDENT'
  });

  useEffect(() => {
    fetchEnquiries();
    fetchCredentials();
  }, []);

  const fetchEnquiries = async () => {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching enquiries:', error);
    } else if (data) {
      const formatted: Enquiry[] = data.map(e => ({
        id: e.id,
        studentName: e.student_name,
        parentName: e.parent_name || '',
        date: e.date,
        time: e.time || '',
        phone: e.phone || '',
        reason: e.reason || '',
        status: e.status as any,
        isLead: e.is_lead
      }));
      setEnquiries(formatted);
    }
  };

  const fetchCredentials = async () => {
    const { data, error } = await supabase
      .from('user_credentials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching credentials:', error);
    } else if (data) {
      setCredentials(data);
    }
  };

  const handleSave = async () => {
    try {
      if (!form.studentName || form.studentName.trim() === '') {
        alert('Student Name is required');
        return;
      }

      const enquiryId = editingEnquiry?.id || `ENQ${Math.floor(1000 + Math.random() * 9000)}`;
      const enquiryData = {
        id: enquiryId,
        student_name: form.studentName.trim(),
        parent_name: form.parentName?.trim() || '',
        date: form.date || new Date().toISOString().split('T')[0],
        time: form.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        phone: form.phone || '',
        reason: form.reason || '',
        status: form.status || 'PENDING',
        is_lead: form.isLead || false
      };

      const { error } = await supabase
        .from('enquiries')
        .upsert(enquiryData);

      if (error) {
        alert(`Failed to save enquiry: ${error.message}`);
        return;
      }

      if (enquiryData.status === 'CONVERTED') {
        await convertToStudent({
          id: enquiryData.id,
          studentName: enquiryData.student_name,
          parentName: enquiryData.parent_name,
          date: enquiryData.date,
          time: enquiryData.time,
          phone: enquiryData.phone,
          reason: enquiryData.reason,
          status: enquiryData.status as any,
          isLead: enquiryData.is_lead
        });
      }

      await fetchEnquiries();
      setIsModalOpen(false);
      setEditingEnquiry(null);
      setForm({ status: 'PENDING', isLead: false });
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSaveCred = async () => {
    try {
      if (!credForm.id || !credForm.password || !credForm.role) {
        alert('ID, Password and Role are required');
        return;
      }

      const credData = {
        id: credForm.id,
        password: credForm.password,
        role: credForm.role,
        name: credForm.name || credForm.id
      };

      const { error } = await supabase
        .from('user_credentials')
        .upsert(credData);

      if (error) {
        alert(`Failed to save credential: ${error.message}`);
        return;
      }

      await fetchCredentials();
      setIsCredModalOpen(false);
      setEditingCred(null);
      setCredForm({ role: 'STUDENT' });
    } catch (err: any) {
      alert(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
    }
  };

  const convertToStudent = async (enquiry: Enquiry) => {
    try {
      if (!enquiry.phone || enquiry.phone.trim() === '') return;

      const { data: existing } = await supabase
        .from('students')
        .select('id')
        .eq('phone', enquiry.phone)
        .maybeSingle();
      
      if (!existing) {
        const newStudent = {
          id: `STU${Math.floor(1000 + Math.random() * 9000)}`,
          name: enquiry.studentName,
          phone: enquiry.phone,
          status: 'Active',
          branch: 'B.Tech CS'
        };

        const { error: insertError } = await supabase.from('students').insert(newStudent);
        if (insertError) {
          alert(`Failed to register student: ${insertError.message}`);
        } else {
          alert(`${enquiry.studentName} has been automatically registered as a student.`);
        }
      }
    } catch (err) {
      console.error('Unexpected error in convertToStudent:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) {
        alert(`Failed to delete enquiry: ${error.message}`);
      } else {
        await fetchEnquiries();
      }
    }
  };

  const handleDeleteCred = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      const { error } = await supabase.from('user_credentials').delete().eq('id', id);
      if (error) {
        alert(`Failed to delete credential: ${error.message}`);
      } else {
        await fetchCredentials();
      }
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCredentials = credentials.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Front Office</h1>
          <p className="text-slate-500">Manage enquiries, student registrations, and user credentials.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-primary/10 shadow-sm">
            <button 
              onClick={() => setActiveTab('enquiries')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'enquiries' ? "bg-primary text-white" : "text-slate-500 hover:bg-primary/5"
              )}
            >
              Enquiries
            </button>
            <button 
              onClick={() => setActiveTab('credentials')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                activeTab === 'credentials' ? "bg-primary text-white" : "text-slate-500 hover:bg-primary/5"
              )}
            >
              Credentials
            </button>
          </div>
          {activeTab === 'enquiries' ? (
            <button 
              onClick={() => {
                setEditingEnquiry(null);
                setForm({ status: 'PENDING', isLead: false });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              New Enquiry
            </button>
          ) : (
            <button 
              onClick={() => {
                setEditingCred(null);
                setCredForm({ role: 'STUDENT' });
                setIsCredModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <Key className="w-4 h-4" />
              New ID/Pass
            </button>
          )}
        </div>
      </div>

      {activeTab === 'enquiries' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Enquiries', value: enquiries.length.toString(), icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
              { title: 'Active Leads', value: enquiries.filter(e => e.isLead).length.toString(), icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Conversions', value: enquiries.filter(e => e.status === 'CONVERTED').length.toString(), icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { title: 'Pending Follow-ups', value: enquiries.filter(e => e.status === 'FOLLOW_UP').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search enquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student & Parent</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No enquiries found.</td>
                    </tr>
                  ) : (
                    filteredEnquiries.map((enq, i) => (
                    <motion.tr key={enq.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{enq.id}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-800">{enq.studentName}</p>
                        <p className="text-xs text-slate-400">Parent: {enq.parentName}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{enq.phone}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(enq.date)} <span className="text-xs text-slate-400">{enq.time}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          enq.status === 'CONVERTED' ? "bg-green-50 text-green-600" : 
                          enq.status === 'FOLLOW_UP' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {enq.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingEnquiry(enq); setForm(enq); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(enq.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Credentials Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Password</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCredentials.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">No credentials found.</td>
                    </tr>
                  ) : (
                    filteredCredentials.map((cred, i) => (
                    <motion.tr key={cred.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-primary">{cred.id}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{cred.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {cred.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-slate-600">
                            {showPassword[cred.id] ? cred.password : '••••••••'}
                          </span>
                          <button 
                            onClick={() => setShowPassword(prev => ({ ...prev, [cred.id]: !prev[cred.id] }))}
                            className="p-1 text-slate-400 hover:text-primary"
                          >
                            {showPassword[cred.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setEditingCred(cred); setCredForm(cred); setIsCredModalOpen(true); }} className="p-2 text-slate-400 hover:text-primary rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCred(cred.id)} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Enquiry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
                <h2 className="text-2xl font-black text-primary">{editingEnquiry ? 'Edit Enquiry' : 'New Enquiry'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</label>
                    <input type="text" value={form.studentName || ''} onChange={(e) => setForm({...form, studentName: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Name</label>
                    <input type="text" value={form.parentName || ''} onChange={(e) => setForm({...form, parentName: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                    <input type="tel" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select value={form.status || 'PENDING'} onChange={(e) => setForm({...form, status: e.target.value as any})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="PENDING">Pending</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex items-center justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold">Cancel</button>
                <button onClick={handleSave} className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Credential Modal */}
      <AnimatePresence>
        {isCredModalOpen && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
                <h2 className="text-2xl font-black text-primary">{editingCred ? 'Edit ID/Pass' : 'New ID/Pass'}</h2>
                <button onClick={() => setIsCredModalOpen(false)} className="p-2 hover:bg-white rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">User ID (Username)</label>
                    <input type="text" value={credForm.id || ''} onChange={(e) => setCredForm({...credForm, id: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <input type="text" value={credForm.name || ''} onChange={(e) => setCredForm({...credForm, name: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <input type="text" value={credForm.password || ''} onChange={(e) => setCredForm({...credForm, password: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
                    <select value={credForm.role || 'STUDENT'} onChange={(e) => setCredForm({...credForm, role: e.target.value})} className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="STUDENT">Student</option>
                      <option value="FACULTY">Faculty</option>
                      <option value="STAFF">Staff</option>
                      <option value="ACCOUNTANT">Accountant</option>
                      <option value="LIBRARIAN">Librarian</option>
                      <option value="PRINCIPAL">Principal</option>
                      <option value="COLLEGE_ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex items-center justify-end gap-3">
                <button onClick={() => setIsCredModalOpen(false)} className="px-6 py-3 text-slate-500 font-bold">Cancel</button>
                <button onClick={handleSaveCred} className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
