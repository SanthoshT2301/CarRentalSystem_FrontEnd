export default function ReportsTab({ reportType, setReportType, dateRange, setDateRange, loadReport, reportData, downloadReport, flash }) {
  return (
    <div>
      <div className="fw-bold mb-4" style={{ fontSize: 22 }}>Reports</div>

      {/* Controls — wraps on mobile */}
      <div className="rr-card mb-4" style={{ padding: 20 }}>
        <div className="d-flex align-items-end flex-wrap gap-3 rr-report-controls">
          <div>
            <label className="rr-label">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)} className="rr-input" style={{ minWidth: 160 }}>
              {[['bookings', 'Bookings'], ['revenue', 'Revenue'], ['reviews', 'Reviews'], ['performance', 'Car Performance']].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="rr-label">Start Date</label>
            <input type="date" value={dateRange.start} onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))} className="rr-input" />
          </div>
          <div>
            <label className="rr-label">End Date</label>
            <input type="date" value={dateRange.end} onChange={e => setDateRange(d => ({ ...d, end: e.target.value }))} className="rr-input" />
          </div>
          <div className="d-flex gap-2 rr-report-btn-row" style={{ flexWrap: 'wrap' }}>
            <button
              onClick={loadReport}
              className="border-0 fw-semibold text-white"
              style={{ padding: '9px 22px', background: '#059669', borderRadius: 8, fontSize: 13 }}
            >
              ▶ Run
            </button>
            <button
              onClick={async () => {
                try { await downloadReport(reportType, dateRange.start, dateRange.end); }
                catch (e) { flash(e.message, 'error'); }
              }}
              className="border-0 fw-semibold text-white"
              style={{ padding: '9px 22px', background: '#2563eb', borderRadius: 8, fontSize: 13 }}
            >
              ⬇ CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="rr-card overflow-hidden">
        {reportData.length === 0 ? (
          <div className="text-center text-secondary py-5">No data for selected range.</div>
        ) : (
          <div className="rr-scrollable-table">
            <table className="table mb-0">
              <thead>
                <tr>
                  {Object.keys(reportData[0]).map(k => (
                    <th key={k} className="rr-th">{k.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([k, v]) => (
                      <td key={k} className="rr-td">
                        {typeof v === 'boolean' ? (v ? '✓' : '✗') :
                          (k.match(/amount|revenue|gross|refund/i)) ? `₹${Number(v).toFixed(2)}` :
                          k.match(/rate/i) ? `${v}%` : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}