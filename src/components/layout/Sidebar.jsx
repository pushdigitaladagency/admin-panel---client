'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  ClipboardList,
  UserCircle,
  ChevronDown,
  List,
  Plus,
  FolderTree,
  Briefcase,
  Award,
  Building2,
  TrendingUp,
  Globe,
  SlidersHorizontal,
  FileText
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
      {
        label: 'Press Releases',
        icon: <Megaphone size={20} />,
        children: [
          { label: 'All Releases', href: '/posts/press-release', icon: <List size={16} /> },
          { label: 'Add Release', href: '/posts/press-release/create', icon: <Plus size={16} /> },
          { label: 'Categories', href: '/terms/press-release-category', icon: <FolderTree size={16} /> },
        ],
      },
      {
        label: 'Gallery',
        icon: <ImageIcon size={20} />,
        children: [
          { label: 'Media Manager', href: '/media', icon: <List size={16} /> },
          { label: 'Categories', href: '/terms/gallery-category', icon: <FolderTree size={16} /> },
        ],
      },
      { label: 'Enquiries', href: '/enquiry', icon: <Mail size={20} /> },
    ],
  },
  {
    title: 'Corporate',
    items: [
      {
        label: 'Careers',
        icon: <Briefcase size={20} />,
        children: [
          { label: 'Job Postings', href: '/career-posts', icon: <List size={16} /> },
          { label: 'Add Posting', href: '/career-posts/create', icon: <Plus size={16} /> },
          { label: 'Applications', href: '/career-applications', icon: <FileText size={16} /> },
        ],
      },
      { label: 'Certificates', href: '/certificates', icon: <Award size={20} /> },
      { label: 'Client & Partner Logos', href: '/client-partner-logos', icon: <Building2 size={20} /> },
      {
        label: 'Investors',
        icon: <TrendingUp size={20} />,
        children: [
          { label: 'Documents', href: '/investor-documents', icon: <List size={16} /> },
          { label: 'Add Document', href: '/investor-documents/create', icon: <Plus size={16} /> },
          { label: 'Categories', href: '/investor-categories', icon: <FolderTree size={16} /> },
        ],
      },
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
      { label: 'Meta Mappings', href: '/meta-mappings', icon: <Globe size={20} /> },
      { label: 'Global Settings', href: '/global-settings', icon: <SlidersHorizontal size={20} /> },
      { label: 'Action Log', href: '/action-log', icon: <ClipboardList size={20} /> },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { can, loading } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState({});

  // The sidebar is gated by the 'sidebar' module's view permission.
  // Render optimistically while /me is still loading (avoids a flash for the common
  // case where the role has the grant). Once resolved, a role WITHOUT sidebar:view
  // is reduced to the "Main" section only (Dashboard) rather than losing all nav.
  const hasSidebar = loading || can('sidebar', 'view');
  const visibleSections = hasSidebar
    ? NAV_SECTIONS
    : NAV_SECTIONS.filter((section) => section.title === 'Main');

  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const normalizePath = (path = '') => path.replace(/\/$/, '') || '/';
  const currentPath = normalizePath(pathname);

  const isRouteActive = (href) => {
    const targetPath = normalizePath(href);
    if (targetPath === '/dashboard') return currentPath === targetPath;
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  const getActiveChildHref = (children = []) =>
    children
      .filter((child) => isRouteActive(child.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href;

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
          <div className="sidebar-logo-mark">
            <img src="/sidebar-logo.svg" alt="Airfloa logo" className="sidebar-logo-image" />
          </div>
          <span className="sidebar-logo">Airfloa - Admin Dashboard</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {visibleSections.map((section) => (
            <div key={section.title}>
              <div className="sidebar-section-title">{section.title}</div>
              {section.items.map((item) => {
                // Dropdown item (has children)
                if (item.children) {
                  const activeChildHref = getActiveChildHref(item.children);
                  const childActive = !!activeChildHref;
                  const isExpanded = childActive || openDropdowns[item.label];

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
                          const isActive = activeChildHref === child.href;

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
                const isActive = isRouteActive(item.href);

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
          <Link href="/profile" className={`sidebar-link ${isRouteActive('/profile') ? 'active' : ''}`}>
            <span className="icon"><UserCircle size={20} /></span>
            <span>Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
