import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import documentService from '../../services/documentService'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import styles from './docDetail.module.css'
import Tabs from '../../components/common/Tabs'
import ChatInterface from '../../components/chat/ChatInterface'
import AIActions from '../../components/ai/AIActions'
import FlashcardManager from '../../components/flashcards/FlashcardManager'
import QuizManager from '../../components/quizzes/QuizManager'

const DocumentDetailPage = () => {

  const { id } = useParams();
  const [document, setDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Content');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        toast.error('Failed to fetch document details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocumentDetails();
  }, [id]);

  // Helper function to get the full PDF URL
  const getPdfUrl = () => {
    if (!document?.data?.filePath) return null;

    const filePath = document.data.filePath;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
  }

  const renderContent = () => {
    if (loading) {
      return <div>
        <h3>Loading...</h3>
      </div>
    }
    if (!document || !document.data || !document.data.filePath) {
      return <div>PDF not available.</div>
    }

    const pdfUrl = getPdfUrl();

    return (
      <div>

        <div className={styles.viewer_header}>
          <span>Document Viewer</span>
          <a 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.open_link}
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        <div className={styles.pdf_viewer}>
          <iframe 
            src={pdfUrl}
            className={styles.pdf_content}
            title='PDF Viewer'
            frameBorder={0}
            style={{
              colorScheme: 'light',
            }}
          />
        </div>

      </div>
    )
  }

  const renderChat = () => {
    return <ChatInterface />
  }

  const  renderAIActions = () => {
    return <AIActions />
  }

  const renderFlashcardsTab = () => {
    return <FlashcardManager documentId={id} />
  }

  const renderQuizzesTab = () => {
    return <QuizManager documentId={id} />
  }

  const tabs = [
    { name: 'Content', label: 'Content', content: renderContent() },
    { name: 'Chat', label: 'Chat', content: renderChat() },
    { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
    { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
    { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
  ];

  if (loading) {
    return <div>
      <h3>Loading...</h3>
    </div>
  }

  if (!document) {
    return <div>Document not found.</div>
  }

  return (
    <div className={styles.doc_page}>
      <Link
        className={styles.back_link}
        to="/documents"
      >
        <ArrowLeft size={18} />
        Back to Documents
      </Link>
      <h2 className={styles.doc_title}>{document.data.title}</h2>
      <Tabs tabCont={styles.tabs} tabItem={styles.tab} actClass={styles.active} viewer={styles.viewerCont} tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

export default DocumentDetailPage