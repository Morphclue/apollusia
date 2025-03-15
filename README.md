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

To set up Keycloak, follow these steps
- Run it with `docker compose up -d keycloak`
- Go to `http://localhost:8080/auth`.
- Create a new realm called `apollusia`
- Create a client called `web` with the following options:
  - Valid Redirect URLs: `http://localhost:4200/*`
  - Valid Post Logout Redirect URLs: `+`
  - Web Origins: `+`.
- Under "Realm Settings > Login", configure:
  - User registration: On
  - Forgot password: On
  - Remember me: On
  - Email as username: On
  - Login with email: On
  - Duplicate emails: Off
  - Verify email: Off
- Under "Realm Settings > User profile", create an attribute:
  - Attribute [Name]: pushTokens
  - Display Name: Push Tokens
  - Multivalued: On
  - Attribute Group: user-metadata
  - Who can edit?: User, Admin
  - Who can view?: User, Admin
- Create a user as follows:
  - Email Verified: Yes
  - Username/email: admin@apollusia.com
  - First Name: Apollusia
  - Last Name: Admin
  - Hit Create
  - Credentials > Set Password: `root` 
  - Role Mapping > Assign Role > Filter by clients > Select all (the list may be long, change pagination to 100 elements to see all) > Assign
  - Role Mapping > Assign Role > Filter by realm roles > Select all > Assign

You can get the Keycloak Client Secret like this:
- Go to http://localhost:8080/auth/admin/master/console/#/apollusia/clients
- Select admin-cli
- Under Settings, make sure Client authentication is enabled
- Hit Save
- Go to the Credentials tab and copy the Client Secret

To get the Keycloak public key, follow these steps:
- Go to http://localhost:8080/auth/admin/master/console/#/apollusia/realm-settings/keys
- Click on the RS256 Public Key
- Copy the base64 key
