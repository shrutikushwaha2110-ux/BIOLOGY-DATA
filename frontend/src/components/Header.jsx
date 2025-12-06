import { Search, Menu, LogOut, User as UserIcon, Shield } from 'lucide-react';

export function Header({ currentPage, onNavigate, user, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L12 22M12 2C8 6 5 10 5 14C5 18 8 22 12 22M12 2C16 6 19 10 19 14C19 18 16 22 12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="8" r="1.5" fill="currentColor" />
                <circle cx="12" cy="14" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl text-gray-900">Biology in Data</h1>
            </div>
          </button>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`transition-colors ${currentPage === 'home' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('research')}
              className={`transition-colors ${currentPage === 'research' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Research
            </button>
            <button
              onClick={() => onNavigate('categories')}
              className={`transition-colors ${currentPage === 'categories' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Categories
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`transition-colors ${currentPage === 'about' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              About
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`transition-colors flex items-center gap-1 ${currentPage === 'admin' ? 'text-green-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
          </nav>

          {/* User Menu and Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('research')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Search Research"
            >
              <Search className="w-5 h-5" />
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{user.email.split('@')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-green-600 text-white rounded text-xs">Admin</span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="hidden md:block px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
              >
                Sign In
              </button>
            )}

            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
