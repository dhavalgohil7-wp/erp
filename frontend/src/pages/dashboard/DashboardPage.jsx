import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import api from '../../api/client';
import {
  Users,
  GraduationCap,
  Building2,
  Calendar,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Shield,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/kpi');
      setData(res.data.data);
    } catch (err) {
      console.error('Error fetching dashboard KPIs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = data?.kpis || {};
  const depts = data?.department_distribution || [];
  const recentStudents = data?.recent_students || [];
  const recentInquiries = data?.recent_inquiries || [];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Session Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-indigo-950/30 to-slate-900 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Campus Academic ERP</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Apex International Academy Group
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Phase 1 Foundation: Academic structures, Spatie RBAC, student master enrollments, and multi-campus configurations active.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-right">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Current Academic Session</div>
            <div className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{kpis.active_academic_year?.name || '2025-2026'} (Active)</span>
            </div>
          </div>
          <NavLink
            to="/students"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
          >
            <span>+ New Admission</span>
          </NavLink>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Active Students', value: kpis.total_students ?? 1, icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Faculty & Staff', value: kpis.total_staff ?? 2, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Classes / Grades', value: kpis.total_classes ?? 15, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Active Campuses', value: kpis.total_branches ?? 2, icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'New Inquiries', value: kpis.new_inquiries ?? 2, icon: Clock, color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'System Users', value: kpis.total_users ?? 4, icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-4 rounded-2xl flex flex-col justify-between transition">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-3 tracking-tight">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Department Stats & Recent Admissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Student Admissions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Recent Student Admissions</h2>
              <p className="text-xs text-slate-400">Master records enrolled for the current academic session</p>
            </div>
            <NavLink to="/students" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">ADM NO</th>
                  <th className="pb-3 font-semibold">STUDENT NAME</th>
                  <th className="pb-3 font-semibold">GENDER</th>
                  <th className="pb-3 font-semibold">DATE</th>
                  <th className="pb-3 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 font-mono text-indigo-300">{st.admission_number}</td>
                    <td className="py-3 font-medium text-white">{st.name}</td>
                    <td className="py-3 capitalize">{st.gender || 'N/A'}</td>
                    <td className="py-3 text-slate-400">{st.admission_date}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] uppercase border border-emerald-500/20">
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Department Distribution */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white">Staff by Department</h2>
              <NavLink to="/staff" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                Manage
              </NavLink>
            </div>
            <div className="space-y-3">
              {depts.map((d, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">{d.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-600/20 text-indigo-300 text-xs font-bold font-mono">
                    {d.staff_count} staff
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <NavLink
              to="/api-docs"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <FileCode2 className="w-4 h-4 text-indigo-400" />
              <span>Explore Swagger API Specs</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Admissions Inquiries CRM Pipeline Preview */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Prospective Student Inquiries</h2>
            <p className="text-xs text-slate-400">Incoming admissions pipeline ready for follow-up and conversion</p>
          </div>
          <NavLink to="/inquiries" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            <span>Inquiries Pipeline</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentInquiries.map((inq) => (
            <div key={inq.id} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/30 transition">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-indigo-400">{inq.inquiry_number}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-semibold uppercase border border-amber-500/20">
                  {inq.status}
                </span>
              </div>
              <p className="font-bold text-white text-sm">{inq.student_name}</p>
              <p className="text-xs text-slate-400 mt-0.5">Guardian: {inq.guardian_name || 'N/A'}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                <span>{inq.phone}</span>
                <span>{inq.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
