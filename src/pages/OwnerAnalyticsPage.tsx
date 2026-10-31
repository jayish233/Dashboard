import { useMemo, useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';

interface OwnerAnalyticsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function OwnerAnalyticsPage({ onNavigate }: OwnerAnalyticsPageProps) {
  const { data } = usePresenceData();
  const [range, setRange] = useState<4 | 13 | 52>(13);

  const { lineA, areaA, bars, currentMeta } = useMemo(() => {
    const n = range;
    let seed = 5 + n;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    const weekly: number[] = [];
    for (let i = 0; i < n; i++) {
      weekly.push(
        Math.max(
          102,
          Math.min(158, Math.round(124 + (i / (n - 1)) * 26 + (rnd() - 0.5) * 8))
        )
      );
    }

    const lo = 100;
    const hi = 160;
    const W = 600;
    const H = 220;
    const pts = weekly.map(
      (v, i) =>
        `${((i / (weekly.length - 1)) * W).toFixed(1)} ${(
          H -
          ((v - lo) / (hi - lo)) * H
        ).toFixed(1)}`
    );
    const linePath = `M${pts.join(' L')}`;
    const areaPath = `${linePath} L${W} ${H} L0 ${H} Z`;

    const alerts: number[] = [];
    for (let i = 0; i < n; i++) {
      alerts.push(
        i === n - 1
          ? 17
          : Math.max(
              4,
              Math.min(19, Math.round(9 + (i / (n - 1)) * 8 + (rnd() - 0.5) * 5))
            )
      );
    }

    const slot = 292 / n;
    const alertBars = alerts.map((v, i) => {
      const h = (v / 20) * 140;
      return {
        x: (4 + i * slot).toFixed(1),
        y: 140 - h,
        h,
        w: Math.max(2, slot * 0.62).toFixed(1),
        fill: i === alerts.length - 1 ? '#00ADB5' : 'rgba(34,40,49,0.28)',
      };
    });

    const meta =
      data.analytics.ranges.find((r) => r.key === n) || data.analytics.ranges[1];

    return {
      lineA: linePath,
      areaA: areaPath,
      bars: alertBars,
      currentMeta: meta,
    };
  }, [range, data.analytics.ranges]);

  const segOn = {
    background: '#fff',
    color: '#222831',
    boxShadow: '0 1px 2px rgba(34,40,49,0.12)',
  };
  const segOff = {
    background: 'transparent',
    color: '#5A616B',
  };

  return (
    <OwnerLayout activeRoute="/owner/analytics" onNavigate={onNavigate} minHeight={1250} sheetGap={40}>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '30px',
              fontWeight: 600,
              letterSpacing: '-0.025em',
            }}
          >
            Analytics
          </h1>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{currentMeta.sub}</span>
        </div>

        <div
          role="group"
          aria-label="Range"
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            borderRadius: '13px',
            background: 'rgba(34, 40, 49, 0.07)',
          }}
        >
          {data.analytics.ranges.map((r) => {
            const active = range === r.key;
            return (
              <button
                key={r.key}
                type="button"
                className="chip"
                onClick={() => setRange(r.key as 4 | 13 | 52)}
                aria-pressed={active}
                style={{
                  height: '44px',
                  minWidth: '56px',
                  border: 0,
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: 500,
                  ...(active ? segOn : segOff),
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </header>

      <section
        aria-label="October retention"
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          October, so far
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))',
            gap: '24px',
          }}
        >
          {data.analytics.octoberStats.map((m) => (
            <div
              key={m.label}
              style={{
                paddingTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: m.highlight
                  ? '2px solid #00ADB5'
                  : '1px solid rgba(34, 40, 49, 0.12)',
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{m.label}</span>
              <span
                style={{
                  fontSize: '38px',
                  lineHeight: 1,
                  fontWeight: 500,
                  letterSpacing: '-0.035em',
                  color: m.highlight ? '#00747A' : undefined,
                }}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '13px',
            lineHeight: 1.55,
            color: 'var(--muted)',
            maxWidth: '640px',
          }}
        >
          Returned means checked in again after an alert. It shows what happened after follow-up,
          not that follow-up caused it.
        </p>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Average daily check-ins, by week
        </h2>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '220px',
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            <span>160</span>
            <span>130</span>
            <span>100</span>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <svg
              viewBox="0 0 600 220"
              preserveAspectRatio="none"
              role="img"
              aria-label="Weekly average check-ins rising from about 124 to about 150 over 13 weeks"
              style={{ width: '100%', height: '220px', display: 'block' }}
            >
              <line
                x1="0"
                y1="0"
                x2="600"
                y2="0"
                stroke="rgba(34,40,49,0.1)"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="110"
                x2="600"
                y2="110"
                stroke="rgba(34,40,49,0.1)"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="220"
                x2="600"
                y2="220"
                stroke="rgba(34,40,49,0.1)"
                vectorEffect="non-scaling-stroke"
              />
              <path d={areaA} fill="rgba(0,173,181,0.12)" />
              <path
                d={lineA}
                fill="none"
                stroke="#00ADB5"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--muted)',
              }}
            >
              <span>{currentMeta.xl.a}</span>
              <span>{currentMeta.xl.b}</span>
              <span>{currentMeta.xl.c}</span>
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))',
          gap: '40px 48px',
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Open inactivity alerts
          </h2>

          <svg
            viewBox="0 0 300 140"
            preserveAspectRatio="none"
            role="img"
            aria-label="Open alerts per week, ending at 17"
            style={{ width: '100%', height: '160px', display: 'block' }}
          >
            <line
              x1="0"
              y1="140"
              x2="300"
              y2="140"
              stroke="rgba(34,40,49,0.2)"
              vectorEffect="non-scaling-stroke"
            />
            {bars.map((b, idx) => (
              <rect
                key={idx}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="2"
                fill={b.fill}
              />
            ))}
          </svg>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            <span>{currentMeta.xl.a}</span>
            <span>{currentMeta.xl.c}</span>
          </div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
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
              Attendance declining, by group
            </h2>
            <a
              href="#/owner/retention"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/owner/retention');
              }}
              style={{
                fontSize: '13px',
                color: 'var(--deep)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                minHeight: '24px',
              }}
            >
              Open Retention
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.analytics.decliningGroups.map((g) => (
              <div
                key={g.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) 96px 28px',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '14px 0',
                  borderTop: '1px solid var(--line)',
                  minHeight: '56px',
                }}
              >
                <span style={{ fontSize: '15px' }}>{g.name}</span>
                <div
                  aria-hidden="true"
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(34, 40, 49, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'var(--teal)',
                      width: g.w,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontSize: '14px',
                    textAlign: 'right',
                  }}
                >
                  {g.n}
                </span>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: '13px',
              lineHeight: 1.55,
              color: 'var(--muted)',
            }}
          >
            Members whose weekly visits fell by half or more. A member can sit in more than one
            group.
          </p>
        </section>
      </div>
    </OwnerLayout>
  );
}
