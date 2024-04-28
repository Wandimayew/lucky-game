# Use a base Keycloak image
FROM quay.io/keycloak/keycloak:24.0.0

# Set environment variables
ENV KEYCLOAK_USER=admin
ENV KEYCLOAK_PASSWORD=admin

# Expose Keycloak ports
EXPOSE 8089

# Use the official PostgreSQL image from Docker Hub
FROM postgres:latest

# Set environment variables (optional)
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=keycloak

# Expose the PostgreSQL port
EXPOSE 5432

# Use a base image suitable for your Node.js application
FROM node:18.19.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3002

# Command to run your application
CMD ["npm", "run", "dev"]

