import type { ReactNode } from 'react';
import { usePresenceData } from '../context/PresenceDataContext';

export type AppRoute =
  | '/signin'
  | '/privacy'
  | '/terms'
  | '/owner/overview'
  | '/owner/attendance'
  | '/owner/members'
  | '/owner/retention'
  | '/owner/inactive'
  | '/owner/memberships'
  | '/owner/analytics'
  | '/owner/settings';

interface OwnerLayoutProps {
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  minHeight?: number;
  sheetGap?: number;
  children: ReactNode;
}

interface NavItemDef {
  route: AppRoute;
  label: string;
  matchRoutes: AppRoute[];
  renderIcon: (active: boolean) => ReactNode;
}

const NAV_ITEMS: NavItemDef[] = [
  {
    route: '/owner/overview',
    label: 'Overview',
    matchRoutes: ['/owner/overview'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    route: '/owner/attendance',
    label: 'Attendance',
    matchRoutes: ['/owner/attendance'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" />
      </svg>
    ),
  },
  {
    route: '/owner/members',
    label: 'Members',
    matchRoutes: ['/owner/members'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    route: '/owner/retention',
    label: 'Retention',
    matchRoutes: ['/owner/retention', '/owner/inactive'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    route: '/owner/memberships',
    label: 'Memberships',
    matchRoutes: ['/owner/memberships'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
    ),
  },
  {
    route: '/owner/analytics',
    label: 'Analytics',
    matchRoutes: ['/owner/analytics'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    route: '/owner/settings',
    label: 'Gym Settings',
    matchRoutes: ['/owner/settings'],
    renderIcon: (active) => (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#00ADB5' : 'currentColor'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
      </svg>
    ),
  },
];

export function OwnerLayout({
  activeRoute,
  onNavigate,
  minHeight = 1100,
  sheetGap = 28,
  children,
}: OwnerLayoutProps) {
  const { data } = usePresenceData();
  const { gym } = data;

  return (
    <div
      style={{
        minHeight: `${minHeight}px`,
        display: 'flex',
        flexWrap: 'wrap',
        background: 'var(--mist)',
        color: 'var(--ink)',
        fontFamily: "'Geist', system-ui, sans-serif",
      }}
    >
      <aside
        style={{
          flex: '1 1 248px',
          background: 'var(--ink)',
          color: 'var(--mist)',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '32px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <a
            href="#/signin"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/signin');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '0 12px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="12" stroke="#00ADB5" strokeWidth="2" />
              <circle cx="14" cy="14" r="5" fill="#00ADB5" />
            </svg>
            <span style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em' }}>
              Presence
            </span>
          </a>

          <nav
            aria-label="Owner"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))',
              gap: '4px',
              alignContent: 'start',
            }}
          >
            {NAV_ITEMS.map((item) => {
              const active = item.matchRoutes.includes(activeRoute);
              return (
                <a
                  key={item.route}
                  className="ni"
                  href={`#${item.route}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.route);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    height: '44px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: active ? 500 : 400,
                    color: active ? '#fff' : 'rgba(238, 238, 238, 0.78)',
                    background: active ? 'rgba(0, 173, 181, 0.18)' : 'transparent',
                  }}
                >
                  {item.renderIcon(active)}
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 12px',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--graphite)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {gym.ownerInitials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{gym.ownerName}</span>
            <span style={{ fontSize: '12px', color: 'rgba(238, 238, 238, 0.7)' }}>
              {gym.name}
            </span>
          </div>
        </div>
      </aside>

      <main style={{ flex: '999 1 640px', minWidth: 0, padding: '24px', display: 'flex' }}>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: `${sheetGap}px`,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
