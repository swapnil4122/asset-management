# MASTER TASKS - Asset Management Platform

This document breaks down the entire Asset Management Platform into atomic, independent, and self-contained tasks. It is designed so that any AI agent with zero context can pick up a task and execute it perfectly.

---

## PHASE 1: Project Setup

### Task Title: Initialize Monorepo Architecture
### Task ID: TASK-001
### Objective: Setup the core pnpm workspace for backend, frontend, and smart contracts.
### Context: A monorepo structure is required to share types and configurations across the full stack.
### Technical Requirements: pnpm workspaces, empty applications, base tsconfig.
### Files to Create / Modify: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`
### Step-by-Step Instructions:
1. Initialize pnpm workspace in root.
2. Create `apps/` and `packages/` folders.
3. Add `pnpm-workspace.yaml` mapping to these folders.
4. Create a global `tsconfig.base.json`.
### Expected Output: Monorepo folder structure is ready to accept apps.
### Dependencies: None
### Validation Criteria: `pnpm install` succeeds without errors.
### Notes: Keep base files minimal.

---

### Task Title: Setup NestJS Backend Shell
### Task ID: TASK-002
### Objective: Scaffold the backend application inside the monorepo.
### Context: The backend provides all APIs and background workers.
### Technical Requirements: NestJS CLI, setup in `apps/backend`.
### Files to Create / Modify: `apps/backend/package.json`, `apps/backend/src/main.ts`
### Step-by-Step Instructions:
1. Run `nest new backend` inside `apps/` (skip git/npm install).
2. Configure `package.json` to link monorepo tools.
### Expected Output: A working barebones NestJS app.
### Dependencies: TASK-001
### Validation Criteria: `pnpm run start:dev` inside backend starts successfully.
### Notes: Use standard Nest defaults.

---

### Task Title: Setup React Frontend Shell
### Task ID: TASK-003
### Objective: Scaffold the frontend using Vite + React.
### Context: The user interface needs a fast development environment.
### Technical Requirements: Vite, React, TypeScript.
### Files to Create / Modify: `apps/frontend/package.json`, `apps/frontend/vite.config.ts`
### Step-by-Step Instructions:
1. Run `npm create vite@latest frontend -- --template react-ts` in `apps/`.
2. Configure basic routing wrapper in `App.tsx`.
### Expected Output: A working Vite React app.
### Dependencies: TASK-001
### Validation Criteria: `pnpm run dev` in frontend serves the default Vite page.
### Notes: Use SWC plugin for faster builds.

---

### Task Title: Setup Shared UI Library
### Task ID: TASK-004
### Objective: Create a package for shared React components.
### Context: Standardized UI components ensure consistency across possible future apps.
### Technical Requirements: package with React, export `Button`, `Input` stubs.
### Files to Create / Modify: `packages/ui/package.json`, `packages/ui/src/index.ts`
### Step-by-Step Instructions:
1. Create `packages/ui` folder.
2. Initialize `package.json` referencing workspace dependencies.
3. Export a dummy UI component.
### Expected Output: A consumable UI package.
### Dependencies: TASK-003
### Validation Criteria: Frontend can import a component from `@asset-mgmt/ui`.
### Notes: Will be expanded later.

---

### Task Title: Configure Shared ESLint/Prettier
### Task ID: TASK-005
### Objective: Ensure consistent code formatting across the monorepo.
### Context: Different tools need unified linting rules.
### Technical Requirements: ESLint, Prettier, configured at root.
### Files to Create / Modify: `.eslintrc.json`, `.prettierrc.json`
### Step-by-Step Instructions:
1. Create root `.eslintrc.json` extending typescript-eslint.
2. Create `.prettierrc.json` with standard formatting.
3. Add `lint` and `format` scripts to root package.json.
### Expected Output: All code is lintable from the root.
### Dependencies: TASK-001
### Validation Criteria: Running `pnpm lint` checks all apps and packages without failing on missing configs.
### Notes: Ignore `dist` and `node_modules`.

---

## PHASE 2: Backend Core

### Task Title: Setup Database Configuration
### Task ID: TASK-006
### Objective: Connect NestJS to PostgreSQL using TypeORM.
### Context: The application requires a persistent relational database.
### Technical Requirements: `@nestjs/typeorm`, Postgres driver, `.env` loading.
### Files to Create / Modify: `apps/backend/src/config/database.config.ts`, `app.module.ts`
### Step-by-Step Instructions:
1. Install `pg` and `@nestjs/typeorm` in backend.
2. Create config file reading from environment variables.
3. Register TypeOrmModule in `AppModule`.
### Expected Output: Backend successfully connects to a local postgres instance.
### Dependencies: TASK-002
### Validation Criteria: App starts and logs successful database connection.
### Notes: Make sure to use `ConfigModule`.

