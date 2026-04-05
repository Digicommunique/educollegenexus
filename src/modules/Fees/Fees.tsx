import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Receipt,
  Wallet,
  MessageSquare,
  Edit2,
  Trash2,
  X,
  Save,
  FileText
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import { motion } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';

interface FeeTransaction {
  id: string;
  student: string;
  roll: string;
  amount: number;
  date: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  type: string;
  phone?: string;
}

export const Fees: React.FC = () => {
  const [transactions, setTransactions] = useState<FeeTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState<FeeTransaction | null>(null);
  const [form, setForm] = useState<Partial<FeeTransaction>>({});

  useEffect(() => {
    const saved = localStorage.getItem('edunexus_fees');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      const initial = [
        { id: 'TXN001', student: 'Rahul Sharma', roll: 'CS202601', amount: 45000, date: '2026-10-10', status: 'PAID', type: 'Tuition Fee', phone: '+91 98765 43210' },
        { id: 'TXN002', student: 'Priya Patel', roll: 'CS202602', amount: 5000, date: '2026-10-09', status: 'PAID', type: 'Exam Fee', phone: '+91 98765 43211' },
        { id: 'TXN003', student: 'Amit Kumar', roll: 'CS202603', amount: 45000, date: '2026-10-08', status: 'PENDING', type: 'Tuition Fee', phone: '+91 98765 43212' },
        { id: 'TXN004', student: 'Siddharth Singh', roll: 'CS202604', amount: 2500, date: '2026-10-07', status: 'PAID', type: 'Library Fee', phone: '+91 98765 43213' },
        { id: 'TXN005', student: 'Anjali Verma', roll: 'CS202605', amount: 45000, date: '2026-10-06', status: 'OVERDUE', type: 'Tuition Fee', phone: '+91 98765 43214' },
        { id: 'TXN006', student: 'Vikram Malhotra', roll: 'CS202606', amount: 5000, date: '2026-10-05', status: 'PAID', type: 'Exam Fee', phone: '+91 98765 43215' },
      ];
      setTransactions(initial as FeeTransaction[]);
      localStorage.setItem('edunexus_fees', JSON.stringify(initial));
    }
  }, []);

  const saveTxns = (newTxns: FeeTransaction[]) => {
    setTransactions(newTxns);
    localStorage.setItem('edunexus_fees', JSON.stringify(newTxns));
  };

  const handleSave = () => {
    const newTxn: FeeTransaction = {
      id: editingTxn?.id || `TXN${Math.floor(1000 + Math.random() * 9000)}`,
      student: form.student || '',
      roll: form.roll || '',
      amount: Number(form.amount) || 0,
      date: form.date || new Date().toISOString().split('T')[0],
      status: form.status || 'PENDING',
      type: form.type || 'Tuition Fee',
      phone: form.phone || ''
    };

    if (editingTxn) {
      saveTxns(transactions.map(t => t.id === editingTxn.id ? newTxn : t));
    } else {
      saveTxns([newTxn, ...transactions]);
    }
    setIsModalOpen(false);
    setEditingTxn(null);
    setForm({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      saveTxns(transactions.filter(t => t.id !== id));
    }
  };

  const sendWhatsAppReminder = (txn: FeeTransaction) => {
    const message = `Hello ${txn.student}, this is a reminder regarding your pending ${txn.type} of ${formatCurrency(txn.amount)}. Please clear your dues at the earliest. - EduNexus College`;
    const url = `https://wa.me/${txn.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleExportPDF = () => {
    const headers = ['ID', 'Student', 'Roll No', 'Type', 'Amount', 'Date', 'Status'];
    const data = transactions.map(t => [t.id, t.student, t.roll, t.type, formatCurrency(t.amount), formatDate(t.date), t.status]);
    exportToPDF('Fee Collection Report', headers, data, 'Fee_Report');
  };

  const handleExportExcel = () => {
    exportToExcel(transactions, 'Fee_Report');
  };

  const filteredTransactions = transactions.filter(txn => 
    txn.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-500">Track collections, pending payments, and generate receipts.</p>
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
              setEditingTxn(null);
              setForm({});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            New Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Collection', value: formatCurrency(transactions.filter(t => t.status === 'PAID').reduce((acc, t) => acc + t.amount, 0)), change: '+12%', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' },
          { title: 'Pending Fees', value: formatCurrency(transactions.filter(t => t.status === 'PENDING').reduce((acc, t) => acc + t.amount, 0)), change: '-5%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'down' },
          { title: 'Overdue Payments', value: formatCurrency(transactions.filter(t => t.status === 'OVERDUE').reduce((acc, t) => acc + t.amount, 0)), change: '+8%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', trend: 'up' },
          { title: 'Total Expected', value: formatCurrency(transactions.reduce((acc, t) => acc + t.amount, 0)), change: '+25%', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up' },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === 'up' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
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
              placeholder="Search student, roll no or transaction ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Latest First</option>
            <option>Amount: High to Low</option>
            <option>Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn, i) => (
                <motion.tr 
                  key={txn.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-800">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{txn.student}</p>
                      <p className="text-xs text-slate-400">{txn.roll}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{txn.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(txn.amount)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">{formatDate(txn.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      txn.status === 'PAID' ? "bg-green-50 text-green-600" : 
                      txn.status === 'PENDING' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                    )}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {txn.status !== 'PAID' && (
                        <button 
                          onClick={() => sendWhatsAppReminder(txn)}
                          title="Send WhatsApp Reminder"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setEditingTxn(txn);
                          setForm(txn);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(txn.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Receipt className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
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
                <h2 className="text-2xl font-black text-primary">{editingTxn ? 'Edit Payment' : 'New Payment'}</h2>
                <p className="text-slate-500 text-sm">Enter payment details below.</p>
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</label>
                  <input 
                    type="text" 
                    value={form.student || ''}
                    onChange={(e) => setForm({...form, student: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No</label>
                  <input 
                    type="text" 
                    value={form.roll || ''}
                    onChange={(e) => setForm({...form, roll: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone (WhatsApp)</label>
                  <input 
                    type="tel" 
                    value={form.phone || ''}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</label>
                  <input 
                    type="number" 
                    value={form.amount || ''}
                    onChange={(e) => setForm({...form, amount: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fee Type</label>
                  <select 
                    value={form.type || 'Tuition Fee'}
                    onChange={(e) => setForm({...form, type: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>Tuition Fee</option>
                    <option>Exam Fee</option>
                    <option>Library Fee</option>
                    <option>Hostel Fee</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select 
                    value={form.status || 'PENDING'}
                    onChange={(e) => setForm({...form, status: e.target.value as any})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>PAID</option>
                    <option>PENDING</option>
                    <option>OVERDUE</option>
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
                {editingTxn ? 'Update' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
