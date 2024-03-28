# <img src=".github/images/logo.png" alt="Apollusia Logo" height="40"> Apollusia

Apollusia is a calendar tool for coordinating events with multiple people.
It is a web application written in Angular with NestJS as the backend.
A running instance of the application can be found under https://apollusia.com/.
Feel free to check it out!

:star: Star this project on GitHub — it motivates me a lot!

## Screenshots

### View Your Polls and Participations in the Dashboard

![Dashboard](.github/images/dashboard_light.png#gh-light-mode-only)
![Dashboard](.github/images/dashboard_dark.png#gh-dark-mode-only)

### Create Polls with Advanced Options

![Create Polls](.github/images/new_poll_light.png#gh-light-mode-only)
![Create Polls](.github/images/new_poll_dark.png#gh-dark-mode-only)

### Choose Available Dates and Times

![Choose Dates](.github/images/choose_events_light.png#gh-light-mode-only)
![Choose Dates](.github/images/choose_events_dark.png#gh-dark-mode-only)

### Participate and Find the Best Option

![Participate](.github/images/participate_light.png#gh-light-mode-only)
![Participate](.github/images/participate_dark.png#gh-dark-mode-only)

## Features

Apollusia offers a variety of features to make event coordination as easy as possible.
All features are completely free and can be used without registration.

<!-- features:start -->
### Participation

<dl>
  <img src="docs/bootstrap-icons/icons/incognito.svg" alt="incognito" align="right" height="50">
  <dt>Anonymous participation</dt>
  <dd>Participants can vote without entering their name</dd>
  <img src="docs/bootstrap-icons/icons/pencil-square.svg" alt="pencil-square" align="right" height="50">
  <dt>Editing participation</dt>
  <dd>Participants can edit their participation</dd>
  <img src="docs/bootstrap-icons/icons/eye-slash.svg" alt="eye-slash" align="right" height="50">
  <dt>Blind participation</dt>
  <dd>Participants can't see other participants until they participate</dd>
</dl>

### Poll Options

<dl>
  <img src="docs/bootstrap-icons/icons/1-square.svg" alt="1-square" align="right" height="50">
  <dt>Participation limit</dt>
  <dd>Limit the number of participants</dd>
  <img src="docs/bootstrap-icons/icons/question-square.svg" alt="question-square" align="right" height="50">
  <dt>Maybe Option</dt>
  <dd>Friendlier event selection with a Maybe option</dd>
  <img src="docs/bootstrap-icons/icons/calendar-day.svg" alt="calendar-day" align="right" height="50">
  <dt>Deadline</dt>
  <dd>Set a deadline for new participations</dd>
  <img src="docs/bootstrap-icons/icons/markdown.svg" alt="markdown" align="right" height="50">
  <dt>Rich Text and Links in Description</dt>
  <dd>Add Markdown formatted text and links to the description</dd>
  <img src="docs/bootstrap-icons/icons/calendar-week.svg" alt="calendar-week" align="right" height="50">
  <dt>Events of varying length</dt>
  <dd>Every event can have its own length</dd>
  <img src="docs/bootstrap-icons/icons/sticky.svg" alt="sticky" align="right" height="50">
  <dt>Event Notes</dt>
  <dd>Add notes to events to provide additional information</dd>
</dl>

### Productivity

<dl>
  <img src="docs/bootstrap-icons/icons/calendar-range.svg" alt="calendar-range" align="right" height="50">
  <dt>Autofill</dt>
  <dd>Create many sequential events automatically, with breaks and on multiple days</dd>
  <img src="docs/bootstrap-icons/icons/copy.svg" alt="copy" align="right" height="50">
  <dt>Cloning polls</dt>
  <dd>Clone polls to start off with the same options</dd>
  <img src="docs/bootstrap-icons/icons/fast-forward.svg" alt="fast-forward" align="right" height="50">
  <dt>Postponing events</dt>
  <dd>Move all events to a later date</dd>
  <img src="docs/bootstrap-icons/icons/calendar2-week.svg" alt="calendar2-week" align="right" height="50">
  <dt>iCal Export</dt>
  <dd>Keep track of your polled events and 1-1 meetings using your favorite calendar app</dd>
</dl>

### Poll Management

<dl>
  <img src="docs/bootstrap-icons/icons/send.svg" alt="send" align="right" height="50">
  <dt>Invite Participants</dt>
  <dd>Invite participants via email or other means</dd>
</dl>


<!-- features:end -->

## Setup

Create an `.env` file in the backend directory and add the following environment variables:

```properties
EMAIL_HOST=<smtp host>
EMAIL_PORT=25 # optional, alternatively 587, or 465 for SSL
EMAIL_SSL=false # optional
EMAIL_STARTTLS=false # optional
EMAIL_USER=<username>
EMAIL_PASSWORD=<password>
EMAIL_FROM=<sender email>
EMAIL_NAME=Apollusia # optional sender display name
VAPID_PUBLIC_KEY=<vapid public key> # for push notifications
VAPID_PRIVATE_KEY=<vapid private key> # for push notifications
CONTACT_OPERATOR=<contact operator>
CONTACT_MAIL=<contact email>
CONTACT_ADDRESS=<contact address>
```

VAPID keys can be generated using the following command:

```bash
npx web-push generate-vapid-keys
```
