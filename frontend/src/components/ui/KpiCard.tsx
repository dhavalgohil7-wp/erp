// KpiCard.tsx — Reusable metric card with trend indicator
import React, { ReactNode } from 'react'
import Icon from '../common/Icon'

export interface KpiCardProps {
  icon: string
  iconBg?: string
  iconColor?: string
  title?: string
  subtitle?: string
  value?: string | number
  unit?: string
  trend?: string
  trendLabel?: string
  trendPositive?: boolean
  badge?: string
  badgeBg?: string
  badgeText?: string
  footer?: ReactNode
}

export default function KpiCard({
  icon,
  iconBg = '',
  iconColor = '',
  title = '',
  subtitle,
  value,
  unit,
  trend,
  trendLabel,
  trendPositive,
  badge,
  badgeBg = '',
  badgeText = '',
  footer,
}: KpiCardProps) {
  return (
    <div className="card p-space-md flex flex-col gap-3 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon name={icon} className={`text-[18px] ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-headline-sm text-on-surface">{title}</h3>
            {subtitle && <p className="text-body-sm text-on-surface-variant">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <span className={`badge-status ${badgeBg} ${badgeText}`}>{badge}</span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span className="stat-value">{value}</span>
        {unit && <span className="text-body-sm text-secondary font-medium">{unit}</span>}
      </div>

      {/* Trend */}
      {(trend || trendLabel) && (
        <div className="flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold flex items-center ${trendPositive ? 'text-tertiary' : 'text-error'}`}>
              <i className={`fa-solid text-[12px] mr-1 ${trendPositive ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
              {trend}
            </span>
          )}
          {trendLabel && <span className="text-secondary">{trendLabel}</span>}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="pt-2 border-t border-surface-container flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  )
}
