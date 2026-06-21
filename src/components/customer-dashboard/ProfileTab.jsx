import { useState, useEffect } from 'react';
import { getMyProfile } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfileTab({ bookings }) {
  const { userId } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile(userId)
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div style={{ padding: 40, color: '#aaa' }}>Loading profile...</div>;
  if (!profile) return <div style={{ padding: 40, color: '#aaa' }}>Couldn't load profile.</div>;

  const fullName = `${profile.firstName} ${profile.lastName || ''}`.trim();
  const firstInitial = profile.firstName?.charAt(0).toUpperCase() || 'U';
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  return (
    <div>
      <div className="fw-bold fs-22 mb-4">My Profile</div>
      <div className="rr-card rr-profile-card p-4">
        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <div className="rr-avatar-lg d-flex align-items-center justify-content-center">{firstInitial}</div>
          <div>
            <div className="fw-bold fs-5">{fullName}</div>
            <div className="text-secondary fs-13">{profile.email}</div>
            <span className="bg-rr-orange-soft text-rr-orange fs-11 fw-semibold px-2 py-1 rounded-pill">{profile.role}</span>
          </div>
        </div>
        {[
          ['Email', profile.email],
          ['Phone', profile.phone || '—'],
          ['Account Role', profile.role],
          ['Member Since', memberSince],
          ['Total Bookings', bookings.length],
        ].map(([k, v]) => (
          <div key={k} className="d-flex justify-content-between py-3 border-bottom fs-14">
            <span className="text-secondary">{k}</span>
            <span className="fw-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}