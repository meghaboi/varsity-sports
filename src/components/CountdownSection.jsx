import { useEffect, useMemo, useState } from 'react';

const QUALIFIERS_START = new Date('2026-08-20T00:00:00+05:30').getTime();
const QUALIFIERS_END = new Date('2026-08-23T23:59:59+05:30').getTime();

function getCountdown(now) {
  const remaining = Math.max(0, QUALIFIERS_START - now);
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };
}

export default function CountdownSection() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = useMemo(() => getCountdown(now), [now]);
  const eventIsLive = now >= QUALIFIERS_START && now <= QUALIFIERS_END;
  const eventHasEnded = now > QUALIFIERS_END;
  const status = eventIsLive ? 'Qualifiers are live' : eventHasEnded ? 'Qualifiers concluded' : 'Countdown to tip off';

  return (
    <section className="countdown-section" aria-labelledby="countdown-title">
      <div className="section-shell countdown-inner">
        <div className="countdown-copy">
          <p className="eyebrow">Hyderabad Varsity League</p>
          <h2 id="countdown-title">Qualifiers begin<br />20 August 2026.</h2>
          <p>Four days of school sport, competition, and community. Qualifiers run from 20 to 23 August.</p>
        </div>
        <div className="countdown-panel" aria-live="polite">
          <p className="countdown-status"><span />{status}</p>
          <div className="countdown-grid">
            {Object.entries(countdown).map(([label, value]) => (
              <div key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="countdown-zone">India Standard Time</p>
        </div>
      </div>
    </section>
  );
}
