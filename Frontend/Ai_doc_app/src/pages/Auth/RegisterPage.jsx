import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import { BrainCircuit,User, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './authPage.module.css'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setError('');
    setLoading(true);
    try {
      await authService.register(username, email, password);
      toast.success('Registered successfully! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      toast.error(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <section className={styles.auth_section}>
      <div className={styles.auth_card}>
        <div className={styles.logo}>
          <BrainCircuit strokeWidth={2} />
        </div>
        <h2>Create an account</h2>
        <p>Start your AI-powered learning experience</p>

        {/* Form */}
        <div className={styles.form}>
          <div className={styles.input_group}>
            <User strokeWidth={2} />
            <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className={styles.input_group}>
            <Mail strokeWidth={2} />
            <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className={styles.input_group}>
            <Lock strokeWidth={2} />
            <input type="password" value={password} placeholder="******" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* Error message */}
          {error && (
            <div>
              <p className={styles.errP}>{error}</p>
            </div>
          )}

          <button className={styles.btn_primary} onClick={handleSubmit} disabled={loading} >
            {loading ? "Creating account..." : "Create account →"}
          </button>
        </div>

        <p className={styles.switch_text}>
          Already have an account? <Link to="/login" >Sign in</Link>
          <p>By continuing, you agree to our terms & conditions.</p>
        </p>
      </div>
    </section>

  )
}

export default RegisterPage