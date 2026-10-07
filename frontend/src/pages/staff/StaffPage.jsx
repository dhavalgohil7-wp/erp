import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { UserCheck, Plus, Search, Mail, Phone, Building2, Briefcase, Calendar, Shield, X, Eye } from 'lucide-react';

export const StaffPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingStaff, setViewingStaff] = useState(null);

  const [formData, setFormData] = useState({
    institute_id: 1,
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'female',
    joining_date: '2025-08-01',
    department_id: '',
    designation_id: '',
    qualification: '',
    experience_years: 5,
    basic_salary: 60000,
    contract_type: 'permanent',
    status: 'active',
    create_user_account: true,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [stfRes, depRes, desRes] = await Promise.all([
        api.get('/staff'),
        api.get('/departments'),
        api.get('/designations'),
      ]);
      setStaffList(stfRes.data.data);
      setDepartments(depRes.data.data);
      setDesignations(desRes.data.data);
      if (depRes.data.data.length > 0) {
        setFormData((prev) => ({ ...prev, department_id: depRes.data.data[0].id }));
      }
      if (desRes.data.data.length > 0) {
        setFormData((prev) => ({ ...prev, designation_id: desRes.data.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching staff records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/staff', formData);
      setShowCreateModal(false);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating staff record');
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept ? s.department_id === parseInt(selectedDept) : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Staff & Employee Records</h1>
          <p className="text-xs text-slate-400">Faculty directory, departments, designations, and staff credentials</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              ...formData,
              employee_id: 'EMP-2025-' + Math.floor(100 + Math.random() * 900),
            });
            setShowCreateModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, employee ID, or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div key={staff.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-indigo-400">{staff.employee_id}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 capitalize">
                  {staff.status}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-300 text-sm">
                  {staff.first_name?.[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{staff.full_name}</h3>
                  <p className="text-xs text-indigo-300">{staff.designation || 'Faculty'}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{staff.department || 'General Department'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono">{staff.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">Exp: {staff.experience_years} yrs</span>
              <button
                onClick={() => setViewingStaff(staff)}
                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold flex items-center gap-1 transition"
              >
                <Eye className="w-3 h-3" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Profile Modal */}
      {viewingStaff && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Employee Master Record</h3>
              <button onClick={() => setViewingStaff(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {viewingStaff.first_name?.[0]}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{viewingStaff.full_name}</h4>
                  <p className="text-indigo-400">{viewingStaff.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px] font-semibold">EMPLOYEE ID</span>
                  <span className="font-mono font-bold text-slate-200">{viewingStaff.employee_id}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px] font-semibold">JOINING DATE</span>
                  <span className="font-mono text-slate-200">{viewingStaff.joining_date}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px] font-semibold">DEPARTMENT</span>
                  <span className="text-slate-200 font-medium">{viewingStaff.department}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px] font-semibold">CONTRACT</span>
                  <span className="text-slate-200 capitalize">{viewingStaff.contract_type}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div><span className="text-slate-500">Qualification:</span> <span className="text-slate-300">{viewingStaff.qualification || 'N/A'}</span></div>
                <div><span className="text-slate-500">Address:</span> <span className="text-slate-300">{viewingStaff.address || 'N/A'}</span></div>
                <div><span className="text-slate-500">Reporting Manager:</span> <span className="text-slate-300">{viewingStaff.reporting_manager || 'None (Direct Report)'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Staff Record</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Designation</label>
                  <select
                    value={formData.designation_id}
                    onChange={(e) => setFormData({ ...formData, designation_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    {designations.map((ds) => (
                      <option key={ds.id} value={ds.id}>{ds.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Qualification</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. M.Sc. Mathematics, B.Ed."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="create_user"
                  checked={formData.create_user_account}
                  onChange={(e) => setFormData({ ...formData, create_user_account: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600"
                />
                <label htmlFor="create_user" className="text-xs text-slate-300 font-medium">
                  Auto-create portal login account (Password: Staff@12345)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
