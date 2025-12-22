import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Loader, Filter, Zap, Target, TrendingUp } from 'lucide-react';
import API from '../api/axios';
import NotificationCard from '../components/NotificationCard';
import Navbar from '../components/Navbar';
import GlassCard from '../components/ui/GlassCard';
import AnimatedBadge from '../components/ui/AnimatedBadge';
import SkeletonLoader from '../components/ui/SkeletonLoader';

/**
 * StudentNotifications Page
 * Full page view of all student notifications with filtering options
 */
const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, high-match
  const [sortBy, setSortBy] = useState('recent'); // recent, match-percent

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Apply filters and sorting when notifications or filter changes
  useEffect(() => {
    let filtered = [...notifications];

    // Apply filter
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead);
    } else if (filter === 'high-match') {
      filtered = filtered.filter(n => (n.matchPercentage || 0) >= 75);
    }

    // Apply sort
    if (sortBy === 'match-percent') {
      filtered.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    } else if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredNotifications(filtered);
  }, [notifications, filter, sortBy]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/student/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.put(`/student/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/student/jobs/${jobId}/apply`);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to apply for job');
    }
  };

  const handleCloseNotification = (notificationId) => {
    const notification = notifications.find(n => n._id === notificationId);
    if (notification && !notification.isRead) {
      handleMarkAsRead(notificationId);
    }
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highMatchCount = notifications.filter(n => (n.matchPercentage || 0) >= 75).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full">
              <Bell className="text-blue-600" size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">Opportunities</h1>
              <p className="text-gray-600 text-lg">AI-matched jobs based on your skills</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <GlassCard glow delay={0.1}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Total Notifications</p>
                <p className="text-3xl font-black text-blue-600">{notifications.length}</p>
              </div>
              <div className="text-4xl">📬</div>
            </div>
          </GlassCard>

          <GlassCard glow delay={0.2}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Unread</p>
                <p className="text-3xl font-black text-orange-600">{unreadCount}</p>
              </div>
              <div className="text-4xl">🆕</div>
            </div>
          </GlassCard>

          <GlassCard glow delay={0.3}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">High Match (≥75%)</p>
                <p className="text-3xl font-black text-green-600">{highMatchCount}</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </GlassCard>
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-5 mb-8 border border-white/50"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'All', icon: '📋' },
                { id: 'unread', label: `Unread (${unreadCount})`, icon: '🆕' },
                { id: 'high-match', label: 'High Match', icon: '⭐' }
              ].map(btn => (
                <motion.button
                  key={btn.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(btn.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    filter === btn.id
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{btn.icon}</span> {btn.label}
                </motion.button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:border-blue-500 bg-white transition-all"
              >
                <option value="recent">Most Recent</option>
                <option value="match-percent">Highest Match %</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        {isLoading ? (
          <SkeletonLoader count={5} type="card" />
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-16 text-center border border-white/50"
          >
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              {filter === 'unread'
                ? 'Great! You\'ve read all your notifications. Check back soon for new opportunities.'
                : filter === 'high-match'
                ? 'No jobs matching ≥75% of your skills yet. Keep updating your profile!'
                : 'Create a complete profile and add your skills to get job matches.'}
            </p>
            {filter !== 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setFilter('all')}
                className="text-blue-600 font-semibold hover:text-blue-700 transition flex items-center justify-center gap-2 mx-auto"
              >
                Show all notifications <span>→</span>
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredNotifications.map((notification, idx) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkAsRead(notification._id);
                  }
                }}
              >
                <NotificationCard
                  notification={notification}
                  onClose={() => handleCloseNotification(notification._id)}
                  onApply={handleApply}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Suggestion Box */}
        {filter === 'high-match' && filteredNotifications.length === 0 && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <p className="text-gray-900 font-semibold mb-2">Want more job matches?</p>
                <p className="text-gray-700 text-sm mb-3">
                  Update your skills and profile to unlock more job opportunities that match your expertise.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
                >
                  View All Jobs →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
              className="mt-2 text-blue-600 font-medium hover:text-blue-700 transition"
            >
              View all notifications →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentNotifications;
