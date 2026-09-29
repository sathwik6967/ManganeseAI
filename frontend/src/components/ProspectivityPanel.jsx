import React from 'react';
import { 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Database, 
  AlertTriangle, 
  Loader2, 
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function ProspectivityPanel({ 
  selectedSite, 
  predictionResult, 
  loading, 
  error, 
  onAnalyze 
}) {
  const siteName = selectedSite?.site_name || selectedSite?.name || 'Bamebari';
  const district = selectedSite?.district || 'Keonjhar';
  const state = selectedSite?.state || 'Odisha';
  const lat = selectedSite?.latitude || selectedSite?.lat || 21.8945;
  const lon = selectedSite?.longitude || selectedSite?.lon || 85.4295;

  // Extract values from prediction response or display default / initial data
  const prediction = predictionResult?.prediction;
  const indicators = predictionResult?.prediction?.indicators || predictionResult?.indicators;
  
  const prospectivityIndex = prediction?.prospectivityIndex ?? 51;
  const status = (prediction?.status || 'medium').toLowerCase();
  
  const rainfall = indicators?.rainfallMmPerDay ?? 4.11;
  const temp = indicators?.landSurfaceTempC ?? 24.78;
  const soilWetness = indicators?.rootZoneSoilWetness ?? 0.68;
  
  const dataSource = predictionResult?.dataSource || "NASA POWER (live climate data) + IBM/GSI published state reserve shares";
  const disclaimer = predictionResult?.disclaimer || "This is a prospectivity index for prioritising ground survey/drilling, not a confirmed deposit detection. No public dataset provides ground-truth assay labels needed for a verified detection model.";

  return (
    <div className="analysis-panel">
      <div>
        <div className="panel-header">
          <div>
            <div className="panel-label">Target Geospatial Region</div>
            <h3>{siteName}</h3>
            <p>{district}, {state} • [{lat}°, {lon}°]</p>
          </div>

          <div className={`status-badge ${status}`}>
            {status.toUpperCase()}
          </div>
        </div>

        {/* PROSPECTIVITY SCORE BOX */}
        <div className="score-box">
          <div className="score-header">
            <span className="panel-label">Prospectivity Index</span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Range 0 – 100</span>
          </div>

          <div className="score-value">
            {prospectivityIndex}
          </div>

          <div className="score-bar-bg">
            <div 
              className="score-bar-fill" 
              style={{ width: `${Math.min(100, Math.max(0, prospectivityIndex))}%` }}
            ></div>
          </div>
        </div>

        {/* ENVIRONMENTAL SATELLITE INDICATORS */}
        <div className="panel-label" style={{ marginBottom: '10px' }}>Satellite Climate Indicators (NASA POWER)</div>
        <div className="indicators-grid">
          <div className="indicator-row">
            <div className="indicator-label">
              <CloudRain size={16} style={{ color: '#3b82f6' }} />
              <span>Rainfall</span>
            </div>
            <div className="indicator-value">{rainfall} <small style={{ fontSize: '11px', color: '#64748b' }}>mm/day</small></div>
          </div>

          <div className="indicator-row">
            <div className="indicator-label">
              <Thermometer size={16} style={{ color: '#f59e0b' }} />
              <span>Land Surface Temp</span>
            </div>
            <div className="indicator-value">{temp} <small style={{ fontSize: '11px', color: '#64748b' }}>°C</small></div>
          </div>

          <div className="indicator-row">
            <div className="indicator-label">
              <Droplets size={16} style={{ color: '#10b981' }} />
              <span>Root Zone Soil Wetness</span>
            </div>
            <div className="indicator-value">{soilWetness}</div>
          </div>
        </div>

        <div className="data-source-tag">
          <Database size={12} /> Source: {dataSource}
        </div>

        {/* SCIENTIFIC DISCLAIMER BOX */}
        <div className="disclaimer-box">
          <div className="disclaimer-title">
            <AlertTriangle size={14} /> SCIENTIFIC & LEGAL DISCLAIMER
          </div>
          <div className="disclaimer-text">
            {disclaimer}
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={16} />
            <div>
              <strong>API Notice:</strong> {error}
            </div>
          </div>
        )}
      </div>

      <button 
        className="analyze-button" 
        onClick={onAnalyze} 
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="spinner" size={18} />
            Analyzing NASA Telemetry & ML...
          </>
        ) : (
          <>
            <Search size={18} />
            Analyze Selected Area
          </>
        )}
      </button>
    </div>
  );
}
