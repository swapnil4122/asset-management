# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy root config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all packages and apps
COPY apps/backend ./apps/backend
COPY apps/common ./apps/common
COPY packages/contracts ./packages/contracts

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build common and backend
RUN pnpm --filter @asset-mgmt/common build
RUN pnpm --filter @asset-mgmt/backend build

# Production Stage
FROM node:20-slim

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy built files and production dependencies
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=builder /app/apps/common/dist ./apps/common/dist
COPY --from=builder /app/apps/common/package.json ./apps/common/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["pnpm", "--filter", "@asset-mgmt/backend", "start:prod"]
