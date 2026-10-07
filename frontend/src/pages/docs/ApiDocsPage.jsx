import React, { useState } from 'react';
import { FileCode2, ExternalLink, Download, Search, CheckCircle2, Shield, Copy } from 'lucide-react';

export const ApiDocsPage = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = [
    'All',
    'Authentication',
    'Dashboard',
    'Institutes & Branches',
    'Academic Years & Sessions',
    'User & Role Management',
    'Settings',
    'Class & Section Management',
    'Subject Management',
    'Staff & Employee Records',
    'Student Profile & Admission',
  ];

  const endpoints = [
    { method: 'POST', path: '/auth/login', tag: 'Authentication', desc: 'Authenticate user credentials & generate Bearer token' },
    { method: 'GET', path: '/auth/me', tag: 'Authentication', desc: 'Get authenticated user with Spatie roles & permissions' },
    { method: 'POST', path: '/auth/logout', tag: 'Authentication', desc: 'Revoke active Sanctum bearer token' },
    { method: 'PUT', path: '/auth/profile', tag: 'Authentication', desc: 'Update profile information' },
    { method: 'POST', path: '/auth/change-password', tag: 'Authentication', desc: 'Change account password securely' },
    { method: 'GET', path: '/dashboard/kpi', tag: 'Dashboard', desc: 'Fetch overall school metrics & KPI counters' },
    { method: 'GET', path: '/institutes', tag: 'Institutes & Branches', desc: 'List all institutes with branches' },
    { method: 'POST', path: '/institutes', tag: 'Institutes & Branches', desc: 'Create new central institute profile' },
    { method: 'GET', path: '/institutes/{id}', tag: 'Institutes & Branches', desc: 'Get institute details' },
    { method: 'PUT', path: '/institutes/{id}', tag: 'Institutes & Branches', desc: 'Update institute profile' },
    { method: 'DELETE', path: '/institutes/{id}', tag: 'Institutes & Branches', desc: 'Delete institute' },
    { method: 'GET', path: '/branches', tag: 'Institutes & Branches', desc: 'List campus branches' },
    { method: 'POST', path: '/branches', tag: 'Institutes & Branches', desc: 'Create campus branch' },
    { method: 'PUT', path: '/branches/{id}', tag: 'Institutes & Branches', desc: 'Update campus branch' },
    { method: 'DELETE', path: '/branches/{id}', tag: 'Institutes & Branches', desc: 'Delete campus branch' },
    { method: 'GET', path: '/academic-years', tag: 'Academic Years & Sessions', desc: 'List academic sessions with terms' },
    { method: 'POST', path: '/academic-years', tag: 'Academic Years & Sessions', desc: 'Create new academic year session' },
    { method: 'POST', path: '/academic-years/{id}/set-current', tag: 'Academic Years & Sessions', desc: 'Set academic year as current active session' },
    { method: 'POST', path: '/academic-years/{id}/terms', tag: 'Academic Years & Sessions', desc: 'Add term / semester to session' },
    { method: 'PUT', path: '/academic-years/{id}/promotion-rules', tag: 'Academic Years & Sessions', desc: 'Configure promotion rules & passing thresholds' },
    { method: 'GET', path: '/users', tag: 'User & Role Management', desc: 'Paginated user directory with role filters' },
    { method: 'POST', path: '/users', tag: 'User & Role Management', desc: 'Create system user with Spatie role' },
    { method: 'PATCH', path: '/users/{id}/toggle-status', tag: 'User & Role Management', desc: 'Toggle user active/inactive status' },
    { method: 'GET', path: '/roles', tag: 'User & Role Management', desc: 'List Spatie roles with permissions counts' },
    { method: 'POST', path: '/roles', tag: 'User & Role Management', desc: 'Create custom role with permissions' },
    { method: 'GET', path: '/permissions', tag: 'User & Role Management', desc: 'List all system permissions grouped by module' },
    { method: 'GET', path: '/settings', tag: 'Settings', desc: 'Retrieve system configuration dictionary' },
    { method: 'POST', path: '/settings/batch', tag: 'Settings', desc: 'Batch update system parameters' },
    { method: 'GET', path: '/classes', tag: 'Class & Section Management', desc: 'List grades & classes with sections' },
    { method: 'POST', path: '/classes', tag: 'Class & Section Management', desc: 'Create class / grade' },
    { method: 'POST', path: '/classes/{classId}/sections', tag: 'Class & Section Management', desc: 'Add section to class' },
    { method: 'GET', path: '/streams', tag: 'Class & Section Management', desc: 'List academic streams (Science, Commerce, Arts)' },
    { method: 'GET', path: '/houses', tag: 'Class & Section Management', desc: 'List student houses / groups' },
    { method: 'GET', path: '/subjects', tag: 'Subject Management', desc: 'List curriculum subject catalog' },
    { method: 'POST', path: '/subjects', tag: 'Subject Management', desc: 'Create new subject' },
    { method: 'POST', path: '/classes/{classId}/assign-subject', tag: 'Subject Management', desc: 'Map subject to class curriculum' },
    { method: 'GET', path: '/staff', tag: 'Staff & Employee Records', desc: 'List faculty & employee records' },
    { method: 'POST', path: '/staff', tag: 'Staff & Employee Records', desc: 'Create staff record with optional portal login' },
    { method: 'POST', path: '/staff/{staffId}/assign-subject', tag: 'Staff & Employee Records', desc: 'Assign teacher to class, section and subject' },
    { method: 'GET', path: '/departments', tag: 'Staff & Employee Records', desc: 'List staff departments' },
    { method: 'GET', path: '/designations', tag: 'Staff & Employee Records', desc: 'List employee designations' },
    { method: 'GET', path: '/students', tag: 'Student Profile & Admission', desc: 'List enrolled students master records' },
    { method: 'POST', path: '/students', tag: 'Student Profile & Admission', desc: 'Unified 3-step admission form (Master, Guardian, Enrollment)' },
    { method: 'POST', path: '/students/{id}/enroll', tag: 'Student Profile & Admission', desc: 'Enroll student to session & section' },
    { method: 'GET', path: '/admission-inquiries', tag: 'Student Profile & Admission', desc: 'List inquiries CRM pipeline' },
    { method: 'POST', path: '/admission-inquiries', tag: 'Student Profile & Admission', desc: 'Log new prospective student inquiry' },
  ];

  const handleCopy = (path) => {
    navigator.clipboard.writeText(`http://localhost:8000/api/v1${path}`);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const filtered = endpoints.filter((ep) => {
    const matchesSearch =
      ep.path.toLowerCase().includes(search.toLowerCase()) ||
      ep.desc.toLowerCase().includes(search.toLowerCase());
    const matchesTag = selectedTag === 'All' || ep.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCode2 className="w-4 h-4" />
            <span>Interactive OpenAPI Documentation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Swagger UI & REST API Explorer</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Live interactive documentation with 44+ endpoints covering Phase 1 entities.
            Available via Swagger UI or text reference file.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="http://localhost:8000/api/documentation"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
          >
            <span>Open Swagger UI</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Docs Info Box */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">OpenAPI JSON</span>
          <a
            href="http://localhost:8000/docs/api-docs.json"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono text-indigo-300 hover:underline flex items-center gap-1 mt-1 truncate"
          >
            <span>/docs/api-docs.json</span>
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Base API URL</span>
          <span className="text-xs font-mono text-emerald-400 font-bold block mt-1">
            http://localhost:8000/api/v1
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Documentation File</span>
          <span className="text-xs font-mono text-amber-300 block mt-1">
            SCHOOL_ERP_API_DOCUMENTATION.txt
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search API endpoints..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tg) => (
            <button
              key={tg}
              onClick={() => setSelectedTag(tg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedTag === tg
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tg}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints Table / Cards */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50">
                <th className="p-4 font-semibold w-24">METHOD</th>
                <th className="p-4 font-semibold">ENDPOINT ROUTE</th>
                <th className="p-4 font-semibold">TAG / MODULE</th>
                <th className="p-4 font-semibold">DESCRIPTION</th>
                <th className="p-4 font-semibold text-right">COPY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filtered.map((ep, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : ep.method === 'POST'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : ep.method === 'PUT'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : ep.method === 'PATCH'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {ep.method}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-white">{ep.path}</td>
                  <td className="p-4 font-sans text-slate-400 text-xs">{ep.tag}</td>
                  <td className="p-4 font-sans text-slate-300 text-xs">{ep.desc}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleCopy(ep.path)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Copy full URL"
                    >
                      {copiedEndpoint === ep.path ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
