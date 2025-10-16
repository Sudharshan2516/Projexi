import { useEffect, useState } from 'react';
import '../styles/hud.css';

interface HUDState {
  visible: boolean;
  message: string;
  progress: number | null;
}

let hudState: HUDState = {
  visible: false,
  message: '',
  progress: null,
};

let listeners: Array<(state: HUDState) => void> = [];

export const HUD = {
  show: (message: string = 'Loading...') => {
    hudState = { visible: true, message, progress: null };
    listeners.forEach(listener => listener(hudState));
  },

  showProgress: (message: string, progress: number) => {
    hudState = { visible: true, message, progress };
    listeners.forEach(listener => listener(hudState));
  },

  updateProgress: (progress: number) => {
    if (hudState.visible) {
      hudState = { ...hudState, progress };
      listeners.forEach(listener => listener(hudState));
    }
  },

  hide: () => {
    hudState = { visible: false, message: '', progress: null };
    listeners.forEach(listener => listener(hudState));
  },
};

export function HUDOverlay() {
  const [state, setState] = useState<HUDState>(hudState);

  useEffect(() => {
    const listener = (newState: HUDState) => setState(newState);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  if (!state.visible) return null;

  return (
    <div className="hud-overlay">
      <div className="hud-content">
        <div className="hud-scanner">
          <div className="scanner-ring scanner-ring-1"></div>
          <div className="scanner-ring scanner-ring-2"></div>
          <div className="scanner-ring scanner-ring-3"></div>
          <div className="scanner-core"></div>
          <div className="scanner-beam"></div>
        </div>

        <div className="hud-message">{state.message}</div>

        {state.progress !== null && (
          <div className="hud-progress">
            <div className="progress-circle">
              <svg className="progress-svg" viewBox="0 0 100 100">
                <circle
                  className="progress-bg"
                  cx="50"
                  cy="50"
                  r="45"
                />
                <circle
                  className="progress-bar"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 45}`,
                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - state.progress / 100)}`,
                  }}
                />
              </svg>
              <div className="progress-text">{Math.round(state.progress)}%</div>
            </div>
          </div>
        )}

        <div className="hud-grid">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="grid-line" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
