'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/lib/api';

const resolveImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseHost = BASE_URL.replace(/\/api$/, '');
  return `${baseHost}/${path.replace(/^\/?/, '')}`;
};

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Theme management
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
  const userName = fullName || user?.username || user?.email || 'User';
  const userRole = user?.role?.name || '—';
  const initials = (
    `${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`.trim() ||
    (user?.username || user?.email || 'U').slice(0, 2)
  ).toUpperCase();

  const avatarUrl = user?.profile_image || user?.profile_img ? resolveImageUrl(user.profile_image || user.profile_img) : '';

  const handleSignOut = () => {
    logout();
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="navbar-right">
        {/* Theme Toggle */}
        <button 
          className="user-menu-btn" 
          onClick={toggleTheme}
          style={{ width: '40px', height: '40px', padding: 0, justifyContent: 'center' }}
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User menu */}
        <div className="user-menu" ref={dropdownRef}>
          <button
            className="user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="user-avatar">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', display: 'block' }} 
                />
              ) : (
                initials
              )}
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRole}</div>
            </div>
          </button>

          <div className={`user-dropdown ${dropdownOpen ? 'open' : ''}`}>
            <a href="/profile" className="user-dropdown-item">
              <User size={16} /> Profile
            </a>
            <a href="/settings" className="user-dropdown-item">
              <Settings size={16} /> Settings
            </a>
            <div className="user-dropdown-divider" />
            <button
              className="user-dropdown-item"
              onClick={handleSignOut}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
