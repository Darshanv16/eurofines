import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const TestItemForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectedEntity } = useAuth();

  const [formData, setFormData] = useState({
    testItemName: '',
    testItemCode: '',
    companyName: '',
    dateOfReceipt: '',
    batchNo: '',
    arcNo: '',
    rackNo: '',
    indexNo: '',
    storage: '',
    expiryDate: '',
    retestDate: '',
    quantity: '',
    dateOfArchive: '',
    archivedBy: '',
    disposedOrReturned: '',
    sponsorApprovalDate: '',
    remark: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEntity) {
      alert('Please select an entity first');
      return;
    }

    // Format data for API - map camelCase to snake_case
    const submitData: any = {
      test_item_name: formData.testItemName,
      test_item_code: formData.testItemCode,
      company_name: formData.companyName,
      date_of_receipt: formData.dateOfReceipt || null,
      batch_no: formData.batchNo,
      arc_no: formData.arcNo,
      rack_no: formData.rackNo,
      index_no: formData.indexNo,
      storage: formData.storage,
      expiry_date: formData.expiryDate || null,
      retest_date: formData.retestDate || null,
      quantity: formData.quantity,
      date_of_archive: formData.dateOfArchive || null,
      archived_by: formData.archivedBy,
      disposed_or_returned: formData.disposedOrReturned,
      sponsor_approval_date: formData.sponsorApprovalDate || null,
      remark: formData.remark,
      entity: selectedEntity,
    };

    const response = await api.createTestItem(submitData);
    
    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      alert('Test Item form submitted successfully!');
      navigate('/admin-dashboard');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">Test Item Form</h1>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Test Item Registration</h2>
          <p className="text-gray-600 mb-8">Fill in the details for the test item</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Test Item Name */}
              <div>
                <label htmlFor="testItemName" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Item Name
                </label>
                <input
                  type="text"
                  id="testItemName"
                  name="testItemName"
                  value={formData.testItemName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter test item name"
                />
              </div>

              {/* Test Item Code */}
              <div>
                <label htmlFor="testItemCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Test Item Code
                </label>
                <input
                  type="text"
                  id="testItemCode"
                  name="testItemCode"
                  value={formData.testItemCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter test item code"
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter company name"
                />
              </div>

              {/* Date of Receipt */}
              <div>
                <label htmlFor="dateOfReceipt" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Receipt
                </label>
                <input
                  type="date"
                  id="dateOfReceipt"
                  name="dateOfReceipt"
                  value={formData.dateOfReceipt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Batch No */}
              <div>
                <label htmlFor="batchNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch No
                </label>
                <input
                  type="text"
                  id="batchNo"
                  name="batchNo"
                  value={formData.batchNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter batch number"
                />
              </div>

              {/* ARC No */}
              <div>
                <label htmlFor="arcNo" className="block text-sm font-medium text-gray-700 mb-2">
                  ARC No
                </label>
                <input
                  type="text"
                  id="arcNo"
                  name="arcNo"
                  value={formData.arcNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter ARC number"
                />
              </div>

              {/* Rack No */}
              <div>
                <label htmlFor="rackNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Rack No
                </label>
                <input
                  type="text"
                  id="rackNo"
                  name="rackNo"
                  value={formData.rackNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter rack number"
                />
              </div>

              {/* Index No */}
              <div>
                <label htmlFor="indexNo" className="block text-sm font-medium text-gray-700 mb-2">
                  Index No
                </label>
                <input
                  type="text"
                  id="indexNo"
                  name="indexNo"
                  value={formData.indexNo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter index number"
                />
              </div>

              {/* Storage */}
              <div>
                <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-2">
                  Storage
                </label>
                <select
                  id="storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Select storage type</option>
                  <option value="Ambient(+15 - +25)">Ambient(+15 - +25)</option>
                  <option value="Ambient(+18 - +36)">Ambient(+18 - +36)</option>
                  <option value="Refrigerator(+2 - +8)">Refrigerator(+2 - +8)</option>
                  <option value="Freezor(-10 - -30)">Freezor(-10 - -30)</option>
                  <option value="Deep Freezor(-60 - -80)">Deep Freezor(-60 - -80)</option>
                </select>
              </div>

              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Retest Date */}
              <div>
                <label htmlFor="retestDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Retest Date
                </label>
                <input
                  type="date"
                  id="retestDate"
                  name="retestDate"
                  value={formData.retestDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter quantity"
                />
              </div>

              {/* Date of Archive */}
              <div>
                <label htmlFor="dateOfArchive" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Archive
                </label>
                <input
                  type="date"
                  id="dateOfArchive"
                  name="dateOfArchive"
                  value={formData.dateOfArchive}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="archivedBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Archived By
                </label>
                <input
                  type="text"
                  id="archivedBy"
                  name="archivedBy"
                  value={formData.archivedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Enter Archived By"
                />
              </div>
            </div>

            {/* Admin-only fields */}
            {user?.role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disposed/Returned */}
                <div>
                  <label htmlFor="disposedOrReturned" className="block text-sm font-medium text-gray-700 mb-2">
                    Disposed/Returned
                  </label>
                  <input
                    type="text"
                    id="disposedOrReturned"
                    name="disposedOrReturned"
                    value={formData.disposedOrReturned}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter disposed/returned status"
                  />
                </div>

                {/* Sponsor Approval Date */}
                <div>
                  <label htmlFor="sponsorApprovalDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Sponsor Approval Date
                  </label>
                  <input
                    type="date"
                    id="sponsorApprovalDate"
                    name="sponsorApprovalDate"
                    value={formData.sponsorApprovalDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>

                {/* Remark */}
                <div>
                  <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-2">
                    Remark
                  </label>
                  <input
                    type="text"
                    id="remark"
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="Enter remark"
                  />
                </div>

                {/* Reg.Sl.no */}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestItemForm;
