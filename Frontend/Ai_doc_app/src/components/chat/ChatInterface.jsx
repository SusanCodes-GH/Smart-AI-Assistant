import React, { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, Sparkles } from 'lucide-react'
import { useParams } from 'react-router-dom'
import aiService from '../../services/aiService'
import { useAuth } from '../../context/AuthContext'
import MarkdownRenderer from '../common/MarkdownRenderer'
import styles from './chatInterface.module.css'

const ChatInterface = () => {
  const { id: documentId } = useParams()
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const fetchChatHistory = async () => {
        try {
            setInitialLoading(true);
            const response = await aiService.getChatHistory(documentId);
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
        } finally {
            setInitialLoading(false);
        }
    }

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history])

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message, timestamp: new Date() }
    setHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true)

    try {
        const response = await aiService.chat(documentId, userMessage.content);
        const assistantMessage = {
            role: 'assistant',
            content: response.data.answer,
            timestamp: new Date(),
            relevantChunks: response.data.relevantChunks
        }
        setHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
        console.error('Chat error: ', error)
        const errorMessage = {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date()
        }
        setHistory(prev => [...prev, errorMessage])
    } finally {
        setLoading(false);
    }
  }
  
  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user';
    return (
        <div key={index} className={ isUser ? `${styles.chat_row} ${styles.user}` : `${styles.chat_row} ${styles.ai}` }>
            {!isUser && (
                <div className={styles.avatar}>
                    <Sparkles size={18} strokeWidth={2} />
                </div>
            )}
            <div className={`${styles.message} ${ isUser ? styles.green : ''}`} >
                {isUser ? (
                    <p>{msg.content}</p>
                ) : (
                    <div>
                        <MarkdownRenderer content={msg.content} />
                    </div>
                ) }
            </div>
            {isUser && (
                <div className={`${styles.avatar} ${styles.user_avatar}`}>
                    {user?.username?.charAt(0).toUpperCase() || 'U' }
                </div>
            )}
        </div>
    )
  }

  if (initialLoading) {
    return (
        <div className={styles.start_box}>
            <div className={styles.avatar}>
                <MessageSquare strokeWidth={2} />
            </div>
            <p>Loading chat history...</p>
        </div>
    )
  }

  return (
    <div className={styles.chat_container}>

        <div className={styles.msg_box}>

            {history?.length === 0 ? (
                <div className={styles.start_box}>
                    <div className={styles.avatar}>
                        <MessageSquare size={18} strokeWidth={2} />
                    </div>
                    <h3>Start a conversation</h3>
                    <p>Ask me anything about the document!</p>
                </div>
            ) : (history?.map(renderMessage))}

            <div ref={messagesEndRef}>
                {loading && (
                    <div className={styles.ques_send}>
                        <div>
                            <Sparkles strokeWidth={2} />
                        </div>
                        <div>
                            <h3>Loading...</h3>
                        </div>
                    </div>
                )}
            </div>

        </div>

        <form onSubmit={handleSendMessage} className={styles.chat_input}>
            <input
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a follow-up question..." 
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
            >
                <span className={styles.avatar}>
                    <Send size={20} strokeWidth={2} />
                </span>
            </button>
        </form>

    </div>
  )
}

export default ChatInterface