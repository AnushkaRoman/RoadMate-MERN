
import React from "react";
import Navbar from "../components/Navbar";
import {
  CarFront,
  ShieldCheck,
  CalendarCheck,
  Fuel,
  Wrench,
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";

function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="rm-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="rm-tag">
                <span className="rm-dot"></span>
                SMARTER VEHICLE OWNERSHIP
              </span>

              <h1>
                Your Vehicle.
                <br />
                Your Journey.
                <br />
                <span>Our RoadMate.</span>
              </h1>

              <p className="rm-hero-text">
                Everything your vehicle needs, all in one place.
                Manage maintenance, insurance, servicing, and
                vehicle records with RoadMate.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="/signup" className="btn rm-primary-btn">
                  Get Started <ArrowRight size={18} />
                </a>

                <a href="#features" className="btn rm-secondary-btn">
                  Explore RoadMate
                </a>
              </div>

              <div className="rm-hero-points mt-4">
                <span>
                  <CheckCircle size={17} />
                  Easy vehicle management
                </span>

                <span>
                  <CheckCircle size={17} />
                  Smart reminders
                </span>
              </div>
            </div>

            {/* REAL CAR IMAGE */}
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="rm-car-visual">
                <img
                  src="/bmw.png"
                  alt="RoadMate premium vehicle"
                  className="rm-hero-car"
                />

                <div className="rm-floating-card rm-insurance">
                  <ShieldCheck size={26} />
                  <div>
                    <strong>Insurance</strong>
                    <small>Stay protected</small>
                  </div>
                </div>

                <div className="rm-floating-card rm-service">
                  <CalendarCheck size={26} />
                  <div>
                    <strong>Service Reminder</strong>
                    <small>Maintenance made easy</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FEATURES */}
      <section className="rm-quick-section">
        <div className="container">
          <div className="row g-3">
            <QuickFeature
              icon={<CarFront />}
              title="My Vehicles"
              text="Manage vehicles"
            />

            <QuickFeature
              icon={<Wrench />}
              title="Service Booking"
              text="Book maintenance"
            />

            <QuickFeature
              icon={<ShieldCheck />}
              title="Insurance"
              text="Track policies"
            />

            <QuickFeature
              icon={<Fuel />}
              title="Fuel Finder"
              text="Find fuel stations"
            />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="rm-features-section" id="features">
        <div className="container">
          <div className="rm-section-heading text-center">
            <span>THE ROADMate EXPERIENCE</span>

            <h2>Everything your vehicle needs.</h2>

            <p>
              Take control of vehicle ownership with intelligent
              tools designed to make your journey easier.
            </p>
          </div>

          <div className="row g-4 mt-4">
            <Feature
              icon={<CalendarCheck />}
              title="Smart Reminders"
              text="Never miss servicing, insurance renewals, or PUC expiry dates."
            />

            <Feature
              icon={<Wrench />}
              title="Service Management"
              text="Discover service centers and manage maintenance appointments."
            />

            <Feature
              icon={<ShieldCheck />}
              title="Insurance Tracking"
              text="Keep track of insurance policies and important expiry dates."
            />

            <Feature
              icon={<Fuel />}
              title="Fuel Finder"
              text="Locate nearby fuel stations and simplify refueling."
            />

            <Feature
              icon={<Clock />}
              title="Vehicle Logbook"
              text="Maintain service history, expenses, and vehicle records."
            />

            <Feature
              icon={<MapPin />}
              title="Nearby Services"
              text="Connect with vehicle service providers conveniently."
            />
          </div>
        </div>
      </section>

      {/* HOW ROADMate WORKS */}
      <section className="rm-how-section" id="about">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <span className="rm-orange-label">
                SIMPLE. SMART. ROADMate.
              </span>

              <h2>Vehicle care made effortless.</h2>

              <p>
                RoadMate brings all your vehicle management
                activities together in one convenient platform.
              </p>
            </div>

            <div className="col-lg-7">
              <div className="rm-steps">
                <Step
                  number="01"
                  title="Create Your Account"
                  text="Register and get started with RoadMate."
                />

                <Step
                  number="02"
                  title="Add Your Vehicle"
                  text="Save your vehicle details and important documents."
                />

                <Step
                  number="03"
                  title="Manage Everything"
                  text="Track services, reminders, insurance, and records."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="rm-cta-section" id="services">
        <div className="container">
          <div className="rm-cta">
            <div>
              <span>READY TO GET STARTED?</span>

              <h2>Your journey starts with RoadMate.</h2>

              <p>
                Manage your vehicle smarter, starting today.
              </p>
            </div>

            <a href="/signup" className="btn rm-primary-btn">
              Join RoadMate <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="rm-footer">
        <div className="container">
          <div className="row gy-4 align-items-center">
            <div className="col-md-6">
              <h3>
                <span>Road</span>Mate.
              </h3>

              <p>
                Your companion for smarter vehicle management.
              </p>
            </div>

            <div className="col-md-6 text-md-end">
              <a href="/">Home</a>
              <a href="#features">Features</a>
              <a href="#about">About</a>

              <p className="rm-copyright">
                © 2026 RoadMate. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// QUICK FEATURE COMPONENT
function QuickFeature({ icon, title, text }) {
  return (
    <div className="col-6 col-lg-3">
      <div className="rm-quick-card">
        <div className="rm-quick-icon">{icon}</div>

        <div>
          <h6>{title}</h6>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

// FEATURE CARD COMPONENT
function Feature({ icon, title, text }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="rm-feature-card">
        <div className="rm-feature-icon">{icon}</div>

        <h5>{title}</h5>

        <p>{text}</p>

        <a href="/signup">
          Explore <ArrowRight size={15} />
        </a>
      </div>
    </div>
  );
}

// HOW IT WORKS COMPONENT
function Step({ number, title, text }) {
  return (
    <div className="rm-step">
      <div className="rm-step-number">{number}</div>

      <div>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Home;
