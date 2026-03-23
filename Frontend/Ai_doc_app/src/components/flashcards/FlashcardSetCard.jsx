import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, FileText, Sparkles, TrendingUp } from 'lucide-react'
import moment from 'moment'
import styles from '../../pages/Flashcards/flashcardList.module.css'

const FlashcardSetCard = ({flashcardSet}) => {
  const navigate = useNavigate();

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
  }

  const reviewedCount = flashcardSet?.cards?.filter(card => card.lastReviewed)?.length || 0;
  const totalCards = flashcardSet.cards.length;
  const progressPercentage = totalCards > 0 ? Math.round((reviewedCount / totalCards) * 100) : 0 ;

  return (
    <div
      className={styles.flashcard_card}
    >
      <div className={styles.card_header}>
        <div className={styles.icon}>
          <BookOpen size={17} strokeWidth={2} />
        </div>
        <div>
          <h3>{flashcardSet?.documentId?.title}</h3>
          <p>Created {moment(flashcardSet.createdAt).fromNow()}</p>
        </div>
      </div>

      <div className={styles.card_stats}>
        <span className={styles.badge}>
          {totalCards} {totalCards === 1 ? 'Card' : 'Cards'}
        </span>
        <span className={styles.badge}>
          <TrendingUp strokeWidth={2} />
          <span>{progressPercentage}%</span>
        </span>
      </div>

      {totalCards > 0 && (
        <>
        <div className={styles.progress_text}>
          <span>Progress</span>
          <span>
            {reviewedCount}/{totalCards} reviewed
          </span>
        </div>
        <div className={styles.progress_bar}>
          <div className={styles.progress_fill} style={{width: `${progressPercentage}%`}}></div>
        </div>
        </>
      )}

      <button
        className={styles.study_btn}
        onClick={(e) => {
          e.stopPropagation();
          handleStudyNow();
        }}
      >
        <Sparkles size={16} strokeWidth={2} />
        Study Now
      </button>

    </div>
  )
}

export default FlashcardSetCard