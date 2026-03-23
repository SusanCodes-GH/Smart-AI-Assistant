import { useState } from 'react'
import { Star, RotateCcw } from 'lucide-react';
import styles from './flsCard.module.css'

const Flashcard = ({ flashcard, onToggleStar, isFlipped, setIsFlipped }) => {
  

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  }

  return (
    <div  className={styles.fls_crd}>
      <div
        style={{
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        className={styles.flashcard_inner}
      >

        {/* Front of the card: Question */}
        <div className={`${styles.flashcard} ${styles.white_card}`} onClick={handleFlip}>
          <span className={styles.difficulty_tag}>{flashcard?.difficulty}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(flashcard._id);
            }}
            className={`${styles.card_icon} ${flashcard.isStarred ? styles.str_clr : ''}`}
          >
            <Star size={18} strokeWidth={2} fill={flashcard.isStarred ? 'white' : 'none'} />
          </button>
          <div className={styles.card_content}>
              <p>{flashcard.question}</p>
          </div>

          <div className={styles.card_hint}>
              <RotateCcw strokeWidth={2} size={14} />
              Click to reveal answer
          </div>
        </div>

        {/* Back of the card: Answer */}
        <div className={`${styles.flashcard} ${styles.green_card}`} onClick={handleFlip}>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(flashcard._id);
            }}
            className={`${styles.card_icon} ${flashcard.isStarred ? styles.str_clr : ''}`}
          >
            <Star size={18} strokeWidth={2} fill={flashcard.isStarred ? 'white' : 'none'} />
          </button>

          <div className={styles.card_content}>
            <p>{flashcard.answer}</p>
          </div>

          <div className={styles.card_hint}>
            <RotateCcw strokeWidth={2} size={14} />
            Click to see question
          </div>

        </div>
        

      </div>
    </div>
  )
}

export default Flashcard