import type { LegalSection } from '../types/presence';
import type { AppRoute } from './OwnerLayout';

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  activePage: 'privacy' | 'terms';
  onNavigate: (route: AppRoute) => void;
}

export function LegalLayout({
  title,
  lastUpdated,
  sections,
  activePage,
  onNavigate,
}: LegalLayoutProps) {
  return (
    <div
      style={{
        minHeight: '1000px',
        background: 'var(--mist)',
        color: 'var(--ink)',
        fontFamily: "'Geist', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header
        style={{
          width: '100%',
          maxWidth: '1040px',
          padding: '28px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
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
            minHeight: '44px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke="#222831" strokeWidth="2" />
            <circle cx="14" cy="14" r="5" fill="#00ADB5" />
          </svg>
          <span style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Presence
          </span>
        </a>
        <nav aria-label="Legal" style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <a
            href="#/privacy"
            aria-current={activePage === 'privacy' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/privacy');
            }}
            style={
              activePage === 'privacy'
                ? {
                    fontWeight: 600,
                    borderBottom: '2px solid var(--teal)',
                    padding: '12px 0',
                  }
                : {
                    color: 'var(--muted)',
                    padding: '12px 0',
                  }
            }
          >
            Privacy
          </a>
          <a
            href="#/terms"
            aria-current={activePage === 'terms' ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/terms');
            }}
            style={
              activePage === 'terms'
                ? {
                    fontWeight: 600,
                    borderBottom: '2px solid var(--teal)',
                    padding: '12px 0',
                  }
                : {
                    color: 'var(--muted)',
                    padding: '12px 0',
                  }
            }
          >
            Terms
          </a>
        </nav>
      </header>

      <main
        style={{
          width: '100%',
          maxWidth: '1040px',
          padding: '48px 32px 96px',
          display: 'flex',
          flexDirection: 'column',
          gap: '56px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '48px',
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)' }}>{lastUpdated}</p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid var(--line-strong)',
          }}
        >
          {sections.map((section) => (
            <section
              key={section.title}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px 48px',
                padding: '32px 0',
                borderBottom: '1px solid var(--line-strong)',
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
                {section.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  flex: '3 1 380px',
                  maxWidth: '640px',
                  fontSize: '16px',
                  lineHeight: 1.65,
                  color: '#393E46',
                  textWrap: 'pretty',
                }}
              >
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <a
          href="#/signin"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/signin');
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
          Back to sign in
        </a>
      </main>
    </div>
  );
}
