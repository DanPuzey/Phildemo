# Use official Bun image
FROM oven/bun:1 AS base

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src

# Build the application
RUN bun run build

# Expose the port
EXPOSE 3000

# Create mount point for data (for future use)
VOLUME ["/app/data"]

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["bun", "run", "start"]
