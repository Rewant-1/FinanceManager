# 💑 OurStory

A gorgeous, elegant personal and shared expense tracker built for couples. Track personal spending, share costs effortlessly, and keep your finances beautifully balanced with powerful analytics and insights.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Prisma](https://img.shields.io/badge/Prisma-6.18-2D3748)

## ✨ Features

### 🎨 Beautiful UI

- **shadcn/ui** components for a polished, accessible interface
- **Aceternity UI** components for stunning visual effects
- **Recharts** for beautiful data visualizations
- Glass-morphism design with teal/emerald gradient backgrounds
- Smooth animations powered by Framer Motion
- Advanced microanimations and hover effects
- Dark mode support with seamless theme switching

### 💰 Expense Management

- Personal expense tracking
- Shared expense mode for couples
- Category management
- Transaction filtering (by category, shared/personal)
- Real-time balance calculations
- Automatic settlement suggestions

### 📊 Analytics & Insights

- **Monthly spending trends** with interactive line charts
- **Transaction volume** tracking with bar charts
- **Category breakdown** with beautiful pie charts
- **Top spending categories** visualization
- **Summary statistics** including total spent, average transaction, and month-over-month changes
- **Detailed category analysis** with color-coded insights

### 👥 Couple Features

- Partner invitation system
- Toggle between personal and couple mode
- Track who paid for shared expenses
- Transparent balance overview
- Fair settlement calculations

### ♿ Accessibility

- Full keyboard navigation
- Screen reader support
- ARIA labels throughout
- Focus management
- High contrast mode compatible

### 📱 Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts for all screen sizes
- Progressive Web App ready

## 🚀 Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui + Aceternity UI
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Database:** PostgreSQL (via Prisma)
- **Auth:** NextAuth.js
- **Toast Notifications:** Sonner
- **Icons:** Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd finance-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and NextAuth secret

# Run database migrations for local development
npx prisma migrate dev

# When targeting production/preview databases
npm run db:migrate

# Start the development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

> **Tip:** Copy `.env.example` to jump-start your configuration.

## 🎨 Component Library

### shadcn/ui Components

- `Button` - Multiple variants (default, secondary, outline, ghost, destructive)
- `Card` - Card layouts with header, content, and footer
- `Input` - Form inputs with modern styling
- `Label` - Accessible form labels
- `Toaster` - Toast notifications

### Aceternity UI Components

- `Spotlight` - Animated spotlight effect
- `TextGenerateEffect` - Typewriter-style text animation
- `HoverEffect` - Card hover animations
- `BackgroundGradientAnimation` - Animated gradient backgrounds

### Custom Components

- `ModeToggle` - Dark/light mode switcher
- `ThemeProvider` - Theme management wrapper
- `StatsCard` - Animated statistics display
- `TransactionCard` - Transaction list item with animations

## 🎯 Key Pages

### Home (`/`)

- Hero section with spotlight effect
- Feature cards with hover effects
- Statistics display
- Theme toggle

### Dashboard (`/dashboard`)

- Transaction list with animations
- Balance overview (couple mode)
- Quick filters
- Add transaction form
- Real-time updates
- Navigation to Analytics

### Analytics (`/analytics`)

- Monthly spending trends line chart
- Transaction volume bar charts
- Category breakdown pie charts
- Top spending categories visualization
- Summary statistics cards
- Detailed category analysis table
- Interactive data tooltips

### Categories (`/categories`)

- CRUD operations for categories
- Inline editing
- Delete confirmations
- Empty states

### Settings (`/settings`)

- Partner invitation system
- Couple mode management
- Pending invites
- Account status

### Authentication

- Sign in (`/auth/signin`)
- Sign up (`/auth/signup`)
- Animated forms
- Toast notifications

## 🌓 Dark Mode

The app supports both light and dark modes with:

- System preference detection
- Manual toggle
- Smooth transitions
- Persistent user preference
- Optimized colors for both themes

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation (Tab, Enter, Escape)
- Focus indicators
- Screen reader announcements
- Skip to content links
- Color contrast compliance

## 📱 Mobile Optimization

- Responsive breakpoints (sm, md, lg, xl)
- Touch-friendly button sizes (min 44px)
- Mobile-optimized navigation
- Swipe gestures support
- Optimized for slow networks

## 🎬 Animations

All animations are carefully crafted using Framer Motion:

- Page transitions with stagger effects
- Enter/exit animations
- Hover states
- Loading states
- Layout animations for dynamic content
- Reduced motion support for accessibility

## 🔒 Security

- Secure authentication with NextAuth.js
- Password hashing with bcrypt
- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection
- Secure HTTP-only cookies

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Apply migrations to the current DATABASE_URL
npm run db:migrate

# Optional: ping the health check once deployed
curl -s https://your-domain.vercel.app/api/health
```

## ✅ Production Checklist

- [ ] `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` are set in Vercel/hosted envs
- [ ] `npm run db:migrate` (or `prisma migrate deploy`) executed against the production database
- [ ] `npm run build` succeeds locally before deploying
- [ ] `/api/health` returns `{ ok: true }` once deployed
- [ ] At least one manual smoke-test: sign up, sign in, add transaction, invite partner

## 📈 Future Enhancements

- [ ] Export to CSV/PDF
- [ ] Budget tracking and alerts
- [ ] Receipt photo uploads
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Custom split percentages
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Aceternity UI](https://ui.aceternity.com) for stunning UI components
- [Recharts](https://recharts.org) for powerful data visualizations
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [next-themes](https://github.com/pacocoursey/next-themes) for theme management
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications

---

Built with ❤️ for couples who want to keep their finances transparent and stress-free.

**OurStory** - Where every expense tells a story.
