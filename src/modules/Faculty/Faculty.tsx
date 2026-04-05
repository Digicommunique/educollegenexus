import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  Upload,
  CheckCircle2,
  ChevronLeft,
  Camera,
  FileText,
  ShieldAlert,
  Heart,
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface FacultyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  designation: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

const MOCK_FACULTY: FacultyMember[] = [
  { id: 'FAC2024001', name: 'Dr. Rajesh Khanna', email: 'rajesh.k@example.com', phone: '+91 98765 43230', branch: 'Computer Science', designation: 'Professor', status: 'Active' },
  { id: 'FAC2024002', name: 'Prof. Sunita Williams', email: 'sunita.w@example.com', phone: '+91 98765 43231', branch: 'Information Technology', designation: 'Assistant Professor', status: 'Active' },
  { id: 'FAC2023045', name: 'Dr. Vikram Sarabhai', email: 'vikram.s@example.com', phone: '+91 98765 43232', branch: 'Mechanical Engineering', designation: 'Head of Department', status: 'On Leave' },
];

export const Faculty: React.FC = () => {
  const [view, setView] = useState<'list' | 'register'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Registration Form State
  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: '',
    middleName: '',
    surname: '',
    branch: '',
    batch: '', // Requested by user
    year: '',  // Requested by user
    phone: '',
    email: '',
    address: '',
    bloodGroup: '',
    religion: '',
    caste: '',
    category: '',
    state: '',
    pincode: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    parentPhone: '',
    parentEmail: '',
    emergencyName: '',
    emergencyAddress: '',
    emergencyPhone: '',
    allergy: '',
  });

  const [generatedId, setGeneratedId] = useState('');

  useEffect(() => {
    if (view === 'register') {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      setGeneratedId(`FAC${year}${random}`);
    }
  }, [view]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setView('list');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Faculty & Staff Management</h1>
          <p className="text-slate-500">Manage staff records and new faculty registrations.</p>
        </div>
        <div className="flex items-center gap-3">
          {view === 'list' ? (
            <button 
              onClick={() => setView('register')}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <UserPlus className="w-5 h-5" />
              Add Staff Member
            </button>
          ) : (
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-primary/10 text-slate-600 rounded-xl font-bold hover:bg-background transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to List
            </button>
          )}
        </div>
      </div>

      {view === 'list' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-primary/10 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search staff by name, ID or department..." 
                className="w-full pl-12 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-3 bg-background text-slate-600 rounded-xl text-sm font-bold hover:bg-primary/5 transition-all">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-background text-slate-600 rounded-xl text-sm font-bold hover:bg-primary/5 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Faculty Table */}
          <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary/5 border-b border-primary/10">
                    <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Staff Member</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Staff ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Branch & Designation</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_FACULTY.map((staff) => (
                    <tr key={staff.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary">{staff.name}</p>
                            <p className="text-xs text-slate-500">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                          {staff.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{staff.branch}</p>
                          <p className="text-xs text-slate-500">{staff.designation}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3" />
                            {staff.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          staff.status === 'Active' ? "bg-green-100 text-green-700" : 
                          staff.status === 'On Leave' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                        )}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-slate-400 hover:text-primary">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-primary/10 shadow-xl overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
            {/* Section: Personal Information */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Staff Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                  <select 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Mrs.</option>
                    <option>Dr.</option>
                    <option>Prof.</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Middle Name</label>
                  <input 
                    type="text" 
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="Enter middle name"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surname</label>
                  <input 
                    type="text" 
                    name="surname"
                    required
                    value={formData.surname}
                    onChange={handleInputChange}
                    placeholder="Enter surname"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff ID (Auto)</label>
                  <input 
                    type="text" 
                    readOnly
                    value={generatedId}
                    className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm font-mono font-bold text-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Branch / Dept</label>
                  <select 
                    name="branch"
                    required
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Branch</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>Mechanical Engineering</option>
                    <option>Administration</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batch (Optional)</label>
                  <input 
                    type="text" 
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="Enter batch if applicable"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year of Joining</label>
                  <input 
                    type="text" 
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="staff@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Group</label>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Religion</label>
                  <input 
                    type="text" 
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    placeholder="Enter religion"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Caste</label>
                  <input 
                    type="text" 
                    name="caste"
                    value={formData.caste}
                    onChange={handleInputChange}
                    placeholder="Enter caste"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    <option value="">Select Category</option>
                    <option>General</option>
                    <option>OBC</option>
                    <option>SC</option>
                    <option>ST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Residential Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                    <textarea 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State</label>
                    <select 
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="">Select State</option>
                      <option>Maharashtra</option>
                      <option>Delhi</option>
                      <option>Karnataka</option>
                      <option>Gujarat</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pincode</label>
                    <input 
                      type="text" 
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="XXXXXX"
                      className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Staff Photo</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-background border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group">
                    <Camera className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold">Upload Photo</span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-primary">Requirements:</p>
                    <p>• Official passport size photo</p>
                    <p>• JPG, PNG format only</p>
                    <p>• Max size: 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Family Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Family Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Father's Information
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Father's Name</label>
                      <input 
                        type="text" 
                        name="fatherName"
                        required
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        placeholder="Enter father's name"
                        className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupation</label>
                      <input 
                        type="text" 
                        name="fatherOccupation"
                        value={formData.fatherOccupation}
                        onChange={handleInputChange}
                        placeholder="Enter occupation"
                        className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    Mother's Information
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mother's Name</label>
                      <input 
                        type="text" 
                        name="motherName"
                        required
                        value={formData.motherName}
                        onChange={handleInputChange}
                        placeholder="Enter mother's name"
                        className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupation</label>
                      <input 
                        type="text" 
                        name="motherOccupation"
                        value={formData.motherOccupation}
                        onChange={handleInputChange}
                        placeholder="Enter occupation"
                        className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent's Contact Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      name="parentPhone"
                      required
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent's Email ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      placeholder="parent@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Emergency Contact */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Emergency Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Name</label>
                  <input 
                    type="text" 
                    name="emergencyName"
                    required
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    placeholder="Enter contact name"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Phone</label>
                  <input 
                    type="tel" 
                    name="emergencyPhone"
                    required
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Any Allergies / Medical Conditions</label>
                  <input 
                    type="text" 
                    name="allergy"
                    value={formData.allergy}
                    onChange={handleInputChange}
                    placeholder="e.g. Peanuts, Asthma"
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Address</label>
                <input 
                  type="text" 
                  name="emergencyAddress"
                  value={formData.emergencyAddress}
                  onChange={handleInputChange}
                  placeholder="Enter emergency address"
                  className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* Section: Document Uploads */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-primary/10">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">Document Uploads</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Documents</label>
                  <div className="h-32 bg-background border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group">
                    <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold">Upload (PDF/JPG)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">ID Proofs, Experience Certs</p>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent/Nominee Documents</label>
                  <div className="h-32 bg-background border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group">
                    <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold">Upload (PDF/JPG)</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Nominee ID Proofs</p>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Signature</label>
                  <div className="h-32 bg-background border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group">
                    <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold">Upload Signature</span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Clear image of signature</p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-12 border-t border-primary/10 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={() => setView('list')}
                className="px-8 py-4 text-slate-500 font-bold hover:text-primary transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "px-12 py-4 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-3",
                  isSubmitting && "opacity-80 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Complete Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Staff Registered Successfully!</p>
              <p className="text-xs text-white/80">Faculty record has been created.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
