# Webshop - Spring Boot E-Commerce Application

This is a Spring Boot-based e-commerce webshop application with a MySQL database. The application is containerized using Docker and Docker Compose for easy setup and deployment.

---

## Prerequisites

- **Docker**: Install [Docker](https://docs.docker.com/get-docker/).
- **Docker Compose**: Install [Docker Compose](https://docs.docker.com/compose/install/).
- **Java 17**: Ensure Java 17 or later is installed (for local development).

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/prnb22/webshop-demo-cloud.git
cd webshop-demo-cloud/backend
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following content:

```sh
# MySQL Configuration
MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=

# Spring Boot Configuration
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/webshop?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
```

### 3. Build and Run the Application
Run the following command to build and start the application:

```shell
docker compose up --build
```

- Access the Application: http://localhost:8082
- Swagger UI: http://localhost:8082/swagger-ui/index.html

## Accessing Database

```shell
docker exec -it mysql_db mysql -u <user_name> -p
```