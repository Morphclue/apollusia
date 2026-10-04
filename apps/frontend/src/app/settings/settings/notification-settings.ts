export interface NotificationSettings {
  title: string;
  description: string;
  types: {
    key: string;
    icon: string;
    title: string;
    description: string;
    email?: boolean;
    push?: boolean;
  }[];
}

export default [
  {
    title: $localize`:@@notification-category-poll-admin:Poll Admin`,
    description: $localize`:@@notification-category-poll-admin-description:Receive notifications for your own polls.`,
    types: [
      {
        key: 'admin:participant.new',
        icon: 'bi-person-plus',
        title: $localize`:@@notification-new-participant:New Participant`,
        description: $localize`:@@notification-new-participant-description:Someone has participated in one of your polls.`,
      },
      {
        key: 'admin:comment.new',
        icon: 'bi-chat-dots',
        title: $localize`:@@notification-new-comment:New Comment`,
        description: $localize`:@@notification-new-comment-description:Someone has commented in one of your polls.`,
        email: false,
      },
    ],
  },
  {
    title: $localize`:@@notification-category-participant:Participant`,
    description: $localize`:@@notification-category-participant-description:Receive notifications for polls you participated in.`,
    types: [
      {
        key: 'user:participant.new',
        icon: 'bi-check-circle',
        title: $localize`:@@notification-own-vote:Own Vote`,
        description: $localize`:@@notification-own-vote-description:You have voted in a poll.`,
        push: false,
      },
      {
        key: 'user:poll.updated',
        icon: 'bi-pencil-square',
        title: $localize`:@@notification-poll-updated:Poll updated`,
        description: $localize`:@@notification-poll-updated-description:The available options of a poll have changed and you can review your choices.`,
      },
      {
        key: 'user:poll.booked',
        icon: 'bi-calendar-event',
        title: $localize`:@@notification-poll-concluded:Poll concluded`,
        description: $localize`:@@notification-poll-concluded-description:The admin has concluded the poll and booked appointments.`,
      },
    ],
  },
] as NotificationSettings[];
