import { Link } from 'react-router-dom';
import { PenSquare, Users, Sparkles, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import Logo from '../components/Logo';

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
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8 animate-float">
            <Logo size="lg" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 text-white drop-shadow-2xl">
            Welcome to <span className="bg-gradient-to-r from-cyan-300 via-white to-neon-300 bg-clip-text text-transparent">Aesop Blog</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-white font-medium max-w-3xl mx-auto drop-shadow-lg">
            An exceptional social blogging platform where writers, thinkers, and creators come together
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/auth"
              className="btn group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-neon-500 text-white hover:from-cyan-400 hover:to-neon-400 text-2xl font-bold px-16 py-8 shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-400/60 transition-all transform hover:scale-105 rounded-2xl"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Link>
            <a
              href="#features"
              className="btn bg-cyber-900/50 backdrop-blur-sm text-white hover:bg-cyber-800/50 border-2 border-cyan-400/50 hover:border-cyan-300 text-xl font-semibold px-12 py-6 rounded-xl transition-all"
            >
              Learn More
            </a>
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
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-4 text-white">
            Find Your <span className="gradient-text">Community</span>
          </h2>
          <p className="text-cyan-200 text-xl mb-12 max-w-2xl mx-auto">
            Join communities of students, scholars, professionals, coders, writers, artists, and more
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Students 🎓', 'Scholars 📚', 'Coders 💻', 'Writers ✍️', 'Artists 🎨',
              'Scientists 🔬', 'Entrepreneurs 🚀', 'Creatives ✨'].map((community) => (
              <span
                key={community}
                className="badge badge-primary px-5 py-3 text-lg font-semibold"
              >
                {community}
              </span>
            ))}
          </div>

          <Link
            to="/auth"
            className="btn btn-primary text-xl font-bold px-12 py-6 inline-block rounded-xl"
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
