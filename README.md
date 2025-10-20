# <img src=".github/images/logo.png" alt="Apollusia Logo" height="40"> Apollusia

Apollusia is a calendar tool for coordinating events with multiple people.
It is a web application written in Angular with NestJS as the backend.
A running instance of the application can be found under https://apollusia.com/.
Feel free to check it out!

:star: Star this project on GitHub — it motivates us a lot!

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
  <img src="docs/bootstrap-icons/icons/chat-dots.svg" alt="chat-dots" align="right" height="50">
  <dt>Comments</dt>
  <dd>Add comments to a poll</dd>
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
  <img src="docs/bootstrap-icons/icons/bell.svg" alt="bell" align="right" height="50">
  <dt>Notifications</dt>
  <dd>Receive quick updates to polls and participations via Push Notifications on all your devices</dd>
  <img src="docs/bootstrap-icons/icons/envelope.svg" alt="envelope" align="right" height="50">
  <dt>Email Updates</dt>
  <dd>Receive detailed updates to polls and participations via Email</dd>
  <img src="docs/bootstrap-icons/icons/clock-history.svg" alt="clock-history" align="right" height="50">
  <dt>History</dt>
  <dd>See all changes to a poll</dd>
</dl>


<!-- features:end -->

## Setup

Create an `.env` file in the backend directory and add the following environment variables:

```properties
VAPID_PUBLIC_KEY=<vapid public key> # for push notifications
VAPID_PRIVATE_KEY=<vapid private key> # for push notifications
KEYCLOAK_CLIENT_SECRET=<keycloak client secret>
AUTH_PUBLIC_KEY=<keycloak public key>
CONTACT_OPERATOR=<contact operator>
CONTACT_MAIL=<contact email>
CONTACT_ADDRESS=<contact address>
```

VAPID keys can be generated using the following command:

```bash
npx web-push generate-vapid-keys
```

To set up Keycloak, follow these steps:

- Run it with `docker compose up -d keycloak`
- Go to [http://localhost:8080/auth](http://localhost:8080/auth)
- Login using default admin credentials:
  - Username: `admin`
  - Password: `root`
- You can get the Keycloak Client Secret like this:
  - [Go to: **Clients** page > **admin-cli** > **Credentials** tab > Copy the **Client Secret**](http://localhost:8080/auth/admin/master/console/#/apollusia/clients/apollusia-client-admin-cli/credentials)
- To get the Keycloak public key, follow these steps:
  - [Go to: **Realm settings** page > **Keys** tab > **RS256** row > Click on the **Public Key** button > Copy the base64 key](http://localhost:8080/auth/admin/master/console/#/apollusia/realm-settings/keys)

## 📄 Documentation and Contribution
These docs will help you get started and contribute smoothly.

- [CONTRIBUTING](CONTRIBUTING.md)
  Learn how to contribute, submit issues, and create pull requests.

- [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md)  
  Review our community guidelines to foster a respectful and inclusive environment.
