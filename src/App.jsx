import { useState, useEffect, useRef } from "react";
import PhoneDemo from "./components/PhoneDemo";
import { Controls, HowItWorks } from "./components/Controls";
import "./index.css";

// "accept" gets misheard as "except", "a cept", "axept" etc — cover all phonetic variants
const ACCEPT_WORDS = [
  "accept", "except", "axcept", "a cept", "aksept", "acept", "xcept",
  "ok", "okay", "yes", "yep", "sure",
  "haan", "haa", "han", "ha", "hna",   // हाँ variants
  "theek", "theek hai", "thik", "le lo", "sahi", "bilkul"
];

const REJECT_WORDS = [
  "reject", "no", "nope", "cancel", "skip", "don't", "dont",
  "nahi", "nahi chahiye", "mat lo", "nahin", "nhi", "nah",   // नहीं variants
  "band karo", "chhodo", "rehne do"
];

export default function App() {
  const [speed, setSpeed] = useState(0);
  const [rideActive, setRideActive] = useState(false);
  const [timerSec, setTimerSec] = useState(15);
  const [voiceLog, setVoiceLog] = useState(["// waiting for activity..."]);
  const [listening, setListening] = useState(false);
  const [heardText, setHeardText] = useState("");
  const [rideResult, setRideResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const safeModeOn = speed >= 20;
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const shouldRestartRef = useRef(false);

  const log = (msg) => {
    const ts = new Date().toLocaleTimeString("en-IN");
    setVoiceLog((prev) => [`[${ts}] ${msg}`, ...prev.slice(0, 10)]);
  };

  // ── TIMER ──
  useEffect(() => {
    if (rideActive) {
      setTimerSec(15);
      timerRef.current = setInterval(() => {
        setTimerSec((s) => {
          if (s <= 1) { clearInterval(timerRef.current); handleDismiss("expired"); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [rideActive]);

  // ── SPEECH RECOGNITION — dual language ──
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSpeechSupported(false); log("⚠ Use Chrome/Edge for voice support"); return; }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    // en-IN picks up both English and Hindi naturally
    rec.lang = "en-IN";

    rec.onstart = () => {
      setListening(true);
      log("🎤 सुन रहा हूँ — say: accept / हाँ / reject / नहीं");
    };

    rec.onend = () => {
      if (shouldRestartRef.current) {
        try { rec.start(); } catch (e) {}
      } else {
        setListening(false);
      }
    };

    rec.onerror = (e) => {
      if (e.error === "no-speech") return; // ignore silence, don't log
      log("Mic: " + e.error + (e.error === "not-allowed" ? " — allow mic in browser settings" : ""));
      if (e.error !== "no-speech") { shouldRestartRef.current = false; setListening(false); }
    };

    rec.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript.trim().toLowerCase();
        if (e.results[i].isFinal) final += " " + t;
        else interim += " " + t;
      }

      const heard = (final || interim).trim();
      if (heard) {
        setHeardText(heard);
        log(`👂 "${heard}"`);
      }

      const combined = (final + " " + interim).toLowerCase();

      if (ACCEPT_WORDS.some((w) => combined.includes(w))) {
        log("✅ Accept detected!");
        window.speechSynthesis.cancel();
        stopMic();
        setTimeout(() => handleAccept("voice 🎤"), 300);
      } else if (REJECT_WORDS.some((w) => combined.includes(w))) {
        log("❌ Reject detected!");
        window.speechSynthesis.cancel();
        stopMic();
        setTimeout(() => handleReject("voice 🎤"), 300);
      }
    };

    recognitionRef.current = rec;
  }, []);

  const startMic = () => {
    if (!recognitionRef.current) return;
    shouldRestartRef.current = true;
    try { recognitionRef.current.start(); } catch (e) {}
  };

  const stopMic = () => {
    shouldRestartRef.current = false;
    try { recognitionRef.current?.stop(); } catch (e) {}
    setListening(false);
  };

  const toggleMic = () => { listening ? stopMic() : startMic(); };

  const triggerRide = () => {
    if (rideActive) return;
    setRideActive(true);
    setRideResult(null);
    setHeardText("");
    log("🛺 Ride request — TTS reading aloud");
    speakRide();
    if (safeModeOn && !listening) startMic();
  };

  const handleAccept = (src = "button") => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    setRideResult("accepted");
    log(`✓ Accepted via ${src}`);
    setTimeout(() => handleDismiss(), 2000);
  };

  const handleReject = (src = "button") => {
    window.speechSynthesis.cancel();
    clearInterval(timerRef.current);
    setRideResult("rejected");
    log(`✗ Rejected via ${src}`);
    setTimeout(() => handleDismiss(), 2000);
  };

  const handleDismiss = (reason = "") => {
    setRideActive(false);
    setRideResult(null);
    setHeardText("");
    if (reason === "expired") log("⏱ Timer expired — auto rejected");
    stopMic();
  };

  const speakRide = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      "नई सवारी। Cyber Hub से Ambience Mall। 4 किलोमीटर। 89 रुपये। बोलिए — हाँ या नहीं।"
    );
    u.lang = "hi-IN";
    u.rate = 0.88;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-dot" />
          SafeDrive
        </div>
        <span className="header-tag">Safety prototype · Rideshare</span>
      </header>

      <section className="hero">
        <div className="problem-tag">
          <span className="blink-dot" /> Live safety problem
        </div>
        <h1>Drivers look at their phone<br />while driving at <em>40 km/h</em></h1>
        <p className="hero-sub">
          Rapido, Uber, Ola — every driver gets new ride requests mid-trip.<br />
          15 seconds to look, read, tap — or lose the fare.<br />
          SafeDrive fixes this with voice. Zero screen interaction.
        </p>
        <div className="stat-row">
          <div className="stat"><span className="stat-n red">15s</span><span className="stat-l">accept or lose</span></div>
          <div className="stat"><span className="stat-n amber">5s</span><span className="stat-l">eyes off road</span></div>
          <div className="stat"><span className="stat-n green">0</span><span className="stat-l">taps needed</span></div>
        </div>
      </section>

      <hr className="divider" />

      <section className="compare-wrap">
        <div className="section-eyebrow">Interactive Demo</div>
        <div className="demo-layout">
          <PhoneDemo variant="before" speed={speed} rideActive={rideActive} timerSec={timerSec} safeModeOn={safeModeOn}
            onAccept={() => handleAccept("button")} onReject={() => handleReject("button")}
            rideResult={rideResult} heardText={heardText} listening={listening} />
          <div className="vs-col"><div className="vs-badge">VS</div></div>
          <PhoneDemo variant="after" speed={speed} rideActive={rideActive} timerSec={timerSec} safeModeOn={safeModeOn}
            onAccept={() => handleAccept("button")} onReject={() => handleReject("button")}
            rideResult={rideResult} heardText={heardText} listening={listening} />
        </div>
      </section>

      <Controls speed={speed} onSpeedChange={setSpeed} onTriggerRide={triggerRide}
        onToggleMic={toggleMic} listening={listening} voiceLog={voiceLog}
        rideActive={rideActive} speechSupported={speechSupported} />

      <hr className="divider" />
      <HowItWorks />

      <footer className="footer">
        <span>Built as a product safety concept · Open source</span>
        <span>Works best in Chrome / Edge</span>
      </footer>
    </div>
  );
}
