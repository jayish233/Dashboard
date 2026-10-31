import { useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';
import type { InactiveStatus } from '../types/presence';
import { parseInlineStyle } from '../utils/style';

interface OwnerInactivePageProps {
  onNavigate: (route: AppRoute) => void;
}

type FilterStatus = 'all' | 'pending' | 'contacted' | 'interested' | 'issue';

export function OwnerInactivePage({ onNavigate }: OwnerInactivePageProps) {
  const { data, patchInactiveMember } = usePresenceData();
  const [sel, setSel] = useState<number>(0);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [draft, setDraft] = useState<string>('');

  const { members, statusMeta } = data.inactiveMembers;
  const openMembers = members.filter(
    (m) => m.status !== 'resolved' && m.status !== 'notint'
  );

  const countBy = (k: FilterStatus) =>
    k === 'all' ? openMembers.length : openMembers.filter((m) => m.status === k).length;

  const chipDefs: [FilterStatus, string][] = [
    ['all', 'All'],
    ['pending', 'Contact pending'],
    ['contacted', 'Contacted'],
    ['interested', 'Interested'],
    ['issue', 'Membership issue'],
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

  const list = openMembers.filter((m) => filter === 'all' || m.status === filter);
  const cur = members.find((m) => m.id === sel) || members[0];
  const telHref = cur.phone.replace(/[^0-9+]/g, '');
  const waHref = cur.phone.replace(/\D/g, '');

  const statusKeys: InactiveStatus[] = [
    'pending',
    'contacted',
    'interested',
    'issue',
    'notint',
    'resolved',
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    patchInactiveMember(cur.id, {
      notes: [{ when: 'Just now', who: 'Aarav', text: t }, ...cur.notes],
    });
    setDraft('');
  };

  return (
    <OwnerLayout activeRoute="/owner/inactive" onNavigate={onNavigate} minHeight={1100} sheetGap={28}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 600,
            letterSpacing: '-0.025em',
          }}
        >
          Inactive members
        </h1>
        <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
          Alerts open after {data.gym.inactivityThreshold} operating days without a visit. Expired
          and suspended memberships are listed elsewhere.
        </span>
      </header>

      <div
        role="group"
        aria-label="Filter by status"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
      >
        {chipDefs.map(([key, label]) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
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
                {countBy(key)}
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
          aria-label="Members"
          style={{
            flex: '999 1 520px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              maxHeight: '640px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              borderTop: '1px solid var(--line)',
            }}
          >
            {list.map((m) => {
              const st = statusMeta[m.status];
              const isSelected = sel === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSel(m.id)}
                  aria-pressed={isSelected}
                  style={{
                    border: 0,
                    borderBottom: '1px solid var(--line)',
                    textAlign: 'left',
                    width: '100%',
                    padding: '12px 14px',
                    minHeight: '68px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(130px, 100%), 1fr))',
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
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      Last seen {m.last}
                    </span>
                  </span>

                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      fontSize: '14px',
                    }}
                  >
                    {m.days} days
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
                        ...parseInlineStyle(st.dot),
                      }}
                    />
                    {st.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section
          aria-label="Follow-up"
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Active · expires {cur.expiry}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '14px' }}>
              <span>{cur.phone}</span>
              <span style={{ color: 'var(--muted)' }}>{cur.email}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                className="btn-ink"
                href={`tel:${telHref}`}
                style={{
                  flex: 1,
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--ink)',
                  color: 'var(--mist)',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
                </svg>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>Status</span>
            <div
              role="group"
              aria-label="Set status"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
            >
              {statusKeys.map((k) => {
                const active = cur.status === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => patchInactiveMember(cur.id, { status: k })}
                    aria-pressed={active}
                    style={{
                      height: '40px',
                      padding: '0 14px',
                      borderRadius: '999px',
                      fontSize: '13px',
                      fontWeight: 500,
                      ...(active
                        ? {
                            background: '#00ADB5',
                            color: '#222831',
                            border: '1px solid #00ADB5',
                          }
                        : {
                            background: '#fff',
                            color: '#222831',
                            border: '1px solid rgba(34,40,49,0.2)',
                          }),
                    }}
                  >
                    {statusMeta[k].label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="nf" style={{ fontSize: '13px', fontWeight: 500 }}>
              Next follow-up
            </label>
            <input
              id="nf"
              type="date"
              value={cur.next}
              onChange={(e) => patchInactiveMember(cur.id, { next: e.target.value })}
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
                placeholder="What happened?"
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
                className="btn-teal"
                type="submit"
                style={{
                  height: '48px',
                  padding: '0 18px',
                  border: 0,
                  borderRadius: '12px',
                  background: 'var(--teal)',
                  color: 'var(--ink)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Add
              </button>
            </form>

            {cur.notes.length === 0 && (
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>No notes yet.</span>
            )}

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
        </section>
      </div>
    </OwnerLayout>
  );
}
