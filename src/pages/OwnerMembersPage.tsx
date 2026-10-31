import { useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';
import type { MemberStatus } from '../types/presence';
import { parseInlineStyle } from '../utils/style';

interface OwnerMembersPageProps {
  onNavigate: (route: AppRoute) => void;
}

type FilterKey = 'all' | MemberStatus;

export function OwnerMembersPage({ onNavigate }: OwnerMembersPageProps) {
  const { data, addMemberInvitation } = usePresenceData();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [page, setPage] = useState<0 | 1>(0);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStarts, setNewStarts] = useState('');
  const [newExpires, setNewExpires] = useState('');

  const chipDefs: [FilterKey, string, number][] = [
    ['all', 'All', data.members.statusCounts.all],
    ['active', 'Active', data.members.statusCounts.active],
    ['expiring', 'Expiring', data.members.statusCounts.expiring],
    ['suspended', 'Suspended', data.members.statusCounts.suspended],
    ['expired', 'Expired', data.members.statusCounts.expired],
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

  const needle = q.trim().toLowerCase();
  const currentPageList = data.members.pages[page] || [];
  const rows = currentPageList.filter(
    (r) =>
      (filter === 'all' || r.status === filter) &&
      (!needle ||
        r.name.toLowerCase().includes(needle) ||
        r.phone.toLowerCase().includes(needle))
  );

  const btnOnStyle = {
    border: '1px solid #222831',
    color: '#222831',
  };
  const btnOffStyle = {
    border: '1px solid rgba(34,40,49,0.2)',
    color: 'rgba(34,40,49,0.4)',
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      addMemberInvitation({
        name: newName.trim(),
        phone: newPhone.trim() || '+91 98100 00000',
        email: newEmail.trim() || 'member@example.com',
        starts: newStarts,
        expires: newExpires || '30 Oct 2027',
      });
    }
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewStarts('');
    setNewExpires('');
    setAddOpen(false);
  };

  return (
    <OwnerLayout activeRoute="/owner/members" onNavigate={onNavigate} minHeight={1200} sheetGap={28}>
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
            Members
          </h1>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
            {data.members.totalRegistered} registered
          </span>
        </div>

        <button
          type="button"
          className="btn-ink"
          onClick={() => setAddOpen((prev) => !prev)}
          aria-expanded={addOpen}
          style={{
            height: '44px',
            padding: '0 20px',
            border: 0,
            borderRadius: '12px',
            background: 'var(--ink)',
            color: 'var(--mist)',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {addOpen ? 'Close' : 'Add member'}
        </button>
      </header>

      {addOpen && (
        <form
          onSubmit={handleInviteSubmit}
          style={{
            background: 'rgba(34, 40, 49, 0.045)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="am-name" style={{ fontSize: '13px', fontWeight: 500 }}>
                Name
              </label>
              <input
                id="am-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  height: '52px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="am-phone" style={{ fontSize: '13px', fontWeight: 500 }}>
                Phone
              </label>
              <input
                id="am-phone"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={{
                  height: '52px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="am-email" style={{ fontSize: '13px', fontWeight: 500 }}>
                Email
              </label>
              <input
                id="am-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{
                  height: '52px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="am-start" style={{ fontSize: '13px', fontWeight: 500 }}>
                Starts
              </label>
              <input
                id="am-start"
                type="date"
                value={newStarts}
                onChange={(e) => setNewStarts(e.target.value)}
                style={{
                  height: '52px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="am-end" style={{ fontSize: '13px', fontWeight: 500 }}>
                Expires
              </label>
              <input
                id="am-end"
                type="date"
                value={newExpires}
                onChange={(e) => setNewExpires(e.target.value)}
                style={{
                  height: '52px',
                  padding: '0 16px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
            <button
              type="submit"
              className="btn-teal"
              style={{
                height: '52px',
                padding: '0 24px',
                border: 0,
                borderRadius: '12px',
                background: 'var(--teal)',
                color: 'var(--ink)',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              Send invitation
            </button>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              The member gets an email link that expires in 7 days.
            </span>
          </div>
        </form>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          role="group"
          aria-label="Filter by status"
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

        <div style={{ flex: '1 1 240px', maxWidth: '320px', position: 'relative' }}>
          <label
            htmlFor="q"
            style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}
          >
            Search members
          </label>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5A616B"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ position: 'absolute', left: '14px', top: '13px' }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="q"
            type="search"
            placeholder="Search name or phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              padding: '0 14px 0 42px',
              borderRadius: '12px',
              border: '1px solid var(--line)',
              background: '#fff',
              fontSize: '15px',
              color: 'var(--ink)',
            }}
          />
        </div>
      </div>

      <section
        aria-label="Member list"
        style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto' }}
      >
        <div style={{ minWidth: '560px', display: 'flex', flexDirection: 'column' }}>
          <div
            aria-hidden="true"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr)',
              gap: '16px',
              padding: '0 14px 10px',
              fontSize: '12px',
              color: 'var(--muted)',
            }}
          >
            <span>Member</span>
            <span>Expires</span>
            <span>Last visit</span>
            <span>Membership</span>
          </div>

          {rows.map((m) => {
            const stMeta = data.members.statusMeta[m.status];
            return (
              <div
                key={m.id}
                className="row"
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr)',
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
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{m.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{m.phone}</span>
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontSize: '13px',
                  }}
                >
                  {m.expires}
                </span>
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontSize: '13px',
                    color: 'var(--muted)',
                  }}
                >
                  {m.lastVisit}
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
                      ...parseInlineStyle(stMeta.dot),
                    }}
                  />
                  {stMeta.label}
                </span>
              </div>
            );
          })}
        </div>

        {rows.length === 0 && (
          <p
            style={{
              margin: 0,
              padding: '32px 14px',
              borderTop: '1px solid var(--line)',
              fontSize: '14px',
              color: 'var(--muted)',
            }}
          >
            No members match.
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '16px 14px 0',
            borderTop: '1px solid var(--line)',
            fontSize: '13px',
            color: 'var(--muted)',
          }}
        >
          <span>
            {page === 0 ? '1–10' : '11–20'} of {data.members.totalRegistered}
          </span>
          <span style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-line"
              onClick={() => setPage(0)}
              disabled={page === 0}
              style={{
                height: '44px',
                padding: '0 16px',
                borderRadius: '12px',
                background: 'transparent',
                fontSize: '14px',
                ...(page === 0 ? btnOffStyle : btnOnStyle),
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-line"
              onClick={() => setPage(1)}
              disabled={page === 1}
              style={{
                height: '44px',
                padding: '0 16px',
                borderRadius: '12px',
                background: 'transparent',
                fontSize: '14px',
                ...(page === 1 ? btnOffStyle : btnOnStyle),
              }}
            >
              Next
            </button>
          </span>
        </div>
      </section>
    </OwnerLayout>
  );
}
