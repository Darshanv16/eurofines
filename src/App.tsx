import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EntitySelection from './pages/EntitySelection';
import InventorySelection from './pages/InventorySelection';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TestItemForm from './pages/TestItemForm';
import StudyForm from './pages/StudyForm';
import FacilityDocForm from './pages/FacilityDocForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/entity-selection"
            element={
              <ProtectedRoute>
                <EntitySelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-selection"
            element={
              <ProtectedRoute>
                <InventorySelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-item-form"
            element={
              <ProtectedRoute>
                <TestItemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-form"
            element={
              <ProtectedRoute>
                <StudyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/facility-doc-form"
            element={
              <ProtectedRoute>
                <FacilityDocForm />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