---

### Task Title: Setup Redis Module
### Task ID: TASK-007
### Objective: Integrate Redis for caching and queues.
### Context: High performance operations require caching layered over the database.
### Technical Requirements: `ioredis`, `@nestjs/bullmq`.
### Files to Create / Modify: `apps/backend/src/config/redis.config.ts`, `app.module.ts`
### Step-by-Step Instructions:
1. Install `ioredis` and connect via a custom provider.
2. Register BullModule with Redis details.
### Expected Output: Redis is available for injection globally.
### Dependencies: TASK-002
### Validation Criteria: Backend starts without Redis connection timeouts.
### Notes: Default to localhost:6379 natively.

---

### Task Title: Setup Rate Limiter & Security
### Task ID: TASK-008
### Objective: Protect endpoints against DDoS and brute force.
### Context: Public APIs need rate limiting to ensure platform stability.
### Technical Requirements: `@nestjs/throttler`, Helmet.
### Files to Create / Modify: `apps/backend/src/main.ts`, `app.module.ts`
### Step-by-Step Instructions:
1. Install `@nestjs/throttler` and `helmet`.
2. Apply `helmet()` in `main.ts`.
3. Register ThrottlerModule globally in `AppModule`.
### Expected Output: Requests are limited to 100 per minute per IP.
### Dependencies: TASK-002
### Validation Criteria: 101st request returns HTTP 429 Too Many Requests.
### Notes: Configure via environment variables.

---

### Task Title: Global Exception Filter
### Task ID: TASK-009
### Objective: Standardize error responses.
### Context: The frontend needs a predictable error structure for every API failure.
### Technical Requirements: Create a custom `ExceptionFilter`.
### Files to Create / Modify: `apps/backend/src/common/filters/global-exception.filter.ts`
### Step-by-Step Instructions:
1. Create filter handling `HttpException` and generic `Error`.
2. Format response to `{ success: false, error: string, timestamp: string }`.
3. Apply globally in `main.ts`.
### Expected Output: Consistent JSON errors.
### Dependencies: TASK-002
### Validation Criteria: Throwing an error in a controller returns the exact format requested.
### Notes: Log generic errors to stdout.

---

### Task Title: Logging & Monitoring Interceptors
### Task ID: TASK-010
### Objective: Automatically log all incoming requests and outgoing responses.
### Context: Production requires traceability for timing and debugging.
### Technical Requirements: NestJS Interceptor.
### Files to Create / Modify: `apps/backend/src/common/interceptors/logging.interceptor.ts`
### Step-by-Step Instructions:
1. Create `LoggingInterceptor` using RxJS `tap`.
2. Log method, URL, and execution time.
3. Bind globally in `main.ts`.
### Expected Output: Terminal logs print response times for every request.
### Dependencies: TASK-002
### Validation Criteria: Making a GET request prints a formatted log line.
### Notes: Ignore healthcheck routes.

---

## PHASE 3: Database Layer

### Task Title: TypeORM User Entity
### Task ID: TASK-011
### Objective: Define the User database schema.
### Context: Accounts are needed to interact with the platform.
### Technical Requirements: `@Entity`, Columns for email, username, wallet.
### Files to Create / Modify: `apps/backend/src/modules/user/entity/user.entity.ts`
### Step-by-Step Instructions:
1. Create the entity class with `id` (UUID).
2. Add `email` (unique), `username`, and `walletAddress` (nullable).
3. Ensure timestamps (`createdAt`, `updatedAt`).
### Expected Output: User table is structured.
### Dependencies: TASK-006
### Validation Criteria: TypeORM generates the correct schema during sync.
### Notes: Use `varchar` for strings.

---

### Task Title: TypeORM Asset Entity
### Task ID: TASK-012
### Objective: Define the core Asset representation.
### Context: The platform manages real-world and digital assets.
### Technical Requirements: `@Entity`, ManyToOne to User.
### Files to Create / Modify: `apps/backend/src/modules/asset/entity/asset.entity.ts`
### Step-by-Step Instructions:
1. Create entity with `name`, `description`, `assetType`, `status`.
2. Define `ownerId` and relation to `User`.
3. Add fields for `valuationUSD`.
### Expected Output: Assets are mapped to the database.
### Dependencies: TASK-011
### Validation Criteria: Relation between User and Asset functions correctly.
### Notes: `status` should be an enum.

