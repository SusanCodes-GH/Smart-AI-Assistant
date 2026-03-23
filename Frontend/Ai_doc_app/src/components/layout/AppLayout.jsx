import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import styles from './appLayout.module.css';

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  return (
    <div className={styles.dashboard_container}>
      <Header toggleSidebar={toggleSidebar} />
      <div className={styles.dashboard_main}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout