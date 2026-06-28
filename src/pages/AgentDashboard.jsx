import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAgentBookings, getAgentCars, createCar, deleteCar, updateCar, returnCar,
  getMaintenanceAlerts, addMaintenanceAlert, updateAlertStatus,
  gateCheckout, gateCheckin, getAgentCarReviews,
} from '../services';
import ReviewsTab from '../components/agent-dashboard/ReviewsTab';
import { useAuth } from '../context/AuthContext';
import '../styles/agent-dashboard.css';

import AgentSidebar from '../components/agent-dashboard/AgentSidebar';
import AgentTopbar from '../components/agent-dashboard/AgentTopbar';
import MyBookingsTab from '../components/agent-dashboard/MyBookingsTab';
import GateLogisticsTab from '../components/agent-dashboard/GateLogisticsTab';
import FleetManagementTab from '../components/agent-dashboard/FleetManagementTab';
import MaintenanceTab from '../components/agent-dashboard/MaintenanceTab';
import CarFormModal from '../components/agent-dashboard/CarFormModal';
import EditCarModal from '../components/agent-dashboard/EditCarModal';
import GateModal from '../components/agent-dashboard/GateModal';
import MaintenanceModal from '../components/agent-dashboard/MaintenanceModal';
import Toast from '../components/agent-dashboard/Toast';

// ── shared micro-style tokens ──────────────────────────────────────────────
const S = {
  card: {
    background: '#fff', borderRadius: 14,
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #eee',
  },
  th: {
    padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    color: '#888', borderBottom: '1px solid #eee', letterSpacing: 0.4,
    whiteSpace: 'nowrap', background: '#f9f9f9',
  },
  td: { padding: '12px 14px', fontSize: 13, color: '#333', borderBottom: '1px solid #f5f5f5' },
  inp: {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  },
  lbl: { display: 'block', fontSize: 13, fontWeight: 500, color: '#444', marginBottom: 6 },
};

const PRIORITY_CLR = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a' };
const STATUS_CLR   = { confirmed: '#2563eb', completed: '#16a34a', cancelled: '#dc2626' };

const CAR_FORM_DEFAULTS = {
  make: '', model: '', year: 2024, type: 'Sedan',
  location: 'Chennai', pricePerDay: 1000, pricePerHour: 70, image: '',
  noSeats: 5, transmission: 'Automatic', color: 'White', mileage: 'Brand New',
};

