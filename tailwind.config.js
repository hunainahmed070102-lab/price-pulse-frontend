/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#8b5cf6',
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                },
                secondary: {
                    DEFAULT: '#06b6d4',
                    500: '#06b6d4',
                    600: '#0891b2',
                },
                fruit: {
                    DEFAULT: '#f97316',
                    50: '#fff7ed',
                    100: '#ffedd5',
                    500: '#f97316',
                    600: '#ea580c',
                },
                vegetable: {
                    DEFAULT: '#10b981',
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    500: '#10b981',
                    600: '#059669',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'gradient-purple': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                'gradient-orange': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                'purple': '0 10px 40px rgba(139, 92, 246, 0.3)',
                'orange': '0 10px 40px rgba(249, 115, 22, 0.3)',
                'green': '0 10px 40px rgba(16, 185, 129, 0.3)',
            },
        },
    },
    plugins: [],
}