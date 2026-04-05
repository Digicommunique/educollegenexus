import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion } from 'motion/react';
import { exportToPDF, exportToExcel } from '../../lib/exportUtils';

const STUDENTS = [
  { id: 'S001', name: 'Rahul Sharma', roll: 'CS202601', attendance: 92, status: 'PRESENT' },
  { id: 'S002', name: 'Priya Patel', roll: 'CS202602', attendance: 85, status: 'PRESENT' },
  { id: 'S003', name: 'Amit Kumar', roll: 'CS202603', attendance: 78, status: 'ABSENT' },
  { id: 'S004', name: 'Siddharth Singh', roll: 'CS202604', attendance: 95, status: 'PRESENT' },
  { id: 'S005', name: 'Anjali Verma', roll: 'CS202605', attendance: 65, status: 'ABSENT' },
  { id: 'S006', name: 'Vikram Malhotra', roll: 'CS202606', attendance: 88, status: 'LATE' },
  { id: 'S007', name: 'Meera Iyer', roll: 'CS202607', attendance: 91, status: 'PRESENT' },
  { id: 'S008', name: 'Sanjay Gupta', roll: 'CS202608', attendance: 82, status: 'PRESENT' },
];

export const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState(STUDENTS);

  const toggleStatus = (id: string, status: string) => {
    setAttendanceData(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleExportPDF = () => {
    const headers = ['ID', 'Name', 'Roll No', 'Attendance %', 'Status'];
    const data = attendanceData.map(s => [s.id, s.name, s.roll, `${s.attendance}%`, s.status]);
    exportToPDF('Attendance Report', headers, data, `Attendance_${selectedDate}`);
  };

  const handleExportExcel = () => {
    exportToExcel(attendanceData, `Attendance_${selectedDate}`);
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
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <CheckCircle2 className="w-4 h-4" />
            Submit Attendance
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
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
        <div className="md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Course</label>
          <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>B.Tech CS - Sem 4</option>
            <option>B.Tech IT - Sem 4</option>
            <option>B.Tech ME - Sem 4</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Subject</label>
          <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option>Data Structures</option>
            <option>Algorithms</option>
            <option>Database Systems</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Search Student</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Name or Roll No..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
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
            <p className="text-2xl font-bold text-slate-900">{attendanceData.filter(s => s.status === 'PRESENT').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Absent</p>
            <p className="text-2xl font-bold text-slate-900">{attendanceData.filter(s => s.status === 'ABSENT').length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Late</p>
            <p className="text-2xl font-bold text-slate-900">{attendanceData.filter(s => s.status === 'LATE').length}</p>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll Number</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceData.map((student, i) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">{student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{student.roll}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            student.attendance > 85 ? "bg-green-500" : student.attendance > 75 ? "bg-amber-500" : "bg-red-500"
                          )}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => toggleStatus(student.id, 'PRESENT')}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          student.status === 'PRESENT' ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-slate-100 text-slate-400 hover:bg-green-50 hover:text-green-600"
                        )}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(student.id, 'ABSENT')}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          student.status === 'ABSENT' ? "bg-red-600 text-white shadow-lg shadow-red-100" : "bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        )}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => toggleStatus(student.id, 'LATE')}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                          student.status === 'LATE' ? "bg-amber-500 text-white shadow-lg shadow-amber-100" : "bg-slate-100 text-slate-400 hover:bg-amber-50 hover:text-amber-500"
                        )}
                      >
                        <Clock className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing 1 to 8 of 45 students</p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
