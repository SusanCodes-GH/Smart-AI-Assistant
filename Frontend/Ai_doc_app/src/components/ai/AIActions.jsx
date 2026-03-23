import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Sparkles, BookOpen, Lightbulb } from 'lucide-react'
import aiService from '../../services/aiService'
import toast from 'react-hot-toast'
import MarkdownRenderer from '../common/MarkdownRenderer'
import styles from './aiActions.module.css'
import Modal from '../common/Modal'

const AIActions = () => {

  const { id: documentId  } = useParams()
  const [loadingAction, setLoadingAction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [concept, setConcept] = useState("")

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");
    try {
        const { summary } = await aiService.generateSummary(documentId);
        setModalTitle("Generated Summary");
        setModalContent(summary);
        setIsModalOpen(true);
    } catch (error) {
        toast.error("Failed to generate summary.");
    } finally {
        setLoadingAction(null);
    }
  }

  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!concept.trim()) {
        toast.error("Please enter a concept to explain.");
        return;
    }
    setLoadingAction("explain");
    try {
        const { explanation } = await aiService.explainConcept(
            documentId,
            concept
        );
        setModalTitle(`Explanation of "${concept}"`);
        setModalContent(explanation);
        setIsModalOpen(true);
        setConcept("")
    } catch (error) {
        toast.error("Failed to explain concept.");
    } finally {
        setLoadingAction(null);
    }
  }

  return (
    <>

    <div className={styles.page}>

        <div className={styles.ai_header}>
        <div className={styles.avatar}>
            <Sparkles size={16} strokeWidth={2} />
        </div>
        <div>
            <h3>AI Assistant</h3>
            <p>Powered by advanced AI</p>
        </div>
        </div>

        <hr />

        <div className={styles.ai_action_row}>
        <div>
            <div className={styles.head}>
                <span className={styles.sum_lgo} >
                    <BookOpen size={16} strokeWidth={2} />
                </span>
                <h4>Generate Summary</h4>
            </div>
            <p>Get a concise summary of the entire document</p>
        </div>

        <button
          onClick={handleGenerateSummary}
          disabled={loadingAction === "summary"}
          className={styles.primary_btn}
        >
            { loadingAction === "summary" ? 'Loading...' : 'Summarize' }
        </button>
        </div>

        <div className={styles.ai_action_column}>
        <div>
            <div className={styles.head}>
                <div className={styles.exp_lgo}>
                    <Lightbulb size={16} strokeWidth={2} />
                </div>
                <h4>Explain a Concept</h4>
            </div>
            <p>Enter a topic or concept from the document to get a detailed explanation</p>
        </div>

        <form className={styles.explain_input} onSubmit={handleExplainConcept}>
            <input 
              type="text" 
              placeholder="e.g., 'React Hooks'" 
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              disabled={loadingAction === "explain"}
            />
            <button 
              type="submit"
              disabled={loadingAction === "explain" || !concept.trim()}
            >
                {loadingAction === "explain" ? "Loading..." : "Explain" }
            </button>
        </form>
        </div>

    </div>

    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={modalTitle}
    >
        <div>
            <MarkdownRenderer content={modalContent} />
        </div>
    </Modal>

    </>
  )
}

export default AIActions