# Asset Management Platform

An enterprise-grade Asset Management Platform with blockchain tokenization. This monorepo contains the backend (NestJS), frontend (React/Vite), and smart contracts (Hardhat/Solidity).

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your local system:

*   **Node.js**: `v20.0.0` or higher ([Download](https://nodejs.org/))
*   **pnpm**: `v9.0.0` or higher ([Install](https://pnpm.io/installation))
*   **Docker & Docker Compose**: For running PostgreSQL and Redis ([Download](https://www.docker.com/products/docker-desktop/))
*   **Web3 Wallet**: A browser extension like MetaMask for interacting with the frontend.

### 1. Clone the Repository

```bash
git clone https://github.com/swapnil4122/asset-management.git
cd asset-management
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Copy the example environment file and update it with your local configuration:

```bash
cp .env.example .env
```

> [!IMPORTANT]
> Make sure to update the `DATABASE_URL` and `RPC_URL` if you're using custom settings. For local development, the defaults in `.env.example` should work with the provided Docker setup.

### 4. Infrastructure Setup

Start the PostgreSQL database and Redis cache using Docker Compose:

```bash
pnpm docker:up
```

This command will start:
*   **PostgreSQL**: Port `5432`
*   **Redis**: Port `6379`
*   **pgAdmin**: Port `5050` (Optional UI for database management)

### 5. Smart Contracts

Compile and deploy the smart contracts to your local blockchain network (e.g., Hardhat node):

```bash
# In a separate terminal, start the local node if needed
# pnpm --filter @asset-mgmt/contracts node

# Compile contracts
pnpm contracts:compile

# Deploy contracts
pnpm contracts:deploy
```

> [!NOTE]
> After deployment, update your `.env` file with the deployed contract addresses.

### 6. Run the Application

Start both the backend and frontend in development mode:

```bash
pnpm dev
```

*   **Backend API**: [http://localhost:3000](http://localhost:3000)
*   **Frontend**: [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```text
.
├── apps/
│   ├── backend/          # NestJS API with TypeORM & Redis
│   └── frontend/         # React + Vite + Tailwind CSS
├── packages/
│   ├── contracts/        # Solidity Smart Contracts (Hardhat)
│   ├── shared-types/     # Shared TypeScript interfaces
│   ├── config/           # Shared configuration (ESLint, Prettier, TSConfig)
│   └── ui/               # Shared UI component library
├── infrastructure/
│   └── docker/           # Docker Compose configurations
└── pnpm-workspace.yaml   # Monorepo workspace configuration
```

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm dev` | Starts backend and frontend concurrently |
| `pnpm build` | Builds all packages and apps |
| `pnpm lint` | Runs linting across the entire workspace |
| `pnpm test` | Runs tests for all apps and packages |
| `pnpm docker:up` | Starts local infrastructure (PostgreSQL, Redis) |
| `pnpm docker:down` | Stops local infrastructure |

## 🧪 Testing

To run tests for a specific application or package:

```bash
pnpm --filter @asset-mgmt/backend test
pnpm --filter @asset-mgmt/frontend test
```

---

## 📄 License

This project is private and for internal use only.
