# Spotlight Nuxt - Mowry Agency Website

[![Deployed Project](https://img.shields.io/badge/Live%20Site-mowryagency.com-blue?style=for-the-badge)](https://mowryagency.com)

A modern digital agency website built with Nuxt 3, featuring pixel-perfect migration from the [Spotlight Template](https://spotlight.tailwindui.com/) by Tailwind UI. This project demonstrates advanced Nuxt.js capabilities with server-side rendering, responsive design, and optimal performance.

## 🚀 Live Demo

**Production Site**: [https://mowryagency.com](https://mowryagency.com)

## ✨ Features

- **Server-Side Rendering (SSR)** for optimal SEO performance
- **Responsive Design** with mobile-first approach
- **Dark/Light Theme** switching with smooth transitions
- **Optimized Images** using Nuxt Image with WebP format
- **Accessibility First** with ARIA labels and keyboard navigation
- **Performance Optimized** with lazy loading and code splitting
- **Quote Form Integration** with Supabase backend
- **Email Notifications** via Resend API
- **Professional Email** setup with custom domain

## 🛠 Tech Stack

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Headless UI Vue for accessible interactions
- **Database**: Supabase for quote form data storage
- **Email**: Resend API for transactional emails
- **Theme Management**: Nuxt Color Mode for theme switching
- **Image Optimization**: Nuxt Image with automatic WebP conversion
- **Deployment**: Netlify with custom domain configuration
- **DNS**: Porkbun with MX record configuration

## 📁 Project Structure

```
spotlight-nuxt/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Header.vue       # Main navigation header
│   │   ├── Avatar.vue       # User avatar component
│   │   ├── ThemeToggle.vue  # Dark/light mode toggle
│   │   ├── Container.vue    # Layout wrapper
│   │   └── Navigation/      # Navigation components
│   ├── layouts/
│   │   └── default.vue      # Main layout template
│   ├── pages/               # File-based routing
│   │   ├── index.vue        # Homepage
│   │   ├── about.vue        # About page
│   │   ├── services.vue     # Services page
│   │   ├── portfolio.vue    # Portfolio showcase
│   │   ├── quote.vue        # Quote request form
│   │   └── contact.vue      # Contact page
│   ├── composables/         # Vue composables
│   │   ├── useQuoteForm.ts  # Quote form logic
│   │   └── useSupabase.ts   # Database operations
│   └── assets/
│       ├── css/             # Global styles
│       └── images/          # Image assets
├── server/
│   └── api/                 # Server API routes
│       ├── quote.post.ts    # Quote form submission
│       └── leads.get.ts     # Lead management
├── emails/                  # Email templates
│   ├── AgencyNotification.vue
│   └── CustomerConfirmation.vue
├── supabase/               # Database configuration
│   └── migrations/         # Database schema
├── public/                 # Static assets
├── agency_assets/          # Agency-specific images
└── nuxt.config.ts         # Nuxt configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Supabase account (for quote form functionality)
- Resend account (for email notifications)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd spotlight-nuxt
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend API Configuration
RESEND_API_KEY=your_resend_api_key

# Site Configuration
NUXT_PUBLIC_SITE_URL=https://mowryagency.com
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run Vitest tests
npm run test:e2e     # Run Playwright e2e tests
```

## 🎨 Design System

### Color Palette

The site uses a sophisticated color system supporting both light and dark themes:

- **Primary**: Zinc color scale for neutral UI elements
- **Accent**: Custom orange/amber for CTAs and highlights
- **Background**: Pure white/black with zinc variations
- **Text**: High contrast ratios for accessibility

### Typography

- **Font Family**: Inter variable font for optimal readability
- **Scale**: Tailwind's typography scale with custom line heights
- **Hierarchy**: Clear visual hierarchy with consistent spacing

### Responsive Breakpoints

- **Mobile**: `< 768px` - Single column, mobile navigation
- **Tablet**: `768px - 1024px` - Hybrid layout, desktop navigation
- **Desktop**: `> 1024px` - Full multi-column layout

## 🔧 Configuration

### Nuxt Configuration

Key configuration highlights in `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  ssr: true,                    // Server-side rendering
  css: ['~/assets/css/main.css'], // Global styles
  modules: [
    '@nuxt/image',              // Image optimization
    '@nuxtjs/color-mode',       // Theme switching
    '@nuxtjs/supabase',         # Database integration
    '@headlessui/vue'           // UI components
  ],
  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL
    }
  }
})
```

### Database Schema

The project uses Supabase with the following main tables:

- **quote_requests**: Store customer quote submissions
- **services**: Available agency services
- **lead_status**: Track lead progression

## 📧 Email System

### Setup

The project uses Resend for transactional emails:

1. **Customer Confirmation**: Sent to customers after quote submission
2. **Agency Notification**: Internal notification for new leads

### Email Templates

Vue-based email templates located in `/emails/`:

- Clean, responsive design
- Brand-consistent styling
- Dynamic content insertion

## 🚀 Deployment

### Netlify Deployment

The site is configured for automatic deployment on Netlify:

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.output/public`
3. **Node Version**: 18+
4. **Custom Domain**: mowryagency.com

### Environment Variables (Production)

Set these in your Netlify dashboard:

```
SUPABASE_URL=your_production_supabase_url
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
RESEND_API_KEY=your_resend_api_key
NUXT_PUBLIC_SITE_URL=https://mowryagency.com
```

### DNS Configuration

MX records configured for email functionality:

```
mowryagency.com  MX  10  mx1.porkbun.com
mowryagency.com  MX  20  mx2.porkbun.com
mowryagency.com  MX  30  mx3.porkbun.com
mowryagency.com  MX  40  mx4.porkbun.com
```

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **SEO**: Server-side rendering with meta tag optimization

## 🧪 Testing

### Unit Tests

```bash
npm run test              # Run unit tests
npm run test:coverage     # Run with coverage report
```

### End-to-End Tests

```bash
npm run test:e2e          # Run Playwright tests
npm run test:e2e:ui       # Run with UI mode
```

### Quote Form Testing

Comprehensive test suite for quote form functionality:

- Form validation
- Database integration
- Email delivery
- Error handling

## 🔐 Security

- **Environment Variables**: Sensitive data stored securely
- **Database Security**: Row-level security enabled in Supabase
- **API Protection**: Rate limiting and validation
- **HTTPS**: SSL certificate via Netlify

## 📚 Documentation

- [Nuxt 3 Documentation](https://nuxt.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit your changes: `git commit -m 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions or support, please contact:

- **Email**: admin@mowryagency.com
- **Website**: [https://mowryagency.com](https://mowryagency.com)
