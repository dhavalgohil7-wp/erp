import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { GraduationCap, Plus, Users, Edit2, Trash2, X, Compass, Flag } from 'lucide-react';

export const ClassesPage = () => {
  const [activeTab, setActiveTab] = useState('classes'); // 'classes', 'streams', 'houses'
  const [classes, setClasses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [classForm, setClassForm] = useState({
    institute_id: 1,
    name: '',
    code: '',
    numeric_level: 1,
    stream_id: null,
    status: 'active',
  });

  const [sectionForm, setSectionForm] = useState({
    name: '',
    room_number: '',
    max_capacity: 35,
    status: 'active',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [clsRes, stmRes, hseRes] = await Promise.all([
        api.get('/classes'),
        api.get('/streams'),
        api.get('/houses'),
      ]);
      setClasses(clsRes.data.data);
      setStreams(stmRes.data.data);
      setHouses(hseRes.data.data);
    } catch (err) {
      console.error('Error fetching academic classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      await api.post('/classes', classForm);
      setShowClassModal(false);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating class');
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!selectedClassId) return;
    try {
      await api.post(`/classes/${selectedClassId}/sections`, sectionForm);
      setShowSectionModal(false);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding section');
    }
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this grade class?')) {
      try {
        await api.delete(`/classes/${id}`);
        loadAll();
      } catch (err) {
        alert('Error deleting class');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Class & Section Management</h1>
          <p className="text-xs text-slate-400">Define grade hierarchy (Nursery - Grade 12), sections, streams, and houses</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'classes' && (
            <button
              onClick={() => {
                setClassForm({
                  institute_id: 1,
                  name: '',
                  code: '',
                  numeric_level: classes.length + 1,
                  stream_id: null,
                  status: 'active',
                });
                setShowClassModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class / Grade</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'classes'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Classes & Sections ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('streams')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'streams'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Streams ({streams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('houses')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'houses'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Houses & Groups ({houses.length})</span>
        </button>
      </div>

      {/* Tab Content: Classes */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">{cls.code || 'GR'}</span>
                  <div className="flex items-center gap-1.5">
                    {cls.stream && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[10px] font-semibold border border-purple-500/20">
                        {cls.stream}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] capitalize">
                      {cls.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{cls.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Numeric Level: {cls.numeric_level}</p>

                {/* Sections Pill Area */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Sections ({cls.sections?.length || 0})
                    </span>
                    <button
                      onClick={() => {
                        setSelectedClassId(cls.id);
                        setSectionForm({
                          name: 'Section ' + String.fromCharCode(65 + (cls.sections?.length || 0)),
                          room_number: '',
                          max_capacity: 35,
                          status: 'active',
                        });
                        setShowSectionModal(true);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cls.sections?.map((sec) => (
                      <div
                        key={sec.id}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-200">{sec.name}</span>
                          {sec.room_number && (
                            <span className="text-slate-400 text-[11px] ml-2">Room: {sec.room_number}</span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono">
                          Cap: {sec.max_capacity} students
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => handleDeleteClass(cls.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition"
                  title="Delete Class"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Streams */}
      {activeTab === 'streams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {streams.map((st) => (
            <div key={st.id} className="glass-card p-5 rounded-2xl">
              <span className="font-mono text-xs font-bold text-indigo-400">{st.code}</span>
              <h3 className="text-base font-bold text-white mt-1">{st.name}</h3>
              <p className="text-xs text-slate-400 mt-2">{st.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
                {st.classes_count || 0} associated classes
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Houses */}
      {activeTab === 'houses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {houses.map((h) => (
            <div key={h.id} className="glass-card p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: h.color_code || '#6366F1' }}
                />
                <span className="font-mono text-xs font-bold text-slate-300">{h.code}</span>
              </div>
              <h3 className="text-base font-bold text-white">{h.name} House</h3>
              <p className="text-xs text-slate-400 mt-2">{h.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono">
                {h.enrollments_count || 0} enrolled students
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Class / Grade</h3>
              <button onClick={() => setShowClassModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Class Name</label>
                <input
                  type="text"
                  required
                  value={classForm.name}
                  onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                  placeholder="e.g. Grade 11 - Science"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Class Code</label>
                  <input
                    type="text"
                    value={classForm.code}
                    onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                    placeholder="GR-11-SCI"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Numeric Level</label>
                  <input
                    type="number"
                    required
                    value={classForm.numeric_level}
                    onChange={(e) => setClassForm({ ...classForm, numeric_level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Stream (Optional)</label>
                <select
                  value={classForm.stream_id || ''}
                  onChange={(e) => setClassForm({ ...classForm, stream_id: e.target.value ? parseInt(e.target.value) : null })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="">No Stream (General)</option>
                  {streams.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Section</h3>
              <button onClick={() => setShowSectionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateSection} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section Name</label>
                <input
                  type="text"
                  required
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                  placeholder="e.g. Section B"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={sectionForm.room_number}
                    onChange={(e) => setSectionForm({ ...sectionForm, room_number: e.target.value })}
                    placeholder="RM-201"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    required
                    value={sectionForm.max_capacity}
                    onChange={(e) => setSectionForm({ ...sectionForm, max_capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSectionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
