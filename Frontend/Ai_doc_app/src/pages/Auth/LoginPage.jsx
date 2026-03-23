import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom' 
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService.js'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import styles from './authPage.module.css'

const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast.error(err.message || 'Failed to login');
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
        <h2>Welcome back</h2>
        <p>Sign in to continue your journey</p>

        {/* Form */}
        <div className={styles.form}>
          <div className={styles.input_group}>
            <div>
              <Mail strokeWidth={2} />
            </div>
            <input type="email" value={email} placeholder='example@gmail.com' onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className={styles.input_group}>
            <Lock strokeWidth={2} />
            <input type="password" value={password} placeholder="*******" onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* Error Message */}
          {error && (
            <div>
              <p className={styles.errP}>{error}</p>
            </div>
          )}

          <button className={styles.btn_primary} onClick={handleSubmit} disabled={loading} >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </div>

        <p className={styles.switch_text}>
          Don’t have an account? <Link to='/register' >Sign up</Link>
          <p>By continuing, you agree to our Terms & Privacy Policy</p>
        </p>
      </div>
    </section>
  )
}

export default LoginPage;