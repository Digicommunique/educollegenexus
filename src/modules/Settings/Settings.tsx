import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Image as ImageIcon, 
  PenTool, 
  MapPin, 
  Shield, 
  Save, 
  CheckCircle2,
  Upload,
  UserCheck,
  Lock,
  Mail,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const Settings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'panels'>('general');

  const [generalSettings, setGeneralSettings] = useState(() => {
    const saved = localStorage.getItem('edu_nexus_general_settings');
    return saved ? JSON.parse(saved) : {
      collegeName: 'EduNexus College of Engineering',
      address: '123 Education Hub, Knowledge Park, Mumbai, Maharashtra 400001',
      website: 'https://edunexus.edu.in',
      email: 'contact@edunexus.edu.in',
      phone: '+91 22 1234 5678',
      logo: '',
      signature: ''
    };
  });

  const [panelCredentials, setPanelCredentials] = useState(() => {
    const saved = localStorage.getItem('edu_nexus_panel_credentials');
    return saved ? JSON.parse(saved) : [
      { role: 'Super Admin', id: 'Dc@18', password: '••••••••', email: 'superadmin@edunexus.edu.in' },
      { role: 'Admin', id: 'admin', password: '••••••••', email: 'admin@edunexus.edu.in' },
      { role: 'Faculty', id: 'faculty', password: '••••••••', email: 'faculty@edunexus.edu.in' },
      { role: 'Principal', id: 'Principal', password: '••••••••', email: 'principal@edunexus.edu.in' },
      { role: 'Accountant', id: 'accountant', password: '••••••••', email: 'accounts@edunexus.edu.in' },
      { role: 'Librarian', id: 'library', password: '••••••••', email: 'library@edunexus.edu.in' },
      { role: 'Staff', id: 'staff', password: '••••••••', email: 'staff@edunexus.edu.in' },
    ];
  });

  const handleFileUpload = (type: 'logo' | 'signature') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setGeneralSettings(prev => ({
            ...prev,
            [type]: event.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('edu_nexus_general_settings', JSON.stringify(generalSettings));
      localStorage.setItem('edu_nexus_panel_credentials', JSON.stringify(panelCredentials));
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">System Settings</h1>
          <p className="text-slate-500">Configure application-wide settings and panel credentials.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20",
            isSaving && "opacity-80 cursor-not-allowed"
          )}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-primary/5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('general')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'general' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
          )}
        >
          <SettingsIcon className="w-4 h-4" />
          General Settings
        </button>
        <button 
          onClick={() => setActiveTab('panels')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
            activeTab === 'panels' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"
          )}
        >
          <Shield className="w-4 h-4" />
          Panel Credentials
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'general' ? (
          <motion.div 
            key="general"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Logo & Signature Section */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Institution Logo
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => handleFileUpload('logo')}
                    className="w-32 h-32 bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group overflow-hidden"
                  >
                    {generalSettings.logo ? (
                      <img src={generalSettings.logo} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold">Upload Logo</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Recommended: 512x512px (PNG/SVG)</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-primary/10 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <PenTool className="w-5 h-5" />
                  Official Signature
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => handleFileUpload('signature')}
                    className="w-full h-32 bg-primary/5 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-primary/40 hover:text-primary transition-all cursor-pointer group overflow-hidden"
                  >
                    {generalSettings.signature ? (
                      <img src={generalSettings.signature} alt="Signature" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold">Upload Signature</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 text-center">Clear image of Principal's signature</p>
                </div>
              </div>
            </div>

            {/* Address & Contact Section */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-primary/10 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Institution Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institution Name</label>
                  <input 
                    type="text" 
                    value={generalSettings.collegeName}
                    onChange={(e) => setGeneralSettings({...generalSettings, collegeName: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Address</label>
                  <textarea 
                    rows={3}
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    className="w-full px-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Website URL</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="url" 
                      value={generalSettings.website}
                      onChange={(e) => setGeneralSettings({...generalSettings, website: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email" 
                      value={generalSettings.email}
                      onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 bg-background border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="panels"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl border border-primary/10 shadow-sm overflow-hidden"
          >
            <div className="p-8 border-b border-primary/10 bg-primary/5">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Panel Access Configuration
              </h3>
              <p className="text-sm text-slate-500 mt-1">Manage login credentials for all user roles.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-primary/10">
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Role</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Login ID</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Password</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Notification</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {panelCredentials.map((panel, index) => (
                    <tr key={panel.role} className="hover:bg-primary/5 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-sm text-primary">{panel.role}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="relative">
                          <input 
                            type="text" 
                            value={panel.id}
                            onChange={(e) => {
                              const newPanels = [...panelCredentials];
                              newPanels[index].id = e.target.value;
                              setPanelCredentials(newPanels);
                            }}
                            className="w-full px-3 py-2 bg-background border-none rounded-lg text-xs font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="relative">
                          <Lock className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="password" 
                            value={panel.password}
                            onChange={(e) => {
                              const newPanels = [...panelCredentials];
                              newPanels[index].password = e.target.value;
                              setPanelCredentials(newPanels);
                            }}
                            className="w-full pl-8 pr-3 py-2 bg-background border-none rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="text-xs text-slate-500">{panel.email}</span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-xs font-bold text-primary hover:underline">Reset</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-50 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold">Settings Saved!</p>
              <p className="text-xs text-white/80">System configuration has been updated.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
