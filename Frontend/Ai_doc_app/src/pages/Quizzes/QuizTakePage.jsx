import React, {useState, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'
import Button from '../../components/common/Button'
import styles from './quizTake.module.css'

const QuizTakePage = () => {

  const { quizId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await quizService.getQuizById(quizId);
        setQuiz(response.data);
      } catch (error) {
        toast.error('Failed to fetch quiz.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.keys(selectedAnswers).map(questionId => {
        const question = quiz.questions.find(q => q._id === questionId);
        const questionIndex = quiz.questions.findIndex(q => q._id === questionId);
        const optionIndex = selectedAnswers[questionId];
        const selectedAnswer = question.options[optionIndex];
        return { questionIndex, selectedAnswer };
      });

      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success('Quiz submitted successfully!');
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return "Loading..."
  }

  if (!quiz || quiz.questions.length === 0) {
    return "Quiz not found or has no questions."
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers.hasOwnProperty(currentQuestion._id);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className={styles.quiz_container}>
      <h2 className={styles.quiz_title}>{quiz.title || 'Take Quiz'}</h2>
      
      {/* Progress Bar */}
      <div className={styles.quiz_progress_header}>
        <div style={{flex: '1'}}>
          <span className={styles.question_count}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <div className={styles.progress_bar}>
            <div className={styles.progress_fill} style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className={styles.answered_count}>{answeredCount} answered</div>
      </div>

      {/* Question card */}
      <div className={styles.quiz_card}>
        
        <div className={styles.question_badge}>Question {currentQuestionIndex + 1}</div>

        <h3 className={styles.question_text}>{currentQuestion.question}</h3>

        {/* Options */}
        <div className={styles.options}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestion._id] === index;
            return (
              <label key={index} className={`${styles.option} ${isSelected ? styles.selected : ""}`}>
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={index}
                  checked={isSelected}
                  onChange={() => handleOptionChange(currentQuestion._id, index)}
                />
                <span>{option}</span>
              </label>
            )
          })}
        </div>

      </div>

      {/* Navigation buttons */}
      <div className={styles.quiz_navigation}>
          <button 
            className={styles.nav_btn}
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || submitting}
          >
            <ChevronLeft strokeWidth={2} size={17} />
            Previous
          </button>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className={styles.next_btn}
            >
              {submitting ? "Submitting..." : (
                <>
                  <CheckCircle2 strokeWidth={2.5} size={17} />
                  Submit Quiz
                </>
              ) }
            </button>
          ) : (
            <button
              className={styles.next_btn}
              onClick={handleNextQuestion}
              disabled={submitting}
            >
              Next
              <ChevronRight strokeWidth={2.5} size={17} />
            </button>
          )}
      </div>

    </div>
  )
}

export default QuizTakePage