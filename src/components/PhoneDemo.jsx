import { useEffect, useRef, useState } from "react";

function MapArea({ speed, variant, rideActive, safeModeOn }) {
  const carRef = useRef(null);
  const posRef = useRef({ x: 50, y: 50 });
  const movingRef = useRef(false);

  useEffect(() => {
    if (speed > 0 && !movingRef.current) {
      movingRef.current = true;
      moveCar();
    }
    if (speed === 0) movingRef.current = false;
  }, [speed]);

  function moveCar() {
    if (!movingRef.current || speed === 0) return;
    const s = speed / 60;
    posRef.current.x += (Math.random() - 0.45) * s * 4;
    posRef.current.y += (Math.random() - 0.52) * s * 3;
    posRef.current.x = Math.max(10, Math.min(88, posRef.current.x));
    posRef.current.y = Math.max(10, Math.min(80, posRef.current.y));
    if (carRef.current) {
      carRef.current.style.left = posRef.current.x + "%";
      carRef.current.style.top = posRef.current.y + "%";
    }
    setTimeout(moveCar, 420);
  }

  const isAfter = variant === "after";
  const speedColor = isAfter
    ? safeModeOn ? "var(--amber)" : "var(--green)"
    : "var(--red)";

  return (
    <div className="pmap">
      <div className="pmap-grid" />
      <div className="proad-h" style={{ top: "40%" }} />
      <div className="proad-h" style={{ top: "68%" }} />
      <div className="proad-v" style={{ left: "28%" }} />
      <div className="proad-v" style={{ left: "66%" }} />
      <div className="pcar" ref={carRef}>🛺</div>

      <div className="pspeed">
        <div className="pspeed-n" style={{ color: speedColor }}>{speed}</div>
        <div className="pspeed-u">km/h</div>
      </div>

      {isAfter && (
        <div className={`psafe-badge ${safeModeOn ? "on" : "off"}`}>
          {safeModeOn ? "SAFE MODE ON" : "SAFE MODE OFF"}
        </div>
      )}
      {!isAfter && (
        <div className="psafe-badge off">UNSAFE</div>
      )}
    </div>
  );
}

function RideCard({ variant, timerSec, safeModeOn, onAccept, onReject, heardText, listening, rideResult }) {
  const isAfter = variant === "after";
  const pct = (timerSec / 15) * 100;

  return (
    <>
      <div className="pride-card">
        <div className="prc-header">
          <div className="prc-dot" />
          <span className="prc-title">New Ride</span>
          <span className="timer-label">{timerSec}s</span>
        </div>
        <div className="prc-row"><div className="prc-pip g" /><span>Cyber Hub, Gurugram</span></div>
        <div className="prc-row" style={{ marginTop: 3 }}><div className="prc-pip r" /><span>Ambience Mall</span></div>
        <div className="prc-fare">₹89 <span>4.2km · 12min</span></div>
        <div className="ptimer-bar"><div className="ptimer-fill" style={{ width: pct + "%" }} /></div>

        {isAfter && safeModeOn ? (
          <div className="lock-msg">🔒 LOCKED — USE VOICE</div>
        ) : (
          <div className="pbtns">
            <button className="pbtn rej" onClick={onReject}>Reject</button>
            <button className="pbtn acc" onClick={onAccept}>Accept</button>
          </div>
        )}
      </div>

      {/* Voice screen — only after phone + safe mode */}
      {isAfter && safeModeOn && (
        <div className="voice-screen">
          <div className={`vring ${rideResult ? "heard" : ""}`}>
            {rideResult === "accepted" ? "✅" : rideResult === "rejected" ? "❌" : "🎤"}
          </div>
          <div className="vtitle">
            {rideResult === "accepted" ? "Accepted!" : rideResult === "rejected" ? "Rejected!" : listening ? "Listening…" : "Tap mic to start"}
          </div>
          <div className="vsub">
            {heardText ? `"${heardText}"` : 'say "accept" or "reject"\nया हाँ / नहीं'}
          </div>
          {listening && <WaveAnimation />}
          <div className="vbtns">
            <button className="vbtn rej" onClick={onReject}>Reject</button>
            <button className="vbtn acc" onClick={onAccept}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}

function WaveAnimation() {
  const [heights, setHeights] = useState([3, 7, 4, 10, 5, 8, 3]);

  useEffect(() => {
    const int = setInterval(() => {
      setHeights(Array.from({ length: 7 }, () => Math.floor(Math.random() * 14) + 3));
    }, 130);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="vwaves">
      {heights.map((h, i) => (
        <div key={i} className="vwb" style={{ height: h }} />
      ))}
    </div>
  );
}

export default function PhoneDemo({
  variant, speed, rideActive, timerSec, safeModeOn,
  onAccept, onReject, rideResult, heardText, listening
}) {
  const isBefore = variant === "before";
  const showDanger = isBefore && rideActive && speed >= 20;

  return (
    <div className="phone-col">
      <span className={`col-label ${isBefore ? "bad" : "good"}`}>
        {isBefore ? "⚠ Today — dangerous" : "✓ SafeDrive — safe"}
      </span>
      <div className={`phone ${isBefore ? "phone-bad" : "phone-good"}`}>
        <div className="notch" />
        <div className="pscreen">
          <MapArea speed={speed} variant={variant} rideActive={rideActive} safeModeOn={safeModeOn} />

          <div className="pbottom">
            <div className="ptrip">
              <div>
                <div className="ptrip-dest">→ Sector 29</div>
                <div className="ptrip-sub">current ride · 2.1km left</div>
              </div>
              <div className="ptrip-earn">₹124</div>
            </div>
          </div>

          {rideActive && (
            <div className="pride-overlay show">
              <RideCard
                variant={variant}
                timerSec={timerSec}
                safeModeOn={safeModeOn}
                onAccept={onAccept}
                onReject={onReject}
                heardText={heardText}
                listening={listening}
                rideResult={rideResult}
              />
            </div>
          )}

          {showDanger && (
            <>
              <div className="danger-flash" />
              <div className="eyes-off">⚠ EYES OFF ROAD</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
