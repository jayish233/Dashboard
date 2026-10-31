import { useEffect, useState } from 'react';
import type { AppRoute } from './components/OwnerLayout';
import { PresenceDataProvider } from './context/PresenceDataContext';
import { OwnerAnalyticsPage } from './pages/OwnerAnalyticsPage';
import { OwnerAttendancePage } from './pages/OwnerAttendancePage';
import { OwnerInactivePage } from './pages/OwnerInactivePage';
import { OwnerMembersPage } from './pages/OwnerMembersPage';
import { OwnerMembershipsPage } from './pages/OwnerMembershipsPage';
import { OwnerOverviewPage } from './pages/OwnerOverviewPage';
import { OwnerRetentionPage } from './pages/OwnerRetentionPage';
import { OwnerSettingsPage } from './pages/OwnerSettingsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SignInPage } from './pages/SignInPage';
import { TermsPage } from './pages/TermsPage';

const VALID_ROUTES: AppRoute[] = [
  '/signin',
  '/privacy',
  '/terms',
  '/owner/overview',
  '/owner/attendance',
  '/owner/members',
  '/owner/retention',
  '/owner/inactive',
  '/owner/memberships',
  '/owner/analytics',
  '/owner/settings',
];

function resolveCurrentRoute(): AppRoute {
  const hash = window.location.hash.replace(/^#/, '');
  if (VALID_ROUTES.includes(hash as AppRoute)) {
    return hash as AppRoute;
  }
  const path = window.location.pathname;
  if (VALID_ROUTES.includes(path as AppRoute)) {
    return path as AppRoute;
  }
  return '/signin';
}

function AppRouter() {
  const [route, setRoute] = useState<AppRoute>(() => resolveCurrentRoute());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(resolveCurrentRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigate = (nextRoute: AppRoute) => {
    window.location.hash = nextRoute;
    setRoute(nextRoute);
    window.scrollTo(0, 0);
  };

  switch (route) {
    case '/privacy':
      return <PrivacyPage onNavigate={navigate} />;
    case '/terms':
      return <TermsPage onNavigate={navigate} />;
    case '/owner/overview':
      return <OwnerOverviewPage onNavigate={navigate} />;
    case '/owner/attendance':
      return <OwnerAttendancePage onNavigate={navigate} />;
    case '/owner/members':
      return <OwnerMembersPage onNavigate={navigate} />;
    case '/owner/retention':
      return <OwnerRetentionPage onNavigate={navigate} />;
    case '/owner/inactive':
      return <OwnerInactivePage onNavigate={navigate} />;
    case '/owner/memberships':
      return <OwnerMembershipsPage onNavigate={navigate} />;
    case '/owner/analytics':
      return <OwnerAnalyticsPage onNavigate={navigate} />;
    case '/owner/settings':
      return <OwnerSettingsPage onNavigate={navigate} />;
    case '/signin':
    default:
      return <SignInPage onNavigate={navigate} />;
  }
}

export function App() {
  return (
    <PresenceDataProvider>
      <AppRouter />
    </PresenceDataProvider>
  );
}

export default App;
