import React, { useState, useEffect } from 'react'
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Trash2,
    ArrowLeft,
    Sparkles,
    Brain,
    X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import moment from 'moment'

import flashcardService from "../../services/flashcardService"
import aiService from "../../services/aiService"
import Flashcard from './Flashcard'
import styles from './flashcardMgr.module.css'

const FlashcardManager = ({ documentId }) => {

  const [flashcardSets, setFlashcardSets] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [setToDelete, setSetToDelete] = useState(null)
  const [isFlipped, setIsFlipped] = useState(false);

  const fetchFlashcardSets = async () => {
    setLoading(true)
    try {
        const response = await flashcardService.getFlashcardsForDocument(
            documentId
        );
        setFlashcardSets(response.data)
    } catch (error) {
        toast.error("Failed to fetch flashcard sets.")
        console.log(error)
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (documentId) {
        fetchFlashcardSets();
    }
  }, [documentId]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
        await aiService.generateFlashcards(documentId);
        toast.success("Flashcards generated successfully!");
        fetchFlashcardSets();
    } catch (error) {
        toast.error(error.message || "Failed to generate flashcards.");
    } finally {
        setGenerating(false);
    }
  }

  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    if (!currentCard) return;

    try {
        await flashcardService.reviewFlashcard(currentCard._id, index);
        toast.success("Flashcard reviewed!");
    } catch (error) {
        toast.error("Failed to review Flashcard.");
    }
  }

  const handleNextCard = () => {
    if (selectedSet) {
        setIsFlipped(false)
        handleReview(currentCardIndex);
        setCurrentCardIndex(
            (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
        );
    }
  }

  const handlePrevCard = () => {
    if (selectedSet) {
        setIsFlipped(false)
        handleReview(currentCardIndex);
        setCurrentCardIndex(
            (prevIndex) => (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
        );
    }
  }

  const handleToggleStar = async (cardId) => {
    try {
        await flashcardService.toggleStar(cardId);
        const updatedSets = flashcardSets.map((set) => {
            if (set._id === selectedSet._id) {
                const updatedCards = set.cards.map((card) => 
                    card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
                );
                return { ...set, cards: updatedCards }
            }
            return set;
        });
        setFlashcardSets(updatedSets);
        setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
        toast.success("Flashcard starred status updated");
    } catch (error) {
        toast.error("Failed to update star status.")
    }
  }

  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
        await flashcardService.deleteFlashcard(setToDelete._id);
        toast.success("Flashcard set deleted successfully");
        setIsDeleteModalOpen(false);
        setSetToDelete(null);
        fetchFlashcardSets();
    } catch (error) {
        toast.error(error.message || "Failed to delete flashcard set.");
    } finally {
        setDeleting(false);
    }
  }

  const hanldeSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  }

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet.cards[currentCardIndex];

    return (
        <div className={styles.flashcard_wrapper}>
            {/* Back Button */}
            <button
              className={styles.back_link}
              onClick={() => setSelectedSet(null)}
            >
                <ArrowLeft strokeWidth={2} size={16} /> Back to Sets
            </button>

            <div>
                <div>
                    <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
                </div>
                <div className={styles.card_navigation}>
                    <button
                      className={styles.nav_btn}
                      onClick={handlePrevCard}
                      disabled={selectedSet.cards.length <= 1}
                    >
                        <ChevronLeft strokeWidth={2.5} /> Previous
                    </button>
                    <div className={styles.cd_count}>
                        <span>
                            {currentCardIndex + 1}{" "}
                            <span style={{"color":"gray"}}>/</span>{" "}
                            {selectedSet.cards.length}
                        </span>
                    </div>
                    <button
                      className={styles.nav_btn}
                      onClick={handleNextCard}
                      disabled={selectedSet.cards.length <= 1}
                    >
                        Next
                        <ChevronRight strokeWidth={2.5} />
                    </button>
                </div>
                
            </div>
        </div>
    )
  }

  const renderSetList = () => {
    if (loading) {
        return "Loading..."
    }

    if (flashcardSets.length === 0) {
        return (
        <div className={styles.emp_box}>
            <div className={styles.lgo}>
                <Brain strokeWidth={2} />
            </div>
            <div>
                <h3>No Flashcards Yet</h3>
                <p>Generate flashcards from your document to start learning and reinforce your knowledge.</p>
            </div>
            <div style={{textAlign : "center"}} >
                <button
                    onClick={handleGenerateFlashcards}
                    disabled={generating}
                    className={styles.upd}
                >
                    {generating ? "Generating..." : (
                        <>
                            <Sparkles size={16} strokeWidth={2} />
                            Generate Flashcards
                        </>
                    ) }
                </button>
            </div>
        </div>
    )
    }

    return (
        <div className={styles.flashcard_wrapper}>
            {/* Header set */}
            <div>
                <div className={styles.flashcard_header}>
                    <div>
                        <h3>Your Flashcard Sets</h3>
                        <p>
                            {flashcardSets.length}{" "}
                            {flashcardSets.length === 1 ? "set" : "sets"} available
                        </p>
                    </div>
                
                    <button
                        className={styles.primary_btn}
                        onClick={handleGenerateFlashcards}
                        disabled={generating}
                        >
                            {generating ? "Generating..." : (
                                <>
                                    <Plus size={16} strokeWidth={2} />
                                    Generate New Set
                                </>
                            )}
                    </button>
                </div>
            </div>

            {/* Flashcards set grid */}
            <div className={styles.flashcard_grid}>
                {flashcardSets.map((set) => (
                    <div
                      className={styles.flashcard_card}
                      key={set._id}
                      onClick={() => hanldeSelectSet(set)}
                    >
                        <button
                          className={styles.close_btn}
                          onClick={(e) => handleDeleteRequest(e, set)}
                        >
                            <Trash2 size={19} strokeWidth={2} />
                        </button>

                        <div>
                            <div className={styles.flash_icon}>
                                <Brain strokeWidth={2} />
                            </div>
                            <div>
                                <h4>Flashcard Set</h4>
                                <p className={styles.created_date}>Created {moment(set.createdAt).format("MMM D, YYYY")}</p>
                            </div>
                            <div className={styles.card_count}>
                                {set.cards.length}{" "}
                                {set.cards.length === 1 ? "card" : "cards"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )

  }

  return (
    <>
    <div>
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
    </div>
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
              Are you sure you want to delete this flashcard set? This action cannot be undone and all cards will be permenantly removed!
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
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Set"}
              </button>
            </div>
          </div>
        </div>
    )}
    </>
  )
}

export default FlashcardManager