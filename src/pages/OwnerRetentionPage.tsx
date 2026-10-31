import { useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';
import type { RetentionSituationKey } from '../types/presence';
import { parseInlineStyle } from '../utils/style';

interface OwnerRetentionPageProps {
  onNavigate: (route: AppRoute) => void;
}

type SituationFilter = 'all' | RetentionSituationKey;

export function OwnerRetentionPage({ onNavigate }: OwnerRetentionPageProps) {
  const { data, patchRetentionItem } = usePresenceData();
  const [sel, setSel] = useState<number>(5);
  const [filter, setFilter] = useState<SituationFilter>('all');
  const [draft, setDraft] = useState<string>('');

  const { items, categoryTotals, situations } = data.retention;
  const openItems = items.filter((m) => !m.closed);

  const closedBy = (k: RetentionSituationKey) =>
    items.filter((m) => m.closed && m.sit === k).length;

  const totals: Record<RetentionSituationKey, number> = {
    inactive: categoryTotals.inactive - closedBy('inactive'),
    dropped: categoryTotals.dropped - closedBy('dropped'),
    expiring: categoryTotals.expiring - closedBy('expiring'),
    away: categoryTotals.away - closedBy('away'),
    returned: categoryTotals.returned - closedBy('returned'),
  };

  const sum =
    totals.inactive + totals.dropped + totals.expiring + totals.away + totals.returned;

  const chipDefs: [SituationFilter, string, number][] = [
    ['all', 'All', sum],
    ['inactive', 'No visit in 10+ days', totals.inactive],
    ['dropped', 'Attendance dropped', totals.dropped],
    ['expiring', 'Expires soon', totals.expiring],
    ['away', 'Away', totals.away],
    ['returned', 'Returned', totals.returned],
  ];

  const onChipStyle = {
    background: '#222831',
    color: '#EEEEEE',
    border: '1px solid #222831',
  };
  const offChipStyle = {
    background: 'transparent',
    color: '#222831',
    border: '1px solid rgba(34,40,49,0.28)',
  };

  const filteredList = openItems.filter((m) => filter === 'all' || m.sit === filter);
  const cur = items.find((m) => m.id === sel) || openItems[0] || items[0];
  const curSitMeta = situations[cur.sit];

  const bars = cur.weeks.map((v, i) => {
    const h = (v / 6) * 56;
    return {
      x: 2 + i * 12.2,
      y: 60 - h,
      h: Math.max(h, 0.8),
      fill: i >= 6 ? '#00ADB5' : 'rgba(34,40,49,0.28)',
    };
  });

  const telHref = cur.phone.replace(/[^0-9+]/g, '');
  const waHref = cur.phone.replace(/\D/g, '');
  const chartLabel = `Weekly visits, oldest to newest: ${cur.weeks.join(', ')}`;

  const handleToggleDone = () => {
    const nd = !cur.done;
    const entry = {
      when: 'Just now',
      who: 'Aarav',
      text: nd ? `${curSitMeta.action} · marked done` : 'Marked as not done',
    };
    patchRetentionItem(cur.id, {
      done: nd,
      notes: [entry, ...cur.notes],
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    patchRetentionItem(cur.id, {
      notes: [{ when: 'Just now', who: 'Aarav', text: t }, ...cur.notes],
    });
    setDraft('');
  };

  const handleCloseAlert = () => {
    const rest = openItems.filter((m) => m.id !== cur.id);
    patchRetentionItem(cur.id, { closed: true });
    if (rest.length) {
      setSel(rest[0].id);
    }
  };

  return (
    <OwnerLayout activeRoute="/owner/retention" onNavigate={onNavigate} minHeight={1100} sheetGap={28}>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '12px 24px',
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
            Retention
          </h1>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            Who may leave, and what to do next. You decide. Nothing is sent automatically.
          </span>
        </div>

        <a
          className="lnk"
          href="#/owner/inactive"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/owner/inactive');
          }}
          style={{
            fontSize: '14px',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          All 17 inactive members
        </a>
      </header>

      <div
        role="group"
        aria-label="Filter by situation"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
      >
        {chipDefs.map(([key, label, count]) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              className="chip"
              onClick={() => setFilter(key)}
              aria-pressed={active}
              style={{
                height: '44px',
                padding: '0 16px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                ...(active ? onChipStyle : offChipStyle),
              }}
            >
              {label}
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, monospace",
                  fontSize: '12px',
                  opacity: 0.8,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '32px',
          alignItems: 'flex-start',
        }}
      >
        <section
          aria-label="Flagged members"
          style={{
            flex: '999 1 500px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              maxHeight: '660px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid var(--line)',
            }}
          >
            {filteredList.map((m) => {
              const sitMeta = situations[m.sit];
              const isSelected = sel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  className="row"
                  onClick={() => setSel(m.id)}
                  aria-pressed={isSelected}
                  style={{
                    border: 0,
                    borderBottom: '1px solid var(--line)',
                    textAlign: 'left',
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '72px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(150px, 100%), 1fr))',
                    gap: '8px 16px',
                    alignItems: 'center',
                    color: 'var(--ink)',
                    background: isSelected ? 'rgba(0,173,181,0.12)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      minWidth: 0,
                    }}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{m.name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{m.line}</span>
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        flex: 'none',
                        ...parseInlineStyle(sitMeta.dot),
                      }}
                    />
                    {sitMeta.label}
                  </span>

                  <span
                    style={{
                      fontSize: '13px',
                      color: m.done ? '#00747A' : '#5A616B',
                      fontWeight: m.done ? 500 : 400,
                    }}
                  >
                    {m.done ? 'Done' : 'To do'}
                  </span>
                </button>
              );
            })}

            {filteredList.length === 0 && (
              <p
                style={{
                  margin: 0,
                  padding: '32px 14px',
                  fontSize: '14px',
                  color: 'var(--muted)',
                }}
              >
                Nothing to do here. Everyone in this group is handled.
              </p>
            )}
          </div>

          <p style={{ margin: '12px 0 0', fontSize: '13px', color: 'var(--muted)' }}>
            Most urgent first. Counts show everyone flagged; the list shows the top few of each
            group.
          </p>
        </section>

        <section
          aria-label="Next action"
          style={{
            flex: '1 1 340px',
            minWidth: 0,
            background: 'rgba(34, 40, 49, 0.045)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
              }}
            >
              {cur.name}
            </h2>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--muted)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  flex: 'none',
                  ...parseInlineStyle(curSitMeta.dot),
                }}
              />
              {curSitMeta.label} · {cur.line}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              Visits per week, last 8 weeks
            </span>
            <svg
              viewBox="0 0 100 60"
              preserveAspectRatio="none"
              role="img"
              aria-label={chartLabel}
              style={{ width: '100%', height: '110px', display: 'block' }}
            >
              <line
                x1="0"
                y1="60"
                x2="100"
                y2="60"
                stroke="rgba(34,40,49,0.25)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {bars.map((b, idx) => (
                <rect
                  key={idx}
                  x={b.x}
                  y={b.y}
                  width="9"
                  height={b.h}
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
              <span>8 weeks ago</span>
              <span>This week</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Suggested next step</span>
            <button
              type="button"
              className={cur.done ? 'btn-line' : 'btn-teal'}
              onClick={handleToggleDone}
              style={{
                height: '52px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                ...(cur.done
                  ? {
                      background: 'transparent',
                      color: '#222831',
                      border: '1px solid #222831',
                    }
                  : {
                      background: '#00ADB5',
                      color: '#222831',
                      border: 0,
                    }),
              }}
            >
              {cur.done ? 'Done · tap to undo' : curSitMeta.action}
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                className="btn-line"
                href={`tel:${telHref}`}
                style={{
                  flex: 1,
                  height: '44px',
                  borderRadius: '12px',
                  border: '1px solid var(--ink)',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Call
              </a>
              <a
                className="btn-line"
                href={`https://wa.me/${waHref}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  height: '44px',
                  borderRadius: '12px',
                  border: '1px solid var(--ink)',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="fu" style={{ fontSize: '13px', fontWeight: 500 }}>
              Follow up on
            </label>
            <input
              id="fu"
              type="date"
              value={cur.next}
              onChange={(e) => patchRetentionItem(cur.id, { next: e.target.value })}
              style={{
                height: '48px',
                padding: '0 14px',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                background: '#fff',
                fontSize: '15px',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Notes</span>
            <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                aria-label="Add a note"
                placeholder="What did they say?"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: '48px',
                  padding: '0 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '15px',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                className="btn-ink"
                style={{
                  height: '48px',
                  padding: '0 18px',
                  border: 0,
                  borderRadius: '12px',
                  background: 'var(--ink)',
                  color: 'var(--mist)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Add
              </button>
            </form>

            {cur.notes.map((n, idx) => (
              <div
                key={`${n.when}-${idx}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {n.when} · {n.who}
                </span>
                <span style={{ fontSize: '14px', lineHeight: 1.5 }}>{n.text}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-line"
            onClick={handleCloseAlert}
            style={{
              height: '44px',
              borderRadius: '12px',
              border: '1px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Close this alert
          </button>
        </section>
      </div>
    </OwnerLayout>
  );
}
