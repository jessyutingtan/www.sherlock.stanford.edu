import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Notification } from '../types/database';
import { formatRelativeTime } from '../utils/date';
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(
          `
          *,
          actor:profiles!notifications_actor_id_fkey(*),
          post:posts(title)
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-600" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationText = (notification: Notification) => {
    const actorName = notification.actor?.full_name || notification.actor?.username;
    switch (notification.type) {
      case 'like':
        return `${actorName} liked your post`;
      case 'comment':
        return `${actorName} commented on your post`;
      case 'follow':
        return `${actorName} started following you`;
      case 'mention':
        return `${actorName} mentioned you in a post`;
      default:
        return 'New notification';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.post_id) return `/post/${notification.post_id}`;
    if (notification.type === 'follow') return `/profile/${notification.actor?.username}`;
    return '#';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your activity</p>
          </div>
          {notifications.some((n) => !n.is_read) && (
            <button
              onClick={markAllAsRead}
              className="btn btn-secondary flex items-center gap-2"
            >
              <CheckCheck className="w-5 h-5" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              to={getNotificationLink(notification)}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
              className={`card p-4 flex items-start gap-4 hover:shadow-lg transition-shadow ${
                !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              {/* Actor avatar */}
              {notification.actor?.avatar_url ? (
                <img
                  src={notification.actor.avatar_url}
                  alt={notification.actor.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-semibold">
                  {notification.actor?.username[0].toUpperCase()}
                </div>
              )}

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <p className="text-gray-900 font-medium">
                    {getNotificationText(notification)}
                  </p>
                </div>
                {notification.post && (
                  <p className="text-sm text-gray-600 line-clamp-1">
                    "{notification.post.title}"
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formatRelativeTime(notification.created_at)}
                </p>
              </div>

              {/* Unread indicator */}
              {!notification.is_read && (
                <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
              )}
            </Link>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12 card">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">
              When people interact with your posts, you'll see it here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
