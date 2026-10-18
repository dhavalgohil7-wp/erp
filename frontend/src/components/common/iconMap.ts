/**
 * Mapping between legacy Material Symbols names and Font Awesome 6 Free icon classes.
 */
export const ICON_MAP: Record<string, string> = {
  // Navigation & Academics
  dashboard: 'fa-solid fa-gauge-high',
  account_balance: 'fa-solid fa-building-columns',
  calendar_month: 'fa-solid fa-calendar-days',
  quiz: 'fa-solid fa-list-check',
  analytics: 'fa-solid fa-chart-line',
  assignment: 'fa-solid fa-clipboard-list',
  schedule: 'fa-solid fa-clock',
  how_to_reg: 'fa-solid fa-user-check',
  edit_note: 'fa-solid fa-file-pen',
  menu_book: 'fa-solid fa-book-open',
  cloud_upload: 'fa-solid fa-cloud-arrow-up',
  verified: 'fa-solid fa-certificate',
  sms: 'fa-solid fa-comment-sms',
  cake: 'fa-solid fa-cake-candles',

  // ERP Modules
  person_add: 'fa-solid fa-user-plus',
  payments: 'fa-solid fa-credit-card',
  badge: 'fa-solid fa-id-badge',
  fingerprint: 'fa-solid fa-fingerprint',
  directions_bus: 'fa-solid fa-bus',
  local_library: 'fa-solid fa-book',
  hotel: 'fa-solid fa-hotel',
  account_balance_wallet: 'fa-solid fa-wallet',
  restaurant: 'fa-solid fa-utensils',
  inventory_2: 'fa-solid fa-boxes-stacked',
  support_agent: 'fa-solid fa-headset',
  receipt_long: 'fa-solid fa-receipt',

  // Layout & Global Controls
  school: 'fa-solid fa-graduation-cap',
  corporate_fare: 'fa-solid fa-landmark',
  menu: 'fa-solid fa-bars',
  menu_open: 'fa-solid fa-bars-staggered',
  search: 'fa-solid fa-magnifying-glass',
  unfold_more: 'fa-solid fa-up-down',
  expand_more: 'fa-solid fa-chevron-down',
  expand_less: 'fa-solid fa-chevron-up',
  arrow_drop_down: 'fa-solid fa-caret-down',
  add: 'fa-solid fa-plus',
  chat: 'fa-solid fa-comments',
  notifications: 'fa-solid fa-bell',
  dark_mode: 'fa-solid fa-moon',
  light_mode: 'fa-solid fa-sun',
  settings: 'fa-solid fa-gear',

  // Actions & CRUD
  close: 'fa-solid fa-xmark',
  edit: 'fa-solid fa-pen-to-square',
  delete: 'fa-solid fa-trash-can',
  visibility: 'fa-solid fa-eye',
  save: 'fa-solid fa-floppy-disk',
  shield: 'fa-solid fa-shield-halved',
  tune: 'fa-solid fa-sliders',
  description: 'fa-solid fa-file-lines',
  arrow_back: 'fa-solid fa-arrow-left',
  arrow_forward: 'fa-solid fa-arrow-right',
  arrow_upward: 'fa-solid fa-arrow-up',
  check_circle: 'fa-solid fa-circle-check',
  language: 'fa-solid fa-globe',
  toggle_on: 'fa-solid fa-toggle-on',
  palette: 'fa-solid fa-palette',
  upload: 'fa-solid fa-upload',
  upload_file: 'fa-solid fa-file-arrow-up',
  download: 'fa-solid fa-download',
  groups: 'fa-solid fa-users',
  refresh: 'fa-solid fa-rotate-right',
  filter_list: 'fa-solid fa-filter',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  error: 'fa-solid fa-circle-exclamation',
  lock: 'fa-solid fa-lock',
};

/**
 * Returns the resolved Font Awesome class name for any given icon name or class.
 */
export function getFontAwesomeClass(name: string): string {
  if (!name) return 'fa-solid fa-circle-question';
  if (name.startsWith('fa-') || name.startsWith('fas ') || name.startsWith('far ')) {
    return name;
  }
  return ICON_MAP[name] || `fa-solid fa-${name}`;
}
