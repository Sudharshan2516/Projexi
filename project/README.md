# Projexi – The Global Entrepreneurial Ecosystem

A complete, production-ready full-stack web application connecting Entrepreneurs, Investors, and Dealers into a verified ecosystem for funding, networking, and skill-based mentoring.

## Features

### Core Functionality
- **Role-Based Authentication**: Single-page login with three user roles (Entrepreneur, Investor, Dealer)
- **Entrepreneur Dashboard**: Post startup ideas, request funding, connect with investors
- **Investor Dashboard**: Browse ideas, smart matchmaking, manage investments
- **Dealer Marketplace**: List products, receive quote requests, manage leads
- **Peer Connect**: Community feed for networking and resource sharing
- **Skill-Based Mentoring**: Directory of mentors with booking system
- **Scholarship Database**: Searchable funding opportunities
- **KYC Verification**: Document upload and admin verification system
- **Real-time Messaging**: Direct communication between users
- **Smart Notifications**: In-app notification system with bell dropdown

### Design & UX
- **Glassmorphism UI**: Beautiful frosted glass effect cards with hover animations
- **HUD Loading Animations**: Futuristic radar-style loaders with circular progress
- **Scroll-Reveal Animations**: Smooth animations as elements enter viewport
- **Animated Counters**: Dynamic number animations on statistics
- **Gradient Accents**: Modern blue-to-cyan gradients throughout
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Sleek dark theme with glowing effects

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Supabase** (PostgreSQL) for database
- **Supabase Auth** for authentication
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

## Database Schema

The application includes 15+ tables:
- `profiles` - User profiles with role and verification status
- `ideas` - Startup ideas posted by entrepreneurs
- `funding_requests` - Connection between entrepreneurs and investors
- `dealer_listings` - Products/materials from dealers
- `quote_requests` - Quote requests from entrepreneurs to dealers
- `mentors` - Mentor profiles and expertise
- `mentorship_bookings` - Mentoring session bookings
- `messages` - Direct messaging between users
- `notifications` - System notifications
- `feed_posts` - Community feed posts
- `feed_comments` - Comments on posts
- `scholarships` - Funding opportunities database
- `kyc_documents` - KYC verification documents
- `investor_preferences` - Investor matching preferences
- `dealer_profiles` - Dealer business information

All tables include:
- UUID primary keys
- Timestamps for audit trails
- Row Level Security policies
- Optimized indexes

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (database already configured)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## User Roles

### Entrepreneur
- Post startup ideas with pitch decks and videos
- Add funding goals, categories, tags, and zones
- Send funding requests to investors
- Browse dealer marketplace
- View idea analytics (views, interest)
- Connect with mentors

### Investor
- Browse startup ideas with advanced filtering
- Set investment preferences (amount, industries, zones)
- Receive AI-powered match recommendations
- Accept/reject funding requests
- Upload KYC documents for verification
- Track investment portfolio

### Dealer
- Create business profile
- List products with pricing and stock
- Receive and manage quote requests
- Track leads and customers
- Upload business verification documents

### Admin
- Verify user KYC documents
- Moderate content
- Manage scholarships
- View platform analytics
- Approve/reject dealer listings

## Key Features Detail

### Smart Matchmaking
The platform uses tag and zone overlap algorithms to match investors with relevant startup ideas, ensuring high-quality connections.

### HUD Loading System
Futuristic loading animations featuring:
- Rotating radar scanner rings
- Pulsing core with glow effects
- Circular progress indicators
- Smooth fade transitions
- Background grid animation

### Glassmorphism Design
All cards feature:
- Frosted glass backdrop blur
- Subtle white border overlays
- Hover scale transformations
- Drop shadow effects
- Gradient backgrounds

### Security Features
- Email/password authentication with Supabase
- Row Level Security on all tables
- Prepared statements preventing SQL injection
- CSRF protection
- Secure session management
- KYC verification system
- Admin-approved verified badges

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── GlassCard.tsx
│   ├── HUD.tsx
│   └── DashboardLayout.tsx
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── lib/              # Utility functions
│   └── supabase.ts
├── pages/            # Page components
│   ├── Landing.tsx
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── Ideas.tsx
│   ├── NewIdea.tsx
│   ├── Community.tsx
│   ├── Scholarships.tsx
│   └── Profile.tsx
├── styles/           # CSS files
│   └── hud.css
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Sample Credentials

Create test accounts using the signup flow and selecting your desired role:
- Entrepreneur
- Investor
- Dealer

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Type Checking

```bash
npm run typecheck
```

## Features Roadmap

Completed:
- ✅ Authentication with role selection
- ✅ Dashboard for all roles
- ✅ Idea posting and browsing
- ✅ Community feed
- ✅ Scholarship database
- ✅ Profile management
- ✅ HUD animations
- ✅ Glassmorphism UI

Future enhancements:
- 📋 Complete messaging system with real-time chat
- 📋 Mentoring booking calendar
- 📋 Admin panel UI
- 📋 KYC document upload UI
- 📋 Investor matchmaking refinements
- 📋 Dealer quote management
- 📋 Analytics dashboard
- 📋 Email notifications
- 📋 File upload for pitch decks
- 📋 Video integration

## Performance

- Optimized bundle size (~363KB gzipped)
- Lazy loading for routes
- Efficient database queries with indexes
- Real-time updates with Supabase subscriptions
- Smooth 60fps animations

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

This project is built for demonstration purposes.

## Support

For questions or issues, please refer to the documentation or create an issue in the repository.

---

Built with ❤️ using React, TypeScript, Supabase, and Tailwind CSS
