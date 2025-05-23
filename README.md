# Movie Reservation System API

## Overview

The Movie Reservation System is a full-featured backend application that enables users to browse movies, view showtimes, reserve seats, and complete payments online. It provides a robust API for both customer-facing and administrative operations, with features including secure authentication, temporary seat reservation, payment processing via PayPal, and comprehensive reporting tools.

## Key Features

* **Two-Phase Seat Reservation:**
    * Temporary Seat Locking: Seats are temporarily locked for 5 minutes while the user completes the reservation process, preventing concurrent bookings of the same seats.
    * Confirmed Reservation: After payment is processed successfully, the reservation is confirmed and the seats are permanently allocated.
* **Payment Processing:** The system integrates with PayPal for secure payment processing including order creation, payment capture, and webhook handling for asynchronous notifications.
* **User Authentication and Authorization:** Implements JWT-based authentication with role-based access control for user registration and login.

## Tech Stack

* **Backend Framework:** NestJS
* **Database:** Postgres
* **ORM:** TypeORM
* **Payment Integration:** Paypal (Paypal SDK)
* **Containerization:** Docker and Docker Compose
* **API Documentation:** Swagger (Automatically generated)

## System Architecture

The system follows a modular architecture based on NestJS best practices, with clear separation of concerns across different functional domains. Each module encapsulates related functionality and exposes specific APIs through controllers.

**Domain Modules:**

* `UserModule` & `AuthModule`: Handle user management, authentication, and authorization.
* `MovieModule`: Manages movie information and categories.
* `RoomModule`: Manages theater rooms and seat layouts.
* `ShowtimeModule`: Handles movie scheduling in specific rooms.
* `ReservationModule`: Core module for handling seat reservations.
* `PaymentModule`: Handles payment processing via PayPal integration.
* `ReportModule`: Provides business analytics and reporting capabilities.

**Core Infrastructure:**

* `ConfigurationModule`
* `DatabaseModule`
* `SharedModule`

**Root Module:**

* `AppModule`

## Reservation Process Flow

The heart of the system is the reservation process:

1.  Users browse movies and view showtimes.
2.  Seats are temporarily blocked (POST `/reservation/block`) for 5 minutes, returning a reservation token.
3.  A reservation is created (POST `/reservation`) using the token, initially in `PENDING` status.
4.  Payment is processed (POST `/payment/:id`), creating a PayPal order and redirecting the user.
5.  A payment notification (webhook) from PayPal updates the reservation status to `CONFIRMED`.


## Prerequisites

Before you begin, ensure you have the following installed:

* Node.js (LTS version)
* pnpm (package manager)
* Docker and Docker Compose
* Git

## Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/devEddu17x/movie-reservation-system
    ```

    ```bash
    cd movie-reservation-system
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory (use `.env.example` as a template).

4.  **Start the PostgreSQL database using Docker:**
    ```bash
    docker-compose up -d
    ```

5.  **Seed the database with initial data:**
    ```bash
    pnpm run seed
    ```

## Running the Application

* **Development mode:** Watches for changes and automatically restarts the server.
    ```bash
    pnpm run start:dev
    ```

* **Debug mode:** Similar to development mode but with debugging capabilities.
    ```bash
    pnpm run start:debug
    ```

* **Production mode:** Runs the compiled JavaScript code (build first if necessary).
    ```bash
    pnpm run start:prod
    ```

## API Documentation

The system automatically generates Swagger API documentation, which is accessible at the `/api` endpoint when the server is running (e.g., `http://localhost:{PORT}/api`). This provides a comprehensive interface for exploring and testing all available endpoints.

*(The setup for Swagger documentation can be found in `src/main.ts`.)*

## Development Tools

The system includes several utility scripts (as defined in `package.json`) to facilitate development:

* Database Migrations: Scripts for generating and running database migrations (TypeORM).
* Seeding: Tools for initializing the database with test data.
* Testing: Jest-based testing framework for unit and integration tests.

## Related Wiki Pages (from DeepWiki export)

For more detailed information about specific aspects of the system, you can visit documentation generated by deepwiki [here](https://deepwiki.com/devEddu17x/movie-reservation-system/2.1-seat-locking-mechanism)

## Project Inspiration

This API was developed as a solution for the Movie Reservation System challenge from [roadmap.sh](https://roadmap.sh/projects/movie-reservation-system). The project serves as a practical implementation of a real-world booking system, following industry best practices and modern development patterns.