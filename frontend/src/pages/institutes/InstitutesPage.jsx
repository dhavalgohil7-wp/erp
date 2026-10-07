import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Building2, Plus, Edit2, Trash2, MapPin, Mail, Phone, Globe, Shield, Check, X } from 'lucide-react';

export const InstitutesPage = () => {
  const [institutes, setInstitutes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    institute_id: 1,
    name: '',
    branch_code: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    contact_person: '',
    email: '',
    phone: '',
    is_main_branch: false,
    status: 'active',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [instRes, branchRes] = await Promise.all([
        api.get('/institutes'),
        api.get('/branches'),
      ]);
      setInstitutes(instRes.data.data);
      setBranches(branchRes.data.data);
      if (instRes.data.data.length > 0) {
        setFormData((prev) => ({ ...prev, institute_id: instRes.data.data[0].id }));
      }
    } catch (err) {
      console.error('Error loading institutes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        institute_id: branch.institute_id,
        name: branch.name,
        branch_code: branch.branch_code,
        address: branch.address || '',
        city: branch.city || '',
        state: branch.state || '',
        postal_code: branch.postal_code || '',
        contact_person: branch.contact_person || '',
        email: branch.email || '',
        phone: branch.phone || '',
        is_main_branch: branch.is_main_branch,
        status: branch.status,
      });
    } else {
      setEditingBranch(null);
      setFormData({
        institute_id: institutes[0]?.id || 1,
        name: '',
        branch_code: 'BR-' + Math.floor(100 + Math.random() * 900),
        address: '',
        city: '',
        state: '',
        postal_code: '',
        contact_person: '',
        email: '',
        phone: '',
        is_main_branch: false,
        status: 'active',
      });
    }
    setShowBranchModal(true);
  };

  const handleSubmitBranch = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await api.put(`/branches/${editingBranch.id}`, formData);
      } else {
        await api.post('/branches', formData);
      }
      setShowBranchModal(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving branch');
    }
  };

  const handleDeleteBranch = async (id) => {
    if (window.confirm('Are you sure you want to delete this campus branch?')) {
      try {
        await api.delete(`/branches/${id}`);
        loadData();
      } catch (err) {
        alert('Error deleting branch');
      }
    }
  };

  const currentInst = institutes[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Institute & Multi-Campus Management</h1>
          <p className="text-xs text-slate-400">Configure central institution profile, accreditation, and campus locations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Branch / Campus</span>
        </button>
      </div>

      {/* Institute Master Card */}
      {currentInst && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{currentInst.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase border border-indigo-500/20">
                    {currentInst.code}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Board Affiliation: <span className="text-slate-200 font-medium">{currentInst.board_affiliation || 'CBSE'}</span> &bull;
                  Structure: <span className="text-slate-200 font-medium capitalize">{currentInst.type?.replace(/_/g, ' ')}</span> &bull;
                  Est: <span className="text-slate-200 font-medium">{currentInst.established_year}</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {currentInst.address}, {currentInst.city}</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {currentInst.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-indigo-400" /> {currentInst.phone}</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Branches</div>
              <div className="text-xl font-black text-indigo-300 font-mono">{branches.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Branches List Cards */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-slate-400">
          Campus Locations & Branches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div key={branch.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-indigo-400">{branch.branch_code}</span>
                  <div className="flex items-center gap-1.5">
                    {branch.is_main_branch && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                        Main Headquarter
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] capitalize">
                      {branch.status}
                    </span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{branch.name}</h3>
                <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{branch.address || 'Address pending'}, {branch.city}</span>
                </p>
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Contact Person:</span>
                    <span className="text-slate-300 font-medium">{branch.contact_person || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-300">{branch.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="text-slate-300 font-mono">{branch.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenModal(branch)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Edit Branch"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Delete Branch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingBranch ? 'Edit Campus Branch' : 'Create New Campus Branch'}
              </h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitBranch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. West City Campus"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch Code</label>
                  <input
                    type="text"
                    required
                    value={formData.branch_code}
                    onChange={(e) => setFormData({ ...formData, branch_code: e.target.value })}
                    placeholder="BR-WEST-01"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Academic Blvd"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="Prof. Jane Doe"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0199"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="campus@apexacademy.edu"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_main_branch"
                  checked={formData.is_main_branch}
                  onChange={(e) => setFormData({ ...formData, is_main_branch: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_main_branch" className="text-xs text-slate-300 font-medium">
                  Mark as Primary / Main Campus Headquarters
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  {editingBranch ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
