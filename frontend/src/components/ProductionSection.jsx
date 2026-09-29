import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Activity, BarChart3, Zap } from 'lucide-react';

export default function ProductionSection({ productionData, activeAlertsCount, onCheckShortfall }) {
  const [siteInput, setSiteInput] = useState('Bamebari');
  const [actualKtInput, setActualKtInput] = useState('12.5');
  const [predictedKtInput, setPredictedKtInput] = useState('18.0');
  const [evaluating, setEvaluating] = useState(false);
  const [lastShortfallResult, setLastShortfallResult] = useState(null);

  const handleShortfallSubmit = async (e) => {
    e.preventDefault();
    setEvaluating(true);
    try {
      const result = await onCheckShortfall({
        site: siteInput,
        actualKt: parseFloat(actualKtInput),
        predictedKt: parseFloat(predictedKtInput)
      });
      setLastShortfallResult(result);
    } catch (err) {
      console.error("Shortfall check failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // Compute stats if productionData exists
  const latestProduction = productionData && productionData.length > 0 ? productionData[productionData.length - 1] : null;
  const predictedValue = latestProduction ? latestProduction.predictedKt : 18.5;
  const actualValue = latestProduction ? latestProduction.actualKt : 14.2;

  return (
    <section className="production" id="production">
      <div className="section-heading">
        <div className="badge">
          <TrendingUp size={14} /> PRODUCTION INTELLIGENCE
        </div>
        <h2>
          Monitor <span>Production Risk & Forecasting</span>
        </h2>
        <p>
          Predict prospective production shortfalls and detect operational bottlenecks across manganese mining operations before supply chains are affected.
        </p>
      </div>

      <div className="production-grid">
        {/* CARD 1: FORECAST METRIC */}
        <div className="production-card">
          <div>
            <div className="panel-label">PRODUCTION FORECAST</div>
            <h3 style={{ fontSize: '20px', margin: '8px 0', fontFamily: 'Outfit' }}>Target Output</h3>
            <div className="big-stat">
              {predictedValue} <span>kilo-tonnes (kt)</span>
            </div>
            <p>
              Estimated baseline target for current quarter derived from historical lease yields and PostGIS extraction boundaries.
            </p>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
            <span>Recorded Actual: <strong>{actualValue || '14.2'} kt</strong></span>
            <span style={{ color: '#10b981' }}>Variance: -4.3 kt</span>
          </div>
        </div>

        {/* CARD 2: ACTIVE RISK STATUS */}
        <div className={`production-card ${activeAlertsCount > 0 ? 'warning-card' : ''}`}>
          <div>
            <div className="panel-label">RISK ALERT STATUS</div>
            <h3 style={{ fontSize: '20px', margin: '8px 0', fontFamily: 'Outfit' }}>Active Production Hazards</h3>
            <div className="big-stat" style={{ color: activeAlertsCount > 0 ? '#f59e0b' : '#10b981' }}>
              {activeAlertsCount} <span>active alerts</span>
            </div>
            <p>
              {activeAlertsCount > 0 
                ? `${activeAlertsCount} active risk alerts require mitigation. Review alerts panel below for details.`
                : 'All production streams are operating within normal variance thresholds.'}
            </p>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: activeAlertsCount > 0 ? '#fbbf24' : '#34d399' }}>
            {activeAlertsCount > 0 ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
            <span>{activeAlertsCount > 0 ? 'Shortfall Action Required' : 'No Critical Disruptions'}</span>
          </div>
        </div>

        {/* CARD 3: SHORTFALL SIMULATION TOOL */}
        <div className="production-card">
          <div>
            <div className="panel-label">AI SHORTFALL EVALUATOR</div>
            <h3 style={{ fontSize: '20px', margin: '8px 0', fontFamily: 'Outfit' }}>Test Shortfall Risk</h3>
            
            <form onSubmit={handleShortfallSubmit} style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b' }}>Actual (kt)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={actualKtInput} 
                    onChange={(e) => setActualKtInput(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#64748b' }}>Predicted (kt)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={predictedKtInput} 
                    onChange={(e) => setPredictedKtInput(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={evaluating}
                style={{ width: '100%', padding: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#34d399', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', marginTop: '4px' }}
              >
                {evaluating ? 'Evaluating Python AI...' : 'Evaluate & Create Alert'}
              </button>
            </form>

            {lastShortfallResult && (
              <div style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', fontSize: '11px', color: '#34d399' }}>
                Result: Severity {lastShortfallResult.severity || 'Normal'} ({lastShortfallResult.issue || 'Evaluated'})
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
