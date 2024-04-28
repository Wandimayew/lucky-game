# Use a base image suitable for your Node.js application
FROM node:v18.19.0

# Set the working directory inside the container
WORKDIR /usr/src/app

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
