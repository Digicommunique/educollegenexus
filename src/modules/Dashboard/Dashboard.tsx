import React from 'react';
import { 
  Users, 
  GraduationCap, 
  School, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  BookOpen,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { cn, formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';

const STATS_CARDS = [
  { title: 'Total Students', value: '12,450', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'up' },
  { title: 'Total Faculty', value: '450', change: '+5%', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'up' },
  { title: 'Fees Collected', value: '₹4.2Cr', change: '+18%', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50', trend: 'up' },
  { title: 'Pending Fees', value: '₹1.2Cr', change: '-8%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', trend: 'down' },
];

const ENROLLMENT_DATA = [
  { name: 'Jan', students: 400 },
  { name: 'Feb', students: 300 },
  { name: 'Mar', students: 600 },
  { name: 'Apr', students: 800 },
  { name: 'May', students: 500 },
  { name: 'Jun', students: 900 },
];

const FEE_COLLECTION_DATA = [
  { name: 'Tuition', value: 65 },
  { name: 'Exam', value: 15 },
  { name: 'Library', value: 10 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}!</h1>
          <p className="text-slate-500">Here's what's happening at your college today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Oct 12, 2026</span>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS_CARDS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
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
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-primary/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-primary">Enrollment Trends</h3>
            <select className="text-xs font-medium bg-background border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENROLLMENT_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#065F46" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Fee Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FEE_COLLECTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {FEE_COLLECTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {FEE_COLLECTION_DATA.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-sm text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {[
              { user: 'Dr. John Doe', action: 'uploaded new study material for', target: 'Physics 101', time: '2 hours ago', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
              { user: 'Jane Smith', action: 'submitted assignment for', target: 'Mathematics', time: '4 hours ago', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { user: 'Admin', action: 'published exam results for', target: 'Semester 2', time: 'Yesterday', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { user: 'System', action: 'generated fee reminders for', target: '350 students', time: '2 days ago', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={cn("w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center", activity.bg)}>
                  <activity.icon className={cn("w-5 h-5", activity.color)} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">
                    <span className="font-bold text-slate-800">{activity.user}</span> {activity.action} <span className="font-bold text-slate-800">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Upcoming Exams</h3>
            <button className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Mid-Term Physics', date: 'Oct 15, 2026', time: '10:00 AM', status: 'Upcoming' },
              { title: 'Advanced Calculus', date: 'Oct 18, 2026', time: '02:00 PM', status: 'Upcoming' },
              { title: 'Organic Chemistry', date: 'Oct 22, 2026', time: '09:00 AM', status: 'Upcoming' },
              { title: 'English Literature', date: 'Oct 25, 2026', time: '11:30 AM', status: 'Upcoming' },
            ].map((exam, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-slate-200 group-hover:border-indigo-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{exam.date.split(' ')[0]}</span>
                    <span className="text-sm font-bold text-slate-800">{exam.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{exam.title}</h4>
                    <p className="text-xs text-slate-500">{exam.time}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {exam.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
