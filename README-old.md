# Couple's Expense Hub

A simple, practical finance tracking web app built with Next.js for tracking personal and shared expenses with your partner.

## Features

### Personal Mode (Default)
- ✅ Track your own private expenses
- ✅ Custom expense categories (add, edit, delete)
- ✅ Filter transactions by category and date range
- ✅ Clean, intuitive dashboard

### Couple Mode
- ✅ Invite your partner via email
- ✅ Track both personal and shared expenses
- ✅ Mark expenses as "Personal" or "Shared"
- ✅ Track who paid for each shared expense (You, Partner, or Split 50/50)
- ✅ Automatic balance calculation showing who owes whom
- ✅ Filter view: All, Shared Only, or Personal Only
- ✅ Real-time balance summary

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** SQLite with Prisma ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
```bash
cd finance-tracker
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
The `.env` file is already created. Update if needed:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production-please"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Run database migrations:**
```bash
npx prisma migrate dev
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guide

### First Time Setup

1. **Create an Account**
   - Click "Get Started" on the homepage
   - Fill in your name, email, and password
   - Sign in with your credentials

2. **Personal Mode (Default)**
   - Add transactions using the "+ Add Transaction" button
   - Manage custom categories in the Categories page
   - Use filters to view specific categories or date ranges

3. **Enable Couple Mode**
   - Go to Settings
   - Enter your partner's email (they must have an account first)
   - Send invite
   - Partner accepts the invite in their Settings page
   - Both accounts are now in Couple Mode

4. **Using Couple Mode**
   - When adding transactions, you'll see a "Shared Expense" checkbox
   - Check it for shared expenses
   - Select who paid: You, Your Partner, or Split 50/50
   - View the balance summary on the dashboard
   - Use view filters to see All, Shared Only, or Personal Only expenses

## Database Schema

- **User:** User accounts and authentication
- **Category:** Custom expense categories per user
- **Transaction:** All expense records (personal and shared)
- **PartnerLink:** Manages partner invites and relationships

## Project Structure

```
finance-tracker/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Sign in/up pages
│   ├── categories/    # Category management
│   ├── dashboard/     # Main dashboard
│   ├── settings/      # Partner linking & settings
│   └── layout.tsx     # Root layout
├── lib/
│   └── prisma.ts      # Prisma client
├── prisma/
│   └── schema.prisma  # Database schema
├── types/             # TypeScript definitions
└── auth.ts            # NextAuth configuration
```

## Development Notes

- SQLite is used for simplicity (easy local development, no external DB needed)
- Default categories are auto-created for new users
- Shared expenses use the `isShared` flag and `paidBy` field
- Balance calculation happens on the backend
- All routes except auth pages require authentication

## Future Enhancements (Optional)

- Recurring transactions/bills
- Budget targets per category
- Export to CSV
- Monthly/yearly analytics
- PWA support for mobile quick-add
- Settlement history log

## License

MIT - This is a personal utility project for self-use.

---

Built with ❤️ for practical expense tracking
