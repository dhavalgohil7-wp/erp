import React from 'react';
import { getFontAwesomeClass } from './iconMap';

export interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Universal Icon component supporting both Font Awesome classes and Material Symbol keywords.
 */
export default function Icon({ name, className = '', style }: IconProps) {
  const faClass = getFontAwesomeClass(name);
  return <i className={`${faClass} ${className}`} style={style} aria-hidden="true" />;
}
