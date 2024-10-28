# 🚀 Apolusia Setup Guide

This guide provides instructions for setting up the Apollusia project using Docker Compose or on a local Linux environment.

## Table of Contents

- [Docker Compose Setup](#-docker-compose-setup)
- [Local Linux Environment Setup](#-local-linux-environment-setup)

## 🐳 Docker Compose Setup

### Prerequisites

- Docker
- Docker Compose

### Steps

1. Clone the repository:
    
    ```
    git clone --depth 1 --branch master https://github.com/Morphclue/apollusia 
    cd apollusia
    ```
2. Start the services:

```shellscript
docker compose up -d
```


3. This will start the following services:

- 🗄️ Database (MongoDB) on port `27017`
- 🖥️ Frontend on port `4000`
- 🔧 Backend on port `3000`
- 🔐 Keycloak on port `8080`


4. Verify services:
Once Docker Compose completes setup, verify each service is running as expected by checking the logs or using:

```shellscript
docker ps
```

## 🐧 Local Linux Environment Setup

### Prerequisites

- Node.js (v14 or later)
- PNPM
- MongoDB
- Keycloak
### Steps

1. Clone the repository:

```shellscript
git clone --depth 1 --branch master https://github.com/Morphclue/apollusia 
cd apollusia
```


2. Install dependencies:

```shellscript
pnpm install
```


3. Set up MongoDB:

```shellscript
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```


4. Set up Keycloak:

```shellscript
wget https://github.com/keycloak/keycloak/releases/download/18.0.0/keycloak-18.0.0.tar.gz
tar -xvzf keycloak-18.0.0.tar.gz
cd keycloak-18.0.0/bin
./standalone.sh -Djboss.socket.binding.port-offset=100
```


5. Configure environment variables:
Create an `.env` file in the backend directory and add the following environment variables:

```ini
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

DATABASE_URL=mongodb://localhost:27017/nestjs
KEYCLOAK_URL=http://localhost:8080/auth
KEYCLOAK_REALM=apollusia
KEYCLOAK_CLIENT_ID=apollusia-backend
KEYCLOAK_CLIENT_SECRET=your-client-secret
KC_HOSTNAME: localhost
KC_HTTP_RELATIVE_PATH: /auth
KEYCLOAK_ADMIN: admin
KEYCLOAK_ADMIN_PASSWORD: root
```

VAPID keys can be generated using the following command:

```shell
npx web-push generate-vapid-keys
```

6. Start the backend:

```shellscript
nx serve backend
```


7. Start the frontend:

```shellscript
nx serve frontend
```


8. Access the services:

1. Frontend: [http://localhost:4000](http://localhost:4000)
2. Backend: [http://localhost:3000](http://localhost:3000)
3. MongoDB: localhost:27017
4. Keycloak: [http://localhost:8180](http://localhost:8180)





## 🔧 Troubleshooting

If you encounter any issues during setup:

1. Ensure all prerequisites are correctly installed
2. Check that all services (MongoDB, Keycloak) are running
3. Verify your `.env` file contains all necessary variables
4. Check the console output for any error messages


If problems persist, please open an issue on our GitHub repository with detailed information about the error and your setup.

## 🤝 Contributing

Now that your environment is set up, you're ready to start contributing! Please refer to our [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines on how to contribute to the project.

Happy coding! 🎉
