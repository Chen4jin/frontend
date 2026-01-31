/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            // Apple-inspired Font Families
            fontFamily: {
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'SF Pro Display',
                    'SF Pro Text',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif',
                ],
                display: [
                    'SF Pro Display',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
                mono: [
                    'SF Mono',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    'Liberation Mono',
                    'Courier New',
                    'monospace',
                ],
            },
            // Apple Color Palette
            colors: {
                apple: {
                    bg: '#fbfbfd',
                    'bg-secondary': '#f5f5f7',
                    black: '#1d1d1f',
                    gray: {
                        DEFAULT: '#86868b',
                        light: '#d2d2d7',
                        dark: '#6e6e73',
                    },
                    blue: '#0066cc',
                    'blue-hover': '#0077ed',
                },
            },
            // Apple-style Letter Spacing
            letterSpacing: {
                'apple-tight': '-0.03em',
                'apple-normal': '-0.02em',
                'apple-wide': '0.02em',
            },
            // Apple-style Line Heights
            lineHeight: {
                'apple-tight': '1.05',
                'apple-snug': '1.1',
                'apple-normal': '1.2',
                'apple-relaxed': '1.5',
            },
            // Font Sizes with Apple-style scaling
            fontSize: {
                'display-2xl': ['96px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
                'display-xl': ['80px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
                'display-lg': ['64px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
                'display-md': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'display-sm': ['40px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'headline': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
                'title': ['24px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'body-lg': ['21px', { lineHeight: '1.5', letterSpacing: '0' }],
                'body': ['17px', { lineHeight: '1.5', letterSpacing: '0' }],
                'body-sm': ['14px', { lineHeight: '1.4', letterSpacing: '0' }],
                'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0' }],
            },
        },
    },
    plugins: [],
};
