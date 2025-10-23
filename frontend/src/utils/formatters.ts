import { format, parseISO } from 'date-fns';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM yyyy');
  } catch {
    return dateString;
  }
}

export function formatDelta(value: number, showSign: boolean = true): string {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}`;
}

export function getMarginColor(margin: number, target: number): string {
  if (margin >= target) return 'text-green-600';
  if (margin >= target - 3) return 'text-yellow-600';
  return 'text-kaptio-action';
}

export function getMarginBgColor(margin: number, target: number): string {
  if (margin >= target) return 'bg-green-100';
  if (margin >= target - 3) return 'bg-yellow-100';
  return 'bg-red-100';
}

export function getDeltaColor(delta: number): string {
  if (delta > 0) return 'text-green-600';
  if (delta < 0) return 'text-kaptio-action';
  return 'text-kaptio-grey-300';
}

export function getDeltaBgColor(delta: number): string {
  if (delta > 0) return 'bg-green-100';
  if (delta < 0) return 'bg-red-100';
  return 'bg-kaptio-grey-100';
}

