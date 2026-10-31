import { useEffect, useMemo, useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';

interface OwnerAttendancePageProps {
  onNavigate: (route: AppRoute) => void;
}

function generateQrPath(seed: number): string {
  const N = 25;
  let s = (seed * 9301 + 49297) % 233280 || 1;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16);
  const finderOn = (x: number, y: number) => {
    const fx = x > 16 ? x - 18 : x;
    const fy = y > 16 ? y - 18 : y;
    if (fx < 0 || fx > 6 || fy < 0 || fy > 6) return false;
    const ring = fx === 0 || fx === 6 || fy === 0 || fy === 6;
    const core = fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4;
    return ring || core;
  };
  let d = '';
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dark = inFinder(x, y) ? finderOn(x, y) : rnd() < 0.5;
      if (dark) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

export function OwnerAttendancePage({ onNavigate }: OwnerAttendancePageProps) {
  const { data } = usePresenceData();
  const cycleSeconds = data.attendance.qrCycleSeconds || 30;
  const [secs, setSecs] = useState<number>(data.attendance.initialSecondsRemaining || 24);
  const [seed, setSeed] = useState<number>(data.attendance.initialSeed || 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecs((prev) => {
        if (prev <= 1) {
          setSeed((s) => s + 1);
          return cycleSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cycleSeconds]);

  const qrPath = useMemo(() => generateQrPath(seed), [seed]);
  const pct = Math.round((secs / cycleSeconds) * 100);

  return (
    <OwnerLayout activeRoute="/owner/attendance" onNavigate={onNavigate} minHeight={1000} sheetGap={28}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 600,
            letterSpacing: '-0.025em',
          }}
        >
          Attendance
        </h1>
        <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
          {data.gym.currentDateLabel}
        </span>
      </header>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          alignItems: 'flex-start',
        }}
      >
        <section
          aria-label="Check-in code"
          style={{
            flex: '1 1 400px',
            minWidth: 0,
            background: 'var(--ink)',
            color: 'var(--mist)',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              aspectRatio: '1',
              background: '#fff',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
            }}
          >
            <svg
              viewBox="-1 -1 27 27"
              shapeRendering="crispEdges"
              role="img"
              aria-label="Current check-in QR code"
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <path d={qrPath} fill="#222831" />
            </svg>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '14px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  aria-hidden="true"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--teal)',
                  }}
                />
                Live
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  color: 'rgba(238, 238, 238, 0.85)',
                }}
              >
                New code in {secs}s
              </span>
            </div>

            <div
              role="progressbar"
              aria-label="Time until the code changes"
              aria-valuemin={0}
              aria-valuemax={cycleSeconds}
              aria-valuenow={secs}
              style={{
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(238, 238, 238, 0.16)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'var(--teal)',
                  width: `${pct}%`,
                  transition: 'width 1s linear',
                }}
              />
            </div>
          </div>

          <p
            style={{
              margin: 0,
              maxWidth: '340px',
              textAlign: 'center',
              fontSize: '13px',
              lineHeight: 1.5,
              color: 'rgba(238, 238, 238, 0.75)',
            }}
          >
            Rotating codes stop old screenshots from working. They cannot stop someone sharing the
            live code.
          </p>
        </section>

        <section
          aria-label="Checked in today"
          style={{
            flex: '1 1 340px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
              paddingBottom: '16px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              Checked in today
            </h2>
            <span
              style={{
                fontSize: '38px',
                lineHeight: 1,
                fontWeight: 500,
                letterSpacing: '-0.035em',
              }}
            >
              {data.attendance.checkedInCount}
            </span>
          </div>

          <div
            style={{
              maxHeight: '560px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {data.attendance.recentCheckIns.map((r) => (
              <div
                key={`${r.name}-${r.time}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '14px 0',
                  borderTop: '1px solid var(--line)',
                  minHeight: '56px',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{r.name}</span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontSize: '13px',
                    color: 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </OwnerLayout>
  );
}
