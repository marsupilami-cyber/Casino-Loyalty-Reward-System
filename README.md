# Casino Loyalty Reward System

## Overview

The Casino Loyalty Reward System is a microservices-based application designed to manage casino promotions, notifications, and user interactions. It supports automated and manual promotions, real-time notifications, and secure user authorization.

## Architecture

The system is composed of three microservices:

1. **Users Service**: Handles user registration, authentication, and balance management.
2. **Promotions Service**: Manages promotions, including creation, retrieval, assignment, and claim.
3. **Notifications Service**: Sends real-time notifications to logged-in users via WebSocket.

Each microservice is independently deployed and communicates via Kafka, REST APIs, and gRPC. The system uses Docker Compose for container orchestration and service replication.

## Features

- **Automated Promotions**: Automatically assigns promotions (welcome bonus) to users upon registration if active.
- **Manual Promotions**: Staff or admin can manually assign promotions to players.
- **Real-Time Notifications**: Notifications are sent to logged-in users via WebSocket.
- **Promotion Claiming**: Players can claim promotions, which updates their balance via gRPC communication with the Users service.
- **Authentication/Authorization**: Implemented using JWT tokens with refresh token rotation logic.
- **Swagger Documentation**: Available for each microservice at `/api-docs`.

## Communication Flow

1. **User Registration**:

   - A player registers via the Users service.
   - The Users service produces a `PLAYER_REGISTERED` event on the `player` Kafka topic.
   - The Promotions service consumes the event and assigns automated promotions if applicable.
   - The Promotions service produces a `PROMOTION` event on the `notification` Kafka topic.
   - The Notifications service consumes the event and sends a real-time notification to the player via Websockets.

2. **Manual Promotion Assignment**:

   - Staff or admin assigns a promotion to a player via the Promotions service.
   - The Promotions service produces a `PROMOTION` event on the `notification` Kafka topic.
   - The Notifications service consumes the event and sends a notification to the player.

3. **Promotion Claiming**:
   - A player claims a promotion via the Promotions service.
   - The Promotions service sends a gRPC request to the Users service to update the player's balance and save transaction.

## Kafka Topics and Events

- **Topic: `player`**
  - **Event: `PLAYER_REGISTERED`**
    - Produced by the Users service when a player registers.
    - Consumed by the Promotions service to assign automated promotions.
- **Topic: `notification`**
  - **Event: `PROMOTION`**
    - Produced by the Promotions service when a promotion is assigned.
    - Consumed by the Notifications service to send notifications.

## Databases

- **PostgreSQL**: Used by the Users and Promotions services for relational data storage.
- **Redis**: Used by the Users service for caching and storing refresh tokens.
- **MongoDB**: Used by the Notifications service to store notification data.

## Skaling

- **Service Replication**: Each microservice is replicated three times for high availability.
- **Kafka**: Configured with three controllers/brokers using Kraft mode for fault tolerance.
- **Redis and MongoDB**: Both are replicated for high availability.
- **NGINX**: Acts as a reverse proxy to route requests to the appropriate services.

## Migration

- **TypeORM**: Used for database migrations in the Users and Promotions services.

## Technologies Used

- **Backend**: Node.js, TypeScript
- **Databases**: PostgreSQL, Redis, MongoDB
- **Message Broker**: Apache Kafka
- **Containerization**: Docker, Docker Compose
- **API Documentation**: Swagger
- **Authentication**: JWT with refresh token rotation
- **WebSocket**: For real-time notifications

## Additional Notes

- Only one active welcome bonus promotion is allowed at any given time.
- Kafka ensures reliable event-driven communication between services.
- The system is designed for scalability and fault tolerance using service replication and distributed databases.
