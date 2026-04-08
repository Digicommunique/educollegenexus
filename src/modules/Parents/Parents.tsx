import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Shield,
  User,
  Heart,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  BookOpen,
  Calendar,
  Award,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';

interface Parent {
  id: string;
  studentName: string;
  studentRoll: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  phone: string;
  email: string;
  address: string;
}

interface ChildProgress {
  attendance: number;
  lastExamScore: string;
  pendingFees: number;
  upcomingExams: any[];
  recentGrades: any[];
}

export const Parents: React.FC = () => {
  const { user } = useAuth();
  const [parents, setParents] = useState<Parent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [childProgress, setChildProgress] = useState<ChildProgress | null>(null);

  const isParent = user?.role === 'PARENT';

  useEffect(() => {
    if (isParent) {
      fetchChildProgress();
    } else {
      fetchParents();
    }
  }, [user]);

  const fetchChildProgress = async () => {
    setIsLoading(true);
    try {
      // Mocking child progress for now as we don't have a direct link between parent user and student record yet
      // In a real app, we'd fetch based on parent_id or linked student_id
      setChildProgress({
        attendance: 88,
        lastExamScore: 'A (92%)',
        pendingFees: 5000,
        upcomingExams: [
          { title: 'Mathematics Mid-term', date: '2024-05-15', time: '10:00 AM' },
          { title: 'Physics Practical', date: '2024-05-18', time: '02:00 PM' }
        ],
        recentGrades: [
          { subject: 'English', grade: 'A', score: 95 },
          { subject: 'Computer Science', grade: 'A+', score: 98 },
          { subject: 'Chemistry', grade: 'B+', score: 82 }
        ]
      });
    } catch (error) {
      console.error('Error fetching child progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParents = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('students')
      .select('id, name, roll_no, father_name, father_occupation, mother_name, mother_occupation, parent_phone, parent_email, address')
      .order('name');

    if (error) {
      console.error('Error fetching parents:', error);
    } else if (data) {
      setParents(data.map(s => ({
        id: s.id,
        studentName: s.name,
        studentRoll: s.roll_no,
        fatherName: s.father_name || 'N/A',
        fatherOccupation: s.father_occupation || 'N/A',
        motherName: s.mother_name || 'N/A',
        motherOccupation: s.mother_occupation || 'N/A',
        phone: s.parent_phone || 'N/A',
        email: s.parent_email || 'N/A',
        address: s.address || 'N/A'
      })));
    }
    setIsLoading(false);
  };

  const filteredParents = parents.filter(p => 
    p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  if (isParent) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Child Progress</h1>
            <p className="text-slate-500 text-sm font-medium">Monitor your child's academic performance and activities.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.hash = '#/fees'}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              <CreditCard className="w-5 h-5" />
              Make Payment
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : childProgress ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Overview */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-primary/10 shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                  <p className="text-2xl font-black text-slate-800">{childProgress.attendance}%</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-primary/10 shadow-sm">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                    <Award className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Last Exam</p>
                  <p className="text-2xl font-black text-slate-800">{childProgress.lastExamScore}</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-primary/10 shadow-sm">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-4">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pending Fees</p>
                  <p className="text-2xl font-black text-slate-800">{formatCurrency(childProgress.pendingFees)}</p>
                </div>
              </div>

              {/* Recent Grades */}
              <div className="bg-white p-8 rounded-[32px] border border-primary/10 shadow-sm">
                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Recent Grades
                </h3>
                <div className="space-y-4">
                  {childProgress.recentGrades.map((grade, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary font-bold shadow-sm">
                          {grade.subject.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{grade.subject}</p>
                          <p className="text-xs text-slate-500">Score: {grade.score}/100</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-black">
                          {grade.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              {/* Upcoming Exams */}
              <div className="bg-white p-8 rounded-[32px] border border-primary/10 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Exams
                </h3>
                <div className="space-y-4">
                  {childProgress.upcomingExams.map((exam, i) => (
                    <div key={i} className="p-4 border border-slate-100 rounded-2xl space-y-2">
                      <p className="font-bold text-slate-800 text-sm">{exam.title}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {exam.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {exam.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-primary p-8 rounded-[32px] text-white shadow-xl shadow-primary/20">
                <h3 className="text-lg font-black mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.hash = '#/attendance'}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-between px-4"
                  >
                    View Attendance <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.location.hash = '#/exams'}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-between px-4"
                  >
                    Exam Schedule <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => window.location.hash = '#/results'}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all flex items-center justify-between px-4"
                  >
                    Full Report Card <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">No child progress data found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Parent Directory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage parent information and communication.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <MessageSquare className="w-5 h-5" />
            Broadcast Message
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by student or parent name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-background text-slate-600 rounded-2xl text-sm font-bold hover:bg-primary/5 transition-all">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParents.map((parent, index) => (
            <motion.div
              key={parent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[32px] border border-primary/10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden group"
            >
              <div className="p-6 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 line-clamp-1">{parent.studentName}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{parent.studentRoll}</p>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <User className="w-3 h-3" /> Father
                    </p>
                    <p className="text-sm font-bold text-slate-800">{parent.fatherName}</p>
                    <p className="text-[10px] text-slate-500">{parent.fatherOccupation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Heart className="w-3 h-3" /> Mother
                    </p>
                    <p className="text-sm font-bold text-slate-800">{parent.motherName}</p>
                    <p className="text-[10px] text-slate-500">{parent.motherOccupation}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    {parent.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{parent.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="truncate">{parent.address}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-3 bg-primary/5 text-primary rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    Contact Parent
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

