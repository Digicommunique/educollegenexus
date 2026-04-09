import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Calendar,
  FileText,
  Scan,
  Settings as SettingsIcon,
  History,
  QrCode,
  Camera,
  Globe,
  MapPin,
  MoreVertical,
  User
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';
import { AttendanceScanner } from './AttendanceScanner';
import { AttendanceSettings } from './AttendanceSettings';
import { supabase } from '../../lib/supabase';

interface AttendanceRecord {
  id: string;
  student_id: string;
  name: string;
  roll: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'INVALID_ENTRY';
  time?: string;
  ip?: string;
  location?: string;
  method?: string;
  course: string;
  year: string;
  branch: string;
  section: string;
  subject?: string;
}

export const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    course: 'All',
    year: 'All',
    branch: 'All',
    section: 'All',
    search: ''
  });
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('attendance_settings');
    return saved ? JSON.parse(saved) : {
      startTime: '09:00',
      lateThreshold: '09:15',
      absentThreshold: '09:45'
    };
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate, filters.course, filters.branch, filters.year, filters.section]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch students based on filters
      let studentQuery = supabase.from('students').select('*');
      if (filters.course !== 'All') studentQuery = studentQuery.eq('branch', filters.course); // Map branch to course for now or use course field if added
      if (filters.branch !== 'All') studentQuery = studentQuery.eq('branch', filters.branch);
      if (filters.year !== 'All') studentQuery = studentQuery.eq('year', filters.year);
      if (filters.section !== 'All') studentQuery = studentQuery.eq('section', filters.section);

      const { data: studentList, error: studentError } = await studentQuery;
      if (studentError) throw studentError;

      // Fetch attendance for the selected date
      const { data: attendanceList, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', selectedDate);
      if (attendanceError) throw attendanceError;

      const mergedData = (studentList || []).map(student => {
        const record = (attendanceList || []).find(a => a.student_id === student.id);
        return {
          id: record?.id || `temp-${student.id}`,
          student_id: student.id,
          name: student.name,
          roll: student.roll_no || 'N/A',
          status: (record?.status?.toUpperCase() || 'ABSENT') as 'PRESENT' | 'ABSENT' | 'LATE',
          time: record?.time,
          ip: record?.ip_address,
          location: record?.location,
          method: record?.method,
          course: student.branch || 'B.Tech',
          year: student.year || '1st Year',
          branch: student.branch || 'CS',
          section: student.section || 'A'
        };
      });

      setStudents(studentList || []);
      setAttendanceData(mergedData);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('attendance_settings', JSON.stringify(settings));
  }, [settings]);

  const handleStatusChange = async (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'INVALID_ENTRY') => {
    try {
      const existingRecord = attendanceData.find(a => a.student_id === studentId && !a.id.startsWith('temp-'));
      const student = students.find(s => s.id === studentId);

      const recordData = {
        student_id: studentId,
        date: selectedDate,
        status: status.charAt(0) + status.slice(1).toLowerCase(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        method: 'MANUAL',
        course: student?.branch,
        branch: student?.branch,
        year: student?.year,
        section: student?.section
      };

      if (existingRecord) {
        const { error } = await supabase
          .from('attendance')
          .update(recordData)
          .eq('id', existingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert([recordData]);
        if (error) throw error;
      }

      fetchData();
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleScanSuccess = async (record: any) => {
    try {
      const student = students.find(s => s.id === record.studentId || s.name === record.studentName);
      if (!student) return;

      const recordData = {
        student_id: student.id,
        date: selectedDate,
        status: record.status.charAt(0) + record.status.slice(1).toLowerCase(),
        time: record.time,
        method: record.method,
        ip_address: record.ip,
        location: record.location,
        course: student.branch,
        branch: student.branch,
        year: student.year,
        section: student.section
      };

      const { error } = await supabase
        .from('attendance')
        .upsert([recordData], { onConflict: 'student_id,date' }); // Note: Need unique constraint on student_id, date for upsert
      
      if (error) {
        // Fallback if no unique constraint
        const { data: existing } = await supabase
          .from('attendance')
          .select('id')
          .eq('student_id', student.id)
          .eq('date', selectedDate)
          .single();
        
        if (existing) {
          await supabase.from('attendance').update(recordData).eq('id', existing.id);
        } else {
          await supabase.from('attendance').insert([recordData]);
        }
      }

      fetchData();
    } catch (error) {
      console.error('Error saving scanned attendance:', error);
    }
  };

  const filteredData = attendanceData.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                         student.roll.toLowerCase().includes(filters.search.toLowerCase());
    return matchesSearch;
  });

  const handleExportPDF = () => {
    const headers = ['ID', 'Name', 'Roll No', 'Course', 'Year', 'Branch', 'Section', 'Status', 'Time', 'Method'];
    const data = filteredData.map(s => [s.id, s.name, s.roll, s.course, s.year, s.branch, s.section, s.status, s.time || '-', s.method || '-']);
    exportToPDF('Attendance Report', headers, data, `Attendance_${selectedDate}_${filters.course}_${filters.branch}`);
  };

  const handleExportExcel = () => {
    exportToExcel(filteredData, `Attendance_${selectedDate}_${filters.course}_${filters.branch}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Management</h1>
          <p className="text-slate-500">Mark daily or subject-wise attendance for your classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition-all shadow-sm",
                showSettings ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </button>
            <button 
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Scan className="w-4 h-4" />
              Scan Attendance
            </button>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AttendanceSettings 
              settings={settings} 
              onSave={(newSettings) => { setSettings(newSettings); setShowSettings(false); }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Select Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Course</label>
            <select 
              value={filters.course}
              onChange={(e) => setFilters({...filters, course: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Year</label>
            <select 
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">All Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Branch</label>
            <select 
              value={filters.branch}
              onChange={(e) => setFilters({...filters, branch: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">All Branches</option>
              <option value="CS">Computer Science</option>
              <option value="IT">Information Tech</option>
              <option value="ME">Mechanical</option>
              <option value="EE">Electrical</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Section</label>
            <select 
              value={filters.section}
              onChange={(e) => setFilters({...filters, section: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="All">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by Name or Roll Number..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Present</p>
            <p className="text-2xl font-bold text-slate-900">{filteredData.filter(s => s.status === 'PRESENT').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Absent</p>
            <p className="text-2xl font-bold text-slate-900">{filteredData.filter(s => s.status === 'ABSENT').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Late</p>
            <p className="text-2xl font-bold text-slate-900">{filteredData.filter(s => s.status === 'LATE').length}</p>
          </div>
        </div>
      </div>

      {/* Attendance Table & Detailed Report */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-800">Attendance Log & Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Auto-Refresh: ON</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time & Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Network & Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((student, i) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.roll} • {student.course} {student.branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          student.status === 'PRESENT' ? "bg-green-100 text-green-600 shadow-sm" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'LATE')}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          student.status === 'LATE' ? "bg-amber-100 text-amber-600 shadow-sm" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        Late
                      </button>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          student.status === 'ABSENT' ? "bg-red-100 text-red-600 shadow-sm" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        Absent
                      </button>
                      <button 
                        onClick={() => handleStatusChange(student.id, 'INVALID_ENTRY')}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          student.status === 'INVALID_ENTRY' ? "bg-rose-100 text-rose-600 shadow-sm" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                        )}
                      >
                        Invalid
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {student.time || '--:--'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                        {student.method === 'QR' ? <QrCode className="w-3 h-3" /> : student.method === 'FACE' ? <Camera className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {student.method || 'MANUAL'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Globe className="w-3 h-3 text-indigo-400" />
                        {student.ip || '0.0.0.0'}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span className="truncate max-w-[120px]">{student.location || 'Unknown'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showScanner && (
        <AttendanceScanner 
          settings={settings}
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}
    </div>
  );
};
