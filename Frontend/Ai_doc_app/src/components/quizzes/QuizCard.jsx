import React from 'react'
import { Link } from 'react-router-dom'
import { Play, BarChart2, Trash2, Award } from 'lucide-react'
import moment from 'moment'
import styles from './quizMgr.module.css'

const QuizCard = ({quiz, onDelete}) => {
  return (
    <div className={styles.flashcard_card}>

      <button 
        className={styles.close_btn}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz)
        }}
      >
        <Trash2 size={19} strokeWidth={2} />
      </button>

      <div>
        {/* Status Badge */}
        <div className={styles.score_box}>
          <Award strokeWidth={2} size={16} />
          Score: {quiz?.score}
        </div>

        <div>
          <h4 title={quiz.title}>
            {quiz.title || `Quiz - ${moment(quiz.createdAt).format("MMM D, YYYY")}`}
          </h4>
          <p>
            Created {moment(quiz.createdAt).format("MMM D, YYYY")}
          </p>
        </div>

        {/* Quiz Info */}
        <div className={styles.card_count}>
          {quiz.questions.length}{" "}
          {quiz.questions.length === 1 ? "Question" : "Questions" }
        </div>
      </div>

      {/* Action Button */}
      <div style={{ textAlign: 'center' }}>
        {quiz?.userAnswers?.length > 0 ? (
          <Link to={`/quizzes/${quiz._id}/results`}  style={{ textDecoration: 'none' }}>
            <button className={styles.action_btn}>
              <BarChart2 strokeWidth={2} size={17} /> View Results
            </button>
          </Link>
        ) : (
          <Link to={`/quizzes/${quiz._id}`} style={{ textDecoration: 'none' }} >
            <button className={`${styles.action_btn} ${styles.st}`}>
              <Play strokeWidth={2} size={17} /> Start Quiz
            </button>
          </Link>
        )}
      </div>

    </div>
  )
}

export default QuizCard