import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDMobile(text: string) {
  const cleaned = text.replace(/\D/g, '');
  let prefix = '';
  let local = cleaned;

  if (cleaned.startsWith('880')) {
    prefix = '+880 ';
    local = cleaned.slice(3);
  } else if (cleaned.startsWith('0')) {
    prefix = '0';
    local = cleaned.slice(1);
  }

  local = local.slice(0, 10);

  if (local.length > 4) {
    return `${prefix}${local.slice(0, 4)}-${local.slice(4)}`;
  }
  return prefix + local;
}
