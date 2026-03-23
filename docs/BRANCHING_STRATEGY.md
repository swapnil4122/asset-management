# Branching Strategy & Git Workflow

## Overview
This document defines the Git workflow, branch types, naming conventions, and merge strategy for the **Asset Management Platform**. It ensures safe, isolated development with proper code review for all AI agents and developers.

## Branch Types

| Branch Type | Purpose | Parent Branch | Merges Into |
|-------------|---------|---------------|-------------|
| **main** | Production-ready code | - | - |
| **develop** | Integration branch for all features | `main` | `main` |
| **feature** | Individual task development | `develop` | `develop` |

## Naming Rules

Feature branches must follow the strict format:
`feature/<module>-<task>`

**Examples:**
- `feature/asset-register`
- `feature/marketplace-buy`
- `feature/auth-wallet-login`
- `feature/db-schema-setup`

## Git Workflow Rules

1. **One Task = One Branch**
   - No branch should contain work for multiple tasks.
   - Refer to `MASTER_TASKS.md` for task boundaries.

2. **No Direct Commits**
   - Direct commits to `main` and `develop` are strictly prohibited.
   - All changes must go through a feature branch.

3. **Pull Requests Required**
   - Every feature branch must be merged via Pull Request (PR).
   - PRs must link to the specific Task ID (e.g., "Resolves TASK-001").

4. **Code Review Required**
   - Automated tests and linters must pass.
   - At least one approval is required before merging into `develop`.

5. **Merge Strategy**
   - Use **Squash and Merge** when merging `feature` into `develop` to keep the history clean.
   - Use **Create a Merge Commit** when merging `develop` into `main` for release traceability.

## Workflow Example

1. **Pick a task**: Review `docs/TASK_PROGRESS.md` and select a Pending task.
2. **Create branch**: 
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/auth-wallet-login
   ```
3. **Develop & Commit**: Commit changes with clear messages referencing the task.
4. **Push**:
   ```bash
   git push -u origin feature/auth-wallet-login
   ```
5. **PR**: Open a PR to `develop`.
6. **Merge**: Once passed, squash and merge to `develop`. Update `TASK_PROGRESS.md` and `BRANCH_LOG.md`.
