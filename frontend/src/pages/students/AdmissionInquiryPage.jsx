import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Sparkles, Plus, Search, Phone, Mail, Clock, CheckCircle2, XCircle, X } from 'lucide-react';

export const AdmissionInquiryPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    institute_id: 1,
    student_name: '',
    guardian_name: '',
    email: '',
    phone: '',
    applied_class_id: '',
    inquiry_date: new Date().toISOString().slice(0, 10),
    status: 'new',
    notes: '',
  });

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const [inqRes, clsRes] = await Promise.all([
        api.get('/admission-inquiries'),
        api.get('/classes'),
      ]);
      setInquiries(inqRes.data.data);
      setClasses(clsRes.data.data);
      if (clsRes.data.data.length > 0) {
        setFormData((prev) => ({ ...prev, applied_class_id: clsRes.data.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admission-inquiries', formData);
      setShowModal(false);
      loadInquiries();
    } catch (err) {
      alert(err.response?.data?.message || 'Error recording inquiry');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/admission-inquiries/${id}`, { status });
      loadInquiries();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const filteredInquiries = statusFilter === 'all'
    ? inquiries
    : inquiries.filter((inq) => inq.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Admission Inquiries CRM Pipeline</h1>
          <p className="text-xs text-slate-400">Track and convert prospective student inquiries into enrolled admissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Inquiry</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'new', 'follow_up', 'converted', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              statusFilter === st
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Inquiries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className="glass-card p-5 rounded-2xl flex flex-col justify-between transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-indigo-400">{inq.inquiry_number}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  inq.status === 'new'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : inq.status === 'follow_up'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : inq.status === 'converted'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {inq.status.replace('_', ' ')}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{inq.student_name}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Applied for: <span className="text-slate-200 font-medium">{inq.applied_class || 'General'}</span>
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div>Guardian: <span className="text-slate-300 font-medium">{inq.guardian_name || 'N/A'}</span></div>
                <div className="flex items-center gap-1.5 font-mono"><Phone className="w-3.5 h-3.5 text-slate-500" /> {inq.phone}</div>
                {inq.notes && (
                  <p className="mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                    "{inq.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Quick Status Changers */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">{inq.inquiry_date}</span>
              <div className="flex items-center gap-1">
                {inq.status !== 'converted' && (
                  <button
                    onClick={() => handleStatusUpdate(inq.id, 'converted')}
                    className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]"
                  >
                    Convert
                  </button>
                )}
                {inq.status !== 'follow_up' && (
                  <button
                    onClick={() => handleStatusUpdate(inq.id, 'follow_up')}
                    className="px-2 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-[10px]"
                  >
                    Follow up
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Log Inquiry Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Log Admission Inquiry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateInquiry} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Candidate Name</label>
                <input
                  type="text"
                  required
                  value={formData.student_name}
                  onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                  placeholder="e.g. Lucas Miller"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.guardian_name}
                    onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                    placeholder="Parent full name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555-0811"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Applied Class</label>
                  <select
                    value={formData.applied_class_id}
                    onChange={(e) => setFormData({ ...formData, applied_class_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Notes / Questions</label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Inquiry for transportation, curriculum, fee breakdown..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
