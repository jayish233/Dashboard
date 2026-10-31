import { LegalLayout } from '../components/LegalLayout';
import type { AppRoute } from '../components/OwnerLayout';
import { usePresenceData } from '../context/PresenceDataContext';

interface PrivacyPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  const { data } = usePresenceData();
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated={data.legal.lastUpdated}
      sections={data.legal.privacySections}
      activePage="privacy"
      onNavigate={onNavigate}
    />
  );
}
