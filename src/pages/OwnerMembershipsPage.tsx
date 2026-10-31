import { useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';
import type { MembershipGroupKey } from '../types/presence';
import { parseInlineStyle } from '../utils/style';

interface OwnerMembershipsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function OwnerMembershipsPage({ onNavigate }: OwnerMembershipsPageProps) {
  const { data, toggleMembershipPayment } = usePresenceData();
  const [tab, setTab] = useState<MembershipGroupKey>('expiring');

  const { totals, groups } = data.memberships;
  const activeGroup = groups[tab];

  const tabOnStyle = {
    background: '#fff',
    color: '#222831',
    boxShadow: '0 1px 2px rgba(34,40,49,0.12)',
  };
  const tabOffStyle = {
    background: 'transparent',
    color: '#5A616B',
  };

  const tabKeys: MembershipGroupKey[] = ['expiring', 'expired', 'suspended'];

  return (
    <OwnerLayout activeRoute="/owner/memberships" onNavigate={onNavigate} minHeight={1100} sheetGap={40}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 600,
            letterSpacing: '-0.025em',
          }}
        >
          Memberships
        </h1>
        <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
          Membership status is separate from attendance. A member can be active and still absent.
        </span>
      </header>

      <section
        aria-label="Totals"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))',
          gap: '24px',
        }}
      >
        {totals.map((t) => (
          <div
            key={t.label}
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{t.label}</span>
            <span
              style={{
                fontSize: '38px',
                lineHeight: 1,
                fontWeight: 500,
                letterSpacing: '-0.035em',
              }}
            >
              {t.value}
            </span>
          </div>
        ))}
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          role="tablist"
          aria-label="Membership groups"
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px',
            borderRadius: '13px',
            background: 'rgba(34, 40, 49, 0.07)',
            alignSelf: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          {tabKeys.map((k) => {
            const g = groups[k];
            const isSelected = tab === k;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                className="chip"
                onClick={() => setTab(k)}
                aria-selected={isSelected}
                style={{
                  height: '44px',
                  padding: '0 18px',
                  border: 0,
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: 500,
                  ...(isSelected ? tabOnStyle : tabOffStyle),
                }}
              >
                {g.label} · {g.count}
              </button>
            );
          })}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '760px', display: 'flex', flexDirection: 'column' }}>
            <div
              aria-hidden="true"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.6fr)',
                gap: '16px',
                padding: '0 14px 10px',
                fontSize: '12px',
                color: 'var(--muted)',
              }}
            >
              <span>Member</span>
              <span>Started</span>
              <span>Ends</span>
              <span>{activeGroup.col}</span>
              <span>Payment</span>
            </div>

            {activeGroup.rows.map((r) => {
              const done = !!r.paid;
              const canRecord = tab !== 'suspended';
              const payLabel = !canRecord
                ? 'On hold'
                : done
                  ? 'Paid ₹12,000 · 30 Oct'
                  : tab === 'expiring'
                    ? 'Renewal due'
                    : 'Unpaid';
              const dotStyle = !canRecord
                ? 'background:#5A616B'
                : done
                  ? 'background:#00ADB5'
                  : 'background:#fff;box-shadow:inset 0 0 0 2px #222831';

              return (
                <div
                  key={r.name}
                  className="row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.6fr)',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '12px 14px',
                    minHeight: '64px',
                    borderTop: '1px solid var(--line)',
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
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{r.name}</span>
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{r.phone}</span>
                  </span>

                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      fontSize: '13px',
                      color: 'var(--muted)',
                    }}
                  >
                    {r.start}
                  </span>

                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      fontSize: '13px',
                    }}
                  >
                    {r.end}
                  </span>

                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      fontSize: '13px',
                      color: tab === 'expiring' ? '#00747A' : '#5A616B',
                      fontWeight: tab === 'expiring' ? 500 : 400,
                    }}
                  >
                    {r.note}
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
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
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          flex: 'none',
                          ...parseInlineStyle(dotStyle),
                        }}
                      />
                      {payLabel}
                    </span>

                    {canRecord && (
                      <button
                        type="button"
                        className="btn-line"
                        onClick={() => toggleMembershipPayment(tab, r.name)}
                        style={{
                          height: '44px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--ink)',
                          background: 'transparent',
                          color: 'var(--ink)',
                          fontSize: '13px',
                          fontWeight: 500,
                        }}
                      >
                        {done ? 'Undo' : 'Record payment'}
                      </button>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
          Recording a payment renews the membership for another year and closes any renewal alert.
          Payments are logged by you; nothing is charged here.
        </p>
      </section>
    </OwnerLayout>
  );
}
