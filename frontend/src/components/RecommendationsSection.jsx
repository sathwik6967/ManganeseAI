import React from 'react';
import { Lightbulb, CloudRain, Pickaxe, MapPin, ShieldAlert, Cpu } from 'lucide-react';

export default function RecommendationsSection() {
  return (
    <section className="recommendations-section" id="recommendations">
      <div className="section-heading">
        <div className="badge">
          <Lightbulb size={14} /> DECISION SUPPORT SYSTEM
        </div>
        <h2>
          Operational <span>Recommendations & Insights</span>
        </h2>
        <p>
          AI-driven operational mitigations to counteract environmental disruptions, optimize survey drilling budgets, and streamline manganese production output.
        </p>
      </div>

      <div className="recommendations-grid">
        <div className="recommendation-card">
          <h4>
            <CloudRain size={20} /> Heavy Monsoon Precipitation Mitigation
          </h4>
          <p>
            When NASA POWER telemetry indicates rainfall &gt; 4.0 mm/day, open-pit drainage pumps should be proactively activated and haulage routes reinforced with gravel capping to prevent haul truck slippage and pit flooding.
          </p>
        </div>

        <div className="recommendation-card">
          <h4>
            <Pickaxe size={20} /> Targeted Ground Survey & Drilling Priority
          </h4>
          <p>
            For regions scoring a Prospectivity Index &gt; 50 (e.g. Bamebari lease zone), focus core-drilling budgets on high-density magnetic anomaly sub-sectors rather than wide-grid reconnaissance.
          </p>
        </div>

        <div className="recommendation-card">
          <h4>
            <Cpu size={20} /> Production Shortfall Buffer Allocation
          </h4>
          <p>
            Maintain a 15% strategic reserve buffer at regional blending yards in Keonjhar to absorb haulage delays during peak monsoon months, preventing supply chain disruptions to domestic steel manufacturing plants.
          </p>
        </div>
      </div>
    </section>
  );
}