---

### Task Title: TypeORM Listing Entity
### Task ID: TASK-013
### Objective: Define the Marketplace Listing schema.
### Context: Users can list assets for sale.
### Technical Requirements: `@Entity`, OneToOne or ManyToOne to Asset.
### Files to Create / Modify: `apps/backend/src/modules/marketplace/entity/listing.entity.ts`
### Step-by-Step Instructions:
1. Create entity with `priceETH`, `status`, `expiresAt`.
2. Link to `Asset` and `User` (seller).
### Expected Output: Listings table created.
### Dependencies: TASK-012
### Validation Criteria: Foreign keys apply correctly on Asset and User.
### Notes: Handle fractional listings later.

---

### Task Title: TypeORM VerificationRequest Entity
### Task ID: TASK-014
### Objective: Track asset verification processes.
### Context: Admins or verifiers must approve assets before listing.
### Technical Requirements: `@Entity`, link to User (verifier) and Asset.
### Files to Create / Modify: `apps/backend/src/modules/verification/entity/verification-request.entity.ts`
### Step-by-Step Instructions:
1. Define `status` (PENDING, APPROVED, REJECTED).
2. Add `notes`, `documents` (JSON array).
3. Link `assetId` and `reviewedById`.
### Expected Output: Verification tracking is supported in DB.
### Dependencies: TASK-012
### Validation Criteria: Entity aligns properly in database synchronizations.
### Notes: None.

---

### Task Title: Database Migrations Setup
### Task ID: TASK-015
### Objective: Configure script-based database migrations.
### Context: Production deploys cannot rely on synchronize: true.
### Technical Requirements: TypeORM CLI configuration.
### Files to Create / Modify: `apps/backend/src/database/data-source.ts`, `package.json`
### Step-by-Step Instructions:
1. Create a `DataSource` instance configuration for CLI.
2. Add `typeorm:generate` and `typeorm:run` scripts.
3. Generate the initial migration for entities created in previous tasks.
### Expected Output: A migration file is created capturing current schema.
### Dependencies: TASK-011, TASK-012, TASK-013, TASK-014
### Validation Criteria: `pnpm run typeorm:run` successfully applies schema to empty DB.
### Notes: Disable sync: true in production env.

---

## PHASE 4: Asset Module

### Task Title: Create Asset Creation Endpoint
### Task ID: TASK-016
### Objective: API endpoint for users to register new assets.
### Context: Users need to interact via frontend to submit assets.
### Technical Requirements: Controller, Service, DTO, JWT Guard.
### Files to Create / Modify: `asset.controller.ts`, `asset.service.ts`, `dto/create-asset.dto.ts`
### Step-by-Step Instructions:
1. Create DTO with class-validator decorators.
2. Implement service method to save new Asset with default `PENDING` status.
3. Expose POST `/assets` secured by AuthGuard.
### Expected Output: User can create asset.
### Dependencies: TASK-012, Auth Module (Assumption: Auth works)
### Validation Criteria: 201 Created returned when posting valid asset JSON with user token.
### Notes: Assign owner purely by JWT payload.

---

### Task Title: Create Asset Retrieval Endpoints
### Task ID: TASK-017
### Objective: API to view owned and public assets.
### Context: Dashboards require asset data.
### Technical Requirements: GET `/assets`, GET `/assets/:id`.
### Files to Create / Modify: `asset.controller.ts`, `asset.service.ts`
### Step-by-Step Instructions:
1. Implement pagination in `asset.service.ts`.
2. GET `/assets` returns assets owned by user if authenticated, or public if not.
3. GET `/assets/:id` returns specific details.
### Expected Output: Asset arrays and detailed JSONs.
### Dependencies: TASK-012
### Validation Criteria: Pagination limits correctly slice data.
### Notes: Use standard pagination config.

---

### Task Title: Create Asset Update Endpoint
### Task ID: TASK-018
### Objective: Enable modification of asset details.
### Context: Users may make typos or want to add documents.
### Technical Requirements: PATCH `/assets/:id`, Authorization checks.
### Files to Create / Modify: `asset.controller.ts`, `asset.service.ts`
### Step-by-Step Instructions:
1. Add DTO for partial updates.
2. Verify in service that requester is the owner.
3. Save changes if status is still PENDING.
### Expected Output: Asset updates successfully.
### Dependencies: TASK-016
### Validation Criteria: 403 Forbidden if non-owner tries to update.
### Notes: Cannot update if VERIFIED.

