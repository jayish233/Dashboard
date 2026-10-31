import { createContext, useContext, useState, type ReactNode } from 'react';
import rawData from '../data/presenceData.json';
import type {
  GymConfig,
  InactiveMemberItem,
  MemberRecord,
  MembershipGroupKey,
  PresenceData,
  RetentionItem,
  StaffMember,
} from '../types/presence';

interface PresenceContextValue {
  data: PresenceData;
  updateGym: (patch: Partial<GymConfig>) => void;
  patchRetentionItem: (id: number, patch: Partial<RetentionItem>) => void;
  patchInactiveMember: (id: number, patch: Partial<InactiveMemberItem>) => void;
  toggleMembershipPayment: (group: MembershipGroupKey, memberName: string) => void;
  addMemberInvitation: (member: Omit<MemberRecord, 'id' | 'lastVisit' | 'status'>) => void;
  inviteStaffMember: (email: string) => void;
}

const PresenceDataContext = createContext<PresenceContextValue | null>(null);

export function PresenceDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PresenceData>(() => rawData as unknown as PresenceData);

  const updateGym = (patch: Partial<GymConfig>) => {
    setData((prev) => ({
      ...prev,
      gym: {
        ...prev.gym,
        ...patch,
      },
    }));
  };

  const patchRetentionItem = (id: number, patch: Partial<RetentionItem>) => {
    setData((prev) => ({
      ...prev,
      retention: {
        ...prev.retention,
        items: prev.retention.items.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        ),
      },
    }));
  };

  const patchInactiveMember = (id: number, patch: Partial<InactiveMemberItem>) => {
    setData((prev) => ({
      ...prev,
      inactiveMembers: {
        ...prev.inactiveMembers,
        members: prev.inactiveMembers.members.map((member) =>
          member.id === id ? { ...member, ...patch } : member
        ),
      },
    }));
  };

  const toggleMembershipPayment = (group: MembershipGroupKey, memberName: string) => {
    setData((prev) => ({
      ...prev,
      memberships: {
        ...prev.memberships,
        groups: {
          ...prev.memberships.groups,
          [group]: {
            ...prev.memberships.groups[group],
            rows: prev.memberships.groups[group].rows.map((row) =>
              row.name === memberName ? { ...row, paid: !row.paid } : row
            ),
          },
        },
      },
    }));
  };

  const addMemberInvitation = (
    member: Omit<MemberRecord, 'id' | 'lastVisit' | 'status'>
  ) => {
    const newRecord: MemberRecord = {
      id: `m-${Date.now()}`,
      name: member.name,
      phone: member.phone,
      email: member.email,
      starts: member.starts,
      expires: member.expires || '30 Oct 2027',
      lastVisit: '—',
      status: 'active',
    };
    setData((prev) => {
      const firstPage = [newRecord, ...(prev.members.pages[0] || [])];
      return {
        ...prev,
        members: {
          ...prev.members,
          totalRegistered: prev.members.totalRegistered + 1,
          statusCounts: {
            ...prev.members.statusCounts,
            all: prev.members.statusCounts.all + 1,
            active: prev.members.statusCounts.active + 1,
          },
          pages: [firstPage, ...prev.members.pages.slice(1)],
        },
      };
    });
  };

  const inviteStaffMember = (email: string) => {
    const newStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      name: email,
      permissions: 'Invited',
      status: 'Invited',
    };
    setData((prev) => ({
      ...prev,
      staff: [...prev.staff, newStaff],
    }));
  };

  return (
    <PresenceDataContext.Provider
      value={{
        data,
        updateGym,
        patchRetentionItem,
        patchInactiveMember,
        toggleMembershipPayment,
        addMemberInvitation,
        inviteStaffMember,
      }}
    >
      {children}
    </PresenceDataContext.Provider>
  );
}

export function usePresenceData(): PresenceContextValue {
  const ctx = useContext(PresenceDataContext);
  if (!ctx) {
    throw new Error('usePresenceData must be used within a PresenceDataProvider');
  }
  return ctx;
}
