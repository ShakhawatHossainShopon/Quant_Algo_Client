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
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Navbar */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Quant Algo Console
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">v1.0</span>
            </h1>
            <p className="text-xs text-slate-400">Algorithmic Trading & System Administration</p>
          </div>
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-semibold">{currentAdmin?.username}</span>
            <Badge variant={currentAdmin?.role === 'superadmin' ? 'purple' : 'primary'}>
              {currentAdmin?.role}
            </Badge>
          </div>
          <Button variant="secondary" size="sm" icon={LogOut} onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Notification Alert */}
        {notification.message && (
          <div className={`flex items-center gap-2 p-4 rounded-xl text-xs font-medium border animate-in fade-in ${
            notification.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Total Admins</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">{admins.length}</p>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Superadmins</span>
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">
              {admins.filter(a => a.role === 'superadmin').length}
            </p>
          </div>

          <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
              <span>Active Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-2xl font-extrabold text-white font-mono">
              {admins.filter(a => a.is_active === 1).length} / {admins.length}
            </p>
          </div>
        </div>

        {/* Action Header / Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111827]/80 p-4 rounded-xl border border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by username, email, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
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
        <div className="bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-500">
                      No admins found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">#{adm.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100">{adm.username}</div>
                        <div className="text-[11px] text-slate-400">{adm.email}</div>
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
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">
                        {adm.created_at}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(adm)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-colors"
                          title="Edit Admin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(adm)}
                          disabled={adm.id === currentAdmin?.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
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
              className="rounded bg-slate-900 border-slate-700 text-teal-500 focus:ring-teal-500 h-4 w-4"
            />
            <label htmlFor="is_active" className="text-xs text-slate-300">Account is Active</label>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete admin <strong className="text-rose-400">{selectedAdmin?.username}</strong>?
          </p>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
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
