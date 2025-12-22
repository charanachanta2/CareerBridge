import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import API from '../../api/axios'
import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, Target, Mail, Award, ArrowRight } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import GradientCard from '../../components/ui/GradientCard'
import GlassCard from '../../components/ui/GlassCard'
import AnimatedBadge from '../../components/ui/AnimatedBadge'
import SkeletonLoader from '../../components/ui/SkeletonLoader'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, applicationsRes, notificationsRes, jobsRes] = await Promise.all([
          API.get('/student/dashboard'), // token auto-added
          API.get('/student/applications'),
          API.get('/student/notifications'),
          API.get('/student/jobs')
        ])

        setDashboard(dashboardRes.data)
        setApplications(applicationsRes.data)
        setNotifications(notificationsRes.data.notifications || [])
        setUnreadCount(notificationsRes.data.unreadCount || 0)
        setJobs(jobsRes.data || [])
      } catch (error) {
        console.error('Error loading student dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.put(`/student/notifications/${notificationId}/read`)
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const chartColors = ['#FF8A80', '#80D8FF', '#FFD180', '#A7FFEB', '#FFD6A5']

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <SkeletonLoader count={4} />
        </div>
      </div>
    </div>
  )

  const applicationsData = [
    { name: 'Applied', value: dashboard?.totalApplications || 0 },
    { name: 'Shortlisted', value: dashboard?.shortlisted || 0 },
    { name: 'Rejected', value: dashboard?.rejected || 0 },
  ]

  const skillsData =
    dashboard?.skills?.map(skill => ({ name: skill, value: 1 })) || []

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeTab="dashboard" />
        <div className="flex-1 p-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 text-purple-900 rounded-xl p-10 mb-8 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Welcome back, {dashboard?.name || user?.name || 'Student'}!
            </h1>
            <p className="text-purple-700 text-lg mb-6">
              Here’s your career journey overview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Applications
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboard?.totalApplications || 0}
                </p>
              </div>

              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Skills
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboard?.skills?.length || 0}
                </p>
                {dashboard?.skills && dashboard.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 justify-center max-w-xs">
                    {dashboard.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {dashboard.skills.length > 5 && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        +{dashboard.skills.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white text-purple-900 rounded-xl p-6 shadow-md flex flex-col items-center">
                <p className="text-sm font-semibold uppercase tracking-wide">
                  Profile Completion
                </p>
                <p className="text-3xl font-bold mt-2">
                  {dashboard?.profileCompletion || 80}%
                </p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="bg-white shadow-md rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Job Opportunities
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h2>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 rounded-lg border-2 ${
                      notification.isRead 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {notification.job?.title} at {notification.job?.company}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.job?.location} • {notification.matchPercentage}% skill match
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="ml-4 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {notifications.length > 5 && (
                <p className="text-sm text-gray-500 mt-3 text-center">
                  Showing 5 of {notifications.length} notifications
                </p>
              )}
            </div>
          )}

          {/* Active Jobs */}
          <div className="bg-white shadow-md rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Active Jobs</h2>
              <p className="text-sm text-gray-500">{jobs.length} opportunities</p>
            </div>
            {jobs.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.slice(0, 4).map((job) => (
                  <div key={job._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        {job.jobType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skillsRequired?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.skillsRequired.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No active jobs available right now.</p>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Applications Status
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={applicationsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {applicationsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[index % chartColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Skills Overview
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={skillsData.length > 0 ? skillsData : [{ name: 'No Skills', value: 1 }]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(skillsData.length > 0 ? skillsData : [{ name: 'No Skills', value: 1 }]).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[index % chartColors.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
