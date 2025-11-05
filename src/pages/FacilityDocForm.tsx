import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacilityDocForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    deptSection: '',
    date: '',
    particulars: '',
    totalNoOfPages: '',
    submittedBy: '',
    adminIndexNo: '',
    adminDateOfReceipt: '',
    adminDateOfIndexing: '',
    adminRemarks: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // eslint-disable-next-line no-console
    console.log('Facility Doc submitted:', formData);
    alert('Facility Doc saved.');
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-700">Facility Doc - Add New</h1>
          <span className="text-gray-600 text-sm">{user?.email}</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="deptSection" className="block text-sm font-medium text-gray-700 mb-2">Dept/Section</label>
                <input id="deptSection" name="deptSection" value={formData.deptSection} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="particulars" className="block text-sm font-medium text-gray-700 mb-2">Particulars</label>
                <input id="particulars" name="particulars" value={formData.particulars} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="totalNoOfPages" className="block text-sm font-medium text-gray-700 mb-2">Total no of pages</label>
                <input id="totalNoOfPages" name="totalNoOfPages" type="number" min="0" value={formData.totalNoOfPages} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label htmlFor="submittedBy" className="block text-sm font-medium text-gray-700 mb-2">Submitted by</label>
                <input id="submittedBy" name="submittedBy" value={formData.submittedBy} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Only</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label htmlFor="adminIndexNo" className="block text-sm font-medium text-gray-700 mb-2">Index no</label>
                  <input id="adminIndexNo" name="adminIndexNo" value={formData.adminIndexNo} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="adminDateOfReceipt" className="block text-sm font-medium text-gray-700 mb-2">Date of receipt</label>
                  <input id="adminDateOfReceipt" name="adminDateOfReceipt" type="date" value={formData.adminDateOfReceipt} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="adminDateOfIndexing" className="block text-sm font-medium text-gray-700 mb-2">Date of indexing</label>
                  <input id="adminDateOfIndexing" name="adminDateOfIndexing" type="date" value={formData.adminDateOfIndexing} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label htmlFor="adminRemarks" className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                  <input id="adminRemarks" name="adminRemarks" value={formData.adminRemarks} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleBack} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Back</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityDocForm;


