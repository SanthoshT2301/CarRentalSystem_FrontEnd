import CarGridCard from './CarGridCard';

const pgBtn = (active) => ({
  padding: '7px 16px', border: '1px solid #e0e0e0', borderRadius: 8,
  cursor: active ? 'pointer' : 'not-allowed', background: '#fff',
  fontSize: 13, opacity: active ? 1 : 0.4,
});

export default function BrowseCarsTab({
  cars, carsLoading, carSearch, setCarSearch,
  typeFilter, setTypeFilter, cityFilter, setCityFilter,
  availFilter, setAvailFilter, maxPrice, setMaxPrice,
  carPage, setCarPage, carTotalPages, filteredCars,
  CITIES, TYPES, navigate,
}) {
  return (
    <div className="rr-browse-layout">
      {/* Filter panel */}
      <div className="rr-filter-panel">
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Filters</div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5, marginBottom: 8 }}>CAR TYPE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`rr-filter-pill ${typeFilter === t ? 'active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5, marginBottom: 8 }}>CITY</div>
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="rr-filter-select">
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5, marginBottom: 8 }}>AVAILABILITY</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['All', 'Available', 'Unavailable'].map(a => (
                <button key={a} onClick={() => setAvailFilter(a)} className={`rr-filter-pill ${availFilter === a ? 'active' : ''}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5 }}>MAX DAILY PRICE</div>
              <div style={{ fontSize: 12, color: '#e85d24', fontWeight: 600 }}>₹{maxPrice}</div>
            </div>
            <input type="range" min={70} max={10000} value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              className="rr-range-orange"
              style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
              <span>₹70</span><span>₹10000</span>
            </div>
          </div>

          <button
            onClick={() => { setTypeFilter('All'); setCityFilter('All'); setAvailFilter('All'); setMaxPrice(10000); setCarSearch(''); }}
            style={{ marginTop: 14, background: 'none', border: 'none', color: '#e85d24', fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 500 }}>
            Clear filters
          </button>
        </div>
      </div>

      {/* Car grid */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="rr-search-box" style={{ flex: 1, minWidth: 180 }}>
            <span className="rr-search-icon">🔍</span>
            <input
              value={carSearch}
              onChange={e => setCarSearch(e.target.value)}
              placeholder="Search by name or type..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 14,
                background: '#fff', boxSizing: 'border-box', outline: 'none',
              }}
            />
          </div>
          <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>
            {filteredCars.length} cars
          </div>
        </div>

        {carsLoading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>Loading cars...</div>
        ) : filteredCars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>No cars match your filters.</div>
        ) : (
          <div className="rr-car-grid">
            {filteredCars.map(car => (
              <CarGridCard key={car.id} car={car} onBook={() => navigate(`/book/${car.id}`)} />
            ))}
          </div>
        )}

        {!carSearch && carTotalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
            <button onClick={() => setCarPage(p => Math.max(1, p - 1))} disabled={carPage === 1} style={pgBtn(carPage > 1)}>← Prev</button>
            <span style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13 }}>{carPage} / {carTotalPages}</span>
            <button onClick={() => setCarPage(p => Math.min(carTotalPages, p + 1))} disabled={carPage === carTotalPages} style={pgBtn(carPage < carTotalPages)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}