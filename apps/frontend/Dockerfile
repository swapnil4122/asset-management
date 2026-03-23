# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Enable pnpm
RUN npm install -g pnpm

# Copy root config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy required workspaces
COPY apps/frontend ./apps/frontend
COPY apps/common ./apps/common

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build common and frontend
RUN pnpm --filter @asset-mgmt/common build
RUN pnpm --filter @asset-mgmt/frontend build

# Serving Stage
FROM nginx:stable-alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
