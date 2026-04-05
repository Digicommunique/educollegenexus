import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Save,
  Sparkles,
  Download,
  Printer,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { cn, formatDate } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';

interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  duration: string;
  semesters: number;
  description: string;
  credits: number;
}

interface TimeTableSlot {
  id: string;
  courseId: string;
  subject: string;
  faculty: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM'
];

export const Courses: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'courses' | 'timetable'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<TimeTableSlot[]>([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingSlot, setEditingSlot] = useState<TimeTableSlot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Form states
  const [courseForm, setCourseForm] = useState<Partial<Course>>({});
  const [slotForm, setSlotForm] = useState<Partial<TimeTableSlot>>({});

  useEffect(() => {
    const savedCourses = localStorage.getItem('edunexus_courses');
    const savedTimetable = localStorage.getItem('edunexus_timetable');
    
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    else {
      const initialCourses = [
        { id: '1', name: 'Computer Science & Engineering', code: 'CSE', department: 'Engineering', duration: '4 Years', semesters: 8, credits: 160, description: 'Core computer science principles and applications.' },
        { id: '2', name: 'Information Technology', code: 'IT', department: 'Engineering', duration: '4 Years', semesters: 8, credits: 158, description: 'Focus on information systems and network technologies.' },
        { id: '3', name: 'Electronics & Communication', code: 'ECE', department: 'Engineering', duration: '4 Years', semesters: 8, credits: 162, description: 'Study of electronic circuits and communication systems.' }
      ];
      setCourses(initialCourses);
      localStorage.setItem('edunexus_courses', JSON.stringify(initialCourses));
    }

    if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
  }, []);

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem('edunexus_courses', JSON.stringify(newCourses));
  };

  const saveTimetable = (newTimetable: TimeTableSlot[]) => {
    setTimetable(newTimetable);
    localStorage.setItem('edunexus_timetable', JSON.stringify(newTimetable));
  };

  const handleAddCourse = () => {
    const newCourse: Course = {
      id: editingCourse?.id || Math.random().toString(36).substr(2, 9),
      name: courseForm.name || '',
      code: courseForm.code || '',
      department: courseForm.department || '',
      duration: courseForm.duration || '',
      semesters: Number(courseForm.semesters) || 0,
      credits: Number(courseForm.credits) || 0,
      description: courseForm.description || ''
    };

    if (editingCourse) {
      saveCourses(courses.map(c => c.id === editingCourse.id ? newCourse : c));
    } else {
      saveCourses([...courses, newCourse]);
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
    setCourseForm({});
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      saveCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleAddSlot = () => {
    const newSlot: TimeTableSlot = {
      id: editingSlot?.id || Math.random().toString(36).substr(2, 9),
      courseId: slotForm.courseId || '',
      subject: slotForm.subject || '',
      faculty: slotForm.faculty || '',
      room: slotForm.room || '',
      day: slotForm.day || '',
      startTime: slotForm.startTime || '',
      endTime: slotForm.endTime || ''
    };

    if (editingSlot) {
      saveTimetable(timetable.map(s => s.id === editingSlot.id ? newSlot : s));
    } else {
      saveTimetable([...timetable, newSlot]);
    }
    setIsTimetableModalOpen(false);
    setEditingSlot(null);
    setSlotForm({});
  };

  const handleDeleteSlot = (id: string) => {
    saveTimetable(timetable.filter(s => s.id !== id));
  };

  const generateAITimetable = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      const subjects = ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Software Engineering'];
      const faculties = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Prof. Brown', 'Dr. Jones'];
      const rooms = ['Room 101', 'Room 102', 'Lab 1', 'Lab 2', 'Seminar Hall'];
      
      const newSlots: TimeTableSlot[] = [];
      
      courses.forEach(course => {
        DAYS.forEach(day => {
          // Add 3-4 random slots per day for each course
          const numSlots = Math.floor(Math.random() * 2) + 3;
          const usedTimes = new Set();
          
          for (let i = 0; i < numSlots; i++) {
            let timeIdx;
            do {
              timeIdx = Math.floor(Math.random() * TIME_SLOTS.length);
            } while (usedTimes.has(timeIdx));
            
            usedTimes.add(timeIdx);
            const timeRange = TIME_SLOTS[timeIdx].split(' - ');
            
            newSlots.push({
              id: Math.random().toString(36).substr(2, 9),
              courseId: course.id,
              subject: subjects[Math.floor(Math.random() * subjects.length)],
              faculty: faculties[Math.floor(Math.random() * faculties.length)],
              room: rooms[Math.floor(Math.random() * rooms.length)],
              day,
              startTime: timeRange[0],
              endTime: timeRange[1]
            });
          }
        });
      });
      
      saveTimetable(newSlots);
      setIsGeneratingAI(false);
    }, 2000);
  };

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">Course Management</h1>
          <p className="text-slate-500">Manage academic courses and plan time tables.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'courses' ? (
            <button 
              onClick={() => {
                setEditingCourse(null);
                setCourseForm({});
                setIsCourseModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              Add New Course
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={generateAITimetable}
                disabled={isGeneratingAI}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {isGeneratingAI ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                AI Planner
              </button>
              <button 
                onClick={() => {
                  setEditingSlot(null);
                  setSlotForm({});
                  setIsTimetableModalOpen(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Plus className="w-5 h-5" />
                Add Slot
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-primary/5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('courses')}
          className={cn(
            "px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'courses' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Courses
        </button>
        <button 
          onClick={() => setActiveTab('timetable')}
          className={cn(
            "px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'timetable' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
          )}
        >
          <Calendar className="w-4 h-4" />
          Time Table
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'courses' ? (
          <motion.div 
            key="courses"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search courses by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-background text-slate-600 rounded-xl text-sm font-bold hover:bg-primary/5 hover:text-primary transition-all">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-background text-slate-600 rounded-xl text-sm font-bold hover:bg-primary/5 hover:text-primary transition-all">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => {
                          setEditingCourse(course);
                          setCourseForm(course);
                          setIsCourseModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">
                      {course.code}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 mt-2 line-clamp-1">{course.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">{course.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                      <p className="text-sm font-bold text-slate-700">{course.duration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Credits</p>
                      <p className="text-sm font-bold text-slate-700">{course.credits} Points</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="timetable"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Time Table View */}
            <div className="bg-white rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10 w-48">Time Slot</th>
                      {DAYS.map(day => (
                        <th key={day} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {TIME_SLOTS.map(slot => (
                      <tr key={slot} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-8 text-sm font-bold text-slate-500 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-50">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {slot}
                          </div>
                        </td>
                        {DAYS.map(day => {
                          const startTime = slot.split(' - ')[0];
                          const daySlots = timetable.filter(s => s.day === day && s.startTime === startTime);
                          
                          return (
                            <td key={day} className="px-4 py-4 min-w-[200px]">
                              {daySlots.length > 0 ? (
                                <div className="space-y-2">
                                  {daySlots.map(s => (
                                    <div 
                                      key={s.id}
                                      className="p-3 bg-primary/5 border border-primary/10 rounded-2xl relative group/slot"
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-black text-primary uppercase tracking-tight">{s.subject}</p>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/slot:opacity-100 transition-opacity">
                                          <button 
                                            onClick={() => {
                                              setEditingSlot(s);
                                              setSlotForm(s);
                                              setIsTimetableModalOpen(true);
                                            }}
                                            className="p-1 text-slate-400 hover:text-primary"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button 
                                            onClick={() => handleDeleteSlot(s.id)}
                                            className="p-1 text-slate-400 hover:text-rose-600"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                                        <User className="w-3 h-3" />
                                        {s.faculty}
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-1">
                                        <MapPin className="w-3 h-3" />
                                        {s.room}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-full min-h-[60px] flex items-center justify-center border-2 border-dashed border-slate-50 rounded-2xl text-slate-300 group-hover:border-slate-100 transition-colors">
                                  <Plus className="w-4 h-4" />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
              <div>
                <h2 className="text-2xl font-black text-primary">{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                <p className="text-slate-500 text-sm">Enter course details below.</p>
              </div>
              <button 
                onClick={() => setIsCourseModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Name</label>
                  <input 
                    type="text" 
                    value={courseForm.name || ''}
                    onChange={(e) => setCourseForm({...courseForm, name: e.target.value})}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Code</label>
                  <input 
                    type="text" 
                    value={courseForm.code || ''}
                    onChange={(e) => setCourseForm({...courseForm, code: e.target.value})}
                    placeholder="e.g. CSE"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                  <select 
                    value={courseForm.department || ''}
                    onChange={(e) => setCourseForm({...courseForm, department: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Commerce">Commerce</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                  <input 
                    type="text" 
                    value={courseForm.duration || ''}
                    onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                    placeholder="e.g. 4 Years"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semesters</label>
                  <input 
                    type="number" 
                    value={courseForm.semesters || ''}
                    onChange={(e) => setCourseForm({...courseForm, semesters: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</label>
                  <input 
                    type="number" 
                    value={courseForm.credits || ''}
                    onChange={(e) => setCourseForm({...courseForm, credits: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3}
                  value={courseForm.description || ''}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsCourseModalOpen(false)}
                className="px-6 py-3 text-slate-500 font-bold hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCourse}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Save className="w-5 h-5" />
                {editingCourse ? 'Update Course' : 'Save Course'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Timetable Modal */}
      {isTimetableModalOpen && (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-primary/5">
              <div>
                <h2 className="text-2xl font-black text-primary">{editingSlot ? 'Edit Slot' : 'Add Time Table Slot'}</h2>
                <p className="text-slate-500 text-sm">Schedule a new class session.</p>
              </div>
              <button 
                onClick={() => setIsTimetableModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course</label>
                  <select 
                    value={slotForm.courseId || ''}
                    onChange={(e) => setSlotForm({...slotForm, courseId: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</label>
                  <input 
                    type="text" 
                    value={slotForm.subject || ''}
                    onChange={(e) => setSlotForm({...slotForm, subject: e.target.value})}
                    placeholder="e.g. Data Structures"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty</label>
                  <input 
                    type="text" 
                    value={slotForm.faculty || ''}
                    onChange={(e) => setSlotForm({...slotForm, faculty: e.target.value})}
                    placeholder="e.g. Dr. Smith"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room / Lab</label>
                  <input 
                    type="text" 
                    value={slotForm.room || ''}
                    onChange={(e) => setSlotForm({...slotForm, room: e.target.value})}
                    placeholder="e.g. Room 101"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Day</label>
                  <select 
                    value={slotForm.day || ''}
                    onChange={(e) => setSlotForm({...slotForm, day: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Day</option>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                  <select 
                    value={slotForm.startTime || ''}
                    onChange={(e) => {
                      const selectedSlot = TIME_SLOTS.find(s => s.startsWith(e.target.value));
                      if (selectedSlot) {
                        const [start, end] = selectedSlot.split(' - ');
                        setSlotForm({...slotForm, startTime: start, endTime: end});
                      }
                    }}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Slot</option>
                    {TIME_SLOTS.map(s => <option key={s} value={s.split(' - ')[0]}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsTimetableModalOpen(false)}
                className="px-6 py-3 text-slate-500 font-bold hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSlot}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Save className="w-5 h-5" />
                {editingSlot ? 'Update Slot' : 'Save Slot'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
