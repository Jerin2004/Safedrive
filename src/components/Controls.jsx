export function Controls({ speed, onSpeedChange, onTriggerRide, onToggleMic, listening, voiceLog, rideActive }) {
  return (
    <section className="controls-wrap">
      <div className="controls-grid">
        <div className="ctrl-box">
          <div className="ctrl-box-label">Vehicle Speed</div>
          <div className="spd-big">
            {speed} <span style={{ fontSize: 14 }}>km/h</span>
          </div>
          <input
            type="range" min="0" max="60" step="1" value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
          />
          <div className="speed-hints">
            <span>stopped</span>
            <span style={{ color: "var(--amber)" }}>20 = safe mode</span>
            <span>60 km/h</span>
          </div>
        </div>

        <div className="ctrl-box">
          <div className="ctrl-box-label">Simulate Ride</div>
          <button className="ctrl-btn" onClick={onTriggerRide} disabled={rideActive}>
            {rideActive ? "⏳ Ride active…" : "▶  Trigger ride request"}
          </button>
          <button
            className={`mic-btn-ctrl ${listening ? "active" : ""}`}
            onClick={onToggleMic}
            style={{ marginTop: 8 }}
          >
            🎤 {listening ? "Listening… tap to stop" : "Start voice recognition"}
          </button>
          <p className="ctrl-hint">Works in Chrome / Edge. Say: accept, reject, हाँ, नहीं</p>
        </div>

        <div className="ctrl-box">
          <div className="ctrl-box-label">Voice Log</div>
          <div className="voice-log-box">
            {voiceLog.map((line, i) => <div key={i}>{line}</div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "1", icon: "📡", title: "Speed detection", desc: "GPS or accelerometer monitors speed. Above 20 km/h → Safe Mode activates automatically." },
    { n: "2", icon: "🔒", title: "Touch lock", desc: "Accept/Reject buttons disabled while driving. No accidental taps, no pressure to look down." },
    { n: "3", icon: "🔊", title: "Auto TTS read-aloud", desc: "Ride details — pickup, drop, fare, distance — spoken aloud instantly via Web Speech API." },
    { n: "4", icon: "🎤", title: "Voice commands", desc: "Real speech recognition. Driver responds hands-free. Works in English + Hindi.", chips: ["accept", "reject", "हाँ", "नहीं", "ok", "nahi"] },
  ];

  return (
    <section className="how-wrap">
      <div className="section-eyebrow">How it works</div>
      <div className="how-grid">
        {steps.map((s) => (
          <div className="how-card" key={s.n} data-n={s.n}>
            <div className="how-icon">{s.icon}</div>
            <div className="how-title">{s.title}</div>
            <div className="how-desc">{s.desc}</div>
            {s.chips && (
              <div className="how-lang">
                {s.chips.map((c) => <span key={c} className="lang-chip">{c}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