---

### Task Title: Establish Asset Module Guards
### Task ID: TASK-019
### Objective: Reusable guard for Ownership checks.
### Context: Simplifies controller logic.
### Technical Requirements: Custom NestJS Guard `IsOwnerGuard`.
### Files to Create / Modify: `apps/backend/src/modules/asset/guards/is-owner.guard.ts`
### Step-by-Step Instructions:
1. Extract assetId from URL params.
2. Query DB to check if `Asset.ownerId === request.user.id`.
3. Block if false.
### Expected Output: Guard correctly evaluates limits.
### Dependencies: TASK-017
### Validation Criteria: Applying guard protects the route definitively.
### Notes: Cache the lookup if applicable.

---

### Task Title: Asset Image Upload (IPFS)
### Task ID: TASK-020
### Objective: Pin asset documents to IPFS.
### Context: Web3 assets need decentralized storage.
### Technical Requirements: Pinata API / ipfs-http-client.
### Files to Create / Modify: `ipfs.service.ts`, `asset.controller.ts`
### Step-by-Step Instructions:
1. Create `IpfsService` wrapping Pinata SDK.
2. Add a `POST /assets/:id/upload` endpoint using FileInterceptor.
3. Call IPFS and save the generated hash to the asset.
### Expected Output: File uploaded and hash returned.
### Dependencies: TASK-016
### Validation Criteria: IPFS CID resolves on public gateways.
### Notes: Validate file types strictly.

---

## PHASE 5: Verification Module

### Task Title: Submit Verification Request API
### Task ID: TASK-021
### Objective: Allow users to request verifier review.
### Context: Only verified assets can be tokenized.
### Technical Requirements: POST `/verification/request`.
### Files to Create / Modify: `verification.controller.ts`, `verification.service.ts`
### Step-by-Step Instructions:
1. Verify asset is in `PENDING` status.
2. Create VerificationRequest row.
3. Change Asset status to `IN_REVIEW`.
### Expected Output: Verification Request is generated.
### Dependencies: TASK-014, TASK-016
### Validation Criteria: Cannot submit multiple times.
### Notes: Ensure transactional integrity.

---

### Task Title: Verifier Dashboard API
### Task ID: TASK-022
### Objective: Endpoints for admin to fetch pending verifications.
### Context: Verifiers need to see what needs review.
### Technical Requirements: GET `/verification/pending`.
### Files to Create / Modify: `verification.controller.ts`, `verification.service.ts`
### Step-by-Step Instructions:
1. Enforce RoleGuard('verifier', 'admin').
2. Fetch requests joined with related Asset context.
### Expected Output: Arrays of reviewable items.
### Dependencies: TASK-021
### Validation Criteria: Regular users get 403 Forbidden.
### Notes: Include documents.

---

### Task Title: Approve Verification Workflow
### Task ID: TASK-023
### Objective: Mark an asset as verified.
### Context: Once verified, it can move to Blockchain module.
### Technical Requirements: POST `/verification/:id/approve`.
### Files to Create / Modify: `verification.service.ts`
### Step-by-Step Instructions:
1. Validate requester is verifier.
2. Update Request status to `APPROVED`.
3. Set Asset status to `VERIFIED`.
### Expected Output: Asset unlocks the tokenization phase.
### Dependencies: TASK-022
### Validation Criteria: Asset reflects new state immediately.
### Notes: Log the user who approved it.

---

### Task Title: Reject Verification Workflow
### Task ID: TASK-024
### Objective: Deny invalid assets with notes.
### Context: Gives users feedback to fix their details.
### Technical Requirements: POST `/verification/:id/reject`.
### Files to Create / Modify: `verification.service.ts`
### Step-by-Step Instructions:
1. Require a `notes` string in the DTO.
2. Update Request status to `REJECTED`.
3. Set Asset status back to `REJECTED`.
### Expected Output: Process is stopped, user gets feedback.
### Dependencies: TASK-022
### Validation Criteria: Rejection reason is exposed to the asset owner.
### Notes: Send Notification in future steps.

---

