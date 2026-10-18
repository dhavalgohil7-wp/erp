import PageWrapper from '../components/ui/PageWrapper'

export default function SettingsPage() {
  return (
    <PageWrapper breadcrumb={['Dashboard', 'System Settings']}>
      <div className="flex flex-col gap-space-lg">
        <div>
          <h1 className="text-headline-md text-on-surface">System Settings</h1>
          <p className="text-body-md text-on-surface-variant">Global configurations, module toggles and integrations</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-space-md">
          {/* General Settings */}
          <div className="xl:col-span-2 flex flex-col gap-space-md">
            <div className="card p-space-md animate-fade-in">
              <h2 className="text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <i className="fa-solid fa-globe text-[18px] text-primary"></i>
                General Configuration
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Currency', hint: 'Used across fee & financial modules', value: 'INR (₹)' },
                  { label: 'Timezone', hint: 'Server & display timezone', value: 'Asia/Kolkata (IST)' },
                  { label: 'Date Format', hint: 'DD/MM/YYYY or MM/DD/YYYY', value: 'DD/MM/YYYY' },
                  { label: 'Language', hint: 'Primary UI language', value: 'English (en-IN)' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-surface-container last:border-0">
                    <div>
                      <div className="text-body-sm font-semibold text-on-surface">{s.label}</div>
                      <div className="text-body-sm text-on-surface-variant">{s.hint}</div>
                    </div>
                    <select className="input-field w-auto text-xs">
                      <option>{s.value}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-space-md animate-fade-in">
              <h2 className="text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <i className="fa-solid fa-toggle-on text-[18px] text-primary"></i>
                Module Toggles
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Fee Management',    enabled: true },
                  { label: 'Biometric Attendance', enabled: true },
                  { label: 'Library Module',    enabled: true },
                  { label: 'Hostel Management', enabled: false },
                  { label: 'Canteen POS',       enabled: false },
                  { label: 'Transportation',    enabled: true },
                ].map(m => (
                  <div key={m.label} className="flex items-center justify-between py-2 border-b border-surface-container last:border-0">
                    <span className="text-body-sm text-on-surface">{m.label}</span>
                    <button className={`relative w-10 h-5 rounded-full transition-colors ${m.enabled ? 'bg-primary' : 'bg-outline'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${m.enabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="flex flex-col gap-space-md">
            <div className="card p-space-md animate-fade-in">
              <h2 className="text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <i className="fa-solid fa-comment-sms text-[18px] text-primary"></i>
                SMS Gateway
              </h2>
              <div className="flex flex-col gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Provider</label>
                  <select className="input-field"><option>Twilio</option><option>MSG91</option><option>TextLocal</option></select></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">API Key</label>
                  <input className="input-field" type="password" placeholder="••••••••••••" /></div>
                <button className="btn-secondary justify-center">Test Connection</button>
              </div>
            </div>

            <div className="card p-space-md animate-fade-in">
              <h2 className="text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <i className="fa-solid fa-credit-card text-[18px] text-primary"></i>
                Payment Gateway
              </h2>
              <div className="flex flex-col gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Gateway</label>
                  <select className="input-field"><option>Razorpay</option><option>PayU</option><option>Stripe</option></select></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Key ID</label>
                  <input className="input-field" type="password" placeholder="••••••••••••" /></div>
                <button className="btn-secondary justify-center">Save Gateway</button>
              </div>
            </div>

            <div className="card p-space-md animate-fade-in">
              <h2 className="text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <i className="fa-solid fa-palette text-[18px] text-primary"></i>
                Branding
              </h2>
              <div className="flex flex-col gap-3">
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Institute Logo</label>
                  <button className="btn-secondary w-full justify-center">
                    <i className="fa-solid fa-upload text-[15px] mr-1.5"></i> Upload Logo
                  </button></div>
                <div><label className="text-label-md text-on-surface-variant block mb-1.5">Primary Color</label>
                  <input className="input-field" type="color" defaultValue="#3525cd" /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn-ghost">Reset to Defaults</button>
          <button className="btn-primary">
            <i className="fa-solid fa-floppy-disk text-[15px]"></i>
            Save All Settings
          </button>
        </div>
      </div>
    </PageWrapper>
  )
}
