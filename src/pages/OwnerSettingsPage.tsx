import { useState } from 'react';
import { OwnerLayout, type AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';

interface OwnerSettingsPageProps {
  onNavigate: (route: AppRoute) => void;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatIsoDate(iso: string): string {
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  const monthIdx = parseInt(parts[1], 10) - 1;
  return `${parts[2]} ${MONTH_NAMES[monthIdx] || parts[1]} ${parts[0]}`;
}

export function OwnerSettingsPage({ onNavigate }: OwnerSettingsPageProps) {
  const { data, updateGym, inviteStaffMember } = usePresenceData();
  const { gym, staff } = data;

  const [gymName, setGymName] = useState(gym.name);
  const [phone, setPhone] = useState(gym.phone);
  const [timezone, setTimezone] = useState(gym.timezone);
  const [address, setAddress] = useState(gym.address);

  const [showClosure, setShowClosure] = useState(false);
  const [closureDraft, setClosureDraft] = useState('');

  const [showInvite, setShowInvite] = useState(false);
  const [inviteDraft, setInviteDraft] = useState('');
  const [saved, setSaved] = useState(false);

  const dayOnStyle = {
    background: '#222831',
    color: '#EEEEEE',
    border: '1px solid #222831',
  };
  const dayOffStyle = {
    background: 'transparent',
    color: '#5A616B',
    border: '1px dashed rgba(34,40,49,0.4)',
  };

  const segOnStyle = {
    background: '#fff',
    color: '#222831',
    boxShadow: '0 1px 2px rgba(34,40,49,0.12)',
  };
  const segOffStyle = {
    background: 'transparent',
    color: '#5A616B',
  };

  const handleToggleDay = (idx: number) => {
    const nextOpen = gym.openDays.map((v, j) => (j === idx ? !v : v));
    updateGym({ openDays: nextOpen });
    setSaved(false);
  };

  const handleAddClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closureDraft || gym.closures.includes(closureDraft)) return;
    const nextClosures = [...gym.closures, closureDraft].sort();
    updateGym({ closures: nextClosures });
    setClosureDraft('');
    setShowClosure(false);
    setSaved(false);
  };

  const handleRemoveClosure = (iso: string) => {
    updateGym({ closures: gym.closures.filter((x) => x !== iso) });
    setSaved(false);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const v = inviteDraft.trim();
    if (!v) return;
    inviteStaffMember(v);
    setInviteDraft('');
    setShowInvite(false);
    setSaved(false);
  };

  const handleSave = () => {
    updateGym({
      name: gymName,
      phone,
      timezone,
      address,
    });
    setSaved(true);
  };

  return (
    <OwnerLayout activeRoute="/owner/settings" onNavigate={onNavigate} minHeight={1350} sheetGap={8}>
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          paddingBottom: '24px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '30px',
            fontWeight: 600,
            letterSpacing: '-0.025em',
          }}
        >
          Gym settings
        </h1>
      </header>

      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 48px',
          padding: '28px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <h2
          style={{
            margin: 0,
            flex: '1 1 220px',
            fontSize: '17px',
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          Profile
        </h2>

        <div
          style={{
            flex: '3 1 380px',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="g-name" style={{ fontSize: '13px', fontWeight: 500 }}>
              Gym name
            </label>
            <input
              id="g-name"
              type="text"
              value={gymName}
              onChange={(e) => {
                setGymName(e.target.value);
                setSaved(false);
              }}
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

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="g-phone" style={{ fontSize: '13px', fontWeight: 500 }}>
                Phone
              </label>
              <input
                id="g-phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setSaved(false);
                }}
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
              <label htmlFor="g-tz" style={{ fontSize: '13px', fontWeight: 500 }}>
                Time zone
              </label>
              <select
                id="g-tz"
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value);
                  setSaved(false);
                }}
                style={{
                  height: '52px',
                  padding: '0 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              >
                {gym.timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="g-addr" style={{ fontSize: '13px', fontWeight: 500 }}>
              Address
            </label>
            <input
              id="g-addr"
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setSaved(false);
              }}
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
      </section>

      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 48px',
          padding: '28px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Opening days
          </h2>
          <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--muted)' }}>
            Closed days never count as absences or break a streak.
          </span>
        </div>

        <div
          style={{
            flex: '3 1 380px',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            role="group"
            aria-label="Open days"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '8px',
            }}
          >
            {DAY_NAMES.map((dayName, i) => {
              const isOpen = gym.openDays[i];
              return (
                <button
                  key={dayName}
                  type="button"
                  className="chip"
                  onClick={() => handleToggleDay(i)}
                  aria-pressed={isOpen}
                  style={{
                    height: '52px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    ...(isOpen ? dayOnStyle : dayOffStyle),
                  }}
                >
                  {dayName}
                </button>
              );
            })}
          </div>

          {gym.closures.map((iso) => {
            const label = formatIsoDate(iso);
            return (
              <div
                key={iso}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '6px 0 6px 4px',
                  borderTop: '1px solid var(--line)',
                  minHeight: '52px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontSize: '14px',
                  }}
                >
                  {label}
                </span>
                <button
                  type="button"
                  className="btn-line"
                  onClick={() => handleRemoveClosure(iso)}
                  aria-label={`Remove closure ${label}`}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: 0,
                    borderRadius: '12px',
                    background: 'transparent',
                    color: 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}

          {showClosure && (
            <form onSubmit={handleAddClosure} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="date"
                aria-label="Closure date"
                value={closureDraft}
                onChange={(e) => setClosureDraft(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: '52px',
                  padding: '0 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                className="btn-teal"
                style={{
                  height: '52px',
                  padding: '0 20px',
                  border: 0,
                  borderRadius: '12px',
                  background: 'var(--teal)',
                  color: 'var(--ink)',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              >
                Add
              </button>
            </form>
          )}

          <button
            type="button"
            className="btn-line"
            onClick={() => setShowClosure((prev) => !prev)}
            style={{
              alignSelf: 'flex-start',
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {showClosure ? 'Cancel' : 'Add a closure date'}
          </button>
        </div>
      </section>

      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 48px',
          padding: '28px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Inactivity alert
          </h2>
          <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--muted)' }}>
            Open an alert after this many opening days without a visit.
          </span>
        </div>

        <div
          style={{
            flex: '3 1 380px',
            maxWidth: '560px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <button
            type="button"
            className="btn-line"
            onClick={() => {
              updateGym({
                inactivityThreshold: Math.max(3, gym.inactivityThreshold - 1),
              });
              setSaved(false);
            }}
            aria-label="Fewer days"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              border: '1px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '22px',
              lineHeight: 1,
            }}
          >
            −
          </button>
          <span
            aria-live="polite"
            style={{
              minWidth: '72px',
              textAlign: 'center',
              fontSize: '38px',
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: '-0.035em',
            }}
          >
            {gym.inactivityThreshold}
          </span>
          <button
            type="button"
            className="btn-line"
            onClick={() => {
              updateGym({
                inactivityThreshold: Math.min(30, gym.inactivityThreshold + 1),
              });
              setSaved(false);
            }}
            aria-label="More days"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              border: '1px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '22px',
              lineHeight: 1,
            }}
          >
            +
          </button>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>opening days</span>
        </div>
      </section>

      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 48px',
          padding: '28px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            QR code lifetime
          </h2>
          <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--muted)' }}>
            Shorter codes are harder to reuse.
          </span>
        </div>

        <div style={{ flex: '3 1 380px', maxWidth: '560px' }}>
          <div
            role="group"
            aria-label="QR lifetime"
            style={{
              display: 'inline-flex',
              gap: '4px',
              padding: '4px',
              borderRadius: '13px',
              background: 'rgba(34, 40, 49, 0.07)',
            }}
          >
            {[30, 45, 60].map((s) => {
              const active = gym.qrLifetime === s;
              return (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  onClick={() => {
                    updateGym({ qrLifetime: s });
                    setSaved(false);
                  }}
                  aria-pressed={active}
                  style={{
                    height: '44px',
                    minWidth: '72px',
                    border: 0,
                    borderRadius: '9px',
                    fontSize: '14px',
                    fontWeight: 500,
                    ...(active ? segOnStyle : segOffStyle),
                  }}
                >
                  {s} sec
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px 48px',
          padding: '28px 0',
          borderTop: '1px solid var(--line)',
        }}
      >
        <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Staff
          </h2>
          <span style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--muted)' }}>
            Staff only see what you allow.
          </span>
        </div>

        <div
          style={{
            flex: '3 1 380px',
            maxWidth: '560px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {staff.map((s) => (
            <div
              key={s.id}
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
              <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>{s.name}</span>
                {s.permissions !== 'Invited' && (
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    {s.permissions}
                  </span>
                )}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{s.status}</span>
            </div>
          ))}

          {showInvite && (
            <form
              onSubmit={handleSendInvite}
              style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
            >
              <input
                type="email"
                aria-label="Staff email"
                placeholder="staff@example.com"
                value={inviteDraft}
                onChange={(e) => setInviteDraft(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: '52px',
                  padding: '0 14px',
                  borderRadius: '12px',
                  border: '1px solid var(--line)',
                  background: '#fff',
                  fontSize: '16px',
                  color: 'var(--ink)',
                }}
              />
              <button
                type="submit"
                className="btn-teal"
                style={{
                  height: '52px',
                  padding: '0 20px',
                  border: 0,
                  borderRadius: '12px',
                  background: 'var(--teal)',
                  color: 'var(--ink)',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              >
                Send
              </button>
            </form>
          )}

          <button
            type="button"
            className="btn-line"
            onClick={() => setShowInvite((prev) => !prev)}
            style={{
              alignSelf: 'flex-start',
              marginTop: '8px',
              height: '44px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {showInvite ? 'Cancel' : 'Invite staff'}
          </button>
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '28px',
          borderTop: '1px solid var(--line)',
        }}
      >
        <button
          type="button"
          className="btn-ink"
          onClick={handleSave}
          style={{
            height: '52px',
            padding: '0 28px',
            border: 0,
            borderRadius: '12px',
            background: 'var(--ink)',
            color: 'var(--mist)',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          {saved ? 'Saved' : 'Save changes'}
        </button>
        <span role="status" style={{ fontSize: '13px', color: 'var(--muted)' }}>
          {saved
            ? 'Changes saved. They apply to new days only.'
            : 'Changes apply to new days only. Past records stay as they were.'}
        </span>
      </div>
    </OwnerLayout>
  );
}