### Task Title: Verification Status Webhook
### Task ID: TASK-025
### Objective: Dispatch system events on status changes.
### Context: Decouples Verification module from notifications.
### Technical Requirements: EventEmitter2.
### Files to Create / Modify: `verification.service.ts`
### Step-by-Step Instructions:
1. Inject EventEmitter.
2. Emit `asset.verified` and `asset.rejected` in approval/rejection workflows.
### Expected Output: Events are fired automatically.
### Dependencies: TASK-023, TASK-024
### Validation Criteria: Test listener correctly catches and prints event payloads.
### Notes: Pass the asset ID as payload.

---

## PHASE 6: Blockchain Integration

### Task Title: Solidity AssetToken Contract
### Task ID: TASK-026
### Objective: Define the ERC721 backing system assets.
### Context: Assets need on-chain representation.
### Technical Requirements: OpenZeppelin ERC721URIStorage.
### Files to Create / Modify: `packages/contracts/contracts/AssetToken.sol`
### Step-by-Step Instructions:
1. Implement ERC721 logic inside packages/contracts.
2. Restrict `mint` to contract owner (the backend).
3. Store IPFS hash as token URI.
### Expected Output: Compilable smart contract.
### Dependencies: TASK-001
### Validation Criteria: `npx hardhat compile` succeeds.
### Notes: Add minting events for tracing.

---

### Task Title: Solidity Marketplace Contract
### Task ID: TASK-027
### Objective: Smart contract handling buy/sell/escrow.
### Context: Trustless transitions of asset ownership.
### Technical Requirements: Solidity, interaction with AssetToken.
### Files to Create / Modify: `packages/contracts/contracts/AssetMarketplace.sol`
### Step-by-Step Instructions:
1. Create functions for listing, buying, and cancelling.
2. Require AssetToken approval before listing.
3. Manage secure fund transfers (ETH or ERC20).
### Expected Output: Marketplace functionality implemented.
### Dependencies: TASK-026
### Validation Criteria: Test units pass the buy flow locally.
### Notes: Reentrancy guards required.

---

### Task Title: Hardhat Deployment Scripts
### Task ID: TASK-028
### Objective: Automate deployment to testnets.
### Context: Contracts need addresses for backend interaction.
### Technical Requirements: Hardhat Ignition or ether.js scripts.
### Files to Create / Modify: `packages/contracts/scripts/deploy.js`
### Step-by-Step Instructions:
1. Write script to deploy AssetToken and Marketplace.
2. Export ABI and addresses into a JSON in `packages/shared-types`.
### Expected Output: Types and ABI are ready for the monorepo.
### Dependencies: TASK-027
### Validation Criteria: Local blockchain yields contract addresses and saves JSON.
### Notes: Use localhost for now.

---

### Task Title: Contract Event Listeners Backend
### Task ID: TASK-029
### Objective: Backend service that tracks chain events.
### Context: Syncs SQL with blockchain states (e.g., successful sale).
### Technical Requirements: Ethers.js provider, NestJS lifecycle hooks.
### Files to Create / Modify: `apps/backend/src/modules/blockchain/listener.service.ts`
### Step-by-Step Instructions:
1. Initialize WebSocket provider to blockchain RPC.
2. Listen to `Transfer` and `Bought` events.
3. Update database statuses to reflect ownership changes.
### Expected Output: DB automatically updates on transaction.
### Dependencies: TASK-028
### Validation Criteria: Manual transfer on Hardhat node updates the NestJS DB.
### Notes: Ensure robustness against disconnects.

---

### Task Title: Tokenization Execution API
### Task ID: TASK-030
### Objective: Admin endpoint to mint an asset.
### Context: Minting bridges the Web2 asset to Web3.
### Technical Requirements: Ethers.js wallet, POST `/blockchain/mint/:assetId`.
### Files to Create / Modify: `blockchain.controller.ts`, `blockchain.service.ts`
### Step-by-Step Instructions:
1. Verify Asset is `VERIFIED`.
2. Construct Tx using Server's private key to call `mint()`.
3. Wait for confirmation, update Asset `tokenId` and status to `TOKENIZED`.
### Expected Output: User's asset now has a real Token ID.
### Dependencies: TASK-025, TASK-028
### Validation Criteria: Endpoint successfully calls the running local chain.
### Notes: Private key handled via env safely.

---

## PHASE 7: Marketplace

