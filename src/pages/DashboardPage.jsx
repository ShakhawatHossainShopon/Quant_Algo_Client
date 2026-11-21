import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { 
  Users, UserPlus, LogOut, RefreshCw, Edit, Trash2, 
  ShieldCheck, Search, AlertCircle, CheckCircle2 
} from 'lucide-react';

export function DashboardPage() {
  const { admin: currentAdmin, logout } = useAuth();
  const { get, post, loading } = useApi();

  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin',
    is_active: 1
  });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await get('/api/admin/list');
      if (res.success && res.data) {
        setAdmins(res.data);
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to fetch admins');
    }
  }, [get]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // Handle Add Admin
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await post('/api/admin/create', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      if (res.success) {
        showNotification('success', `Admin '${formData.username}' created successfully!`);
        setIsAddModalOpen(false);
        setFormData({ username: '', email: '', password: '', role: 'admin', is_active: 1 });
        fetchAdmins();
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // Open Edit Modal
  const openEditModal = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      password: '', // Blank unless updating
      role: admin.role,
      is_active: admin.is_active
    });
    setIsEditModalOpen(true);
  };

  // Handle Update Admin
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const payload = {
        id: selectedAdmin.id,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active
      };
      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await post('/api/admin/update', payload);
      if (res.success) {
        showNotification('success', `Admin '${selectedAdmin.username}' updated successfully!`);
        setIsEditModalOpen(false);
        fetchAdmins();
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  // Open Delete Modal
  const openDeleteModal = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Admin
  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    try {
      const res = await post('/api/admin/delete', { id: selectedAdmin.id });
      if (res.success) {
        showNotification('success', `Admin '${selectedAdmin.username}' deleted.`);
        setIsDeleteModalOpen(false);
        fetchAdmins();
      }
    } catch (err) {
      showNotification('error', err.message);
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Quant Algo Console
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono font-semibold">v1.0</span>
              </h1>
              <p className="text-xs text-slate-500">Trading Administrators & Access Control</p>
            </div>
          </div>

          {/* User Badge & Logout */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-800 font-semibold">{currentAdmin?.username}</span>
              <Badge variant={currentAdmin?.role === 'superadmin' ? 'purple' : 'primary'}>
                {currentAdmin?.role}
              </Badge>
            </div>
            <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Notification Alert */}
        {notification.message && (
          <div className={`flex items-center gap-2 p-4 rounded-xl text-xs font-semibold border animate-in fade-in ${
            notification.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 text-xs font-medium">
              <span>Total Administrators</span>
              <Users className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">{admins.length}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 text-xs font-medium">
              <span>Superadmins</span>
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {admins.filter(a => a.role === 'superadmin').length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 text-xs font-medium">
              <span>Active Accounts</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {admins.filter(a => a.is_active === 1).length} / {admins.length}
            </p>
          </div>
        </div>

        {/* Action Header / Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" icon={RefreshCw} loading={loading} onClick={fetchAdmins}>
              Refresh
            </Button>
            <Button variant="primary" size="md" icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
              Add Admin
            </Button>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Admin User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      No administrators found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 font-medium">#{adm.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{adm.username}</div>
                        <div className="text-[11px] text-slate-500">{adm.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={adm.role === 'superadmin' ? 'purple' : 'primary'}>
                          {adm.role}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={adm.is_active === 1 ? 'success' : 'danger'}>
                          {adm.is_active === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                        {adm.created_at}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(adm)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Admin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(adm)}
                          disabled={adm.id === currentAdmin?.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                          title={adm.id === currentAdmin?.id ? "Cannot delete yourself" : "Delete Admin"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Admin Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Administrator"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Username"
            required
            placeholder="e.g. quant_trader"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            placeholder="trader@quantalgo.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Create Admin
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Admin Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Admin: ${selectedAdmin?.username}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Username"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="New Password (leave blank to keep current)"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active === 1}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-600 h-4 w-4"
            />
            <label htmlFor="is_active" className="text-xs font-medium text-slate-700 cursor-pointer">Account is Active</label>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete admin <strong className="text-slate-900">{selectedAdmin?.username}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" loading={loading} onClick={handleDeleteConfirm}>
              Yes, Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
