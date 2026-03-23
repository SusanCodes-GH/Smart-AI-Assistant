import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Brain, Sparkles, X } from 'lucide-react'
import toast from 'react-hot-toast'

import quizService from '../../services/quizService'
import aiService from '../../services/aiService'
import Button from '../common/Button'
import Modal from '../common/Modal'
import QuizCard from './QuizCard'
import styles from './quizMgr.module.css'

const QuizManager = ({documentId}) => {

  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [isGeneratingModalOpen, setIsGeneratingModalOpen] = useState(false)
  const [numQuestions, setNumQuestions] = useState(5)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
        const response = await quizService.getQuizzesForDocument(documentId);
        setQuizzes(response.data)
    } catch (error) {
        toast.error("Failed to fetch quizzes.")
        console.log(error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    if (documentId) {
        fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
        await aiService.generateQuiz(documentId, { numQuestions });
        toast.success("Quiz generated successfully!");
        fetchQuizzes();
    } catch (error) {
        toast.error(error.message || "Failed to generate quiz.");
    } finally {
        setGenerating(false);
    }
  }

  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return;
    setDeleting(true);
    try {
      await quizService.deleteQuiz(selectedQuiz._id);
      toast.success(`'${selectedQuiz.title || 'Quiz'}' deleted.`);
      setIsDeleteModalOpen(false);
      setSelectedQuiz(null);
      setQuizzes(quizzes.filter(q => q._id !== selectedQuiz._id));
    } catch (error) {
      toast.error(error.message || 'Failed to delete quiz.');
    } finally {
      setDeleting(false);
    }
  }

  const renderQuizContent = () => {
    if (loading) {
      return "Loading..."
    }

    if (quizzes.length === 0) {
      return (
        <div className={styles.emp_box}>
            <div className={styles.lgo}>
                <Brain strokeWidth={2} />
            </div>
            <div>
              <h3>No Quizzes Yet</h3>
              <p>Generate a quiz from your document to test your knowledge.</p>
            </div>
        </div>
      )
    }

    return (
      <div className={styles.flashcard_grid}>
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    )

  }

  return (
    <div className={styles.flashcard_wrapper}>

      <div className={styles.flashcard_header}>
        <button 
          className={styles.primary_btn}
          onClick={() => setIsGeneratingModalOpen(true)}
        >
          <>
            <Sparkles size={16} strokeWidth={2} />
            Generate Quiz
          </>
        </button>
      </div>

      {renderQuizContent()}

      {/* Generate Quiz */}
      {isGeneratingModalOpen && (
      <div className={styles.modal_overlay}>
        <div className={styles.modal_box}>

          <button
            className={styles.cls_btn}
            onClick={() => setIsGeneratingModalOpen(false)}
          >
            <X strokeWidth={2} />
          </button>

          <h3>Generate Quiz</h3>

          <form onSubmit={handleGenerateQuiz}>
            <div>
              <label>Number of Questions</label>
              <input 
                type="number"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value)))}
                min="1"
                required
                className=''
                style={{ border: '2px solid gray' }}
              />
            </div>
            <div className={styles.modal_actions}>
              <button
                className={`${styles.btn} ${styles.cancel}`}
                type="button"
                onClick={() => setIsGeneratingModalOpen(false)}
                disabled={generating}
              >
                Cancel
              </button>
              <button
                disabled={generating}
                className={`${styles.btn} ${styles.gen}`}
              >
                {generating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>

        </div>
      </div> )}

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
      
                  <div style={{textAlign: 'center'}}>

                  <h3>Confirm Deletion</h3>
      
                  <p className={styles.modal_text}>
                    Are you sure you want to delete the quiz: <strong>{selectedQuiz?.title || 'this quiz'}</strong>? This action cannot be undone and it will be permenantly removed!
                  </p>

                  </div>
      
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

    </div>
  )
}

export default QuizManager