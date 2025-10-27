import { Link } from 'react-router-dom';
import { PenSquare, Users, Sparkles, Heart, MessageCircle, TrendingUp } from 'lucide-react';

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
      <section className="gradient-bg text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to Aesop Blog
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            An exceptional social blogging platform where writers, thinkers, and creators come together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="btn btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="btn bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 text-lg px-8 py-4"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">
            What Makes Us Exceptional
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Aesop Blog combines the best of blogging, social networking, and collaborative writing
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 animate-slide-up hover:scale-105 transition-transform"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 gradient-text">Find Your Community</h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Join communities of students, scholars, professionals, coders, writers, artists, and more
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Students 🎓', 'Scholars 📚', 'Coders 💻', 'Writers ✍️', 'Artists 🎨',
              'Scientists 🔬', 'Entrepreneurs 🚀', 'Creatives ✨'].map((community) => (
              <span
                key={community}
                className="badge badge-primary px-4 py-2 text-base"
              >
                {community}
              </span>
            ))}
          </div>

          <Link
            to="/auth"
            className="btn btn-primary text-lg px-8 py-4 inline-block"
          >
            Join Your Community
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Writing?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of writers sharing their stories, ideas, and passions
          </p>
          <Link
            to="/auth"
            className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-2xl font-bold">Aesop Blog</span>
          </div>
          <p className="text-gray-400 mb-4">
            Write, Share, Connect - An exceptional blogging experience
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 Aesop Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
