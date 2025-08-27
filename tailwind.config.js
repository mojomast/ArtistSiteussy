/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a'
  			},
  			accent: '#00FFC6',
  			neon: '#00FFC6',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			theme: {
  				primary: 'var(--theme-primary)',
  				secondary: 'var(--theme-secondary)',
  				accent: 'var(--theme-accent)',
  				background: 'var(--theme-background)',
  				text: 'var(--theme-text)',
  				border: 'var(--theme-border)'
  			}
  		},
  		fontFamily: {
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			heading: [
  				'Playfair Display',
  				'serif'
  			],
  			sans: [
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'Playfair Display',
  				'serif'
  			]
  		}
  	}
  },
  plugins: [],
}