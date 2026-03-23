import React, { useState, useEffect } from 'react'
import progressService from '../../services/progressService'
import toast from 'react-hot-toast'
import { FileText, BookOpen, BrainCircuit, TrendingUp, Clock } from 'lucide-react'
import styles from './dashboard.module.css'

const DashboardPage = () => {

  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData();
        console.log("Data___getDashboardData: ", data);

        setDashboardData(data.data)
      } catch (error) {
        toast.error('Failed to fetch dashboard data.');
        console.error(error)
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className={styles.loading}>
      <p>Loading...</p>
    </div>
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="">
        <div className="">
          <div className="">
            <TrendingUp className='' />
          </div>
          <p>No dashboard data available.</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      colr: 'blue'
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards,
      icon: BookOpen,
      colr: 'pink'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      colr: 'green'
    }
  ]

  return (
    <div className={styles.page}>
      <h2 className={styles.page_title}>Dashboard</h2>
      <p className={styles.page_subtitle}>Track your learning progress and activity</p>

      {/* Stats Cards */}
      <div className={styles.stats_grid}>

        { stats.map((stat, index) => (
          <div
            key={index}
            className={styles.stat_card}
          >
            <div className={`${styles.icon} ${styles[stat.colr]}`}>
              <stat.icon className='' strokeWidth={2} />
            </div>
            <div>
              <p>{stat.label}</p>
              <h3>{stat.value}</h3>
            </div>
          </div>
        )) }


      </div>

      {/* Recent Activity */}
      <div className={styles.activity_card}>

        <div className={styles.app_name} style={{"marginBottom":"10px"}} >
          <div className={styles.timer} >
            <Clock strokeWidth={2} />
          </div>
          <h3>Recent Activity</h3>
        </div>

        { dashboardData.recentActivity && (dashboardData.recentActivity.documents.length > 0 || dashboardData.recentActivity.quizzes.length > 0 ) ? (
          <div>
            {[
              ...(dashboardData.recentActivity.documents || []).map(doc => ({
                id: doc._id,
                description: doc.title,
                timestamp: doc.lastAccessed,
                link: `/documents/${doc._id}`,
                type: 'document'
              })),
              ...(dashboardData.recentActivity.quizzes || []).map(quiz => ({
                id: quiz._id,
                description: quiz.title,
                timestamp: quiz.lastAccessed,
                link: `/quizzes/${quiz._id}`,
                type: 'quiz'
              }))
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((activity, index) => (
                <div
                  key={activity.id || index}
                  className={styles.activity_item}
                >
                  <span className={`${styles.dot} ${ activity.type === 'document' ? 'blue' : 'green' }`}></span>
                  <div>
                    <p>{ activity.type === 'document' ? 'Accessed Document: ' : 'Attempted Quiz: ' }{ activity.description }</p>
                    <small>{ new Date(activity.timestamp).toLocaleString() }</small>
                  </div>
                  { activity.link && (
                    <a href={activity.link}>View</a>
                  ) }
                </div>
              ))
            }
          </div>
        ) : (
          <div className={styles.activity_item}>
            <Clock className='' />
            <div>
              <p>No recent activity yet.</p>
              <small>Start learning to see your progress.</small>
            </div>
          </div>
        ) }


        
        
      </div>
    </div>
  )
}

export default DashboardPage