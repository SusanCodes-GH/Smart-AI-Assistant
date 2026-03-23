import React from 'react'

import styles from './appLayout.module.css';
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, FileText, User, LogOut, BookOpen } from 'lucide-react'

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ];

  return (

    <aside className={styles.sidebar}>
        <nav>
          {navLinks.map((link) => (
            <NavLink 
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) => isActive ? `${styles.menu_item} ${styles.active}` : `${styles.menu_item}` }
            >
              <link.icon
                size={18}
                strokeWidth={2.5}
              />
              {link.text}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <nav>
          <button
            onClick={handleLogout}
            className={styles.menu_item}
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
            />
            Logout
          </button>
        </nav>

        </aside>
  )
}

export default Sidebar