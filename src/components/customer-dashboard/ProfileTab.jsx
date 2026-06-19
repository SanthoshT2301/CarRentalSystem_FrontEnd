export default function ProfileTab({ userName, firstInitial, email, bookings }) {
  return (
    <div>
      <div className="fw-bold fs-22 mb-4">My Profile</div>
      <div className="rr-card rr-profile-card p-4">
        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <div className="rr-avatar-lg d-flex align-items-center justify-content-center">{firstInitial}</div>
          <div>
            <div className="fw-bold fs-5">{userName}</div>
            <div className="text-secondary fs-13">{email}</div>
            <span className="bg-rr-orange-soft text-rr-orange fs-11 fw-semibold px-2 py-1 rounded-pill">Customer</span>
          </div>
        </div>
        {[
          ['Email', email],
          ['Account Role', 'Customer'],
          ['Member Since', 'January 2024'],
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