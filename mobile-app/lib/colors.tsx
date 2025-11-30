import { useColorScheme } from 'nativewind';

export const cssVars = {
  light: {
    background: '#ffffff', // 0 0% 100%
    foreground: '#0a0a0a', // 0 0% 3.9%
    card: '#ffffff',
    cardForeground: '#0a0a0a',
    popover: '#ffffff',
    popoverForeground: '#0a0a0a',

    // primary → BLUE (#0094d9)
    primary: '#0094d9',
    primaryForeground: '#fafafa',

    // secondary → stays neutral
    secondary: '#f5f5f5',
    secondaryForeground: '#171717',

    muted: '#f5f5f5',
    mutedForeground: '#737373',

    // accent → BLUE as well for consistency
    accent: '#0094d9',
    accentForeground: '#fafafa',

    // destructive
    destructive: '#d9534f',

    border: '#e3e3e3',
    input: '#e3e3e3',

    ring: '#0094d9', // ring should follow primary color

    radius: '0.5rem',

    // charts (unchanged)
    chart1: '#e36d3f',
    chart2: '#2bbf9b',
    chart3: '#19708a',
    chart4: '#f3da6f',
    chart5: '#f58f27',

    sidebarBackground: '#fafafa',
    sidebarForeground: '#3f3f46',
    sidebarPrimary: '#0f172a', // slightly tweaked for consistency
    sidebarPrimaryForeground: '#fafafa',

    // accent for sidebar = BLUE-ish tint instead of gray
    sidebarAccent: '#e8f4fb', // subtle blue-tinted light background
    sidebarAccentForeground: '#0f172a',

    sidebarBorder: '#e5e7eb',
    sidebarRing: '#3b82f6', // blue
  },
  dark: {
    background: '#0a0a0a', // 0 0% 3.9%
    foreground: '#fafafa', // 0 0% 98%

    card: '#0a0a0a',
    cardForeground: '#fafafa',

    popover: '#0a0a0a',
    popoverForeground: '#fafafa',

    primary: '#0094d9', // 198 100% 41%
    primaryForeground: '#171717',

    secondary: '#262626', // 0 0% 14.9%
    secondaryForeground: '#fafafa',

    muted: '#262626',
    mutedForeground: '#a3a3a3', // 0 0% 63.9%

    accent: '#262626',
    accentForeground: '#fafafa',

    destructive: '#7a1f1f', // 0 62.8% 30.6%
    destructiveForeground: '#fafafa',

    border: '#262626',
    input: '#f5f5f5', // (you have a typo in CSS)

    ring: '#d4d4d4', // 0 0% 83.1%

    radius: '0.5rem',

    chart1: '#3a6ce6', // 220 70% 50%
    chart2: '#1c7a5c', // 160 60% 45%
    chart3: '#d6852d', // 30 80% 55%
    chart4: '#a34bd9', // 280 65% 60%
    chart5: '#d92669', // 340 75% 55%

    sidebarBackground: '#171717',
    sidebarForeground: '#f3f4f6',
    sidebarPrimary: '#1e40af',
    sidebarPrimaryForeground: '#ffffff',
    sidebarAccent: '#1f1f23',
    sidebarAccentForeground: '#f3f4f6',
    sidebarBorder: '#1f1f23',
    sidebarRing: '#3b82f6',
  },
};

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const mode = colorScheme === 'dark' ? 'dark' : 'light';
  return {
    colors: cssVars[mode],
    isDark: mode === 'dark',
  };
}

export const isDarkMode = (scheme: 'light' | 'dark') => scheme === 'dark';
