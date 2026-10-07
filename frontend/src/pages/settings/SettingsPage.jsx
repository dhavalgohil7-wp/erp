import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Sliders, Save, CheckCircle2, Globe, Shield, CreditCard, Mail, Palette } from 'lucide-react';

export const SettingsPage = () => {
  const [settings, setSettings] = useState({
    app_name: 'Apex Cloud ERP',
    institute_tagline: 'Empowering Future Leaders with Modern Education',
    currency: 'USD',
    currency_symbol: '$',
    timezone: 'America/New_York',
    date_format: 'YYYY-MM-DD',
    language: 'en',
    enable_admissions: true,
    enable_staff_portal: true,
    enable_parent_portal: true,
    enable_sms_notifications: false,
    enable_2fa_policy: false,
    primary_color: '#4F46E5',
    accent_color: '#06B6D4',
    theme_mode: 'dark',
    stripe_enabled: true,
    paypal_enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      if (res.data.data?.map) {
        const map = res.data.data.map;
        setSettings((prev) => ({
          ...prev,
          app_name: map.app_name || prev.app_name,
          institute_tagline: map.institute_tagline || prev.institute_tagline,
          currency: map.currency || prev.currency,
          currency_symbol: map.currency_symbol || prev.currency_symbol,
          timezone: map.timezone || prev.timezone,
          date_format: map.date_format || prev.date_format,
          enable_admissions: map.enable_admissions === 'true' || map.enable_admissions === true,
          enable_staff_portal: map.enable_staff_portal === 'true' || map.enable_staff_portal === true,
          enable_sms_notifications: map.enable_sms_notifications === 'true' || map.enable_sms_notifications === true,
          enable_2fa_policy: map.enable_2fa_policy === 'true' || map.enable_2fa_policy === true,
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/settings/batch', {
        settings: settings,
        group: 'general',
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">System & Branch Settings</h1>
          <p className="text-xs text-slate-400">Global configurations, localization preferences, module switches, and API gateway credentials</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>System configuration updated successfully!</span>
        </div>
      )}

      {/* Settings Sections */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* General & Branding */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Palette className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">General & Institutional Branding</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">System Application Name</label>
              <input
                type="text"
                value={settings.app_name}
                onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Motto / Tagline</label>
              <input
                type="text"
                value={settings.institute_tagline}
                onChange={(e) => setSettings({ ...settings, institute_tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Localization & Formats</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Currency Code</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol}
                onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Default Timezone</label>
              <input
                type="text"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Module Feature Toggles */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Module Toggles & Policies</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'enable_admissions', label: 'Admissions Module', desc: 'Allow online admission inquiries and master enrollments' },
              { key: 'enable_staff_portal', label: 'Staff & Faculty Self-Service Portal', desc: 'Permit faculty logins and subject gradebook access' },
              { key: 'enable_sms_notifications', label: 'SMS Notifications Gateway', desc: 'Trigger automated transactional SMS alerts for admissions' },
              { key: 'enable_2fa_policy', label: 'Mandatory 2FA Policy', desc: 'Enforce two-factor authentication for administrative users' },
            ].map((mod) => (
              <label
                key={mod.key}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="font-semibold text-xs text-white block">{mod.label}</span>
                  <span className="text-[11px] text-slate-400">{mod.desc}</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings[mod.key] || false}
                  onChange={(e) => setSettings({ ...settings, [mod.key]: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0 w-4 h-4"
                />
              </label>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
