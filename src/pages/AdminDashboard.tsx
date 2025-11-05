import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, selectedEntity, selectedInventory, logout } = useAuth();
  const navigate = useNavigate();

  const getEntityDisplayName = (entity: string | null) => {
    if (!entity) return 'No Entity Selected';
    return entity.charAt(0).toUpperCase() + entity.slice(1);
  };

  const getInventoryDisplayName = (inventory: string | null) => {
    if (!inventory) return 'No Inventory Selected';
    const names: { [key: string]: string } = {
      test_item: 'Test Item',
      study: 'Study',
      facility_doc: 'Facility Doc',
    };
    return names[inventory] || inventory;
  };

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleBackToSelection = () => {
    navigate('/entity-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <nav className="bg-purple-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Eurofines</h1>
              <span className="text-sm text-purple-300">|</span>
              <span className="text-lg font-semibold text-white">Admin - {getEntityDisplayName(selectedEntity)}</span>
              <span className="text-sm text-purple-300">|</span>
              <span className="text-lg font-semibold text-purple-200">{getInventoryDisplayName(selectedInventory)}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">{user?.email}</span>
              <button
                onClick={handleBackToSelection}
                className="px-3 py-1.5 text-sm bg-purple-800 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Change Entity
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Admin Control Panel</h2>
          <p className="text-gray-600 mb-6">
            This is an admin-only dashboard for <span className="font-semibold">{getEntityDisplayName(selectedEntity)}</span> - <span className="font-semibold">{getInventoryDisplayName(selectedInventory)}</span> with elevated privileges.
          </p>
          {selectedInventory === 'test_item' &&
            (selectedEntity === 'adgyl' || selectedEntity === 'agro' || selectedEntity === 'biopharma') && (
            <div className="mb-6">
              <button
                onClick={() => navigate('/test-item-form')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold shadow-md"
              >
                + Add New Test Item
              </button>
            </div>
          )}
          {selectedInventory === 'study' && (
            <div className="mb-6">
              <button
                onClick={() => navigate('/study-form')}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold shadow-md"
              >
                + Add New Study
              </button>
            </div>
          )}
          {selectedInventory === 'facility_doc' && (
            <div className="mb-6">
              <button
                onClick={() => navigate('/facility-doc-form')}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold shadow-md"
              >
                + Add New Facility Doc
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-purple-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Users</h3>
            <p className="text-purple-700 mb-4">Manage all users</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              View Users
            </button>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">Analytics</h3>
            <p className="text-blue-700 mb-4">View system analytics</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              View Analytics
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-green-900 mb-2">Reports</h3>
            <p className="text-green-700 mb-4">Generate reports</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              Create Report
            </button>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-orange-900 mb-2">Settings</h3>
            <p className="text-orange-700 mb-4">System configuration</p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Open Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
