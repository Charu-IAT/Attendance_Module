import { useState, useEffect } from 'react';
import { FiMenu, FiUser, FiX, FiMail, FiBookOpen, FiEdit, FiRefreshCw } from 'react-icons/fi';
import { getCurrentUserProfile, updateUser } from '../api/services';
import { getRole, getUserId, setAuth, getToken } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { validateEmail } from '../utils/validation';
import type { UserDTO } from '../types/user.types';

interface HeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  title,
  userName = 'Admin User',
  userRole = 'Administrator',
  isSidebarCollapsed = false,
  onToggleSidebar,
}: HeaderProps) {
  const [displayName, setDisplayName] = useState(userName);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const toast = useToast();
  const isAdmin = getRole() === 'admin';

  useEffect(() => {
    setDisplayName(userName);
  }, [userName]);

  useEffect(() => {
    if (isModalOpen) {
      const fetchProfile = async () => {
        setLoading(true);
        setModalError(null);
        try {
          const res = await getCurrentUserProfile();
          setProfile(res.data);
          setEditName(res.data.userName);
          setEditEmail(res.data.email);
        } catch (err) {
          console.error('Failed to fetch profile:', err);
          setModalError('Failed to load profile details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setEditMode(false);
      setModalError(null);
    }
  }, [isModalOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    const nameTrimmed = editName.trim();
    if (!nameTrimmed) {
      setModalError('Name is required.');
      return;
    }
    if (nameTrimmed.length > 20) {
      setModalError('Name must be at most 20 characters.');
      return;
    }
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!nameRegex.test(nameTrimmed)) {
      setModalError('Name should contain only letters and spaces.');
      return;
    }

    const emailTrimmed = editEmail.trim();
    if (!emailTrimmed) {
      setModalError('Email is required.');
      return;
    }
    if (!validateEmail(emailTrimmed)) {
      setModalError('Email must be in a valid format.');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setModalError('User ID not found.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        userName: nameTrimmed,
        email: emailTrimmed,
        roleId: 1, // Admin is 1
        courseId: null,
      };
      const res = await updateUser(userId, payload);

      const token = getToken() ?? '';
      const roleName = getRole() || 'admin';
      setAuth({
        token,
        userName: res.data.userName,
        roleName,
        userId: res.data.userId,
      });

      setProfile(res.data);
      setDisplayName(res.data.userName);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? 'Failed to update profile. Please try again.';
      setModalError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  return (
    <div className="header">
      <div className="header-title">
        {onToggleSidebar && (
          <button
            className="sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-pressed={isSidebarCollapsed}
            onClick={onToggleSidebar}
          >
            <FiMenu />
          </button>
        )}
        <h1>{title}</h1>
      </div>

      <div className="header-actions">
        <div
          className="profile interactive-profile"
          onClick={() => setIsModalOpen(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="View user profile"
        >
          <div className="profile-avatar">
            <FiUser />
          </div>
          <div>
            <h4>{displayName}</h4>
            <span>{userRole}</span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay profile-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box profile-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Profile</h2>
              <button
                type="button"
                className="close-btn"
                aria-label="Close profile modal"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX />
              </button>
            </div>

            <div className="modal-body profile-modal-body">
              {loading ? (
                <div className="loading-state">
                  <FiRefreshCw className="spin" />
                  <span>Loading profile...</span>
                </div>
              ) : modalError && !profile ? (
                <div className="error-state">
                  <p>{modalError}</p>
                  <button className="add-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
              ) : (
                profile && (
                  <div className="profile-container">
                    <div className="profile-hero">
                      <div className="profile-hero-avatar">
                        <FiUser />
                      </div>
                      <h3>{profile.userName}</h3>
                      <span className="profile-role-badge">
                        {profile.roleName === 'admin' ? 'Administrator' : 'Trainer'}
                      </span>
                    </div>

                    {modalError && (
                      <div className="error-banner" role="alert" style={{ marginBottom: '1.25rem' }}>
                        {modalError}
                      </div>
                    )}

                    {!editMode ? (
                      <div className="profile-details-grid">
                        <div className="profile-detail-item">
                          <span className="detail-label">
                            <FiUser /> Name
                          </span>
                          <span className="detail-value">{profile.userName}</span>
                        </div>
                        <div className="profile-detail-item">
                          <span className="detail-label">
                            <FiMail /> Email
                          </span>
                          <span className="detail-value">{profile.email}</span>
                        </div>
                        {profile.roleName === 'trainer' && (
                          <div className="profile-detail-item">
                            <span className="detail-label">
                              <FiBookOpen /> Assigned Course
                            </span>
                            <span className="detail-value">{profile.courseName || 'None'}</span>
                          </div>
                        )}
                        
                        {isAdmin && (
                          <div className="profile-actions-row">
                            <button
                              type="button"
                              className="edit-profile-btn"
                              onClick={() => setEditMode(true)}
                            >
                              <FiEdit /> Edit Profile
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleSave} className="profile-edit-form">
                        <div className="form-group">
                          <label htmlFor="profile-name">
                            <FiUser /> Full Name
                          </label>
                          <input
                            id="profile-name"
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            disabled={saving}
                            maxLength={20}
                          />
                        </div>

                         <div className="form-group">
                          <label htmlFor="profile-email">
                            <FiMail /> Email Address
                          </label>
                          <input
                            id="profile-email"
                            type="email"
                            value={editEmail}
                            disabled={true}
                            style={{ cursor: 'not-allowed', backgroundColor: '#f3f4f6' }}
                          />
                        </div>

                        <div className="profile-modal-footer">
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => {
                              setEditMode(false);
                              setEditName(profile.userName);
                              setEditEmail(profile.email);
                              setModalError(null);
                            }}
                            disabled={saving}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
