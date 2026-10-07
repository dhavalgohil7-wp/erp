import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { ShieldCheck, Plus, Check, X, Shield, Lock, Users } from 'lucide-react';

export const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [permissionGroups, setPermissionGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      const [rolRes, perRes] = await Promise.all([
        api.get('/roles'),
        api.get('/permissions'),
      ]);
      setRoles(rolRes.data.data);
      setPermissionGroups(perRes.data.data);
      if (rolRes.data.data.length > 0) {
        selectRole(rolRes.data.data[0]);
      }
    } catch (err) {
      console.error('Error fetching roles and permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectRole = async (role) => {
    try {
      const res = await api.get(`/roles/${role.id}`);
      setSelectedRole(role);
      setRolePermissions(res.data.data.permissions || []);
    } catch (err) {
      console.error('Error loading role permissions:', err);
    }
  };

  const handleTogglePermission = (permName) => {
    if (rolePermissions.includes(permName)) {
      setRolePermissions(rolePermissions.filter((p) => p !== permName));
    } else {
      setRolePermissions([...rolePermissions, permName]);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await api.put(`/roles/${selectedRole.id}`, {
        permissions: rolePermissions,
      });
      alert(`Permissions for ${selectedRole.name} updated successfully!`);
      loadRolesAndPermissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating permissions');
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      await api.post('/roles', { name: newRoleName, permissions: [] });
      setShowRoleModal(false);
      setNewRoleName('');
      loadRolesAndPermissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating role');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Spatie Roles & Permissions Matrix</h1>
          <p className="text-xs text-slate-400">Granular role-based access control (RBAC) across Phase 1 modules</p>
        </div>
        <button
          onClick={() => setShowRoleModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Role</span>
        </button>
      </div>

      {/* Roles Chips Row */}
      <div className="flex flex-wrap items-center gap-2">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => selectRole(r)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border cursor-pointer ${
              selectedRole?.id === r.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : 'glass-card border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="capitalize">{r.name.replace('_', ' ')}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px] font-mono">
              {r.permissions_count}
            </span>
          </button>
        ))}
      </div>

      {/* Permissions Matrix for Selected Role */}
      {selectedRole && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <h2 className="text-base font-bold text-white capitalize">
                Permissions for role: <span className="text-indigo-400">{selectedRole.name}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle permissions to adjust what users with this role can view, create, edit, or delete.
              </p>
            </div>
            <button
              onClick={handleSavePermissions}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
            >
              <Check className="w-4 h-4" />
              <span>Save Permissions Matrix</span>
            </button>
          </div>

          {/* Grouped Modules */}
          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([group, perms]) => (
              <div key={group} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Module: {group.replace('_', ' ')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {perms.map((p) => {
                    const isChecked = rolePermissions.includes(p.name);
                    return (
                      <label
                        key={p.id}
                        className={`p-2.5 rounded-lg border flex items-center justify-between text-xs cursor-pointer select-none transition ${
                          isChecked
                            ? 'bg-indigo-950/40 border-indigo-500/40 text-white'
                            : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-mono text-[11px] truncate">{p.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(p.name)}
                          className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 ml-2"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Custom Role</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Identifier (Slug)</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="e.g. academic_director"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
