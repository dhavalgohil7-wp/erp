import { useInstituteStore } from '../../store/useInstituteStore'

export default function ToastContainer() {
  const { toasts, removeToast } = useInstituteStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success'
        const isError = toast.type === 'error'
        const isWarning = toast.type === 'warning'

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md animate-slide-in
              ${isSuccess ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40' : ''}
              ${isError ? 'bg-red-950/90 text-red-100 border-red-500/40' : ''}
              ${isWarning ? 'bg-amber-950/90 text-amber-100 border-amber-500/40' : ''}
              ${toast.type === 'info' ? 'bg-slate-900/90 text-slate-100 border-slate-700' : ''}
            `}
          >
            <div className="text-[17px] mt-0.5 flex-shrink-0">
              {isSuccess && <i className="fa-solid fa-circle-check text-emerald-400"></i>}
              {isError && <i className="fa-solid fa-circle-exclamation text-red-400"></i>}
              {isWarning && <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>}
              {toast.type === 'info' && <i className="fa-solid fa-circle-info text-blue-400"></i>}
            </div>

            <div className="flex-1 text-sm">
              <div className="font-semibold">{toast.title}</div>
              {toast.description && (
                <div className="text-xs opacity-85 mt-0.5 leading-snug">{toast.description}</div>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-60 hover:opacity-100 transition-opacity p-0.5"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )
      })}
    </div>
  )
}
