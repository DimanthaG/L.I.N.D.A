# L.I.N.D.A Frontend

**L**everaged **I**nvestment **N**arrative **D**iscovery & **A**nalysis - Frontend Dashboard

## Setup

### Prerequisites
- Node.js 20+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### Dashboard
- Real-time sentiment overview
- Trending tickers and sectors
- Top engaging posts
- Theme analysis

### Analysis
- Detailed ticker analysis
- Sector distribution charts
- Historical sentiment trends
- Custom time range filtering

### Strategy
- AI-generated investment strategies
- Bullish ideas and bearish risks
- Consensus signals across accounts
- Confidence scoring

### Watchlists
- Create custom watchlists
- Track specific accounts and tickers
- Manage multiple watchlists
- Quick access to tracked items

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── charts/           # Chart components
│   ├── analysis/         # Analysis components
│   ├── posts/            # Post components
│   ├── strategy/         # Strategy components
│   └── filters/          # Filter components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and API client
└── store/                # Zustand stores
```

## Building for Production

Build the application:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Environment Variables

See `.env.example` for required configuration.

Key variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXTAUTH_URL` - NextAuth base URL
- `NEXTAUTH_SECRET` - NextAuth secret key
