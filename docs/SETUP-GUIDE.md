# 🚀 Apolusia Setup Guide

This guide provides instructions for setting up the Apollusia project using Docker Compose or on a local Linux environment.

## Table of Contents

- [Docker Compose Setup](#-docker-compose-setup)

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
