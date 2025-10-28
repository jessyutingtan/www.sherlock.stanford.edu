import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import WritePage from './pages/WritePage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import BookmarksPage from './pages/BookmarksPage';
import CollaborativeSpacesPage from './pages/CollaborativeSpacesPage';
import DebatesPage from './pages/DebatesPage';
import DashboardPage from './pages/DashboardPage';

// Components
import Navbar from './components/Navbar';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { user, loading, fetchUser, setUser } = useAuthStore();

  useEffect(() => {
    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          fetchUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter basename="/www.sherlock.stanford.edu">
      <div className="min-h-screen bg-gray-50">
        {user && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={user ? <Navigate to="/feed" /> : <LandingPage />}
          />
          <Route
            path="/auth"
            element={user ? <Navigate to="/feed" /> : <AuthPage />}
          />
          <Route
            path="/onboarding"
            element={
              user && (!user.communities?.length || !user.topics?.length) ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/feed" />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/feed"
            element={user ? <FeedPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/explore"
            element={user ? <ExplorePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/write"
            element={user ? <WritePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/write/:id"
            element={user ? <WritePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/post/:id"
            element={user ? <PostPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile/:username"
            element={user ? <ProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/profile/edit"
            element={user ? <EditProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/notifications"
            element={user ? <NotificationsPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/bookmarks"
            element={user ? <BookmarksPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/spaces"
            element={user ? <CollaborativeSpacesPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/debates"
            element={user ? <DebatesPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/dashboard"
            element={user ? <DashboardPage /> : <Navigate to="/auth" />}
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
