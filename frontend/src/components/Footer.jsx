import React from 'react';
import { Layers, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="about">
      <div className="footer-logo">
        <Layers className="logo-icon" size={22} style={{ color: '#10b981', display: 'inline', marginRight: '8px' }} />
        MANGANESE<span>AI</span>
      </div>

      <p>
        AI-Powered Manganese Exploration, Geospatial Satellite Intelligence & Production Shortfall Forecasting Platform.
      </p>

      <div className="footer-divider"></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#64748b' }}>
        <div>
          Smart India Hackathon (SIH) Prototype • Node Express + PostGIS + Python FastAPI AI Service
        </div>
        <div>
          Prospectivity Index for Ground Drilling Prioritisation
        </div>
      </div>
    </footer>
  );
}
