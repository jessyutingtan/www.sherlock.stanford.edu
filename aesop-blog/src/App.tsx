import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { supabase } from './lib/supabase';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import EmailConfirmedPage from './pages/EmailConfirmedPage';
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
import SpacePage from './pages/SpacePage';
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

  // Check if user needs to complete onboarding
  const needsOnboarding = user && (!user.communities?.length || !user.topics?.length);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        {user && !needsOnboarding && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              user ? (
                needsOnboarding ? (
                  <Navigate to="/onboarding" />
                ) : (
                  <Navigate to="/feed" />
                )
              ) : (
                <LandingPage />
              )
            }
          />
          <Route
            path="/auth"
            element={
              user ? (
                needsOnboarding ? (
                  <Navigate to="/onboarding" />
                ) : (
                  <Navigate to="/feed" />
                )
              ) : (
                <AuthPage />
              )
            }
          />
          <Route
            path="/email-confirmed"
            element={<EmailConfirmedPage />}
          />
          <Route
            path="/onboarding"
            element={user ? <OnboardingPage /> : <Navigate to="/auth" />}
          />

          {/* Protected routes - redirect to onboarding if incomplete */}
          <Route
            path="/feed"
            element={
              user ? (
                needsOnboarding ? (
                  <Navigate to="/onboarding" />
                ) : (
                  <FeedPage />
                )
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/explore"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <ExplorePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/write"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <WritePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/write/:id"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <WritePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/post/:id"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <PostPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/profile/:username"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <ProfilePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/profile/edit"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <EditProfilePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <NotificationsPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/bookmarks"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <BookmarksPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/spaces"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <CollaborativeSpacesPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/space/:id"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <SpacePage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/debates"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <DebatesPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                needsOnboarding ? <Navigate to="/onboarding" /> : <DashboardPage />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
