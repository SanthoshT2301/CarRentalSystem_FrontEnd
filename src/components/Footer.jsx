import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else navigate("/");
  }

  return (
    <footer className="bg-black border-top border-dark py-5">
      <div className="container">
        <div className="row g-4 mb-5">

          {/* Brand */}
          <div className="col-12 col-md-6 col-lg-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded"
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: "#e85d24",
                }}
              >
                🚗
              </div>
              <span
                className="fw-bold text-white"
                style={{ fontSize: "13px", letterSpacing: "1px" }}
              >
                ROADREADY
              </span>
            </div>

            <p className="text-secondary small lh-lg">
              Affordable, flexible car rentals across the US. Book in seconds.
            </p>
          </div>

          {/* Services */}
          <div className="col-6 col-md-6 col-lg-2">
            <h6
              className="fw-semibold mb-3"
              style={{
                color: "#e85d24",
                fontSize: "11px",
                letterSpacing: "1px",
              }}
            >
              SERVICES
            </h6>

            {[
              "Hourly Rental",
              "Daily Rental",
              "Corporate Plans",
              "One-Way Trips",
            ].map((service) => (
              <p
                key={service}
                className="text-secondary small mb-2"
                style={{ cursor: "pointer" }}
                onClick={() => scrollTo("services")}
              >
                {service}
              </p>
            ))}
          </div>

          {/* Cities */}
          <div className="col-6 col-md-6 col-lg-2">
            <h6
              className="fw-semibold mb-3"
              style={{
                color: "#e85d24",
                fontSize: "11px",
                letterSpacing: "1px",
              }}
            >
              CITIES
            </h6>

            {[
              "New York",
              "Los Angeles",
              "Chicago",
              "Houston",
              "Miami",
              "Seattle",
            ].map((city) => (
              <p key={city} className="text-secondary small mb-2">
                {city}
              </p>
            ))}
          </div>

          {/* Company */}
          <div className="col-6 col-md-6 col-lg-3">
            <h6
              className="fw-semibold mb-3"
              style={{
                color: "#e85d24",
                fontSize: "11px",
                letterSpacing: "1px",
              }}
            >
              COMPANY
            </h6>

            {["About Us", "Careers", "Blog", "Contact"].map((item) => (
              <p
                key={item}
                className="text-secondary small mb-2"
                style={{ cursor: "pointer" }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="border-top border-dark pt-4 text-center">
          <p className="text-secondary small mb-0">
            © 2026 RoadReady. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}