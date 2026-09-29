import React from 'react';
import { Layers, Activity, MapPin, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Navbar({ backendConnected }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <Layers className="logo-icon" size={24} style={{ color: '#10b981' }} />
        MANGANESE<span>AI</span>
        <span className="logo-badge">SIH PROTOTYPE</span>
      </div>

      <div className="nav-links">
        <a href="#home"><Activity size={15} /> Home</a>
        <a href="#explore"><MapPin size={15} /> Overview</a>
        <a href="#dashboard"><Layers size={15} /> Exploration</a>
        <a href="#production"><TrendingUp size={15} /> Production</a>
        <a href="#alerts"><AlertTriangle size={15} /> Risk Alerts</a>
      </div>

      <div className="backend-status">
        <span className="status-dot"></span>
        {backendConnected ? "Express + PostGIS Connected" : "Connecting Backend..."}
      </div>
    </nav>
  );
}
