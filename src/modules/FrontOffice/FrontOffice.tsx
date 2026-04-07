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
  FileText
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

export const FrontOffice: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<Partial<Enquiry>>({
    status: 'PENDING',
    isLead: false
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    console.log('Fetching enquiries from Supabase...');
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching enquiries:', error);
      const saved = localStorage.getItem('edunexus_enquiries');
      if (saved) {
        console.log('Loading enquiries from localStorage fallback');
        setEnquiries(JSON.parse(saved));
      }
    } else if (data) {
      console.log(`Fetched ${data.length} enquiries`);
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
      localStorage.setItem('edunexus_enquiries', JSON.stringify(formatted));
    }
  };

  const handleSave = async () => {
    console.log('Attempting to save enquiry...', form);
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

      console.log('Upserting enquiry data:', enquiryData);
      const { error } = await supabase
        .from('enquiries')
        .upsert(enquiryData);

      if (error) {
        console.error('Supabase error saving enquiry:', error);
        alert(`Failed to save enquiry: ${error.message}`);
        return;
      }

      console.log('Enquiry saved successfully');

      // If converted to lead and status is CONVERTED, automatically move to register student
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
    } catch (err) {
      console.error('Unexpected error in handleSave:', err);
      alert('An unexpected error occurred. Please check the console for details.');
    }
  };

  const convertToStudent = async (enquiry: Enquiry) => {
    try {
      if (!enquiry.phone || enquiry.phone.trim() === '') {
        console.warn('Cannot convert to student: Phone number is missing');
        return;
      }

      // Check if student already exists in Supabase
      const { data: existing, error: checkError } = await supabase
        .from('students')
        .select('id')
        .eq('phone', enquiry.phone)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking existing student:', checkError);
        return;
      }

      if (!existing) {
        const newStudent = {
          id: `STU${Math.floor(1000 + Math.random() * 9000)}`,
          name: enquiry.studentName,
          phone: enquiry.phone,
          status: 'Active',
          branch: 'B.Tech CS' // Default
        };

        const { error: insertError } = await supabase.from('students').insert(newStudent);
        if (insertError) {
          console.error('Error converting to student:', insertError);
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
        console.error('Error deleting enquiry:', error);
        alert(`Failed to delete enquiry: ${error.message}`);
      } else {
        await fetchEnquiries();
      }
    }
  };

  const handleExportPDF = () => {
    const headers = ['ID', 'Student', 'Parent', 'Date', 'Time', 'Phone', 'Status', 'Lead'];
    const data = enquiries.map(e => [e.id, e.studentName, e.parentName, e.date, e.time, e.phone, e.status, e.isLead ? 'Yes' : 'No']);
    exportToPDF('Front Office Enquiries Report', headers, data, 'Enquiries_Report');
  };

  const handleExportExcel = () => {
    exportToExcel(enquiries, 'Enquiries_Report');
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Front Office</h1>
          <p className="text-slate-500">Manage student and parent enquiries, leads, and conversions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-primary/10 text-slate-600 rounded-xl text-sm font-bold hover:bg-background transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-primary/10 text-slate-600 rounded-xl text-sm font-bold hover:bg-background transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
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
        </div>
      </div>

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
              placeholder="Search by name, parent or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                      <p>No enquiries found. Add your first enquiry to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq, i) => (
                <motion.tr 
                  key={enq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{enq.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{enq.studentName}</p>
                      <p className="text-xs text-slate-400">Parent: {enq.parentName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3 h-3" />
                      {enq.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(enq.date)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {enq.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      enq.status === 'CONVERTED' ? "bg-green-50 text-green-600" : 
                      enq.status === 'FOLLOW_UP' ? "bg-amber-50 text-amber-600" : 
                      enq.status === 'CLOSED' ? "bg-slate-50 text-slate-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {enq.isLead ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                        <CheckCircle2 className="w-3 h-3" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingEnquiry(enq);
                          setForm(enq);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(enq.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
                <div>
                  <h2 className="text-2xl font-black text-primary">{editingEnquiry ? 'Edit Enquiry' : 'New Enquiry'}</h2>
                  <p className="text-slate-500 text-sm">Fill in the details for the enquiry.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</label>
                    <input 
                      type="text" 
                      value={form.studentName || ''}
                      onChange={(e) => setForm({...form, studentName: e.target.value})}
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Name</label>
                    <input 
                      type="text" 
                      value={form.parentName || ''}
                      onChange={(e) => setForm({...form, parentName: e.target.value})}
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      value={form.phone || ''}
                      onChange={(e) => setForm({...form, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select 
                      value={form.status || 'PENDING'}
                      onChange={(e) => setForm({...form, status: e.target.value as any})}
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="FOLLOW_UP">Follow Up</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason for Enquiry</label>
                    <textarea 
                      rows={3}
                      value={form.reason || ''}
                      onChange={(e) => setForm({...form, reason: e.target.value})}
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="isLead"
                      checked={form.isLead || false}
                      onChange={(e) => setForm({...form, isLead: e.target.checked})}
                      className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isLead" className="text-sm font-bold text-slate-700">Mark as Lead</label>
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
                  {editingEnquiry ? 'Update Enquiry' : 'Save Enquiry'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
