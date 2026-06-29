export default function BillingTab({ payments }) {
  return (
    <div>
      <div className="fw-bold fs-22 mb-4">Billing & Payment History</div>
      <div className="rr-card overflow-hidden">
        <div style={{ overflowX: 'auto' }}>
          <table className="table mb-0">
            <thead>
              <tr>{['Date', 'Car', 'Amount', 'Method', 'Status', 'Transaction ID'].map(h => <th key={h} className="rr-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.paymentId}>
                  <td className="rr-td">{p.paymentDate}</td>
                  <td className="rr-td">{p.carName}</td>
                  <td className="rr-td fw-semibold text-rr-orange">₹{p.amount}</td>
                  <td className="rr-td">{p.paymentMethod}</td>
                  <td className="rr-td">{p.paymentStatus}</td>
                  <td className="rr-td">{p.transactionId || '—'}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="text-center text-secondary py-5">No payment history yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}