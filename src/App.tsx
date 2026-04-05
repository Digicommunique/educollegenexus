import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { Login } from './modules/Auth/Login';
import { Dashboard } from './modules/Dashboard/Dashboard';
import { PaperSetter } from './modules/PaperSetter/PaperSetter';
import { Attendance } from './modules/Attendance/Attendance';
import { Fees } from './modules/Fees/Fees';
import { Library } from './modules/Library/Library';
import { Exams } from './modules/Exams/Exams';
import { Students } from './modules/Students/Students';
import { Settings } from './modules/Settings/Settings';
import { Admissions } from './modules/Admissions/Admissions';
import { Faculty } from './modules/Faculty/Faculty';
import { Reports } from './modules/Reports/Reports';
import { Courses } from './modules/Courses/Courses';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/paper-setter" 
            element={
              <ProtectedRoute>
                <PaperSetter />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fees" 
            element={
              <ProtectedRoute>
                <Fees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exams" 
            element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admissions" 
            element={
              <ProtectedRoute>
                <Admissions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty" 
            element={
              <ProtectedRoute>
                <Faculty />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          {/* Fallback for other routes */}
          <Route 
            path="*" 
            element={
              <ProtectedRoute>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🚧</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Under Construction</h2>
                  <p className="text-slate-500 max-w-md">
                    We're working hard to bring this feature to you. Please check back later!
                  </p>
                </div>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
