import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { CalendarDays, Plus, CheckCircle2, Sliders, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export const AcademicYearsPage = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showYearModal, setShowYearModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const [yearForm, setYearForm] = useState({
    institute_id: 1,
    name: '',
    code: '',
    start_date: '',
    end_date: '',
    status: 'active',
    description: '',
  });

  const [termForm, setTermForm] = useState({
    name: '',
    term_number: 1,
    start_date: '',
    end_date: '',
    is_active: false,
  });

  const [rulesForm, setRulesForm] = useState({
    min_attendance_percentage: 75,
    passing_marks_percentage: 40,
    auto_promotion_enabled: false,
  });

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const loadAcademicYears = async () => {
    try {
      setLoading(true);
      const res = await api.get('/academic-years');
      const data = res.data.data;
      setAcademicYears(data);
      if (data.length > 0) {
        setSelectedYear(data.find((y) => y.is_current) || data[0]);
      }
    } catch (err) {
      console.error('Error fetching academic years:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrent = async (id) => {
    try {
      await api.post(`/academic-years/${id}/set-current`);
      loadAcademicYears();
    } catch (err) {
      alert('Error updating active session');
    }
  };

  const handleCreateYear = async (e) => {
    e.preventDefault();
    try {
      await api.post('/academic-years', yearForm);
      setShowYearModal(false);
      loadAcademicYears();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating academic year');
    }
  };

  const handleCreateTerm = async (e) => {
    e.preventDefault();
    if (!selectedYear) return;
    try {
      await api.post(`/academic-years/${selectedYear.id}/terms`, termForm);
      setShowTermModal(false);
      loadAcademicYears();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating term');
    }
  };

  const handleUpdateRules = async (e) => {
    e.preventDefault();
    if (!selectedYear) return;
    try {
      await api.put(`/academic-years/${selectedYear.id}/promotion-rules`, rulesForm);
      setShowRulesModal(false);
      loadAcademicYears();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving promotion rules');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Academic Years & Sessions</h1>
          <p className="text-xs text-slate-400">Manage institutional calendar, active session binding, semesters, and promotion rules</p>
        </div>
        <button
          onClick={() => {
            setYearForm({
              institute_id: 1,
              name: '2026-2027',
              code: 'AY-26-27',
              start_date: '2026-06-01',
              end_date: '2027-05-31',
              status: 'upcoming',
              description: '',
            });
            setShowYearModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic Year</span>
        </button>
      </div>

      {/* Grid: Academic Years List & Selected Year Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Academic Years List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">All Academic Sessions</h2>
          {academicYears.map((ay) => (
            <div
              key={ay.id}
              onClick={() => setSelectedYear(ay)}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                selectedYear?.id === ay.id
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'glass-card border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-base">{ay.name}</span>
                {ay.is_current ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Session
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetCurrent(ay.id);
                    }}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
                  >
                    Set Active
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono">
                {ay.start_date} &rarr; {ay.end_date}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
                <span className="capitalize">{ay.status}</span>
                <span>{ay.terms?.length || 0} Terms</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Cols: Details of Selected Session */}
        {selectedYear && (
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-white">{selectedYear.name}</h2>
                    {selectedYear.is_current && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                        Current System Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Duration: {selectedYear.start_date} to {selectedYear.end_date}
                  </p>
                  {selectedYear.description && (
                    <p className="text-xs text-slate-300 mt-2">{selectedYear.description}</p>
                  )}
                </div>

                {!selectedYear.is_current && (
                  <button
                    onClick={() => handleSetCurrent(selectedYear.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                  >
                    Activate Session
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setTermForm({
                      name: 'Term ' + ((selectedYear.terms?.length || 0) + 1),
                      term_number: (selectedYear.terms?.length || 0) + 1,
                      start_date: selectedYear.start_date,
                      end_date: selectedYear.end_date,
                      is_active: false,
                    });
                    setShowTermModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Term / Semester</span>
                </button>

                <button
                  onClick={() => {
                    setRulesForm({
                      min_attendance_percentage: selectedYear.promotion_rules?.min_attendance_percentage || 75,
                      passing_marks_percentage: selectedYear.promotion_rules?.passing_marks_percentage || 40,
                      auto_promotion_enabled: selectedYear.promotion_rules?.auto_promotion_enabled || false,
                    });
                    setShowRulesModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Promotion Rules</span>
                </button>
              </div>
            </div>

            {/* Terms List */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-slate-400">
                Terms / Semesters Structure
              </h3>
              {selectedYear.terms && selectedYear.terms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedYear.terms.map((term) => (
                    <div key={term.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{term.name}</span>
                        {term.is_active && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                            Active Term
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-2 font-mono">
                        {term.start_date} &rarr; {term.end_date}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No terms configured yet. Click "Add Term / Semester" above.</p>
              )}
            </div>

            {/* Promotion Rules Preview */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-slate-400">
                Configured Promotion Criteria
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Min Attendance</div>
                  <div className="text-xl font-black text-indigo-300 font-mono mt-1">
                    {selectedYear.promotion_rules?.min_attendance_percentage || 75}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Passing Threshold</div>
                  <div className="text-xl font-black text-emerald-300 font-mono mt-1">
                    {selectedYear.promotion_rules?.passing_marks_percentage || 40}%
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">Auto Promotion</div>
                  <div className="text-sm font-bold text-white mt-2">
                    {selectedYear.promotion_rules?.auto_promotion_enabled ? (
                      <span className="text-emerald-400">Enabled</span>
                    ) : (
                      <span className="text-slate-400">Manual Review</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Academic Year Modal */}
      {showYearModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Create Academic Year</h3>
              <button onClick={() => setShowYearModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateYear} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Name</label>
                <input
                  type="text"
                  required
                  value={yearForm.name}
                  onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
                  placeholder="e.g. 2026-2027"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Code</label>
                <input
                  type="text"
                  value={yearForm.code}
                  onChange={(e) => setYearForm({ ...yearForm, code: e.target.value })}
                  placeholder="AY-26-27"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={yearForm.start_date}
                    onChange={(e) => setYearForm({ ...yearForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={yearForm.end_date}
                    onChange={(e) => setYearForm({ ...yearForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowYearModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Create Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Term Modal */}
      {showTermModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Term / Semester</h3>
              <button onClick={() => setShowTermModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTerm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Term Name</label>
                <input
                  type="text"
                  required
                  value={termForm.name}
                  onChange={(e) => setTermForm({ ...termForm, name: e.target.value })}
                  placeholder="e.g. First Semester"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={termForm.start_date}
                    onChange={(e) => setTermForm({ ...termForm, start_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={termForm.end_date}
                    onChange={(e) => setTermForm({ ...termForm, end_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="term_active"
                  checked={termForm.is_active}
                  onChange={(e) => setTermForm({ ...termForm, is_active: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600"
                />
                <label htmlFor="term_active" className="text-xs text-slate-300 font-medium">
                  Set as Current Active Term
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTermModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promotion Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Promotion Rules Configuration</h3>
              <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateRules} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minimum Attendance Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={rulesForm.min_attendance_percentage}
                  onChange={(e) => setRulesForm({ ...rulesForm, min_attendance_percentage: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Passing Marks Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={rulesForm.passing_marks_percentage}
                  onChange={(e) => setRulesForm({ ...rulesForm, passing_marks_percentage: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_promo"
                  checked={rulesForm.auto_promotion_enabled}
                  onChange={(e) => setRulesForm({ ...rulesForm, auto_promotion_enabled: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600"
                />
                <label htmlFor="auto_promo" className="text-xs text-slate-300 font-medium">
                  Enable Automatic Promotion based on threshold
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRulesModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
