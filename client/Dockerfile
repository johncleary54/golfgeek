# Stage 1: Build Stage
FROM node:20-alpine as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json pnpm-lock.yaml /app/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . /app/
COPY .env.prod /app/.env

# Build the SvelteKit application
RUN pnpm run build

# Stage 2: Production Stage
FROM node:20-alpine as production-stage

# Set the working directory inside the container
WORKDIR /app

# Copy the built artifacts from the build stage to the production stage
COPY --from=build-stage /app /app

# Expose the port on which the application will run (default is 3000)
EXPOSE 3000

# Set the command to run the application when the container starts
CMD ["node", "/app/build"]
