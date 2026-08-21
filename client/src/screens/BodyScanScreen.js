import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './BodyScanScreen.scss';

const bodyParts = [
  { id: 'feet', label: 'Stopy', instruction: 'Zwróć uwagę na swoje stopy. Poczuj ich kontakt z podłożem. Jeśli czujesz napięcie, spróbuj je rozluźnić z wydechem.' },
  { id: 'legs', label: 'Łydki i Uda', instruction: 'Przenieś uwagę wyżej, na łydki i uda. Zauważ ciężar swoich nóg.' },
  { id: 'pelvis', label: 'Miednica i Biodra', instruction: 'Skup się na miednicy. Poczuj, jak ciało swobodnie opiera się na siedzeniu.' },
  { id: 'belly', label: 'Brzuch', instruction: 'Zauważ swój brzuch. Obserwuj, jak unosi się i opada z każdym oddechem.' },
  { id: 'chest', label: 'Klatka piersiowa', instruction: 'Poczuj rytm bicia serca i spokojny ruch klatki piersiowej. Rozluźnij plecy.' },
  { id: 'arms', label: 'Barki, Ramiona i Dłonie', instruction: 'Pozwól barkom opaść. Zauważ wszelkie napięcia w dłoniach i miękko je puść.' },
  { id: 'neck', label: 'Szyja i Kark', instruction: 'Zwróć uwagę na szyję. Wyobraź sobie, jak z wydechem opuszcza ją całe napięcie.' },
  { id: 'head', label: 'Głowa i Twarz', instruction: 'Rozluźnij szczękę, wygładź czoło. Pozwól całej twarzy głęboko odpocząć.' },
  { id: 'whole', label: 'Całe Ciało', instruction: 'Teraz obejmij uwagą całe swoje ciało, od czubka głowy aż po palce stóp. Poczuj się całością, zrelaksowany, spokojny i obecny.' },
];

const DURATION_PER_PART = 18000; // Zwiększony czas na jedną część ciała dla powolniejszego lektora

const createAmbientAudio = (ctx) => {
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0; 

  // --- Kojąca Częstotliwość (Drone) ---
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.04; 
  const osc1 = ctx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = 216; 
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = 218.5; // Lekkie dudnienie różnicowe (binaural)
  
  osc1.connect(droneGain);
  osc2.connect(droneGain);
  droneGain.connect(masterGain);
  osc1.start();
  osc2.start();

  // --- Szum Morza (Brown Noise + LFO) ---
  const bufferSize = ctx.sampleRate * 2; 
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02; // Filtr dolnoprzepustowy dla szumu brązowego
    lastOut = output[i];
    output[i] *= 3.5; 
  }
  
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 350; 
  
  const oceanGain = ctx.createGain();
  oceanGain.gain.value = 0.3; 
  
  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.1; // Fale oceanu
  
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.25; 
  
  lfo.connect(lfoGain);
  lfoGain.connect(oceanGain.gain); 

  noiseSource.connect(filter);
  filter.connect(oceanGain);
  oceanGain.connect(masterGain);
  
  noiseSource.start();
  lfo.start();

  masterGain.connect(ctx.destination);
  
  masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 4);

  return () => {
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      noiseSource.stop();
      lfo.stop();
      masterGain.disconnect();
    }, 2500);
  };
};

const BodyScanScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [voices, setVoices] = useState([]);
  const audioCtxRef = useRef(null);
  const stopAudioRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Web Audio API Ambient Sound
  useEffect(() => {
    if (isPlaying) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      stopAudioRef.current = createAmbientAudio(audioCtxRef.current);
    } else {
      if (stopAudioRef.current) {
        stopAudioRef.current();
        stopAudioRef.current = null;
      }
    }
    
    return () => {
      if (stopAudioRef.current) {
        stopAudioRef.current();
        stopAudioRef.current = null;
      }
    }
  }, [isPlaying]);

  // Lektor
  useEffect(() => {
    if (isPlaying) {
      const text = bodyParts[currentIndex].instruction;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.rate = 0.65; // Mocno zwolnione tempo
      utterance.pitch = 0.75; // Niższy, "męski" i spokojny ton
      
      const plVoices = voices.filter(v => v.lang.startsWith('pl'));
      if (plVoices.length > 0) {
        // Preferujemy męski głos, szukając słów kluczowych lub bierzemy pierwszy
        const maleVoice = plVoices.find(v => 
          v.name.includes('Maciej') || 
          v.name.includes('Adam') || 
          v.name.includes('Marek') || 
          v.name.includes('Mikołaj') ||
          v.name.toLowerCase().includes('male') || 
          v.name.toLowerCase().includes('man')
        );
        utterance.voice = maleVoice || plVoices[0];
      }
      
      window.speechSynthesis.cancel(); 
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
    
    return () => {
      window.speechSynthesis.cancel();
    }
  }, [currentIndex, isPlaying, voices]);

  const vibrate = useCallback(() => {
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  }, []);

  const nextPart = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex < bodyParts.length) {
        vibrate();
        return nextIndex;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [vibrate]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentIndex < bodyParts.length) {
      interval = setTimeout(() => {
        nextPart();
      }, DURATION_PER_PART);
    }
    return () => {
      clearTimeout(interval);
    };
  }, [isPlaying, currentIndex, nextPart]);

  const togglePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
      vibrate();
    }
    if (currentIndex === bodyParts.length - 1 && !isPlaying) {
      setCurrentIndex(0);
      setHasStarted(true);
      vibrate();
    }
    setIsPlaying(!isPlaying);
  };

  const currentPart = bodyParts[currentIndex].id;
  const isActive = (partId) => currentPart === partId || currentPart === 'whole';

  return (
    <div className="body-scan-screen">
      <motion.div 
        className="screen-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Skanowanie Ciała</h1>
      </motion.div>

      <div className="scan-content">
        <motion.div 
          className="silhouette-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="silhouette">
            <div className={`part part-head ${isActive('head') ? 'active' : ''}`} />
            <div className={`part part-neck ${isActive('neck') ? 'active' : ''}`} />
            
            <div className="arms-chest-wrapper">
              <div className={`part part-arm left ${isActive('arms') ? 'active' : ''}`} />
              <div className="chest-belly-wrapper">
                <div className={`part part-chest ${isActive('chest') ? 'active' : ''}`} />
                <div className={`part part-belly ${isActive('belly') ? 'active' : ''}`} />
                <div className={`part part-pelvis ${isActive('pelvis') ? 'active' : ''}`} />
              </div>
              <div className={`part part-arm right ${isActive('arms') ? 'active' : ''}`} />
            </div>
            
            <div className="legs-wrapper">
              <div className={`part part-leg left ${isActive('legs') ? 'active' : ''}`} />
              <div className={`part part-leg right ${isActive('legs') ? 'active' : ''}`} />
            </div>
            
            <div className="feet-wrapper">
              <div className={`part part-foot left ${isActive('feet') ? 'active' : ''}`} />
              <div className={`part part-foot right ${isActive('feet') ? 'active' : ''}`} />
            </div>
          </div>
        </motion.div>

        <div className="instruction-panel">
          <div className="controls">
            <button className="control-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={24} /> : (currentIndex === bodyParts.length - 1 && hasStarted ? <RotateCcw size={24} /> : <Play size={24} />)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyScanScreen;
