import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react'
import moment from 'moment'
import styles from '../../pages/Documents/document.module.css'

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

const DocumentCard = ({ document, onDelete }) => {

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${document._id}`)
  }

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  }

  return (
    <div 
      className={styles.doc_card}
      onClick={handleNavigate} 
    >

        <div className={styles.doc_icon}>
            <FileText strokeWidth={2} />
        </div>
        <button 
            className={styles.delete_btn}
            onClick={handleDelete}
        >
            <Trash2 strokeWidth={2} />
        </button>

        <h4 title={document.title}>
            {document.title}
        </h4>
        <small>
            {document.fileSize !== undefined && (
                <>{formatFileSize(document.fileSize)}</>
            )}
        </small>

        <div className={styles.doc_tags}>
            {document.flashcardCount !== undefined && (
                <div className={styles.flash}>
                    <BookOpen strokeWidth={2} /> {document.flashcardCount} Flashcards
                </div>
            )}
            {document.quizCount !== undefined && (
                <div className={styles.quiz}>
                    <BrainCircuit strokeWidth={2} /> {document.quizCount} Quizzes
                </div>
            )}
        </div>

        <div className={styles.time}>
            <Clock size={18} strokeWidth={2} /> Uploaded {moment(document.createdAt).fromNow()}
        </div>

    </div>
  )
}

export default DocumentCard;