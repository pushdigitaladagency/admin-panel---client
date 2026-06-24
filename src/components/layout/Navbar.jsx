'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, Settings, LogOut, Sun, Moon } from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  const router = useRouter();
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

  const userName = 'Admin User';
  const userRole = 'Superadmin';
  const initials = 'AU';

  const handleSignOut = () => {
    // Mock sign out
    router.push('/login');
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
            <div className="user-avatar">{initials}</div>
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
