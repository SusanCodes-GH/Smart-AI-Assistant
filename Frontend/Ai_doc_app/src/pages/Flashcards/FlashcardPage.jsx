import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  X,
  Sparkles,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

import flashcardService from '../../services/flashcardService'
import aiService from '../../services/aiService'
import Flashcard from '../../components/flashcards/Flashcard'
import styles from './flashcard.module.css'

const FlashcardPage = () => {

  const { id: documentId } = useParams()
  const [flashcardSets, setFlashcardSets] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await flashcardService.getFlashcardsForDocument(
        documentId
      );
      setFlashcardSets(response.data[0]);
      setFlashcards(response.data[0]?.cards || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFlashcards();
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully.");
      fetchFlashcards();
    } catch (error) {
      toast.error(error)
    } finally {
      setGenerating(false);
    }
  }

  const handleNextCard = () => {
    setIsFlipped(false);
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex + 1) % flashcards.length
    );
  }

  const handlePrevCard = () => {
    setIsFlipped(false);
    handleReview(currentCardIndex);
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  }

  const handleReview = async (index) => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard) return;

    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
      toast.success('Flashcard reviewed');
    } catch (error) {
      toast.error('Failed to review flashcard.');
    } 
  }

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId);
      setFlashcards((prevFlashcards) => 
        prevFlashcards.map((card) => 
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        )
      );
      toast.success("Flashcard starred status updated!");
    } catch (error) {
      toast.error("Failed to update star status.");
    }
  }

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcard(flashcardSets._id);
      toast.success("Flashcard set deleted successfully!");
      setIsDeleteModalOpen(false);
      fetchFlashcards();
    } catch (error) {
      toast.error(error.message || "Failed to delete flashcard set!");
    } finally {
      setDeleting(false);
    }
  }

  const renderFlashcardContent = () => {
    if (loading) {
      return "Loading..."
    }

    if (flashcards.length === 0) {
      return (
        <div className={styles.cntr}>
          <div className={styles.emp_box}>

            <div className={styles.lgo}>
              <FileText className='' strokeWidth={1.5} />
            </div>
            <div>
              <h3>No Flashcards Yet</h3>
              <p>Generate flashcards from your document to start learning.</p>
            </div>

          </div>
        </div>
      )
    }

    const currentCard = flashcards[currentCardIndex];

    return (
      <div>

        <div>
          <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
        </div>

        <div className={styles.card_navigation}>
          <button
            className={styles.nav_btn}
            onClick={handlePrevCard}
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft strokeWidth={2} size={16} />Previous
          </button>
          <div className={styles.cd_count}>
            <span>
              {currentCardIndex + 1} / {flashcards.length}
            </span>
          </div>
          <button
            className={styles.nav_btn}
            onClick={handleNextCard}
            disabled={flashcards.length <= 1}
          >
            Next <ChevronRight strokeWidth={2} size={16} />
          </button>

        </div>

      </div>
    )

  }

  return (
    <div className={styles.results_container}>

      <div className={styles.back_link}>
        <Link to={`/documents/${documentId}`} >
          <span>
            <ArrowLeft size={17} strokeWidth={2} />
            Back to Document
          </span>
        </Link>
      </div>

      <div style={{marginBottom: "20px"}}>
        <div className={styles.cont}>
          <h2 className={styles.results_title}>Flashcards</h2>
          {!loading && (
            flashcards.length > 0 ? (
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleting}
                className={styles.del}
              >
                <Trash2 size={16} strokeWidth={2} /> Delete set
              </button>
            ) : (
            <button
              onClick={handleGenerateFlashcards} 
              disabled={generating}
              className={styles.upd}
            >
              {generating ? "Generating..." : (
                <>
                  <Plus size={16} strokeWidth={2} />
                  Generate Flashcards
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {renderFlashcardContent()}

      {isDeleteModalOpen && (
        <div className={styles.modal_overlay}>
          <div className={styles.modal_box}>
            <button
              className={styles.close_btn}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <X strokeWidth={2} />
            </button>

            <div className={`${styles.modal_icon} ${styles.danger}`}>
              <Trash2 strokeWidth={2} />
            </div>

            <h3>Confirm Deletion</h3>

            <p className={styles.modal_text}>
              Are you sure you want to delete all flashcards for this document? This action cannot be undone.
            </p>

            <div className={styles.modal_actions}>
              <button
                className={`${styles.btn} ${styles.cancel}`}
                type='button'
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.delete}`}
                onClick={handleDeleteFlashcardSet}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      

    </div>
  )
}

export default FlashcardPage