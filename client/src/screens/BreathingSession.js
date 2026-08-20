import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BreathingAnimation from '../components/BreathingAnimation';
import ControlPanel from '../components/ControlPanel';
import './BreathingSession.scss';

// Web Audio API Synthesizer Class
class BreathingSynth {
  constructor(themeId) {
    this.themeId = themeId;
    this.audioCtx = null;
    this.initialized = false;
    
    this.padOsc = null;
    this.padOsc2 = null;
    this.padGain = null;
    this.padFilter = null;
    
    this.noiseNode = null;
    this.noiseGain = null;
    this.noiseFilter = null;

    this.chirpInterval = null;
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;

      // 1. Create a soft ambient pad drone
      this.padOsc = this.audioCtx.createOscillator();
      this.padOsc2 = this.audioCtx.createOscillator();
      this.padFilter = this.audioCtx.createBiquadFilter();
      this.padGain = this.audioCtx.createGain();

      this.padOsc.type = 'sine';
      this.padOsc2.type = 'triangle';

      if (this.themeId === 'cosmic') {
        this.padOsc.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2
        this.padOsc2.frequency.setValueAtTime(165, this.audioCtx.currentTime); // E3 (fifth)
      } else if (this.themeId === 'forest') {
        this.padOsc.frequency.setValueAtTime(98, this.audioCtx.currentTime); // G2
        this.padOsc2.frequency.setValueAtTime(146.83, this.audioCtx.currentTime); // D3
      } else { // ocean
        this.padOsc.frequency.setValueAtTime(73.42, this.audioCtx.currentTime); // D2
        this.padOsc2.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2
      }

      this.padFilter.type = 'lowpass';
      this.padFilter.frequency.setValueAtTime(300, this.audioCtx.currentTime);
      this.padFilter.Q.setValueAtTime(1, this.audioCtx.currentTime);

      this.padGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);

      this.padOsc.connect(this.padFilter);
      this.padOsc2.connect(this.padFilter);
      this.padFilter.connect(this.padGain);
      this.padGain.connect(this.audioCtx.destination);

      this.padOsc.start();
      this.padOsc2.start();

      // 2. Noise Generator for wind/waves
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.noiseNode = this.audioCtx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.audioCtx.createBiquadFilter();
      this.noiseFilter.type = 'bandpass';
      this.noiseFilter.frequency.setValueAtTime(400, this.audioCtx.currentTime);
      this.noiseFilter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      this.noiseGain = this.audioCtx.createGain();
      this.noiseGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.audioCtx.destination);

      this.noiseNode.start();

      if (this.themeId === 'forest') {
        this.chirpInterval = setInterval(() => this.triggerForestChirp(), 4500);
      }
    } catch (e) {
      console.error('Failed to initialize AudioContext:', e);
    }
  }

  triggerForestChirp() {
    if (!this.initialized || this.audioCtx.state === 'suspended') return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700 + Math.random() * 500, now);
      osc.frequency.exponentialRampToValueAtTime(1200 + Math.random() * 300, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.28);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.012, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch(e) {}
  }

  update(scale) {
    if (!this.initialized) return;
    try {
      const now = this.audioCtx.currentTime;
      const norm = (scale - 0.8) / 0.4; // 0..1

      let noiseFreq, noiseVol, padFreq;

      if (this.themeId === 'ocean') {
        noiseFreq = 160 + norm * 260; 
        noiseVol = 0.01 + norm * 0.038; 
        padFreq = 180 + norm * 160; 
      } else if (this.themeId === 'forest') {
        noiseFreq = 220 + norm * 330; 
        noiseVol = 0.007 + norm * 0.024;
        padFreq = 220 + norm * 180;
      } else { // cosmic
        noiseFreq = 280 + norm * 450; 
        noiseVol = 0.004 + norm * 0.018;
        padFreq = 380 + norm * 350;
      }

      this.noiseFilter.frequency.setTargetAtTime(noiseFreq, now, 0.12);
      this.noiseGain.gain.setTargetAtTime(noiseVol, now, 0.18);
      this.padFilter.frequency.setTargetAtTime(padFreq, now, 0.28);
    } catch (e) {}
  }

  fadeOut(durationSec) {
    if (!this.initialized) return;
    try {
      const now = this.audioCtx.currentTime;
      this.noiseGain.gain.cancelScheduledValues(now);
      this.padGain.gain.cancelScheduledValues(now);
      
      this.noiseGain.gain.setValueAtTime(this.noiseGain.gain.value, now);
      this.noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      
      this.padGain.gain.setValueAtTime(this.padGain.gain.value, now);
      this.padGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    } catch (e) {}
  }

  suspend() {
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend();
    }
  }

  resume() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stop() {
    if (this.chirpInterval) {
      clearInterval(this.chirpInterval);
    }
    if (this.audioCtx) {
      try {
        this.padOsc?.stop();
        this.padOsc2?.stop();
        this.noiseNode?.stop();
        this.audioCtx.close();
      } catch (e) {}
      this.initialized = false;
    }
  }
}

const BreathingSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract technique, theme, and duration from state
  const durationInSeconds = location.state?.duration || 60;
  const technique = location.state?.technique || { id: 'box', name: 'Box Breathing', phases: [4, 4, 4, 4] };
  const theme = location.state?.theme || { id: 'ocean', name: 'Ocean Wave' };

  // Calculate cycle timing based on technique
  const [inhale, holdFull, exhale, holdEmpty] = technique.phases;
  const cycleTimeMs = (inhale + holdFull + exhale + holdEmpty) * 1000;

  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [remainingTime, setRemainingTime] = useState(durationInSeconds);
  const [countdown, setCountdown] = useState(4);
  
  const [text, setText] = useState('Inhale');
  const [scale, setScale] = useState(0.8);
  
  const animationFrameId = useRef();
  const cycleStartTime = useRef(performance.now());
  const timePaused = useRef(0);
  const synthRef = useRef(null);

  // Initialize synthesizer
  useEffect(() => {
    synthRef.current = new BreathingSynth(theme.id);
    return () => {
      synthRef.current?.stop();
    };
  }, [theme.id]);

  // Countdown effect
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) {
          clearInterval(countdownInterval);
          setIsReady(true);
          // Initialize synthesizer audio on user interaction completion
          synthRef.current?.init();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(countdownInterval);
  }, []);

  // Animation Loop and Synth Modulation
  useEffect(() => {
    const animate = (timestamp) => {
      const elapsedSinceStart = timestamp - cycleStartTime.current;
      const progress = elapsedSinceStart % cycleTimeMs; // progress in ms: 0..cycleTimeMs

      const inhaleLimit = inhale * 1000;
      const holdFullLimit = inhaleLimit + holdFull * 1000;
      const exhaleLimit = holdFullLimit + exhale * 1000;

      let currentScale = 0.8;
      let currentText = 'Inhale';

      if (progress < inhaleLimit) {
        // Inhaling phase
        const ratio = progress / inhaleLimit;
        // smooth cosine easing
        currentScale = 0.8 + 0.4 * (0.5 * (1 - Math.cos(ratio * Math.PI)));
        currentText = 'Inhale';
      } else if (progress < holdFullLimit) {
        // Holding full phase
        currentScale = 1.2;
        currentText = 'Hold';
      } else if (progress < exhaleLimit) {
        // Exhaling phase
        const ratio = (progress - holdFullLimit) / (exhale * 1000);
        currentScale = 1.2 - 0.4 * (0.5 * (1 - Math.cos(ratio * Math.PI)));
        currentText = 'Exhale';
      } else {
        // Holding empty phase
        currentScale = 0.8;
        currentText = 'Hold';
      }

      setScale(currentScale);
      setText(currentText);

      // Modulate synthesizer sound (only if not fading out)
      if (!isFadingOut) {
        synthRef.current?.update(currentScale);
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (isReady && !isPaused && !isFadingOut) {
      cycleStartTime.current = performance.now() - timePaused.current;
      animationFrameId.current = requestAnimationFrame(animate);
      synthRef.current?.resume();
    } else {
      timePaused.current = performance.now() - cycleStartTime.current;
      cancelAnimationFrame(animationFrameId.current);
      if (isPaused) {
        synthRef.current?.suspend();
      }
    }

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isReady, isPaused, isFadingOut, cycleTimeMs, inhale, holdFull, exhale]);

  // Session timer
  useEffect(() => {
    if (isReady && !isPaused && !isFadingOut && remainingTime > 0) {
      const remainingTimeInterval = setInterval(() => setRemainingTime(t => t - 1), 1000);
      return () => clearInterval(remainingTimeInterval);
    }
    if (remainingTime <= 0 && !isFadingOut) {
      setIsFadingOut(true);
      synthRef.current?.fadeOut(2.5);
      setTimeout(() => {
        navigate('/breathe');
      }, 2500);
    }
  }, [isReady, isPaused, isFadingOut, remainingTime, navigate]);

  const handlePlayPause = () => {
    if (isReady && !isFadingOut) {
      setIsPaused(p => !p);
    }
  };

  return (
    <div className="session-screen">
      <BreathingAnimation 
        isReady={isReady} 
        text={text} 
        countdown={countdown > 0 && countdown <= 3 ? countdown : null}
        scale={scale}
        theme={theme}
        isFadingOut={isFadingOut}
      />
      <div className="session-screen__panel-wrapper">
        <ControlPanel onPlayPause={handlePlayPause} isPlaying={!isPaused && !isFadingOut} />
      </div>
    </div>
  );
};

export default BreathingSession;