### Task Title: Create Listing Endpoint
### Task ID: TASK-031
### Objective: Users list their tokenized assets.
### Context: Starts the sales process in the DB and prompts UI.
### Technical Requirements: POST `/marketplace/list`.
### Files to Create / Modify: `listing.controller.ts`, `listing.service.ts`
### Step-by-Step Instructions:
1. Verify user is owner and Asset is `TOKENIZED`.
2. Save Listing row (price, expiresAt).
3. Return unsigned Tx payload for user to approve on-chain.
### Expected Output: Listing initiated in DB.
### Dependencies: TASK-013, TASK-030
### Validation Criteria: Correctly forms listing record.
### Notes: The actual chain listing happens via user wallet.

---

### Task Title: Cancel Listing Endpoint
### Task ID: TASK-032
### Objective: Withdraw an item.
### Context: User changes their mind.
### Technical Requirements: DELETE `/marketplace/list/:id`.
### Files to Create / Modify: `listing.service.ts`
### Step-by-Step Instructions:
1. Check ownership.
2. Soft delete or update status to `CANCELLED`.
### Expected Output: Item is off-market.
### Dependencies: TASK-031
### Validation Criteria: Item no longer shows in public feeds.
### Notes: Also requires on-chain delisting tx.

---

### Task Title: View Active Listings API
### Task ID: TASK-033
### Objective: Fetch all items currently for sale.
### Context: Feeds the main gallery view.
### Technical Requirements: GET `/marketplace/active`.
### Files to Create / Modify: `listing.service.ts`
### Step-by-Step Instructions:
1. Query Listings where status is `ACTIVE` and expiry is in future.
2. Include relation to Asset data.
### Expected Output: Clean JSON array of purchasable assets.
### Dependencies: TASK-031
### Validation Criteria: Excludes cancelled or sold items successfully.
### Notes: Provide sorting (price, date).

---

### Task Title: Execute Purchase API
### Task ID: TASK-034
### Objective: Verify that a purchase concluded.
### Context: Called via the Event Listener or User prompting to finalize.
### Technical Requirements: Webhook or active check.
### Files to Create / Modify: `marketplace.service.ts`
### Step-by-Step Instructions:
1. Validate on-chain transaction receipt.
2. Mark Listing `SOLD`.
3. Shift Asset ownership to buyer.
### Expected Output: State synchronized with chain.
### Dependencies: TASK-029, TASK-031
### Validation Criteria: Data integrity completely matches smart contract state.
### Notes: Must prevent double counting.

---

### Task Title: Escrow Implementation
### Task ID: TASK-035
### Objective: Implement hold functionalities for complex assets.
### Context: Some physical items require real-world delivery confirmation.
### Technical Requirements: Smart contract Escrow logic + Backend trigger.
### Files to Create / Modify: `escrow.service.ts`
### Step-by-Step Instructions:
1. Define Escrow DB schema.
2. Provide endpoints to approve release of funds.
### Expected Output: Two-step purchase process supported.
### Dependencies: TASK-034
### Validation Criteria: Funds only move if buyer confirms receipt.
### Notes: Advanced feature.

---

## PHASE 8: Frontend

### Task Title: React Router Setup
### Task ID: TASK-036
### Objective: Initialize application navigation.
### Context: SPAs require client-side routing.
### Technical Requirements: `react-router-dom`.
### Files to Create / Modify: `apps/frontend/src/App.tsx`
### Step-by-Step Instructions:
1. Install dependencies.
2. Setup `<BrowserRouter>` and define `/dashboard`, `/marketplace` routes.
### Expected Output: Navigation works.
### Dependencies: TASK-003
### Validation Criteria: Direct URL linking resolves correct blank components.
### Notes: None.

---

### Task Title: Auth Provider Context
### Task ID: TASK-037
### Objective: Manage user global state.
### Context: Token handling across all pages is necessary.
### Technical Requirements: React Context API.
### Files to Create / Modify: `apps/frontend/src/contexts/AuthContext.tsx`
### Step-by-Step Instructions:
1. Create provider holding `user` and `token` state.
2. Methods for `login`, `logout`.
3. Inject Axios interceptor for JWT headers.
### Expected Output: Secure routes can utilize `useAuth()`.
### Dependencies: TASK-036
### Validation Criteria: Token is appended to backend requests.
### Notes: Handle 401 automatic refreshes.

---

### Task Title: Wallet Connection Hook
### Task ID: TASK-038
### Objective: Interface with MetaMask/Browser Wallets.
### Context: Web3 actions require a connected provider.
### Technical Requirements: `ethers` or `wagmi` in React.
### Files to Create / Modify: `useWallet.ts`
### Step-by-Step Instructions:
1. Detect `window.ethereum`.
2. Request accounts and sign messages.
### Expected Output: User wallet address is accessible.
### Dependencies: TASK-037
### Validation Criteria: Approving connection prompt logs the address.
### Notes: Keep it modular.

