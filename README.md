# apollusia

Apollusia is a calendar tool for coordinating events with multiple people.
It is a web application written in Angular with NestJS as the backend.
A running instance of the application can be found under https://apollusia.uniks.de/.
Feel free to check it out!

:star: Star this project on GitHub — it motivates me a lot!

<!---
TODO: Add Logo Banner
-->

<!---
TODO: Add screenshots of the application
-->

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
```

VAPID keys can be generated using the following command:

```bash
npx web-push generate-vapid-keys
```
