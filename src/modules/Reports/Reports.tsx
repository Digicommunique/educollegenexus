import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CreditCard, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Mail,
  Phone,
  DollarSign,
  PieChart,
  History
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';

type ReportType = 
  | 'PROFIT_LOSS' 
  | 'DUES_FEES' 
  | 'FINE' 
  | 'INCOME_EXPENSE' 
  | 'EXAMINATION' 
  | 'LEDGER' 
  | 'STUDENT_LEDGER' 
  | 'PASSING_REPORT';

interface ReportCategory {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const REPORT_CATEGORIES: ReportCategory[] = [
  { id: 'PROFIT_LOSS', title: 'Profit & Loss', description: 'Overall financial performance summary', icon: TrendingUp, color: 'text-emerald-600' },
  { id: 'DUES_FEES', title: 'Dues Fees', description: 'Pending fee payments and reminders', icon: CreditCard, color: 'text-amber-600' },
  { id: 'FINE', title: 'Fine Reports', description: 'Summary of fines and penalties', icon: AlertCircle, color: 'text-rose-600' },
  { id: 'INCOME_EXPENSE', title: 'Income & Expense', description: 'Detailed transaction history', icon: BarChart3, color: 'text-indigo-600' },
  { id: 'EXAMINATION', title: 'Examination', description: 'Exam performance and statistics', icon: FileText, color: 'text-blue-600' },
  { id: 'LEDGER', title: 'General Ledger', description: 'Accounting ledger for all accounts', icon: BookOpen, color: 'text-slate-600' },
  { id: 'STUDENT_LEDGER', title: 'Student Ledger', description: 'Individual student financial history', icon: Users, color: 'text-cyan-600' },
  { id: 'PASSING_REPORT', title: 'Passing Report', description: 'Exam pass/fail analysis and trends', icon: CheckCircle2, color: 'text-green-600' },
];

export const Reports: React.FC = () => {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState<ReportType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const handlePrint = () => {
    window.print();
  };

  const sendWhatsAppReminder = (studentName: string, amount: number) => {
    const message = `Dear Parent, this is a reminder regarding the pending fees of ${amount} for your ward ${studentName}. Please clear the dues at the earliest. - EduNexus College`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const renderProfitLoss = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <h3 className="text-emerald-900/50 text-sm font-bold uppercase tracking-wider mb-1">Total Income</h3>
          <p className="text-3xl font-black text-emerald-900">₹12,45,000</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
              <TrendingDown className="w-6 h-6" />
            </div>
            <span className="text-rose-600 text-xs font-bold bg-rose-100 px-2 py-1 rounded-full">+8.2%</span>
          </div>
          <h3 className="text-rose-900/50 text-sm font-bold uppercase tracking-wider mb-1">Total Expense</h3>
          <p className="text-3xl font-black text-rose-900">₹4,12,000</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
              <PieChart className="w-6 h-6" />
            </div>
            <span className="text-indigo-600 text-xs font-bold bg-indigo-100 px-2 py-1 rounded-full">+15.3%</span>
          </div>
          <h3 className="text-indigo-900/50 text-sm font-bold uppercase tracking-wider mb-1">Net Profit</h3>
          <p className="text-3xl font-black text-indigo-900">₹8,33,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800">Monthly Breakdown</h3>
          <button className="text-indigo-600 text-sm font-bold hover:underline">View Detailed Ledger</button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {['January', 'February', 'March'].map((month) => (
              <div key={month} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{month} 2026</p>
                    <p className="text-xs text-slate-500">245 Transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600">+₹4,15,000</p>
                  <p className="text-xs text-rose-500">-₹1,20,000</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDuesFees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search student or roll number..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Filter by Batch
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Fee</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dues</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Rahul Sharma', roll: 'CS202401', total: 45000, paid: 30000, dues: 15000 },
              { name: 'Priya Patel', roll: 'CS202405', total: 45000, paid: 45000, dues: 0 },
              { name: 'Amit Kumar', roll: 'IT202412', total: 42000, paid: 20000, dues: 22000 },
              { name: 'Sneha Reddy', roll: 'EC202408', total: 48000, paid: 40000, dues: 8000 },
            ].map((student) => (
              <tr key={student.roll} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{student.roll}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">₹{student.total}</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600">₹{student.paid}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-sm font-bold",
                    student.dues > 0 ? "text-rose-600" : "text-emerald-600"
                  )}>
                    ₹{student.dues}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {student.dues > 0 && (
                      <button 
                        onClick={() => sendWhatsAppReminder(student.name, student.dues)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Send WhatsApp Reminder"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={handlePrint}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Print Receipt"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderExamination = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Exams', value: '24', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Avg. Score', value: '78%', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { title: 'Pass Rate', value: '92%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Pending Results', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800">Recent Exam Performance</h3>
          <div className="flex items-center gap-2">
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>B.Tech CS</option>
              <option>B.Tech IT</option>
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {[
              { subject: 'Advanced Mathematics', students: 120, passed: 112, failed: 8, avg: 82 },
              { subject: 'Data Structures', students: 115, passed: 105, failed: 10, avg: 75 },
              { subject: 'Digital Electronics', students: 118, passed: 110, failed: 8, avg: 79 },
            ].map((exam) => (
              <div key={exam.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{exam.subject}</p>
                    <p className="text-xs text-slate-500">{exam.students} Students Appeared</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo-600">{exam.avg}% Avg</p>
                    <p className="text-xs text-emerald-600">{exam.passed} Passed • {exam.failed} Failed</p>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${(exam.passed / exam.students) * 100}%` }}
                  />
                  <div 
                    className="h-full bg-rose-500" 
                    style={{ width: `${(exam.failed / exam.students) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLedger = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input type="date" className="text-sm outline-none bg-transparent" />
            <span className="text-slate-300">to</span>
            <input type="date" className="text-sm outline-none bg-transparent" />
          </div>
          <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>All Accounts</option>
            <option>Fee Collection</option>
            <option>Salary Expense</option>
            <option>Maintenance</option>
          </select>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Printer className="w-4 h-4" />
          Print Ledger
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Debit (Dr)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Credit (Cr)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { date: '2026-04-01', desc: 'Opening Balance', ref: '-', dr: 0, cr: 0, bal: 450000 },
              { date: '2026-04-02', desc: 'Fee Collection - Batch A', ref: 'RCP-882', dr: 0, cr: 125000, bal: 575000 },
              { date: '2026-04-03', desc: 'Staff Salary Payment', ref: 'PAY-102', dr: 85000, cr: 0, bal: 490000 },
              { date: '2026-04-04', desc: 'Electricity Bill', ref: 'EXP-441', dr: 12000, cr: 0, bal: 478000 },
              { date: '2026-04-05', desc: 'Library Fine Collection', ref: 'RCP-883', dr: 0, cr: 2500, bal: 480500 },
            ].map((entry, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(entry.date)}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{entry.desc}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{entry.ref}</td>
                <td className="px-6 py-4 text-sm font-bold text-rose-600 text-right">{entry.dr > 0 ? `₹${entry.dr}` : '-'}</td>
                <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">{entry.cr > 0 ? `₹${entry.cr}` : '-'}</td>
                <td className="px-6 py-4 text-sm font-black text-slate-800 text-right">₹{entry.bal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPassingReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Overall Pass Percentage</h3>
          <div className="flex items-end gap-4">
            <p className="text-4xl font-black text-emerald-600">94.2%</p>
            <span className="text-emerald-500 text-sm font-bold mb-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +2.1%
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Toppers Count (90%+)</h3>
          <div className="flex items-end gap-4">
            <p className="text-4xl font-black text-indigo-600">42</p>
            <span className="text-indigo-500 text-sm font-bold mb-1 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Students
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Failures Count</h3>
          <div className="flex items-end gap-4">
            <p className="text-4xl font-black text-rose-600">12</p>
            <span className="text-rose-500 text-sm font-bold mb-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Requires Attention
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-800">Batch-wise Passing Analysis</h3>
        </div>
        <div className="p-6">
          <div className="space-y-8">
            {[
              { batch: 'B.Tech CS 2024', total: 120, passed: 115, distinction: 45, firstClass: 50, secondClass: 20 },
              { batch: 'B.Tech IT 2024', total: 110, passed: 102, distinction: 38, firstClass: 42, secondClass: 22 },
              { batch: 'B.Tech EC 2024', total: 115, passed: 108, distinction: 35, firstClass: 48, secondClass: 25 },
            ].map((batch) => (
              <div key={batch.batch} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-lg">{batch.batch}</p>
                    <p className="text-sm text-slate-500">{batch.total} Students Appeared</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-600 text-xl">{((batch.passed / batch.total) * 100).toFixed(1)}% Pass</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Distinction</p>
                    <p className="text-lg font-black text-indigo-600">{batch.distinction}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">First Class</p>
                    <p className="text-lg font-black text-emerald-600">{batch.firstClass}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Second Class</p>
                    <p className="text-lg font-black text-amber-600">{batch.secondClass}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFineReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Total Fines', value: '₹45,200', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { title: 'Collected', value: '₹32,800', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Pending', value: '₹12,400', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Library Fines', value: '₹8,500', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Rahul Sharma', reason: 'Late Library Return', amount: 250, date: '2026-04-01', status: 'PAID' },
              { name: 'Priya Patel', reason: 'Damage to Equipment', amount: 1500, date: '2026-04-02', status: 'PENDING' },
              { name: 'Amit Kumar', reason: 'Attendance Shortage', amount: 500, date: '2026-04-03', status: 'PAID' },
            ].map((fine, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">{fine.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{fine.reason}</td>
                <td className="px-6 py-4 text-sm font-black text-rose-600">₹{fine.amount}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(fine.date)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    fine.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {fine.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderIncomeExpense = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Income Sources
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Tuition Fees', amount: 850000, color: 'bg-emerald-500' },
              { label: 'Exam Fees', amount: 120000, color: 'bg-indigo-500' },
              { label: 'Library Fines', amount: 15000, color: 'bg-amber-500' },
              { label: 'Hostel Fees', amount: 260000, color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-bold">{item.label}</span>
                  <span className="text-slate-900 font-black">₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: `${(item.amount / 1245000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-rose-500" />
            Expense Categories
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Staff Salaries', amount: 280000, color: 'bg-rose-500' },
              { label: 'Maintenance', amount: 45000, color: 'bg-amber-500' },
              { label: 'Electricity & Water', amount: 32000, color: 'bg-indigo-500' },
              { label: 'Library Books', amount: 55000, color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-bold">{item.label}</span>
                  <span className="text-slate-900 font-black">₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: `${(item.amount / 412000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentLedger = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-3xl font-black">
          RS
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900">Rahul Sharma</h2>
          <p className="text-slate-500 font-bold">Roll No: CS202401 • B.Tech Computer Science</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active Student</span>
            <span className="text-xs font-bold text-slate-500">Batch: 2024-28</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Fees</p>
          <p className="text-2xl font-black text-slate-900">₹1,80,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Paid</p>
          <p className="text-2xl font-black text-emerald-600">₹1,65,000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Outstanding</p>
          <p className="text-2xl font-black text-rose-600">₹15,000</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-800">Transaction History</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
            <Download className="w-4 h-4" />
            Download Statement
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { date: '2024-08-15', desc: 'Admission Fee', type: 'DEBIT', amount: 45000, bal: 45000 },
              { date: '2024-08-16', desc: 'Fee Payment - RCP-001', type: 'CREDIT', amount: 45000, bal: 0 },
              { date: '2025-01-10', desc: 'Semester 2 Tuition Fee', type: 'DEBIT', amount: 45000, bal: 45000 },
              { date: '2025-01-15', desc: 'Fee Payment - RCP-102', type: 'CREDIT', amount: 30000, bal: 15000 },
            ].map((entry, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(entry.date)}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{entry.desc}</td>
                <td className="px-6 py-4 text-xs font-bold">
                  <span className={cn(
                    "px-2 py-1 rounded-full",
                    entry.type === 'DEBIT' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {entry.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-black text-right">₹{entry.amount}</td>
                <td className="px-6 py-4 text-sm font-black text-slate-800 text-right">₹{entry.bal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeReport) {
      case 'PROFIT_LOSS': return renderProfitLoss();
      case 'DUES_FEES': return renderDuesFees();
      case 'EXAMINATION': return renderExamination();
      case 'LEDGER': return renderLedger();
      case 'PASSING_REPORT': return renderPassingReport();
      case 'INCOME_EXPENSE': return renderIncomeExpense();
      case 'STUDENT_LEDGER': return renderStudentLedger();
      case 'FINE': return renderFineReport();
      default: return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REPORT_CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setActiveReport(category.id)}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", category.color.replace('text-', 'bg-').replace('600', '50'))}>
                <category.icon className={cn("w-7 h-7", category.color)} />
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-2">{category.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{category.description}</p>
              <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Generate Report
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {activeReport && (
            <button 
              onClick={() => setActiveReport(null)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {activeReport ? REPORT_CATEGORIES.find(c => c.id === activeReport)?.title : 'Reports & Analytics'}
            </h1>
            <p className="text-slate-500">
              {activeReport ? REPORT_CATEGORIES.find(c => c.id === activeReport)?.description : 'Access comprehensive institutional reports and financial summaries.'}
            </p>
          </div>
        </div>
        {!activeReport && (
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
              <History className="w-4 h-4" />
              Recent Reports
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              <PieChart className="w-4 h-4" />
              Custom Analytics
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeReport || 'dashboard'}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
