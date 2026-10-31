export type MemberStatus = 'active' | 'expiring' | 'suspended' | 'expired';

export type InactiveStatus =
  | 'pending'
  | 'contacted'
  | 'interested'
  | 'issue'
  | 'notint'
  | 'resolved';

export type RetentionSituationKey =
  | 'inactive'
  | 'dropped'
  | 'expiring'
  | 'away'
  | 'returned';

export type MembershipGroupKey = 'expiring' | 'expired' | 'suspended';

export interface NoteEntry {
  when: string;
  who: string;
  text: string;
}

export interface GymConfig {
  name: string;
  ownerName: string;
  ownerInitials: string;
  phone: string;
  timezone: string;
  timezones: string[];
  address: string;
  currentDateLabel: string;
  openDays: boolean[];
  closures: string[];
  inactivityThreshold: number;
  qrLifetime: number;
}

export interface OverviewStat {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface OverviewDropItem {
  name: string;
  meta: string;
}

export interface OverviewFollowupItem {
  name: string;
  meta: string;
  status: string;
  dot: string;
}

export interface OverviewExpiringItem {
  name: string;
  date: string;
}

export interface OverviewData {
  stats: OverviewStat[];
  rangeLabels: Record<'7' | '30' | '90', [string, string, string]>;
  dropping: OverviewDropItem[];
  followups: OverviewFollowupItem[];
  expiring: OverviewExpiringItem[];
}

export interface RecentCheckIn {
  name: string;
  time: string;
}

export interface AttendanceData {
  checkedInCount: number;
  qrCycleSeconds: number;
  initialSecondsRemaining: number;
  initialSeed: number;
  recentCheckIns: RecentCheckIn[];
}

export interface MemberRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  starts?: string;
  expires: string;
  lastVisit: string;
  status: MemberStatus;
}

export interface MembersData {
  totalRegistered: number;
  statusCounts: {
    all: number;
    active: number;
    expiring: number;
    suspended: number;
    expired: number;
  };
  statusMeta: Record<MemberStatus, { label: string; dot: string }>;
  pages: MemberRecord[][];
}

export interface RetentionSituationMeta {
  label: string;
  action: string;
  dot: string;
}

export interface RetentionItem {
  id: number;
  name: string;
  sit: RetentionSituationKey;
  line: string;
  weeks: number[];
  next: string;
  done: boolean;
  closed: boolean;
  phone: string;
  notes: NoteEntry[];
}

export interface RetentionData {
  categoryTotals: Record<RetentionSituationKey, number>;
  situations: Record<RetentionSituationKey, RetentionSituationMeta>;
  items: RetentionItem[];
}

export interface InactiveMemberItem {
  id: number;
  name: string;
  last: string;
  days: number;
  status: InactiveStatus;
  phone: string;
  email: string;
  expiry: string;
  next: string;
  notes: NoteEntry[];
}

export interface InactiveMembersData {
  statusMeta: Record<InactiveStatus, { label: string; dot: string }>;
  members: InactiveMemberItem[];
}

export interface MembershipRow {
  name: string;
  phone: string;
  start: string;
  end: string;
  note: string;
  paid?: boolean;
}

export interface MembershipGroup {
  label: string;
  col: string;
  count: number;
  rows: MembershipRow[];
}

export interface MembershipsData {
  totals: { label: string; value: string }[];
  groups: Record<MembershipGroupKey, MembershipGroup>;
}

export interface AnalyticsRangeMeta {
  key: number;
  label: string;
  sub: string;
  xl: { a: string; b: string; c: string };
}

export interface DecliningGroup {
  name: string;
  n: string;
  w: string;
}

export interface AnalyticsData {
  octoberStats: OverviewStat[];
  ranges: AnalyticsRangeMeta[];
  decliningGroups: DecliningGroup[];
}

export interface StaffMember {
  id: string;
  name: string;
  permissions: string;
  status: 'Active' | 'Invited';
}

export interface LegalSection {
  title: string;
  body: string;
}

export interface LegalData {
  lastUpdated: string;
  privacySections: LegalSection[];
  termsSections: LegalSection[];
}

export interface PresenceData {
  gym: GymConfig;
  overview: OverviewData;
  attendance: AttendanceData;
  members: MembersData;
  retention: RetentionData;
  inactiveMembers: InactiveMembersData;
  memberships: MembershipsData;
  analytics: AnalyticsData;
  staff: StaffMember[];
  legal: LegalData;
}