---

### Task Title: Login UI Page
### Task ID: TASK-039
### Objective: Visual interface for authentication.
### Context: The gate to the platform.
### Technical Requirements: Email + Wallet login buttons.
### Files to Create / Modify: `apps/frontend/src/pages/Login.tsx`
### Step-by-Step Instructions:
1. Build forms using plain CSS or Tailwind.
2. Connect to Auth API.
### Expected Output: Fully functional login portal.
### Dependencies: TASK-037, TASK-038
### Validation Criteria: Successful login redirects to `/dashboard`.
### Notes: Handle error states cleanly.

---

### Task Title: Asset Registration Form
### Task ID: TASK-040
### Objective: Interface to create new assets.
### Context: Collects metadata and uploads IPFS images.
### Technical Requirements: Forms, File input, API integration.
### Files to Create / Modify: `AssetForm.tsx`
### Step-by-Step Instructions:
1. Multi-step form for description and image.
2. Call POST `/assets` API.
### Expected Output: Form creates a real asset in database.
### Dependencies: TASK-016, TASK-020, TASK-039
### Validation Criteria: Submitting form populates dashboard.
### Notes: Validate required fields visually.

---

### Task Title: Asset Dashboard View
### Task ID: TASK-041
### Objective: Display user-owned assets.
### Context: Manage portfolio visually.
### Technical Requirements: Grid layout, detail modlas.
### Files to Create / Modify: `Dashboard.tsx`
### Step-by-Step Instructions:
1. Fetch from GET `/assets` locally.
2. Display properties and status chips (PENDING, VERIFIED).
### Expected Output: Users see their stuff.
### Dependencies: TASK-017, TASK-040
### Validation Criteria: Array renders dynamically.
### Notes: Handle empty states gracefully.

---

### Task Title: Marketplace Gallery
### Task ID: TASK-042
### Objective: The public shopping center.
### Context: Crucial for the business model.
### Technical Requirements: Infinite scroll or pagination.
### Files to Create / Modify: `Marketplace.tsx`
### Step-by-Step Instructions:
1. Fetch GET `/marketplace/active`.
2. Render attractive cards showing ETH price.
### Expected Output: Visually appealing grid of items.
### Dependencies: TASK-033, TASK-041
### Validation Criteria: Displays listings with correct prices.
### Notes: Implement simple text filter.

---

### Task Title: Purchase Modal & Validation
### Task ID: TASK-043
### Objective: Handle the Web3 complexity of buying.
### Context: Users need guidance finalizing transactions.
### Technical Requirements: Ethers.js transaction triggering.
### Files to Create / Modify: `PurchaseModal.tsx`
### Step-by-Step Instructions:
1. Ask MetaMask to send exact ETH to contract `buyItem()`.
2. Show loading spinner until chain confirmation.
### Expected Output: Smooth sales flow.
### Dependencies: TASK-034, TASK-042
### Validation Criteria: Successfully buys the unit on local testnet.
### Notes: Display detailed error if insufficient funds.

---

### Task Title: Verifier Role UI
### Task ID: TASK-044
### Objective: Admin interface to approve items.
### Context: Without this, assets stay PENDING forever.
### Technical Requirements: Admin route protection, table lists.
### Files to Create / Modify: `VerifierDashboard.tsx`
### Step-by-Step Instructions:
1. Display table of verification requests.
2. Approve/Reject buttons that call API.
### Expected Output: Administrators can clear queues.
### Dependencies: TASK-022, TASK-023
### Validation Criteria: Clicking approve hides the row and updates the DB.
### Notes: Hide this page from normal users.

---

## PHASE 9: DevOps

### Task Title: Dockerfile Generation (Backend)
### Task ID: TASK-045
### Objective: Containerize the API.
### Context: Necessary for cloud deployments.
### Technical Requirements: Node alpine image, multi-stage.
### Files to Create / Modify: `apps/backend/Dockerfile`
### Step-by-Step Instructions:
1. Write Dockerfile utilizing pnpm workspaces to build backend.
2. Expose port 3000.
### Expected Output: Working tiny docker container.
### Dependencies: TASK-002
### Validation Criteria: `docker run` successfully serves endpoints locally.
### Notes: Set production env vars.

