'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  Key, 
  Megaphone, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  Mail, 
  Settings, 
  ClipboardList,
  UserCircle,
  ChevronDown,
  List,
  Plus,
  FolderTree
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        label: 'News',
        icon: <Newspaper size={20} />,
        children: [
          { label: 'All News', href: '/posts/news', icon: <List size={16} /> },
          { label: 'Add News', href: '/posts/news/create', icon: <Plus size={16} /> },
          { label: 'Categories', href: '/terms/news-category', icon: <FolderTree size={16} /> },
        ],
      },
      {
        label: 'Events',
        icon: <Calendar size={20} />,
        children: [
          { label: 'All Events', href: '/posts/event', icon: <List size={16} /> },
          { label: 'Add Events', href: '/posts/event/create', icon: <Plus size={16} /> },
          { label: 'Categories', href: '/terms/event-category', icon: <FolderTree size={16} /> },
        ],
      },
      { label: 'Press Releases', href: '/posts/press-release', icon: <Megaphone size={20} /> },
      { label: 'Gallery', href: '/media', icon: <ImageIcon size={20} /> },
      { label: 'Enquiries', href: '/enquiry', icon: <Mail size={20} /> },
    ],
  },
  {
    title: 'Users & Access',
    items: [
      { label: 'Users', href: '/users', icon: <Users size={20} /> },
      { label: 'Roles', href: '/roles', icon: <Shield size={20} /> },
      { label: 'Permissions', href: '/permissions', icon: <Key size={20} /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
      { label: 'Action Log', href: '/action-log', icon: <ClipboardList size={20} /> },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Check if any child is active to auto-expand & highlight parent
  const isChildActive = (children) =>
    children?.some(
      (child) =>
        pathname === child.href ||
        (child.href !== '/dashboard' && pathname.startsWith(child.href))
    );

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo-mark">A</div>
          <span className="sidebar-logo">Airfloa</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item) => {
                // Dropdown item (has children)
                if (item.children) {
                  const childActive = isChildActive(item.children);
                  const isExpanded = openDropdowns[item.label] ?? childActive;

                  return (
                    <div key={item.label} className="sidebar-dropdown">
                      <button
                        className={`sidebar-link sidebar-dropdown-toggle ${childActive || isExpanded ? 'active' : ''}`}
                        onClick={() => toggleDropdown(item.label)}
                        type="button"
                      >
                        <span className="icon">{item.icon}</span>
                        <span>{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`sidebar-dropdown-chevron ${isExpanded ? 'rotated' : ''}`}
                        />
                      </button>
                      <div className={`sidebar-dropdown-menu ${isExpanded ? 'open' : ''}`}>
                        {item.children.map((child) => {
                          const isActive = pathname === child.href;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`sidebar-link sidebar-sub-link ${isActive ? 'active' : ''}`}
                              onClick={onClose}
                            >
                              <span className="icon">{child.icon}</span>
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // Normal link item
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link href="/profile" className="sidebar-link">
            <span className="icon"><UserCircle size={20} /></span>
            <span>Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
