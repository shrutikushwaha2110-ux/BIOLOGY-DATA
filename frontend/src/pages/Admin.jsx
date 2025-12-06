import { 
  Users, 
  FileText, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export function Admin({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for charts
  const monthlyData = [
    { month: 'Jan', submissions: 45, users: 120 },
    { month: 'Feb', submissions: 52, users: 145 },
    { month: 'Mar', submissions: 48, users: 160 },
    { month: 'Apr', submissions: 61, users: 180 },
    { month: 'May', submissions: 70, users: 210 },
    { month: 'Jun', submissions: 78, users: 245 }
  ];

  const categoryData = [
    { category: 'Genetics', count: 450 },
    { category: 'Microbiology', count: 380 },
    { category: 'Ecology', count: 320 },
    { category: 'Biotechnology', count: 290 },
    { category: 'Neuroscience', count: 210 }
  ];

  const pendingResearch = [
    {
      id: 1,
      title: 'Novel Approach to CRISPR Gene Therapy',
      author: 'Dr. Sarah Chen',
      category: 'Genetics',
      submittedDate: '2024-11-26',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Microbiome Analysis in Urban Environments',
      author: 'Prof. Michael Rodriguez',
      category: 'Microbiology',
      submittedDate: '2024-11-25',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Climate Change Effects on Coral Reefs',
      author: 'Dr. Emily Thompson',
      category: 'Ecology',
      submittedDate: '2024-11-24',
      status: 'pending'
    }
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', email: 'john@university.edu', role: 'Researcher', joined: '2024-11-20' },
    { id: 2, name: 'Maria Garcia', email: 'maria@institute.org', role: 'Researcher', joined: '2024-11-19' },
    { id: 3, name: 'David Kim', email: 'david@lab.com', role: 'Student', joined: '2024-11-18' },
    { id: 4, name: 'Lisa Wang', email: 'lisa@research.edu', role: 'Professor', joined: '2024-11-17' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage research submissions, users, and platform analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600">+12%</span>
            </div>
            <div className="text-3xl text-gray-900 mb-1">2,847</div>
            <div className="text-sm text-gray-600">Total Research Papers</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600">+8%</span>
            </div>
            <div className="text-3xl text-gray-900 mb-1">1,245</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-yellow-600">Pending</span>
            </div>
            <div className="text-3xl text-gray-900 mb-1">23</div>
            <div className="text-sm text-gray-600">Awaiting Review</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600">+24%</span>
            </div>
            <div className="text-3xl text-gray-900 mb-1">45K</div>
            <div className="text-sm text-gray-600">Monthly Views</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'research'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Research Management
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                User Management
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-4">Monthly Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Line type="monotone" dataKey="submissions" stroke="#4CAF50" strokeWidth={2} name="Submissions" />
                        <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="New Users" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div>
                    <h3 className="text-xl text-gray-900 mb-4">Research by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="category" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="count" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Research paper approved: &quot;CRISPR Applications in Medicine&quot;</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">New user registered: Dr. James Wilson</p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">New submission awaiting review</p>
                        <p className="text-xs text-gray-500">8 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-gray-900">Pending Research Submissions</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {pendingResearch.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-gray-900">{item.title}</h4>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Pending</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">By {item.author}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">{item.category}</span>
                            <span>Submitted: {item.submittedDate}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-gray-900">User Management</h3>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    Add New User
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button className="p-1 text-gray-600 hover:text-blue-600 transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-red-600 transition-colors" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-600 hover:text-gray-900 transition-colors" title="More">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
