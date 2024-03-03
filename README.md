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

### Participation

<dl>
  <dt>Anonymous participation</dt>
  <dd>Participants can vote without entering their name</dd>
  <dt>Editing participation</dt>
  <dd>Participants can edit their participation</dd>
  <dt>Blind participation</dt>
  <dd>Participants can't see other participants until they participate</dd>
</dl>

### Poll Options

<dl>
  <dt>Participation limit</dt>
  <dd>Limit the number of participants</dd>
  <dt>Maybe Option</dt>
  <dd>Friendlier event selection with a Maybe option</dd>
  <dt>Deadline</dt>
  <dd>Set a deadline for new participations</dd>
  <dt>Events of varying length</dt>
  <dd>Every event can have its own length</dd>
  <dt>Event Notes</dt>
  <dd>Add notes to events to provide additional information</dd>
</dl>

### Productivity

<dl>
  <dt>Autofill</dt>
  <dd>Create many sequential events automatically, with breaks and on multiple days</dd>
  <dt>Cloning polls</dt>
  <dd>Clone polls to start off with the same options</dd>
  <dt>Postponing events</dt>
  <dd>Move all events to a later date</dd>
  <dt>iCal Export</dt>
  <dd>
    Keep track of your polled events and 1-1 meetings using your favorite calendar app.
    Tested with Apple Calendar and Google Calendar.
  </dd>
</dl>

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
