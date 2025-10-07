# Portfolio Nuxt - Spotlight Template Migration

A complete migration of the [Spotlight Template](https://spotlight.tailwindui.com/) from Next.js to Nuxt.js, maintaining pixel-perfect design fidelity and responsive behavior.

## 🎯 Project Overview

This project demonstrates a comprehensive migration from Next.js to Nuxt.js while preserving:

- Identical visual design and responsive behavior
- Complex header animations and scroll effects
- Dark/light mode theming
- Mobile navigation with animations
- Responsive breakpoint behavior

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack

- **Framework**: Nuxt 3
- **Styling**: Tailwind CSS v4
- **UI Components**: Headless UI Vue
- **Icons**: Nuxt Icon
- **Theme**: Nuxt Color Mode
- **Images**: Nuxt Image
- **Testing**: Vitest + Playwright

### Project Structure

```
app/
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS imports and custom styles
├── components/
│   ├── Header.vue            # Main header with responsive behavior
│   ├── Container.vue         # Layout container component
│   ├── Avatar.vue            # User avatar component
│   ├── AvatarContainer.vue   # Avatar wrapper with styling
│   ├── ThemeToggle.vue       # Dark/light mode toggle
│   ├── DesktopNavigation.vue # Desktop navigation menu
│   ├── MobileNavigation.vue  # Mobile navigation with animations
│   ├── NavItem.vue           # Individual navigation item
│   └── MobileNavItem.vue     # Mobile navigation item
├── layouts/
│   └── default.vue           # Main layout with background panel
├── pages/
│   ├── index.vue             # Home page
│   ├── about.vue             # About page
│   ├── articles.vue          # Articles page
│   ├── projects.vue          # Projects page
│   ├── speaking.vue          # Speaking page
│   └── uses.vue              # Uses page
└── app.vue                   # Root application component
```

## ✨ Key Features Implemented

### Responsive Header

- **Desktop Navigation**: Centered navigation with theme toggle on the right
- **Mobile Navigation**: Collapsible menu with smooth animations
- **Avatar Positioning**: Large avatar on home page with scroll animations
- **Dynamic Sizing**: Responsive breakpoints at 768px (md)

### Animation System

- **Scroll Animations**: Avatar scaling and position changes on scroll
- **Mobile Menu**: Slide and fade animations with backdrop
- **Theme Transitions**: Smooth color transitions between light/dark modes
- **CSS Custom Properties**: Dynamic header positioning with CSS variables

### Theme System

- **Color Modes**: Light and dark theme support
- **Background Layers**: Fixed background panel with themed colors
- **Component Theming**: All components respond to theme changes
- **Persistence**: Theme preference saved in localStorage

## 🎨 Design System

### Colors

- **Light Mode**: Zinc-50 background, white content area
- **Dark Mode**: Black background, zinc-900 content area
- **Accent**: Teal-500 for active states and interactions

### Layout

- **Container**: Max-width 7xl with responsive padding
- **Content**: Max-width 5xl for main content areas
- **Spacing**: Consistent spacing using Tailwind's spacing scale

### Typography

- **Font Stack**: System fonts with antialiasing
- **Sizes**: Custom text sizes from xs to 9xl
- **Line Heights**: Optimized for readability

## 🧪 Testing

The project includes comprehensive testing for responsive behavior:

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

- Header responsive behavior across breakpoints
- Mobile navigation functionality
- Theme toggle functionality
- Avatar positioning and animations

## 📱 Responsive Breakpoints

| Breakpoint | Width          | Behavior                         |
| ---------- | -------------- | -------------------------------- |
| Mobile     | < 768px        | Mobile navigation, right-aligned |
| Tablet     | 768px - 1024px | Desktop navigation appears       |
| Desktop    | > 1024px       | Full desktop layout              |

## 🔧 Configuration

### Nuxt Configuration

Key modules and settings:

- `@nuxtjs/tailwindcss` - Tailwind CSS integration
- `@nuxtjs/color-mode` - Theme switching
- `@nuxt/image` - Optimized image handling
- `@nuxt/icon` - Icon system

### Tailwind Configuration

- Custom color palette matching original design
- Typography configuration with custom sizes
- Dark mode support with class strategy

## 📚 Migration Notes

### Key Differences from Next.js

1. **Component Structure**: Vue composition API instead of React hooks
2. **Navigation**: `useRoute()` instead of `usePathname()`
3. **Theme System**: Nuxt Color Mode instead of next-themes
4. **Image Handling**: Nuxt Image instead of next/image
5. **CSS Variables**: Same custom properties for animations

### Challenges Overcome

1. **Headless UI Vue**: Different API from React version
2. **Animation Timing**: Vue transitions vs React animation libraries
3. **Theme Integration**: Ensuring proper SSR theme handling
4. **Mobile Navigation**: Custom backdrop implementation for Vue

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
npm run preview
```

### Netlify

```bash
npm run generate
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature/new-feature`
6. Create a Pull Request

### Development Guidelines

- Maintain responsive behavior across all breakpoints
- Test both light and dark themes
- Ensure animations are smooth and performant
- Follow Vue 3 composition API best practices
- Match the original design pixel-perfectly

## 📄 License

This project is based on the Spotlight template from Tailwind UI. Please refer to Tailwind UI's license for usage terms.

## 🔗 Links

- [Original Spotlight Template](https://spotlight.tailwindui.com/)
- [Next.js Version](../spotlight-js)
- [Nuxt Documentation](https://nuxt.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Headless UI Vue](https://headlessui.com/vue)

---

Built with ❤️ using Nuxt.js and Tailwind CSS