---

### Task Title: Dockerfile Generation (Frontend)
### Task ID: TASK-046
### Objective: Containerize React.
### Context: Serve via Nginx.
### Technical Requirements: Multi-stage Nginx build.
### Files to Create / Modify: `apps/frontend/Dockerfile`
### Step-by-Step Instructions:
1. Build step using Node.
2. Serve step using Nginx alpine.
### Expected Output: Fast static file server.
### Dependencies: TASK-003
### Validation Criteria: Container loads the SPA natively.
### Notes: Handle history API fallback locally.

---

### Task Title: CI/CD GitHub Actions Setup
### Task ID: TASK-047
### Objective: Automate testing and linting blocks.
### Context: Guarantee code quality on PRs.
### Technical Requirements: `.github/workflows/main.yml`.
### Files to Create / Modify: `.github/workflows/ci.yml`
### Step-by-Step Instructions:
1. Create actions workflow on push/pr to main/develop.
2. Setup node, pnpm install, lint, test, build.
### Expected Output: Green checkmarks on GitHub.
### Dependencies: TASK-045, TASK-046
### Validation Criteria: Action executes properly in git context.
### Notes: None.

---

### Task Title: E2E Testing Framework Setup
### Task ID: TASK-048
### Objective: Ensure critical paths never break.
### Context: High confidence deploys.
### Technical Requirements: Cypress or Playwright.
### Files to Create / Modify: `packages/e2e/`
### Step-by-Step Instructions:
1. Add e2e package to workspace.
2. Write one test validating the login flow.
### Expected Output: Framework ready for expansion.
### Dependencies: TASK-047
### Validation Criteria: Test suite runs automatically in CI.
### Notes: Target localhost for now.

---

## PHASE 10: Optimization & Scaling

### Task Title: Redis Query Caching in Backend
### Task ID: TASK-049
### Objective: Decrease DB load.
### Context: The `/marketplace/active` route gets heavy traffic.
### Technical Requirements: CacheInterceptor in Nest.
### Files to Create / Modify: `marketplace.controller.ts`
### Step-by-Step Instructions:
1. Apply `@UseInterceptors(CacheInterceptor)` to high traffic GET routes.
2. Invalidate cache on new list/buy.
### Expected Output: Response times drop critically.
### Dependencies: TASK-007, TASK-033
### Validation Criteria: Second GET returns cached TTL headers.
### Notes: Use specific cache keys.

---

### Task Title: Image/Media Optimization Service
### Task ID: TASK-050
### Objective: Optimize uploaded IPFS files.
### Context: Heavy images stall UI rendering.
### Technical Requirements: Sharp library.
### Files to Create / Modify: `asset.service.ts`
### Step-by-Step Instructions:
1. Intercept file uploads.
2. Compress with Sharp before pinning to IPFS.
### Expected Output: Images load blazing fast.
### Dependencies: TASK-020
### Validation Criteria: Original 5MB file stored at <300kb retaining visual quality.
### Notes: Output standard WebP.

---

## PHASE 10: Identity & Onboarding

### Task Title: Auth Module Setup & User Entity Updates
### Task ID: AUTH-001
### Objective: Update User entity and setup base Auth module.
### Context: Support KYC, onboarding, and multi-auth types.
### Technical Requirements: TypeORM entity updates.
### Files to Create / Modify: `apps/backend/src/modules/user/entity/user.entity.ts`
### Step-by-Step Instructions:
1. Add `kycStatus`, `onboardingCompleted`, and `googleId` to User entity.
### Expected Output: User schema updated.
### Dependencies: TASK-011
### Validation Criteria: SQL schema reflects new columns.
### Notes: Use Enums for KYC status.

---

### Task Title: Implement AuthSession Entity
### Task ID: AUTH-002
### Objective: Support multi-device sessions.
### Context: Better security and session management.
### Technical Requirements: TypeORM entity, link to User.
### Files to Create / Modify: `apps/backend/src/modules/auth/entity/auth-session.entity.ts`
### Step-by-Step Instructions:
1. Create entity with `refreshToken`, `expiresAt`, `userAgent`, `ip`.
### Expected Output: Session table created.
### Dependencies: AUTH-001
### Validation Criteria: Sessions can be tracked per user.
### Notes: None.

---

## Conclusion
This list acts as the absolute truth for platform execution. AI agents must execute precisely one task per feature branch and follow validation criteria faithfully.

