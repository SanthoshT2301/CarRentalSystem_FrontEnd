import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CarCard({ car }) {
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleBook = () => {
        if (!token) {
            navigate('/login');
            return;
        }

        navigate(`/book/${car.id}`);
    };

    return (
        <div className="card h-100 shadow-sm">
            <img
                src={car.image}
                className="card-img-top"
                alt={`${car.make} ${car.model}`}
                style={{ height: '220px', objectFit: 'cover' }}
            />

            <div className="card-body">
                <div className="d-flex justify-content-between flex-wrap gap-2">
                    <div>
                        <h5 className="card-title">
                            {car.make} {car.model}
                        </h5>

                        <p className="text-muted">
                            {car.year} · {car.type}
                        </p>
                    </div>

                    <h5 className="text-warning mb-0">
                        ₹{car.pricePerDay}/day
                    </h5>
                </div>

                <div className="mb-3">
                    {car.features?.slice(0, 3).map((feature, index) => (
                        <span
                            key={index}
                            className="badge bg-secondary me-1"
                        >
                            {feature}
                        </span>
                    ))}
                </div>

                <p className="text-muted mb-2">
                    📍 {car.location}
                </p>

                <p>
                    ⭐ {car.rating || 4.8}
                    <span className="text-muted ms-1">
                        ({car.reviewsCount || 0})
                    </span>
                </p>

                <span
                    className={`badge ${
                        car.available
                            ? 'bg-success'
                            : 'bg-danger'
                    }`}
                >
                    {car.available
                        ? 'Available'
                        : 'Unavailable'}
                </span>

                <button
                    className={`btn mt-3 w-100 ${
                        car.available
                            ? 'btn-primary'
                            : 'btn-secondary'
                    }`}
                    onClick={handleBook}
                    disabled={!car.available}
                >
                    {car.available
                        ? 'Book Now'
                        : 'Not Available'}
                </button>
            </div>
        </div>
    );
}