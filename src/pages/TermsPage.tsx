import { LegalLayout } from '../components/LegalLayout';
import type { AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';

interface TermsPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
  const { data } = usePresenceData();
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={data.legal.lastUpdated}
      sections={data.legal.termsSections}
      activePage="terms"
      onNavigate={onNavigate}
    />
  );
}
