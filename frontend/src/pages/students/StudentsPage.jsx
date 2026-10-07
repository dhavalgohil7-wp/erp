import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { UserPlus, Plus, Search, Eye, Trash2, X, GraduationCap, CheckCircle2, ChevronRight, User } from 'lucide-react';

export const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [viewingStudent, setViewingStudent] = useState(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [admissionStep, setAdmissionStep] = useState(1);

  const [admissionForm, setAdmissionForm] = useState({
    // Student Master
    institute_id: 1,
    admission_number: '',
    admission_date: new Date().toISOString().slice(0, 10),
    first_name: '',
    last_name: '',
    gender: 'male',
    date_of_birth: '2012-05-10',
    blood_group: 'O+',
    nationality: 'American',
    category: 'General',
    email: '',
    phone: '',
    current_address: '',
    emergency_contact: '',
    status: 'active',
    create_user_account: true,
    // Guardian
    guardian_name: '',
    guardian_relation: 'Father',
    guardian_phone: '',
    guardian_email: '',
    guardian_occupation: 'Engineer',
    guardian_annual_income: 95000,
    // Enrollment
    academic_year_id: 1,
    class_id: '',
    section_id: '',
    house_id: '',
    roll_number: '',
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [stuRes, clsRes, ayRes, hseRes] = await Promise.all([
        api.get('/students'),
        api.get('/classes'),
        api.get('/academic-years'),
        api.get('/houses'),
      ]);
      setStudents(stuRes.data.data);
      setClasses(clsRes.data.data);
      setAcademicYears(ayRes.data.data);
      setHouses(hseRes.data.data);

      const activeYear = ayRes.data.data.find((y) => y.is_current) || ayRes.data.data[0];
      const defaultClass = clsRes.data.data[0];
      const defaultSec = defaultClass?.sections?.[0];

      setAdmissionForm((prev) => ({
        ...prev,
        admission_number: 'ADM-2025-' + Math.floor(1000 + Math.random() * 9000),
        academic_year_id: activeYear?.id || 1,
        class_id: defaultClass?.id || '',
        section_id: defaultSec?.id || '',
        house_id: hseRes.data.data[0]?.id || '',
      }));
    } catch (err) {
      console.error('Error fetching student records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', admissionForm);
      setShowAdmissionModal(false);
      setAdmissionStep(1);
      loadAll();
      alert('Student master record and class enrollment created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing admission');
    }
  };

  const selectedClassObj = classes.find((c) => c.id === parseInt(admissionForm.class_id));

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass ? s.current_enrollment?.class_id === parseInt(selectedClass) : true;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Student Master Directory & Admissions</h1>
          <p className="text-xs text-slate-400">Complete student records, guardian profiles, and session enrollments</p>
        </div>
        <button
          onClick={() => {
            setAdmissionStep(1);
            setAdmissionForm((prev) => ({
              ...prev,
              admission_number: 'ADM-2025-' + Math.floor(1000 + Math.random() * 9000),
            }));
            setShowAdmissionModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Admission Form</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, admission number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Classes / Grades</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <th className="p-4 font-semibold">ADM NO</th>
                <th className="p-4 font-semibold">STUDENT</th>
                <th className="p-4 font-semibold">CLASS & SECTION</th>
                <th className="p-4 font-semibold">ROLL NO</th>
                <th className="p-4 font-semibold">HOUSE</th>
                <th className="p-4 font-semibold">ADMIT DATE</th>
                <th className="p-4 font-semibold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-mono font-bold text-indigo-400">{st.admission_number}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{st.full_name}</div>
                    <div className="text-[11px] text-slate-400 capitalize">{st.gender} &bull; {st.email || 'No email'}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-slate-200">
                      {st.current_enrollment?.class_name || 'Class 10'}
                    </span>
                    <span className="text-slate-400 ml-1">
                      ({st.current_enrollment?.section_name || 'Section A'})
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-300">
                    {st.current_enrollment?.roll_number || '10A-01'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold text-[10px]">
                      {st.current_enrollment?.house_name || 'Phoenix'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{st.admission_date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setViewingStudent(st)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-semibold text-xs flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Profile Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Student Master Profile</h3>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                  {viewingStudent.first_name?.[0]}
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{viewingStudent.full_name}</h4>
                  <p className="text-indigo-400 font-mono">Admission No: {viewingStudent.admission_number}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">DOB / GENDER</span>
                  <span className="text-slate-200 capitalize">{viewingStudent.date_of_birth || '2010-05-18'} &bull; {viewingStudent.gender}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">BLOOD GROUP</span>
                  <span className="text-slate-200 font-bold">{viewingStudent.blood_group || 'O+'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">ENROLLMENT SESSION</span>
                  <span className="text-slate-200">{viewingStudent.current_enrollment?.academic_year || '2025-2026'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[10px]">GRADE & SECTION</span>
                  <span className="text-slate-200">{viewingStudent.current_enrollment?.class_name} - {viewingStudent.current_enrollment?.section_name}</span>
                </div>
              </div>

              {viewingStudent.guardians && viewingStudent.guardians.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Guardian Information</span>
                  <div className="text-slate-300">Name: <span className="font-semibold text-white">{viewingStudent.guardians[0]?.name}</span></div>
                  <div className="text-slate-400">Relation: {viewingStudent.guardians[0]?.relation} &bull; Occupation: {viewingStudent.guardians[0]?.occupation}</div>
                  <div className="text-slate-400">Phone: {viewingStudent.guardians[0]?.phone}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Admission Application Wizard Modal */}
      {showAdmissionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Student Admission Application</h3>
                <p className="text-[11px] text-slate-400">Phase 1 Unified Admission & Enrollment Wizard</p>
              </div>
              <button onClick={() => setShowAdmissionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              {[
                { step: 1, title: 'Student Master' },
                { step: 2, title: 'Guardian Details' },
                { step: 3, title: 'Class Enrollment' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      admissionStep === s.step
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                        : admissionStep > s.step
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {admissionStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${
                    admissionStep === s.step ? 'text-white' : 'text-slate-400'
                  }`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-4">
              {/* Step 1: Student Master */}
              {admissionStep === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Admission Number</label>
                      <input
                        type="text"
                        required
                        value={admissionForm.admission_number}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, admission_number: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Admission Date</label>
                      <input
                        type="date"
                        required
                        value={admissionForm.admission_date}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, admission_date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={admissionForm.first_name}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, first_name: e.target.value })}
                        placeholder="e.g. Liam"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={admissionForm.last_name}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, last_name: e.target.value })}
                        placeholder="e.g. Johnson"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                      <select
                        value={admissionForm.gender}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, gender: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={admissionForm.date_of_birth}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, date_of_birth: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={admissionForm.blood_group}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, blood_group: e.target.value })}
                        placeholder="O+, A+, B+"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
                    <input
                      type="text"
                      value={admissionForm.current_address}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, current_address: e.target.value })}
                      placeholder="124 Park Ave, Metropolis"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => setAdmissionStep(2)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>Next: Guardian Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Guardian Details */}
              {admissionStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Full Name</label>
                      <input
                        type="text"
                        required
                        value={admissionForm.guardian_name}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, guardian_name: e.target.value })}
                        placeholder="e.g. Robert Johnson"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
                      <select
                        value={admissionForm.guardian_relation}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, guardian_relation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Phone</label>
                      <input
                        type="text"
                        value={admissionForm.guardian_phone}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, guardian_phone: e.target.value })}
                        placeholder="+1 555-0188"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Guardian Email</label>
                      <input
                        type="email"
                        value={admissionForm.guardian_email}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, guardian_email: e.target.value })}
                        placeholder="guardian@example.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Occupation</label>
                      <input
                        type="text"
                        value={admissionForm.guardian_occupation}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, guardian_occupation: e.target.value })}
                        placeholder="Senior Software Architect"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Annual Income ($)</label>
                      <input
                        type="number"
                        value={admissionForm.guardian_annual_income}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, guardian_annual_income: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setAdmissionStep(1)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdmissionStep(3)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <span>Next: Enrollment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Class Enrollment */}
              {admissionStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                      <select
                        value={admissionForm.academic_year_id}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, academic_year_id: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        {academicYears.map((ay) => (
                          <option key={ay.id} value={ay.id}>{ay.name} {ay.is_current ? '(Current)' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Class / Grade</label>
                      <select
                        value={admissionForm.class_id}
                        onChange={(e) => {
                          const clsId = e.target.value;
                          const found = classes.find((c) => c.id === parseInt(clsId));
                          setAdmissionForm({
                            ...admissionForm,
                            class_id: clsId,
                            section_id: found?.sections?.[0]?.id || '',
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Section</label>
                      <select
                        value={admissionForm.section_id}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, section_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        {selectedClassObj?.sections?.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">House / Group</label>
                      <select
                        value={admissionForm.house_id}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, house_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      >
                        {houses.map((h) => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={admissionForm.roll_number}
                        onChange={(e) => setAdmissionForm({ ...admissionForm, roll_number: e.target.value })}
                        placeholder="e.g. 10A-24"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="stu_account"
                      checked={admissionForm.create_user_account}
                      onChange={(e) => setAdmissionForm({ ...admissionForm, create_user_account: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600"
                    />
                    <label htmlFor="stu_account" className="text-xs text-slate-300 font-medium">
                      Create student portal login account (Password: Student@12345)
                    </label>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setAdmissionStep(2)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
                    >
                      Complete Admission & Enroll
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
