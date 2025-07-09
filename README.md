# 🌟 LightingPro - AI-Powered Lighting Recommendation App

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/lightingpro-app)

A modern web application that helps users find perfect lighting solutions for their spaces using AI-powered recommendations.

## 🚀 Features

- 🎯 **AI-Powered Recommendations**: Advanced machine learning algorithms for personalized lighting suggestions
- 🌍 **Multi-language Support**: English, Chinese, Spanish, French, German, Italian
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **High Performance**: Built with Next.js 15 and Turbopack for lightning-fast loading
- 🔍 **Smart Search**: Intelligent product search with filters and categories
- 🛒 **Shopping Cart**: Seamless shopping experience with affiliate integration
- 📊 **Analytics Dashboard**: Real-time insights and user behavior tracking
- 🎨 **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- 🔐 **User Authentication**: Secure login and user profile management
- 💾 **Database Integration**: Powered by Supabase for reliable data management

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **AI/ML**: Custom recommendation engine
- **Caching**: Redis (Upstash)
- **Internationalization**: next-intl

## 📦 Project Structure

```
lighting-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── questionnaire/     # Quiz flow
│   │   └── recommendations/   # Results page
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   └── lib/
│       ├── supabase.ts       # Database client
│       └── utils.ts          # Helper functions
├── .github/workflows/        # GitHub Actions
└── next.config.ts           # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)
- Cloudflare account (free tier)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd lighting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy `.env.local` and update with your credentials:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Required environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Setup (Supabase)

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the following SQL to create the database schema:

```sql
-- User profiles
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questionnaire responses
CREATE TABLE questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  room_type TEXT NOT NULL,
  room_size TEXT NOT NULL,
  style_preference TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  current_lighting TEXT,
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lighting products
CREATE TABLE lighting_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  specifications JSONB,
  image_urls TEXT[],
  affiliate_links JSONB,
  commission_rate DECIMAL(5,2),
  rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🌐 Deployment

### 🚀 Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/lightingpro-app)

#### Quick Deploy with Script
```bash
chmod +x deploy-simple.sh
./deploy-simple.sh
```

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Environment Variables for Production

Add these to your Vercel dashboard:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Alternative: Cloudflare Pages

1. **Connect your GitHub repository** to Cloudflare Pages
2. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables: Add your Supabase credentials
3. **Auto-deployment**: Pushes to `main` branch will automatically deploy

## 💰 Business Model

The app generates revenue through:

1. **Affiliate Marketing**: Commission from product sales
   - Amazon Associates: 3-8% commission
   - Home Depot: 2-5% commission  
   - Wayfair: 3-7% commission

2. **Premium Features** (future):
   - VIP recommendations: $9.99/month
   - Design consultation: $29.99/session
   - Custom lighting plans: $99.99/room

## 📈 Performance Targets

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1

## 🔒 Security

- Environment variables for sensitive data
- Supabase Row Level Security (RLS) enabled
- HTTPS enforced via Cloudflare
- Input validation and sanitization

## 📱 Mobile Experience

- Responsive design for all screen sizes
- Touch-friendly interface
- Progressive Web App (PWA) ready
- Offline-first questionnaire capability

## 🚀 Future Enhancements

- [ ] 3D room visualization
- [ ] AR lighting preview
- [ ] User accounts and favorites
- [ ] Social sharing features
- [ ] Advanced filtering options
- [ ] Price tracking and alerts
- [ ] Expert consultation booking

## 📊 Analytics

Track key metrics:
- Questionnaire completion rate: Target >80%
- Recommendation click-through rate: Target >25%
- Conversion rate: Target >3%
- Average session duration: Target >3 minutes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Inspiration

Built for the North American lighting market, focusing on:
- DIY homeowners
- Interior design enthusiasts  
- Smart home adopters
- Budget-conscious consumers

---

**Total Development Time**: ~4 weeks  
**Monthly Operating Cost**: $0-45 (depending on scale)  
**Target Market**: North American homeowners  
**Revenue Model**: Affiliate marketing + premium services
