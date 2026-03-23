import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import quizService from '../../services/quizService'
import toast from 'react-hot-toast'
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Target, BookOpen } from 'lucide-react'
import styles from './quizResult.module.css';

const QuizResultPage = () => {

  const { quizId } = useParams()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await quizService.getQuizResults(quizId);
        setResults(data);
      } catch (error) {
        toast.error('Failed to fetch quiz results.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [quizId]);

  if (loading) {
    return "Loading..."
  }

  if (!results || !results.data) {
    return "Quiz results not found."
  }

  const { data: { quiz, results: detailedResults } } = results;
  const score = quiz.score;
  const totalQuestions = detailedResults.length;
  const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  }

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! ';
    if (score >= 80) return 'Great job!' ;
    if (score >= 70) return 'Good work! ';
    if (score >= 60) return 'Not bad! ';
    return 'Keep practicing! '
  }

  return (
    <div className={styles.results_container}>

      <div className={styles.back_link}>
        <Link to={`/documents/${quiz.document._id}`} >
          <span>
            <ArrowLeft size={17} strokeWidth={2} />
            Back to documents
          </span>
        </Link>
      </div>

      <h2 className={styles.results_title}>{`${quiz.title || 'Quiz'} Results`}</h2>

      {/* Score card */}
      <div className={styles.score_card}>

        <div className={styles.score_icon}>
          <Trophy strokeWidth={2} />
        </div>

        <div className={styles.score_label}>Your Score</div>
        <div className={styles.score_value} style={{color: `${getScoreColor(score)}`}}>{score}%</div>
        <div className={styles.score_message}>{getScoreMessage(score)}</div>

        <div className={styles.score_stats}>
          <span className={`${styles.stat} ${styles.total}`}>
            <Target strokeWidth={2} />
            {totalQuestions} Total
          </span>
          <span className={`${styles.stat} ${styles.correct}`}>
            <CheckCircle2 strokeWidth={2} />
            {correctAnswers} Correct
          </span>
          <span className={`${styles.stat} ${styles.incorrect}`}>
            <XCircle strokeWidth={2} />
            {incorrectAnswers} Incorrect
          </span>
        </div>

      </div>

      {/* Questions Review */}
      <div>

          <div className={styles.review_title}>
            <BookOpen size={18} strokeWidth={2} />
            <h3>Detailed Review</h3>
          </div>

          {detailedResults.map((result, index) => {
            const userAnswerIndex = result.options.findIndex(opt => opt === result.selectedAnswer);
            const correctAnswerIndex = result.correctAnswer.startsWith('0')
              ? parseInt(result.correctAnswer.substring(1)) - 1
              : result.options.findIndex(opt => opt === result.correctAnswer);
            const isCorrect = result.isCorrect;

            return (
              <div
                className={styles.review_card}
                key={index}
              >
                
                <div className={styles.review_header}>
                  <div className={styles.ques}>
                    Question { index + 1 }
                  </div>
                  <div className={styles.bdg}>
                    {isCorrect ? (
                      <CheckCircle2 size={20} strokeWidth={2} style={{color: 'green'}} />
                    ) : (
                      <XCircle size={20} strokeWidth={2} style={{color: 'red'}}/>
                    )}
                  </div>
                </div>

                <h4 className={styles.review_question}>{result.question}</h4>

                <div className={styles.review_options}>
                  {result.options.map((option, optIndex) => {
                    const isCorrectOption = optIndex === correctAnswerIndex;
                    const isUserAnswer = optIndex === userAnswerIndex;
                    const isWrongAnswer = isUserAnswer && !isCorrect;

                    return (
                      <div
                        className={`${styles.review_option} ${isCorrectOption
                          ? styles.correct_answer : isWrongAnswer ? styles.usrWrong : ''
                        }`}
                        key={optIndex}
                      >
                        {option}

                        {isCorrectOption && (
                          <span className={styles.answer_tag}>
                            <CheckCircle2 size={16} strokeWidth={2} />
                            Correct
                          </span>
                        )}
                        
                        {isWrongAnswer && (
                          <span className={styles.ans_tag_w}>
                            <XCircle size={16} strokeWidth={2} />
                            Your Answer
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {result.explanation && (
                  <div className={styles.explanation_box}>
                    <div className={styles.exp}>
                      <div>
                        <span className={styles.lgo}>
                          <BookOpen style={{width: '18px', height: '18px'}} strokeWidth={2} />
                        </span>
                      </div>
                      <div>
                        <strong>Explanation</strong>
                        <p>{result.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )
          })}

      </div>

      {/* Return Button */}
      <div className={styles.return_container}>
        <Link to={`/documents/${quiz.document._id}`}>
          <button className={styles.return_btn}>
            <ArrowLeft size={17} strokeWidth={2} />
            Return to Document
          </button>
        </Link>
      </div>

    </div>
  )
}

export default QuizResultPage