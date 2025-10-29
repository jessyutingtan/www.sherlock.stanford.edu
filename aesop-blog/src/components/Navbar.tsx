import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PenSquare, Bell, User, Bookmark, Users, Swords, LayoutDashboard, UserCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Logo from './Logo';

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/write', icon: PenSquare, label: 'Write' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/spaces', icon: Users, label: 'Spaces' },
    { path: '/debates', icon: Swords, label: 'Debates' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/following', icon: UserCheck, label: 'Following' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-cyber-950 via-cyber-900 to-neon-950 border-b border-cyber-700 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/feed" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-cyber-600 to-neon-600 text-white shadow-lg shadow-cyber-500/50'
                    : 'text-cyber-200 hover:bg-cyber-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>

          {/* Profile */}
          <Link
            to={`/profile/${user?.username}`}
            className="flex items-center gap-2 hover:bg-cyber-800/50 rounded-lg px-3 py-2 transition-colors"
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || user.username}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-cyber-500"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-600 to-neon-600 flex items-center justify-center ring-2 ring-cyber-500">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="hidden sm:inline font-medium text-cyber-100">
              {user?.username}
            </span>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-cyber-800 -mx-4 px-4 py-2">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map(({ path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`p-2 rounded-lg transition-all ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-cyber-600 to-neon-600 text-white shadow-lg shadow-cyber-500/50'
                    : 'text-cyber-300 hover:bg-cyber-800/50 hover:text-white'
                }`}
              >
                <Icon className="w-6 h-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
