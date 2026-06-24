'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, User, Settings, LogOut } from 'lucide-react';

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
