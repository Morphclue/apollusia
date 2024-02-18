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
