import React from 'react'
import { Link } from 'react-router-dom'
import { useUIStore } from '../../store/useStore'

export type BreadcrumbItem = string | { label: string; path?: string }

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
}

const getPathForLabel = (label: string): string => {
  const normalized = label.trim().toLowerCase()
  switch (normalized) {
    case 'dashboard':
    case 'overview & analytics':
    case 'overview and analytics':
    case 'home':
    case 'system setup':
    case 'all in one erp modules':
      return '/overview-and-analytics'
    case 'institute management':
    case 'institute setup':
    case 'account details':
    case 'user management':
      return '/institute-management'
    case 'institute details':
      return '/institute-details'
    case 'my sub institute':
      return '/my-sub-institute'
    case 'master setup':
      return '/master-setup'
    case 'years management':
    case 'academic year':
    case 'academic years':
      return '/years-management'
    case 'department management':
      return '/department-management'
    case 'standards':
      return '/standards'
    case 'subject group type':
      return '/subject-group-type'
    case 'classrooms':
    case 'classroom':
      return '/classrooms'
    case 'group classrooms':
    case 'group class room':
      return '/group-classrooms'
    case 'master subject group':
      return '/master-subject-group'
    case 'subject labs':
      return '/subject-labs'
    case 'institute admin':
      return '/institute-admin'
    case 'students':
      return '/students'
    case 'faculties':
      return '/faculties'
    default:
      return '#'
  }
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const { setActivePath } = useUIStore()

  const handleCrumbClick = (path: string) => {
    if (path && path !== '#') {
      const clean = path.replace(/^\/+/, '')
      setActivePath(clean)
    }
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-on-surface-variant text-[14px]">
      {/* Home / Dashboard link */}
      <Link
        to="/overview-and-analytics"
        onClick={() => handleCrumbClick('overview-and-analytics')}
        className="text-on-surface-variant hover:text-primary transition-colors flex items-center p-1 rounded-md hover:bg-surface-container"
        title="Go to Dashboard Overview"
      >
        <i className="fa-solid fa-house text-[13px]"></i>
      </Link>

      {items.map((rawItem, i) => {
        const isLast = i === items.length - 1
        const label = typeof rawItem === 'string' ? rawItem : rawItem.label
        const explicitPath = typeof rawItem === 'object' ? rawItem.path : undefined
        const resolvedPath = explicitPath || getPathForLabel(label)

        return (
          <span key={i} className="flex items-center gap-2">
            <i className="fa-solid fa-chevron-right text-[10px] text-on-surface-variant/50"></i>
            {isLast ? (
              <span className="text-on-surface font-semibold select-none cursor-default">
                {label}
              </span>
            ) : resolvedPath && resolvedPath !== '#' ? (
              <Link
                to={resolvedPath}
                onClick={() => handleCrumbClick(resolvedPath)}
                className="text-on-surface-variant hover:text-primary transition-colors font-medium hover:underline"
              >
                {label}
              </Link>
            ) : (
              <span className="text-on-surface-variant font-medium">
                {label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
