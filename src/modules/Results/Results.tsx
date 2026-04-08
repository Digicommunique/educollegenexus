import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Users,
  BookOpen,
  Eye
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';

interface Result {
  id: string;
  studentName: string;
  studentRoll: string;
  examTitle: string;
  subject: string;
  marks: number;
  totalMarks: number;
  status: 'PASSED' | 'FAILED';
  date: string;
  course: string;
}

export const Results: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('All');
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch courses for filter
    const { data: coursesData } = await supabase.from('courses').select('*');
    if (coursesData) setCourses(coursesData);

    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        exams (
          title,
          subject,
          course
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching results:', error);
    } else if (data) {
      setResults(data.map(r => ({
        id: r.id,
        studentName: r.student_name,
        studentRoll: r.student_roll || 'N/A',
        examTitle: r.exams?.title || 'Unknown Exam',
        subject: r.exams?.subject || 'N/A',
        marks: r.marks,
        totalMarks: r.total_marks,
        status: r.status,
        date: new Date(r.created_at).toLocaleDateString(),
        course: r.exams?.course || 'N/A'
      })));
    }
    setIsLoading(false);
  };

  const filteredResults = results.filter(r => {
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'All' || r.course === courseFilter;
    
    return matchesSearch && matchesCourse;
  });

  const stats = [
    { title: 'Total Results', value: results.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pass Rate', value: `${Math.round((results.filter(r => r.status === 'PASSED').length / results.length || 0) * 100)}%`, icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Avg Score', value: `${Math.round(results.reduce((acc, r) => acc + (r.marks/r.totalMarks * 100), 0) / results.length || 0)}%`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const handleExportPDF = () => {
    const headers = ['Student', 'Exam', 'Subject', 'Score', 'Status', 'Date'];
    const data = filteredResults.map(r => [r.studentName, r.examTitle, r.subject, `${r.marks}/${r.totalMarks}`, r.status, r.date]);
    exportToPDF('Exam Results', headers, data, 'Exam_Results');
  };

  const handleExportExcel = () => {
    exportToExcel(filteredResults, 'Exam_Results');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Academic Results</h1>
          <p className="text-slate-500 text-sm font-medium">View and manage published examination results.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-[32px] border border-primary/10 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.title}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by student, exam or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-background border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-3 bg-background border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-3 bg-background text-slate-600 rounded-2xl text-sm font-bold hover:bg-primary/5 transition-all">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-primary/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-widest">Examination</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-widest">Subject</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-widest">Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-primary uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-bold text-slate-400">Loading results...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Award className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-slate-400">No results found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-xs shadow-sm">
                          {res.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{res.studentName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.studentRoll}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700">{res.examTitle}</p>
                      <p className="text-[10px] text-slate-500">{res.course}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{res.subject}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900">{res.marks}/{res.totalMarks}</span>
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              res.status === 'PASSED' ? "bg-emerald-500" : "bg-rose-500"
                            )}
                            style={{ width: `${(res.marks/res.totalMarks) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center w-fit gap-1.5",
                        res.status === 'PASSED' 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-rose-50 text-rose-600"
                      )}>
                        {res.status === 'PASSED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {res.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