export default function AgentDashboard() {
  const { userId, userName, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings');
  const [toast, setToast] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── data ─────────────────────────────────────────────────────────────────
  const [bookings,  setBookings]  = useState([]);
  const [myCars,    setMyCars]    = useState([]);
  const [alerts,    setAlerts]    = useState([]);
  const [reviews, setReviews] = useState([]);

  // ── modals ────────────────────────────────────────────────────────────────
  const [gateModal,  setGateModal]  = useState(null); // {type, reservationId}
  const [gateForm,   setGateForm]   = useState({});
  const [maintModal, setMaintModal] = useState(false);
  const [maintForm,  setMaintForm]  = useState({ carId: '', description: '', priority: 'Medium' });
  const [carModal,   setCarModal]   = useState(false);
  const [carForm,    setCarForm]    = useState(CAR_FORM_DEFAULTS);
  const [carFormErr, setCarFormErr] = useState('');

  // ── edit car modal ───────────────────────────────────────────────────────
  const [editModal, setEditModal] = useState(null); // car being edited
  const [editForm,  setEditForm]  = useState({ make: '', model: '', pricePerDay: '', pricePerHour: '' });
  const [editErr,   setEditErr]   = useState('');

  function flash(msg) { setToast(msg); setTimeout(() => setToast(''), 3500); }

  function handleTabChange(newTab) {
    setTab(newTab);
    setMobileOpen(false);
  }

  // ── initial loads ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Only load bookings for cars that THIS agent added
    getAgentBookings(userId, 1, 100)
      .then(r => setBookings(r.data || []))
      .catch(() => {});

    getAgentCarReviews(userId, 1, 100)
  .then(r => setReviews(r.data || []))
  .catch(() => {});

    getAgentCars(userId, 1, 100)
      .then(r => setMyCars(r.data || []))
      .catch(() => {});

    getMaintenanceAlerts()
      .then(a => setAlerts(a || []))
      .catch(() => {});
  }, [userId]);

  // ── car management ────────────────────────────────────────────────────────
  async function handleCreateCar() {
    setCarFormErr('');
    try {
      const payload = {
        ...carForm,
        features: [carForm.transmission, 'GPS', carForm.color],
      };
      // Pass agentId so the backend tags this car to the agent
      const car = await createCar(payload, userId);
      setMyCars(prev => [car, ...prev]);
      setCarModal(false);
      setCarForm(CAR_FORM_DEFAULTS);
      flash('Car added to your fleet!');
    } catch (e) {
      setCarFormErr(e.message);
    }
  }

  async function handleDeleteCar(id) {
    if (!window.confirm('Remove this car from your fleet?')) return;
    try {
      await deleteCar(id);
      setMyCars(prev => prev.filter(c => c.id !== id));
      flash('Car removed.');
    } catch (e) {
      flash(e.message);
    }
  }

  // ── edit car ─────────────────────────────────────────────────────────────
  function openEditModal(car) {
    setEditModal(car);
    setEditForm({
      make: car.make || '',
      model: car.model || '',
      pricePerDay: car.pricePerDay || '',
      pricePerHour: car.pricePerHour || '',
    });
    setEditErr('');
  }

  async function handleSaveEdit() {
    setEditErr('');
    try {
      const updated = await updateCar(editModal.id, {
        make: editForm.make,
        model: editForm.model,
        pricePerDay: editForm.pricePerDay !== '' ? parseFloat(editForm.pricePerDay) : null,
        pricePerHour: editForm.pricePerHour !== '' ? parseFloat(editForm.pricePerHour) : null,
      });
      setMyCars(prev => prev.map(c => c.id === editModal.id ? { ...c, ...updated } : c));
      setEditModal(null);
      flash('Car updated successfully!');
    } catch (e) {
      setEditErr(e.message);
    }
  }

  // ── put car in maintenance ──────────────────────────────────────────────
  async function handlePutInMaintenance(car) {
    if (!window.confirm(`Put ${car.make} ${car.model} under maintenance?`)) return;
    try {
      const alert = await addMaintenanceAlert({
        carId: car.id,
        description: 'Routine maintenance requested by agent.',
        priority: 'Medium',
        reportedBy: userName,
      });
      setAlerts(prev => [alert, ...prev]);
      setMyCars(prev => prev.map(c => c.id === car.id ? { ...c, available: false } : c));
      flash('Car moved to maintenance.');
    } catch (e) {
      flash(e.message);
    }
  }

  // ── return car ────────────────────────────────────────────────────────────
  async function doReturn(id) {
    try {
      await returnCar(id, userId, false);
      setBookings(b => b.map(r => r.id === id ? { ...r, status: 'completed' } : r));
      flash('Car returned successfully.');
    } catch (e) {
      flash(e.message);
    }
  }

  // ── gate logistics ────────────────────────────────────────────────────────
  async function doGate() {
    try {
      if (gateModal.type === 'checkout') {
        await gateCheckout(gateModal.reservationId, {
          driverLicense: gateForm.driverLicense,
          mileageOut:    parseInt(gateForm.mileageOut),
          fuelOut:       parseInt(gateForm.fuelOut),
          agentName:     userName,
        });
        flash('Checkout recorded.');
      } else {
        await gateCheckin(gateModal.reservationId, {
          mileageIn: parseInt(gateForm.mileageIn),
          fuelIn:    parseInt(gateForm.fuelIn),
          damages:   gateForm.damages,
          agentName: userName,
        });
        flash('Check-in recorded.');
      }
      setGateModal(null);
      setGateForm({});
    } catch (e) {
      flash(e.message);
    }
  }

  // ── maintenance ───────────────────────────────────────────────────────────
  async function doMaint() {
    try {
      const a = await addMaintenanceAlert({
        carId:       parseInt(maintForm.carId),
        description: maintForm.description,
        priority:    maintForm.priority,
        reportedBy:  userName,
      });
      setAlerts(prev => [a, ...prev]);
      setMyCars(prev => prev.map(c => c.id === a.carId ? { ...c, available: false } : c));
      flash('Alert created.');
      setMaintModal(false);
      setMaintForm({ carId: '', description: '', priority: 'Medium' });
    } catch (e) {
      flash(e.message);
    }
  }

  async function changeStatus(id, status) {
    try {
      const a = await updateAlertStatus(id, status);
      setAlerts(prev => prev.map(x => x.maintenanceAlertId === id ? a : x));
      if (status === 'Fixed') {
        setMyCars(prev => prev.map(c => c.id === a.carId ? { ...c, available: true } : c));
      }
    } catch (e) {
      flash(e.message);
    }
  }

  // ── convenience filters ───────────────────────────────────────────────────
  // Gate ops only makes sense for confirmed bookings
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const MENU_TITLES = {
  bookings: 'My Bookings',
  gate: 'Gate Logistics',
  fleet: 'My Fleet',
  reviews: 'Reviews',
  maintenance: 'Maintenance',
};
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <AgentSidebar
        tab={tab}
        setTab={handleTabChange}
        userName={userName}
        onLogout={() => { logout(); navigate('/'); }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="rr-content flex-grow-1" style={{ minHeight: '100vh' }}>
        <AgentTopbar
          title={MENU_TITLES[tab]}
          userName={userName}
          myCarsCount={myCars.length}
          bookingsCount={bookings.length}
          onMenuOpen={() => setMobileOpen(true)}
        />

        <div className="rr-agent-body">
          {tab === 'bookings' && (
            <MyBookingsTab bookings={bookings} doReturn={doReturn} />
          )}

          {tab === 'gate' && (
            <GateLogisticsTab
              confirmedBookings={confirmedBookings}
              setGateModal={setGateModal}
              setGateForm={setGateForm}
            />
          )}

          {tab === 'fleet' && (
            <>
              {carModal && (
                <CarFormModal
                  carForm={carForm}
                  setCarForm={setCarForm}
                  carFormErr={carFormErr}
                  setCarModal={setCarModal}
                  setCarFormErr={setCarFormErr}
                  handleCreateCar={handleCreateCar}
                />
              )}
              <FleetManagementTab
                myCars={myCars}
                bookings={bookings}
                setCarModal={setCarModal}
                setCarForm={setCarForm}
                CAR_FORM_DEFAULTS={CAR_FORM_DEFAULTS}
                setCarFormErr={setCarFormErr}
                openEditModal={openEditModal}
                handlePutInMaintenance={handlePutInMaintenance}
                handleDeleteCar={handleDeleteCar}
              />
            </>
          )}
          {tab === 'reviews' && (
  <ReviewsTab reviews={reviews} />
)}

          {tab === 'maintenance' && (
            <MaintenanceTab
              alerts={alerts}
              setMaintModal={setMaintModal}
              changeStatus={changeStatus}
            />
          )}
        </div>
      </div>

      <GateModal
        gateModal={gateModal}
        gateForm={gateForm}
        setGateForm={setGateForm}
        setGateModal={setGateModal}
        doGate={doGate}
      />

      <MaintenanceModal
        maintModal={maintModal}
        maintForm={maintForm}
        setMaintForm={setMaintForm}
        setMaintModal={setMaintModal}
        doMaint={doMaint}
      />

      <EditCarModal
        editModal={editModal}
        editForm={editForm}
        setEditForm={setEditForm}
        editErr={editErr}
        setEditModal={setEditModal}
        handleSaveEdit={handleSaveEdit}
      />

      <Toast toast={toast} />
    </div>
  );
}