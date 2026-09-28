# Swad Express

Swad Express is a full-stack food ordering application built with a React/Vite frontend and a Spring Boot backend.

## Project Structure

```text
SwadExpress/
├── frontend/
│   └── swad-express-frontend/    # React/Vite frontend
│
└── SwadExpress/                  # Spring Boot backend
```

## Requirements

* Java 21
* Node.js and npm
* MySQL
* Maven

## Run the Frontend

Open a terminal and run:

```powershell
cd frontend/swad-express-frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

By default, the frontend sends API requests to:

```text
http://localhost:8080
```

## Run the Backend

Create a MySQL database:

```sql
CREATE DATABASE swadexpress;
```

Configure the following environment variables before starting the backend:

```text
USERNAME
PASSWORD
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
EMAIL_NAME
EMAIL_PASSWORD
```

The default database URL is:

```text
jdbc:mysql://localhost:3306/swadexpress
```

Start the Spring Boot application:

```powershell
cd SwadExpress
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

## Environment Variables

Do not commit real credentials to GitHub.

Keep sensitive values in local environment variables or a local `.env` file.

Make sure `.env` is included in `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

For example, you can provide an `.env.example` file containing only placeholder values:

```text
USERNAME=your_mysql_username
PASSWORD=your_mysql_password
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_NAME=your_email
EMAIL_PASSWORD=your_email_password
```

Never put your actual passwords or API secrets in `.env.example`.

## Validation

### Frontend

```powershell
cd frontend/swad-express-frontend

npm install
npm run lint
npm run build
```

### Backend

```powershell
cd ../../SwadExpress

.\mvnw.cmd -DskipTests package
```

## Technology Stack

### Frontend

* React.js
* Vite
* JavaScript
* Material UI
* Axios
* Redux

### Backend

* Java 21
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* MySQL
* Razorpay
* Java Mail

## Local Development

Start the backend first:

```powershell
cd SwadExpress
.\mvnw.cmd spring-boot:run
```

Then start the frontend:

```powershell
cd frontend/swad-express-frontend
npm run dev
```

Open the frontend in your browser:

```text
http://localhost:5173
```
