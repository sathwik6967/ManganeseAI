import React from 'react';
import { Satellite, ArrowRight, Compass, ShieldAlert, Cpu } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="badge">
          <Satellite size={14} /> AI + SPACE TECHNOLOGY FOR MINING
        </div>

        <h1>
          Intelligent Manganese <span>Reserve Prospectivity</span> & Shortfall Forecasting
        </h1>

        <p>
          ManganeseAI integrates NASA POWER live satellite climate indicators, IBM/GSI published reserve share models, and PostGIS geospatial intelligence to generate a high-precision manganese prospectivity index for prioritising ground survey and drilling.
        </p>

        <div className="hero-buttons">
          <a href="#dashboard" className="primary-button" onClick={onExploreClick}>
            Explore Live Dashboard <ArrowRight size={18} />
          </a>

          <a href="#explore" className="secondary-button">
            <Compass size={18} /> Core Capabilities
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="earth-card">
          <div className="grid-circle">
            <div className="circle-dot dot-one"></div>
            <div className="circle-dot dot-two"></div>
            <div className="circle-dot dot-three"></div>

            <div className="earth-center">
              <Cpu size={28} />
              <span>GEOSPATIAL AI</span>
            </div>
          </div>

          <div className="location-card">
            <div className="location-title">
              <span style={{ color: '#10b981' }}>●</span> Bamebari Site
            </div>
            <div className="location-info">
              Keonjhar District, Odisha (21.8945° N, 85.4295° E)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
