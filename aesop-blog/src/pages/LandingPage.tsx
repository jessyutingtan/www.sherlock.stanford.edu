import { Link } from 'react-router-dom';
import { PenSquare, Users, Sparkles, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import Logo from '../components/Logo';
import { COMMUNITIES } from '../types/database';
import DynamicIcon from '../components/DynamicIcon';

export default function LandingPage() {
  const features = [
    {
      icon: PenSquare,
      title: 'Rich Writing Experience',
      description: 'Beautiful editor with cover images, tags, and automatic reading time calculation',
    },
    {
      icon: Users,
      title: 'Collaborative Spaces',
      description: 'Write together with others in real-time collaborative writing spaces',
    },
    {
      icon: Sparkles,
      title: 'Thought Bubbles',
      description: 'Share quick thoughts with mood tracking - your personal micro-blogging space',
    },
    {
      icon: Heart,
      title: 'Social Features',
      description: 'Like, comment, bookmark, and follow writers you love',
    },
    {
      icon: MessageCircle,
      title: 'Post Debates',
      description: 'Engage in friendly debates and vote on the best arguments',
    },
    {
      icon: TrendingUp,
      title: 'Smart Discovery',
      description: 'Explore trending topics, discover top writers, and find your community',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-900/30 to-transparent"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-12 animate-float scale-125 sm:scale-150">
            <Logo size="xl" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-white drop-shadow-2xl animate-pulse-slow">
            Welcome to <span className="bg-gradient-to-r from-cyan-300 via-white to-neon-300 bg-clip-text text-transparent">Aesop Blog</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-white font-medium max-w-3xl mx-auto drop-shadow-lg">
            An exceptional social blogging platform where writers, thinkers, and creators come together
          </p>
          <div className="flex justify-center items-center">
            <Link
              to="/auth"
              className="btn group relative overflow-hidden bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 border-4 border-yellow-400 text-orange-500 hover:text-orange-400 text-4xl font-black px-20 py-10 shadow-[0_0_40px_rgba(34,211,238,0.8),0_0_80px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,1),0_0_100px_rgba(34,211,238,0.6)] transition-all transform hover:scale-110 rounded-3xl animate-pulse-glow"
            >
              <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-cyber-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-black text-center mb-4 text-white">
            What Makes Us <span className="gradient-text">Exceptional</span>
          </h2>
          <p className="text-center text-cyan-200 text-xl mb-12 max-w-2xl mx-auto">
            Aesop Blog combines the best of blogging, social networking, and collaborative writing
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 animate-slide-up hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-cyan-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-cyber-900 to-cyber-950">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl font-black mb-6 text-white">
            Find Your <span className="gradient-text">Community</span>
          </h2>
          <p className="text-cyan-200 text-2xl mb-16 whitespace-nowrap overflow-x-auto">
            Join communities of students, scholars, professionals, coders, writers, artists, and more
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12">
            {COMMUNITIES.map((community) => (
              <div
                key={community.value}
                className="p-5 rounded-xl border-2 border-cyan-500/50 bg-cyber-900/50 hover:bg-orange-500/20 hover:border-yellow-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20"
              >
                <div className="mb-3 flex justify-center">
                  <DynamicIcon name={community.icon} size={40} className="text-cyan-300" />
                </div>
                <div className="font-bold text-white text-base">{community.label}</div>
              </div>
            ))}
          </div>

          <Link
            to="/auth"
            className="btn btn-primary text-2xl font-bold px-16 py-7 inline-block rounded-xl shadow-xl hover:scale-105 transition-transform"
          >
            Join Your Community
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
            Ready to Start Writing?
          </h2>
          <p className="text-2xl mb-10 text-white font-medium">
            Join thousands of writers sharing their stories, ideas, and passions
          </p>
          <Link
            to="/auth"
            className="btn bg-white text-cyber-600 hover:bg-cyan-50 text-2xl font-bold px-16 py-8 shadow-2xl inline-block rounded-2xl hover:scale-105 transition-transform"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyber-950 border-t border-cyber-800 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo size="md" />
          </div>
          <p className="text-cyan-300 mb-4 text-lg">
            Write, Share, Connect - An exceptional blogging experience
          </p>
          <p className="text-cyan-600 text-sm">
            © 2025 Aesop Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
