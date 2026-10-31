import { useMemo, useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';
import { parseInlineStyle } from '../utils/style';

interface OwnerOverviewPageProps {
  onNavigate: (route: AppRoute) => void;
}

function generateSeries(n: number): number[] {
  const out: number[] = [];
  let s = 11 + n;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < n; i++) {
    const trend = 126 + (i / (n - 1)) * 26;
    out.push(Math.max(105, Math.min(195, Math.round(trend + (rnd() - 0.5) * 30))));
  }
  return out;
}

export function OwnerOverviewPage({ onNavigate }: OwnerOverviewPageProps) {
  const { data } = usePresenceData();
  const [range, setRange] = useState<7 | 30 | 90>(30);

  const { linePath, areaPath, labels } = useMemo(() => {
    const series = generateSeries(range);
    const lo = 100;
    const hi = 200;
    const W = 600;
    const H = 200;
    const pts = series.map((v, i) => {
      const x = (i / (series.length - 1)) * W;
      const y = H - ((v - lo) / (hi - lo)) * H;
      return `${x.toFixed(1)} ${y.toFixed(1)}`;
    });
    const line = `M${pts.join(' L')}`;
    const area = `${line} L${W} ${H} L0 ${H} Z`;
    const xl = data.overview.rangeLabels[String(range) as '7' | '30' | '90'];
    return { linePath: line, areaPath: area, labels: xl };
  }, [range, data.overview.rangeLabels]);

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
    <OwnerLayout activeRoute="/owner/overview" onNavigate={onNavigate} minHeight={1100} sheetGap={40}>
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
            Overview
          </h1>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            {data.gym.currentDateLabel}
          </span>
        </div>

        <a
          className="btn-teal"
          href="#/owner/attendance"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/owner/attendance');
          }}
          style={{
            height: '44px',
            padding: '0 20px',
            borderRadius: '12px',
            background: 'var(--teal)',
            color: 'var(--ink)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M20 20h.01" />
          </svg>
          Show QR
        </a>
      </header>

      <section
        aria-label="Key figures"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
          gap: '24px',
        }}
      >
        {data.overview.stats.map((m) => (
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
                fontFamily: "'Geist', system-ui, sans-serif",
                color: m.highlight ? '#00747A' : undefined,
              }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
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
            Daily check-ins
          </h2>
          <div
            role="group"
            aria-label="Range"
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              borderRadius: '11px',
              background: 'rgba(34, 40, 49, 0.07)',
            }}
          >
            {([7, 30, 90] as const).map((n) => (
              <button
                key={n}
                type="button"
                className="chip"
                onClick={() => setRange(n)}
                aria-pressed={range === n}
                style={{
                  height: '44px',
                  minWidth: '56px',
                  border: 0,
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  ...(range === n ? segOn : segOff),
                }}
              >
                {n}D
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>
          <div
            aria-hidden="true"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '200px',
              fontFamily: "'Geist Mono', ui-monospace, monospace",
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            <span>200</span>
            <span>150</span>
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
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
              role="img"
              aria-label="Daily check-ins for the last 30 days, rising from about 125 to about 150"
              style={{ width: '100%', height: '200px', display: 'block' }}
            >
              <line
                x1="0"
                y1="0"
                x2="600"
                y2="0"
                stroke="rgba(34,40,49,0.1)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="100"
                x2="600"
                y2="100"
                stroke="rgba(34,40,49,0.1)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <line
                x1="0"
                y1="200"
                x2="600"
                y2="200"
                stroke="rgba(34,40,49,0.1)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <path d={areaPath} fill="rgba(0,173,181,0.12)" />
              <path
                d={linePath}
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
              <span>{labels[0]}</span>
              <span>{labels[1]}</span>
              <span>{labels[2]}</span>
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '40px 40px',
        }}
      >
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
              paddingBottom: '12px',
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
              Attendance dropping
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
              Check in
            </a>
          </div>
          {data.overview.dropping.map((d) => (
            <div
              key={d.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                padding: '14px 0',
                borderTop: '1px solid var(--line)',
                minHeight: '60px',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 500 }}>{d.name}</span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{d.meta}</span>
            </div>
          ))}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
              paddingBottom: '12px',
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
              No visit in 10+ days
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
              Retention
            </a>
          </div>
          {data.overview.followups.map((f) => (
            <div
              key={f.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '14px 0',
                borderTop: '1px solid var(--line)',
                minHeight: '60px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{f.name}</span>
                <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{f.meta}</span>
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    ...parseInlineStyle(f.dot),
                  }}
                />
                {f.status}
              </span>
            </div>
          ))}
        </section>

        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '12px',
              paddingBottom: '12px',
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
              Expiring soon
            </h2>
            <a
              href="#/owner/memberships"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/owner/memberships');
              }}
              style={{
                fontSize: '13px',
                color: 'var(--deep)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                minHeight: '24px',
              }}
            >
              Memberships
            </a>
          </div>
          {data.overview.expiring.map((e) => (
            <div
              key={e.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '14px 0',
                borderTop: '1px solid var(--line)',
                minHeight: '60px',
              }}
            >
              <span style={{ fontSize: '15px', fontWeight: 500 }}>{e.name}</span>
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: '13px',
                  color: 'var(--muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                {e.date}
              </span>
            </div>
          ))}
        </section>
      </div>
    </OwnerLayout>
  );
}
