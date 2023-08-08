import {Component} from '@angular/core';

const apps = ['Apollusia', 'Doodle'] as const;
type App = typeof apps[number];

interface Feature {
  title: string;
  description: string;
  support: Record<App, boolean | string>;
}

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent {
  apps = apps;
  features: Feature[] = [
    {
      title: 'Anonymous participation',
      description: 'Participants can vote without entering their name',
      support: {Apollusia: true, Doodle: true}
    },
    {
      title: 'Participation limit',
      description: 'Limit the number of participants',
      support: {Apollusia: true, Doodle: true}
    },
    {
      title: 'Editing participation',
      description: 'Participants can edit their participation',
      support: {Apollusia: true, Doodle: true}
    },
    {
      title: 'Deadline',
      description: 'Set a deadline for new participations',
      support: {Apollusia: true, Doodle: 'Paid option'}
    },
    {
      title: 'Maybe-option',
      description: 'Friendlier event selection with a Maybe option',
      support: {Apollusia: true, Doodle: 'Not adjustable'}
    },
    {
      title: 'Rich Text and Links in Description',
      description: 'Add Markdown formatted text and links to the description',
      support: {Apollusia: true, Doodle: false}
    },
    {
      title: 'Events of varying length',
      description: 'Every event can have its own length',
      support: {Apollusia: true, Doodle: false}
    },
    {
      title: 'Blind participation',
      description: 'Participants can\'t see other participants until they participate',
      support: {Apollusia: true, Doodle: false}
    },
    {
      title: 'Autofill',
      description: 'Create many sequential events automatically, with breaks and on multiple days',
      support: {Apollusia: true, Doodle: false}
    },
    {
      title: 'Event Notes',
      description: 'Add notes to events to provide additional information',
      support: {Apollusia: true, Doodle: false}
    },
    {
      title: 'Cloning polls',
      description: 'Clone polls to start off with the same options',
      support: {Apollusia: true, Doodle: false}
    },
    {
      title: 'Postponing events',
      description: 'Move all events to a later date',
      support: {Apollusia: true, Doodle: false}
    },
  ];
}
