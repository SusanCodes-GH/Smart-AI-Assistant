import React, { useState, useEffect } from 'react'
import authService from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { User, Mail, Lock } from 'lucide-react';
import styles from './profile.module.css'

const ProfilePage = () => {

  const [loading, setLoading] = useState(true)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const  { data } = await authService.getProfile();
        console.log(data)
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
      } finally {
        setLoading(false)
      }
    }
    fetchProfile();
  },[]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  }

  if (loading) {
    return "Loading..."
  }

  return (
    <div className={styles.profile_container}>

      <h2 className={styles.page_title}>Profile Settings</h2>
      
      <div className={styles.card}>
        <h3>User Information</h3>
        <div className={styles.form_group}>
          <label>Username</label>
          <div className={styles.input_box}>
            <div className={styles.icon}>
              <User size={17} strokeWidth={2} />
            </div>
            <div>{username}</div>
          </div>
        </div>
        <div className={styles.form_group}>
          <label>Email Address</label>
          <div className={styles.input_box}>
            <div className={styles.icon}>
              < Mail size={17} strokeWidth={2} />
            </div>
            <div>{email}</div>
          </div>
        </div>
      </div>

      {/* Change password form */}
      <div className={styles.card}>

        <h3>Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className={styles.form_group}>
            <label>Current Password</label>
            <div className={styles.input_box}>
              <div className={styles.icon}>
                <Lock size={17} strokeWidth={2} />
              </div>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.form_group}>
            <label>New Password</label>
            <div className={styles.input_box}>
              <div className={styles.icon}>
                <Lock size={17} strokeWidth={2} />
              </div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.form_group}>
            <label>Confirm New Password</label>
            <div className={styles.input_box}>
              <div className={styles.icon}>
                <Lock size={17} strokeWidth={2} />
              </div>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.btn_container}>
            <button
              className={styles.change_btn}
              type="submit"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>

      </div>

    </div>
  )
}

export default ProfilePage