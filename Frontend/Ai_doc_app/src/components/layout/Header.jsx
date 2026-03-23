import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Bell, User, Menu } from 'lucide-react'
import { BrainCircuit } from 'lucide-react'
import styles from './appLayout.module.css';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return <header className={styles.dashboard_header}>

        <div className={styles.app_name}>
          <span className={styles.prof}>
            <BrainCircuit className='' strokeWidth={2} />
          </span>
          <h3>AI Learning Assistant</h3>
        </div>

        <div className={styles.app_name}>
          <div className={styles.prof}>
            <User size={18} strokeWidth={2.5} />
          </div>
          <div className={styles.profile_info}>
            <h4>{ user?.username || 'User' }</h4>
            <span>{ user?.email || 'user@gmail.com' }</span>
          </div>
        </div>


        {/*
    <div className="">
        Mobile Menu Button 

        <button
          onClick={toggleSidebar}
          className=''
          aria-label='Toggle sidebar'
        >
          <Menu size={24} />
        </button>  

        <div className="">

          <button>
            <Bell size={20} strokeWidth={2} className='' />

            <span></span>
          </button>

        </div>
    </div>
    */}


    </header>
}

export default Header