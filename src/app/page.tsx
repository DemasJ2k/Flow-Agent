import Link from "next/link";
import { LineChart, Brain, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <nav className="flex items-center justify-between p-6">
        <div className="text-2xl font-bold text-white">Trading AI</div>
        <div className="space-x-4">
          <Link
            href="/login"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            AI-Powered Trading Analysis
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Leverage the power of AI to analyze markets, track your trades, and improve your trading strategy with real-time insights.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Trading Smarter
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="Dual AI Support"
            description="Choose between Anthropic Claude and OpenAI GPT for your analysis needs"
          />
          <FeatureCard
            icon={<LineChart className="h-8 w-8" />}
            title="Real-time Charts"
            description="View candlestick charts with ICT pattern detection and analysis"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="AI Memory"
            description="Context-aware responses based on your trading history"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Multi-Market"
            description="Support for Forex, Metals, Crypto, and Stocks"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20 text-blue-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
