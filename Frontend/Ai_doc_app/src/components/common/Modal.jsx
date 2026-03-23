import React from 'react'
import { X } from 'lucide-react'
import styles from './modal.module.css'

const Modal = ({ isOpen, onClose, title, children }) => {
  
  if (!isOpen) return null;

  return <div className={styles.modal_overlay}>
    <div className={styles.modal_box}>
        <button 
          className={styles.close_btn}
          onClick={onClose} 
        >
            <X strokeWidth={2} />
        </button>
        <h3>{title}</h3>
        <div className={styles.cont}>{children}</div>
    </div>
  </div>
}

export default Modal