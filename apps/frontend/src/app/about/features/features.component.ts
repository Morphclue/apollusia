import {Component} from '@angular/core';

const apps = ['Apollusia', 'Doodle', 'DuD-Poll'] as const;
type App = typeof apps[number];

interface Feature {
  title: string;
  description: string;
  apollusiaIssue?: number;
  support: Record<App, boolean | string>;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
  apps = apps;
  features: Record<string, Feature[]> = {
    Participation: [
      {
        title: 'Anonymous participation',
        description: 'Participants can vote without entering their name',
        support: {Apollusia: true, Doodle: true, 'DuD-Poll': true}
      },
      {
        title: 'Editing participation',
        description: 'Participants can edit their participation',
        support: {Apollusia: true, Doodle: true, 'DuD-Poll': true}
      },
      {
        title: 'Blind participation',
        description: 'Participants can\'t see other participants until they participate',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': false}
      },
      {
        title: 'Comments',
        description: 'Add comments to a poll',
        support: {Apollusia: false, Doodle: false, 'DuD-Poll': true}
      },
    ],
    'Poll Options': [
      {
        title: 'Participation limit',
        description: 'Limit the number of participants',
        support: {Apollusia: true, Doodle: true, 'DuD-Poll': false}
      },
      {
        title: 'Maybe Option',
        description: 'Friendlier event selection with a Maybe option',
        support: {Apollusia: true, Doodle: 'Not adjustable', 'DuD-Poll': 'Always'}
      },
      {
        title: 'Deadline',
        description: 'Set a deadline for new participations',
        support: {Apollusia: true, Doodle: 'Paid option', 'DuD-Poll': false}
      },
      {
        title: 'Rich Text and Links in Description',
        description: 'Add Markdown formatted text and links to the description',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': false}
      },
      {
        title: 'Events of varying length',
        description: 'Every event can have its own length',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': false}
      },
      {
        title: 'Event Notes',
        description: 'Add notes to events to provide additional information',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': false}
      },
    ],
    Productivity: [
      {
        title: 'Autofill',
        description: 'Create many sequential events automatically, with breaks and on multiple days',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': 'Repeating the time for every day is possible'}
      },
      {
        title: 'Cloning polls',
        description: 'Clone polls to start off with the same options',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': false}
      },
      {
        title: 'Postponing events',
        description: 'Move all events to a later date',
        support: {Apollusia: true, Doodle: false, 'DuD-Poll': false}
      },
    ],
    'Poll Management': [
      {
        title: 'Invite Participants',
        description: 'Invite participants via email or other means',
        support: {Apollusia: 'Simple link sharing is possible', Doodle: true, 'DuD-Poll': true}
      },
      {
        title: 'Access Control',
        description: 'Restrict access to your poll',
        support: {Apollusia: 'Only for creator, but planned. See #60', Doodle: false, 'DuD-Poll': true}
      },
      {
        title: 'History',
        description: 'See all changes to a poll',
        support: {Apollusia: false, Doodle: false, 'DuD-Poll': true}
      },
    ],
  };
}
