# Jin Chen - Portfolio

A modern, responsive portfolio website built with **React 19**, **Tailwind CSS**, and **Vite**. Features a photography gallery, admin dashboard, and Apple-inspired design system.

![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red)

## Features

- **Responsive Design** - Mobile-first, works on all devices
- **Photography Gallery** - Masonry layout with infinite scroll and lightbox viewer
- **Admin Dashboard** - Protected routes for content management
- **Apple Design System** - Clean typography, smooth animations, minimalist UI
- **PWA Ready** - Installable with offline support
- **SEO Optimized** - Meta tags, Open Graph, sitemap

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 19, React Router 7 |
| **Styling** | Tailwind CSS 3.4, HeadlessUI |
| **State** | Redux Toolkit, React Redux |
| **Build** | Vite 7, PostCSS, Autoprefixer |
| **Auth** | Firebase Authentication |
| **Icons** | React Icons (Heroicons) |
| **Utilities** | clsx, nanoid, axios, sonner |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Chen4jin/frontend.git
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Backend API
VITE_BACKEND=https://your-api-url.com/
VITE_API_VERSION=v1/
```

### Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint
```

The app will be available at `http://localhost:3000`

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # Admin dashboard components
│   ├── ui/             # Reusable UI components (Button, Input, etc.)
│   ├── navbar.jsx      # Navigation bar
│   ├── sidebar.jsx     # Dashboard sidebar
│   └── upload.jsx      # Photo upload component
├── config/             # App configuration
├── constants/          # Route & navigation constants
├── hooks/              # Custom React hooks
├── lib/                # Third-party configs (Firebase)
├── pages/              # Page components
├── redux/              # Redux slices & store
├── services/           # API & auth services
└── index.css           # Global styles & Tailwind

public/
├── favicon.svg         # Browser icon
├── og-image.svg        # Social sharing image
├── manifest.json       # PWA manifest
├── robots.txt          # Search engine rules
└── sitemap.xml         # SEO sitemap
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Design System

The app uses a custom Apple-inspired design system defined in `tailwind.config.js`:

- **Colors**: Neutral grays with blue accents
- **Typography**: SF Pro Display-inspired font stack
- **Spacing**: Consistent 4px grid
- **Animations**: Smooth fade-in and scale transitions

### CSS Classes

Reusable component classes in `index.css`:

```css
/* Typography */
.text-hero-xl, .text-hero-lg, .text-body-lg

/* Buttons */
.btn-primary, .btn-secondary, .btn-ghost

/* Navigation */
.nav-link, .sidebar-link, .mobile-nav-link

/* Components */
.card, .input-field, .alert-error
```

## Deployment

### Cloudflare Pages (CI/CD)

The project uses GitHub Actions for automatic deployment to Cloudflare Pages.

#### Setup Steps:

1. **Create Cloudflare Pages Project**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
   - Create a new project named `jin-chen-portfolio`

2. **Get Cloudflare Credentials**
   - Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Create token with `Cloudflare Pages: Edit` permission
   - Note your Account ID from the dashboard URL

3. **Add GitHub Secrets**
   
   Go to your repo → Settings → Secrets → Actions, add:

   | Secret | Description |
   |--------|-------------|
   | `CLOUDFLARE_API_TOKEN` | Cloudflare API token |
   | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
   | `VITE_FIREBASE_API_KEY` | Firebase API key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
   | `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
   | `VITE_BACKEND` | Backend API URL |
   | `VITE_API_VERSION` | API version (e.g., `v1/`) |

4. **Push to main**
   ```bash
   git push origin main
   ```
   
   The workflow will automatically build and deploy.

#### Workflow Features:
- Runs on push to `main` branch
- Runs linter before build
- Injects environment variables at build time
- Deploys to Cloudflare Pages

### Creating a Release

To create a new release with automatic deployment:

```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0
```

This will:
1. Create a GitHub Release with auto-generated changelog
2. Deploy to production on Cloudflare Pages

**Tag format:**
- `v1.0.0` - Production release
- `v1.0.0-beta.1` - Pre-release (marked as pre-release on GitHub)

### Manual Deployment

```bash
npm run build
npx wrangler pages deploy dist --project-name=jin-chen-portfolio
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private - All rights reserved.

## Author

**Jin Chen**
- Website: [chenjq.com](https://chenjq.com)
- GitHub: [@chenjq](https://github.com/chenjq)
- LinkedIn: [/in/chenjq](https://linkedin.com/in/chenjq)
