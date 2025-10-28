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
          post:posts(title),
          space:collaborative_spaces(id, title, creator_id)
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

  const handleApproveJoinRequest = async (notificationId: string, actorId: string, spaceId: string) => {
    try {
      // Update join request status to approved
      const { error: updateError } = await supabase
        .from('space_join_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('space_id', spaceId)
        .eq('user_id', actorId);

      if (updateError) throw updateError;

      // Mark notification as read
      await markAsRead(notificationId);

      alert('Join request approved! User has been added as a collaborator.');
      fetchNotifications();
    } catch (error) {
      console.error('Error approving join request:', error);
      alert('Failed to approve join request');
    }
  };

  const handleRejectJoinRequest = async (notificationId: string, actorId: string, spaceId: string) => {
    try {
      // Update join request status to rejected
      const { error: updateError } = await supabase
        .from('space_join_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('space_id', spaceId)
        .eq('user_id', actorId);

      if (updateError) throw updateError;

      // Mark notification as read
      await markAsRead(notificationId);

      alert('Join request rejected.');
      fetchNotifications();
    } catch (error) {
      console.error('Error rejecting join request:', error);
      alert('Failed to reject join request');
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
      case 'space_join_request':
        return <UserPlus className="w-5 h-5 text-purple-600" />;
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
      case 'space_join_request':
        return `${actorName} wants to join "${notification.space?.title}"`;
      default:
        return 'New notification';
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.post_id) return `/post/${notification.post_id}`;
    if (notification.type === 'follow') return `/profile/${notification.actor?.username}`;
    if (notification.type === 'space_join_request') return `/profile/${notification.actor?.username}`;
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
            <p className="text-white">Stay updated with your activity</p>
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
          {notifications.map((notification) => {
            // Special rendering for space join requests
            if (notification.type === 'space_join_request') {
              return (
                <div
                  key={notification.id}
                  className={`card p-4 flex items-start gap-4 ${
                    !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  {/* Actor avatar */}
                  <Link to={`/profile/${notification.actor?.username}`}>
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
                  </Link>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-1">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <p className="text-white font-medium">
                        <Link
                          to={`/profile/${notification.actor?.username}`}
                          className="hover:underline"
                        >
                          {notification.actor?.full_name || notification.actor?.username}
                        </Link>
                        {' '}wants to join{' '}
                        <Link
                          to={`/space/${notification.space_id}`}
                          className="hover:underline font-semibold"
                        >
                          "{notification.space?.title}"
                        </Link>
                      </p>
                    </div>
                    <p className="text-sm text-white mt-1">
                      {formatRelativeTime(notification.created_at)}
                    </p>

                    {/* Action buttons */}
                    {!notification.is_read && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApproveJoinRequest(notification.id, notification.actor_id, notification.space_id!)}
                          className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 text-sm py-1.5 px-3"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectJoinRequest(notification.id, notification.actor_id, notification.space_id!)}
                          className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 text-sm py-1.5 px-3"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Unread indicator */}
                  {!notification.is_read && (
                    <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                  )}
                </div>
              );
            }

            // Regular notifications
            return (
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
                    <p className="text-white font-medium">
                      {getNotificationText(notification)}
                    </p>
                  </div>
                  {notification.post && (
                    <p className="text-sm text-white line-clamp-1">
                      "{notification.post.title}"
                    </p>
                  )}
                  <p className="text-sm text-white mt-1">
                    {formatRelativeTime(notification.created_at)}
                  </p>
                </div>

                {/* Unread indicator */}
                {!notification.is_read && (
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                )}
              </Link>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12 card">
            <Bell className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
            <p className="text-white">
              When people interact with your posts, you'll see it here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
