import Link from 'next/link';
import { ArrowRight, TrendingUp, BarChart3, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">L.I.N.D.A</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-white hover:text-blue-300 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Investment Intelligence
            <br />
            <span className="text-blue-400">From Reddit Insights</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover high-quality investment insights by analyzing posts from top finance
            accounts. Track sentiment, identify trending tickers, and generate data-driven
            investment strategies.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
          >
            Start Analyzing
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Real-Time Analysis
            </h3>
            <p className="text-gray-400">
              Automatically analyze posts for sentiment, conviction, and actionable insights
              from curated finance accounts.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Trend Detection
            </h3>
            <p className="text-gray-400">
              Identify trending tickers, sectors, and themes across multiple accounts to
              spot consensus opportunities.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Strategy Dashboard
            </h3>
            <p className="text-gray-400">
              Generate comprehensive investment strategies with bullish ideas, bearish
              risks, and confidence scores.
            </p>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> This application provides research and analysis
            tools for educational purposes. All insights are for informational use only and
            should not be construed as financial advice. Conduct your own research and
            consult with financial advisors before making investment decisions.
          </p>
        </div>
      </main>
    </div>
  );
}
