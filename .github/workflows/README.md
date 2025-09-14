# GitHub Actions CI/CD Workflows

This repository includes three GitHub Actions workflows for comprehensive CI/CD pipeline implementation.

## 📋 Workflows Overview

### 1. **Lint and Format** (`lint-and-format.yml`)
- **Triggers**: Push/PR to `main` and `staging` branches
- **Purpose**: Code quality assurance through linting and formatting checks
- **Features**:
  - ESLint code quality checks
  - Prettier formatting verification
  - Automatic fix suggestions via annotations
  - Clear error messages with remediation steps

### 2. **Tests** (`tests.yml`)
- **Triggers**: Push/PR to `main` and `staging` branches  
- **Purpose**: Automated testing with coverage reporting
- **Features**:
  - Jest test execution with experimental VM modules
  - Coverage report generation and artifacts
  - GitHub step summary with test results
  - PR comments with coverage details
  - Test failure annotations with debugging tips

### 3. **Docker Build and Push** (`docker-build-and-push.yml`)
- **Triggers**: Push to `main` branch or manual dispatch
- **Purpose**: Multi-platform Docker image building and publishing
- **Features**:
  - Multi-stage Dockerfile builds (linux/amd64, linux/arm64)
  - Docker Hub publishing with metadata
  - Comprehensive tagging strategy
  - Build caching for efficiency
  - Detailed build summaries

## 🔧 Required Secrets

To use these workflows, configure the following repository secrets:

### Docker Hub Credentials
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password-or-token
```

### Optional Test Database (if needed)
```
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

## 🏷️ Docker Image Tagging Strategy

The Docker workflow uses the following tagging strategy:

- `latest` - Latest build from main branch
- `main` - Branch-based tag  
- `main-<sha>` - Commit-specific tag
- `prod-YYYYMMDD-HHmmss` - Production timestamp tag

## 📊 Coverage Reports

Test coverage reports are:
- Generated automatically on every test run
- Uploaded as artifacts (30-day retention)
- Commented on pull requests
- Displayed in GitHub step summaries

## 🚀 Usage Examples

### Local Development
```bash
# Run linting
npm run lint
npm run lint:fix

# Run formatting
npm run format:check
npm run format

# Run tests
npm test
```

### Docker Usage
```bash
# Pull and run the latest image
docker pull <username>/acquisitions:latest
docker run -p 3000:3000 <username>/acquisitions:latest
```

## 🔒 Security Features

- **Docker Images**: Non-root user execution (nodejs:1001)
- **Dependencies**: Production-only in final image
- **Base Images**: Alpine Linux for reduced attack surface
- **Multi-stage**: Minimal final image size

## 🐛 Troubleshooting

### Lint/Format Issues
- Check ESLint configuration in `eslint.config.js`
- Verify Prettier settings in `.prettierrc`
- Run fixes locally: `npm run lint:fix && npm run format`

### Test Failures
- Ensure all dependencies are installed
- Check environment variables in test configuration
- Verify Jest configuration in `jest.config.mjs`

### Docker Build Issues
- Verify Dockerfile syntax
- Check Docker Hub credentials
- Ensure base images are accessible
- Review build context and .dockerignore

## 📝 Workflow Files Location
- `.github/workflows/lint-and-format.yml`
- `.github/workflows/tests.yml`
- `.github/workflows/docker-build-and-push.yml`