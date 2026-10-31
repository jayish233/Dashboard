import { useMemo, useRef, useState } from 'react';
import type { AppRoute } from '../components/OwnerLayout';

interface SignInPageProps {
  onNavigate: (route: AppRoute) => void;
}

function generateDots() {
  const out: { bg: string }[] = [];
  let s = 7;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 14; c++) {
      const on = rnd() < 1 - c * 0.058;
      const a = 0.35 + rnd() * 0.65;
      out.push({
        bg: on ? `rgba(0,173,181,${a.toFixed(2)})` : 'rgba(238,238,238,0.09)',
      });
    }
  }
  return out;
}

export function SignInPage({ onNavigate }: SignInPageProps) {
  const [role, setRole] = useState<'owner' | 'member'>('owner');
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  const dots = useMemo(() => generateDots(), []);

  const isOwner = role === 'owner';
  const showForm = step === 'form';
  const registering = isOwner && mode === 'register';

  let title = 'Sign in';
  let sub = isOwner
    ? 'Attendance and follow-ups for your gym.'
    : 'Check in and keep your streak.';
  if (step === 'code') {
    title = 'Enter your code';
    sub = 'We emailed you a 6-digit code. It expires in 10 minutes.';
  } else if (registering) {
    title = 'Create your gym';
    sub = 'We will verify your email first.';
  }

  const activePillStyle = {
    background: '#fff',
    color: '#222831',
    boxShadow: '0 1px 2px rgba(34,40,49,0.12)',
  };
  const inactivePillStyle = {
    background: 'transparent',
    color: '#5A616B',
  };

  const handleDigitChange = (idx: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 5) {
      digitRefs.current[idx + 1]?.focus();
    }
  };

  return (
    <div
      style={{
        minHeight: '900px',
        display: 'flex',
        flexWrap: 'wrap',
        background: 'var(--mist)',
        color: 'var(--ink)',
        fontFamily: "'Geist', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          flex: '1 1 440px',
          minHeight: '420px',
          background: 'var(--ink)',
          color: 'var(--mist)',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke="#00ADB5" strokeWidth="2" />
            <circle cx="14" cy="14" r="5" fill="#00ADB5" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Presence
          </span>
        </div>

        <div
          aria-hidden="true"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(14, minmax(0, 1fr))',
            gap: '8px',
            maxWidth: '520px',
            width: '100%',
          }}
        >
          {dots.map((d, idx) => (
            <div
              key={idx}
              style={{
                aspectRatio: '1',
                borderRadius: '50%',
                background: d.bg,
              }}
            />
          ))}
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: '40px',
            lineHeight: 1.1,
            fontWeight: 500,
            letterSpacing: '-0.025em',
            maxWidth: '420px',
            textWrap: 'balance',
          }}
        >
          See who is drifting before they leave.
        </h2>
      </div>

      <div
        style={{
          flex: '1 1 480px',
          minHeight: '560px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 48px',
          gap: '32px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: '24px' }}>
          {showForm && isOwner && (
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              style={{
                background: 'none',
                border: 0,
                padding: 0,
                fontSize: '14px',
                color: 'var(--ink)',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                minHeight: '44px',
              }}
            >
              {registering ? 'Have an account? Sign in' : 'New gym? Create account'}
            </button>
          )}
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {showForm && (
            <div
              role="group"
              aria-label="Account type"
              style={{
                display: 'flex',
                gap: '4px',
                padding: '4px',
                borderRadius: '13px',
                background: 'rgba(34, 40, 49, 0.07)',
              }}
            >
              <button
                type="button"
                onClick={() => setRole('owner')}
                aria-pressed={isOwner}
                style={{
                  flex: 1,
                  height: '44px',
                  border: 0,
                  borderRadius: '9px',
                  fontWeight: 500,
                  fontSize: '14px',
                  ...(isOwner ? activePillStyle : inactivePillStyle),
                }}
              >
                Gym owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('member');
                  setMode('signin');
                }}
                aria-pressed={!isOwner}
                style={{
                  flex: 1,
                  height: '44px',
                  border: 0,
                  borderRadius: '9px',
                  fontWeight: 500,
                  fontSize: '14px',
                  ...(!isOwner ? activePillStyle : inactivePillStyle),
                }}
              >
                Member
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: '-0.025em',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '15px',
                lineHeight: 1.5,
                color: 'var(--muted)',
              }}
            >
              {sub}
            </p>
          </div>

          {showForm && !registering && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('code');
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="si-email" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  id="si-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={{
                    height: '52px',
                    padding: '0 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--line-strong)',
                    background: '#fff',
                    fontSize: '16px',
                    color: 'var(--ink)',
                  }}
                />
              </div>
              <button
                className="btn-ink"
                type="submit"
                style={{
                  height: '52px',
                  border: 0,
                  borderRadius: '12px',
                  background: 'var(--ink)',
                  color: 'var(--mist)',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                Send code
              </button>
            </form>
          )}

          {showForm && registering && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('code');
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(170px, 100%), 1fr))',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="rg-name" style={{ fontSize: '13px', fontWeight: 500 }}>
                    Your name
                  </label>
                  <input
                    id="rg-name"
                    type="text"
                    autoComplete="name"
                    style={{
                      height: '52px',
                      padding: '0 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--line-strong)',
                      background: '#fff',
                      fontSize: '16px',
                      color: 'var(--ink)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label htmlFor="rg-gym" style={{ fontSize: '13px', fontWeight: 500 }}>
                    Gym name
                  </label>
                  <input
                    id="rg-gym"
                    type="text"
                    autoComplete="organization"
                    style={{
                      height: '52px',
                      padding: '0 16px',
                      borderRadius: '12px',
                      border: '1px solid var(--line-strong)',
                      background: '#fff',
                      fontSize: '16px',
                      color: 'var(--ink)',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="rg-email" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  id="rg-email"
                  type="email"
                  autoComplete="email"
                  style={{
                    height: '52px',
                    padding: '0 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--line-strong)',
                    background: '#fff',
                    fontSize: '16px',
                    color: 'var(--ink)',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="rg-phone" style={{ fontSize: '13px', fontWeight: 500 }}>
                  Phone
                </label>
                <input
                  id="rg-phone"
                  type="tel"
                  autoComplete="tel"
                  style={{
                    height: '52px',
                    padding: '0 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--line-strong)',
                    background: '#fff',
                    fontSize: '16px',
                    color: 'var(--ink)',
                  }}
                />
              </div>
              <button
                className="btn-ink"
                type="submit"
                style={{
                  height: '52px',
                  border: 0,
                  borderRadius: '12px',
                  background: 'var(--ink)',
                  color: 'var(--mist)',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                Send verification code
              </button>
            </form>
          )}

          {step === 'code' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                role="group"
                aria-label="6-digit code"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
                  gap: '8px',
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((n, idx) => (
                  <input
                    key={n}
                    ref={(el) => {
                      digitRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[idx]}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    aria-label={`Digit ${n}`}
                    style={{
                      width: '100%',
                      height: '56px',
                      textAlign: 'center',
                      borderRadius: '12px',
                      border: '1px solid var(--line-strong)',
                      background: '#fff',
                      fontFamily: "'Geist Mono', ui-monospace, monospace",
                      fontSize: '22px',
                      color: 'var(--ink)',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
              <a
                className="btn-teal"
                href="#/owner/overview"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/owner/overview');
                }}
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  background: 'var(--teal)',
                  color: 'var(--ink)',
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Verify and continue
              </a>
              <button
                type="button"
                onClick={() => setStep('form')}
                style={{
                  background: 'none',
                  border: 0,
                  padding: 0,
                  minHeight: '44px',
                  fontSize: '14px',
                  color: 'var(--muted)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                Use a different email
              </button>
            </div>
          )}
        </div>

        <p
          style={{
            margin: 0,
            textAlign: 'center',
            fontSize: '13px',
            lineHeight: 1.5,
            color: 'var(--muted)',
          }}
        >
          By continuing you agree to the{' '}
          <a
            href="#/terms"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/terms');
            }}
            style={{
              color: 'var(--ink)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Terms
          </a>{' '}
          and{' '}
          <a
            href="#/privacy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/privacy');
            }}
            style={{
              color: 'var(--ink)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
