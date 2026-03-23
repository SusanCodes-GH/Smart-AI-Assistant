import React, { useState, useEffect } from 'react'
import flashcardService from '../../services/flashcardService'
import FlashcardSetCard from '../../components/flashcards/FlashcardSetCard'
import toast from 'react-hot-toast'
import styles from './flashcardList.module.css'
import { FileText } from 'lucide-react'

const FlashcardListPage = () => {
  const [flahscardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      try {
        const response = await flashcardService.getAllFlashcardSets();

        console.log("fetchFlashcardSets___", response.data);

        setFlashcardSets(response.data);
      } catch (error) {
        toast.error('Failed to fetch flashcard sets.');
        console.error(error)
      } finally {
        setLoading(false);
      }
    }
    fetchFlashcardSets();
  }, []);

  const renderContent = () => {
    if (loading) {
      return "Loading..."
    }

    if (flahscardSets.length === 0) {
      return (
        <div className={styles.cntr}>
          <div className={styles.emp_box}>

            <div className={styles.lgo}>
              <FileText className='' strokeWidth={1.5} />
            </div>
            <div>
              <h3>No Flashcard Sets Found</h3>
              <p>You haven't generated any flahscards yet. Got to a document to create your flashcard set.</p>
            </div>

          </div>
        </div>
      )
    }

    return (
      <div className={styles.flashcards_grid}>
        {flahscardSets.map((set) => (
          <FlashcardSetCard key={set._id} flashcardSet={set} />
        ))}
      </div>
    )    

  }

  return (
    <div className={styles.page}>
      <div className={styles.doc_header}>
        <div>
          <h2>All Flashcard Sets</h2>
        </div>
      </div>

      {renderContent()}

    </div>
  )
}

export default FlashcardListPage