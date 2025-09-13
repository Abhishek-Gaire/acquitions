# Acquisitions API

A Node.js Express API with authentication features, dockerized for both development and production environments.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Git

### Development Setup (Using Neon Local)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhishek-Gaire/acquitions.git
   cd acquitions
   ```

2. **Start the development environment**
   ```bash
   npm run docker:dev
   ```

   This will:
   - Start Neon Local proxy container
   - Build and start your application in development mode
   - Enable hot reload for code changes
   - Connect to local PostgreSQL database

3. **Access the application**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/health
   - Database: Direct connection via `localhost:5432`

4. **Run database migrations** (if needed)
   ```bash
   npm run docker:dev:migrate
   ```

### Production Setup (Using Neon Cloud)

1. **Set environment variables**
   ```bash
   export DATABASE_URL="postgresql://neondb_owner:password@ep-your-endpoint.aws.neon.tech/neondb?sslmode=require"
   export JWT_SECRET="your-production-jwt-secret"
   ```

2. **Start the production environment**
   ```bash
   npm run docker:prod
   ```

3. **Run database migrations** (if needed)
   ```bash
   npm run docker:prod:migrate
   ```

## 📁 Project Structure

```
├── src/
│   ├── config/          # Database and logger configuration
│   ├── controllers/     # Request handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── validations/     # Input validation schemas
│   ├── app.js           # Express app setup
│   ├── server.js        # Server startup
│   └── index.js         # Entry point
├── drizzle/             # Database migrations
├── logs/                # Application logs
├── Dockerfile           # Multi-stage Docker build
├── docker-compose.dev.yml   # Development environment
├── docker-compose.prod.yml  # Production environment
├── .env.development     # Development configuration
└── .env.production      # Production configuration template
```

## 🐳 Docker Architecture

### Development Environment

```mermaid
graph TB
    A[Developer] --> B[docker-compose.dev.yml]
    B --> C[Neon Local Container]
    B --> D[App Container - Dev]
    C --> E[PostgreSQL Database]
    D --> C
    F[Source Code] --> D
    D --> G[Hot Reload]
```

**Features:**
- **Neon Local**: Local PostgreSQL with Neon branching features
- **Hot Reload**: Source code changes trigger app restart
- **Debug Logs**: Enhanced logging for development
- **Volume Mounts**: Live code editing without rebuilds

### Production Environment

```mermaid
graph TB
    A[Production] --> B[docker-compose.prod.yml]
    B --> C[App Container - Prod]
    C --> D[Neon Cloud Database]
    E[Environment Variables] --> C
    C --> F[Health Checks]
    C --> G[Log Files]
```

**Features:**
- **Neon Cloud**: Serverless PostgreSQL database
- **Security**: Non-root user, read-only filesystem
- **Health Checks**: Automated container health monitoring
- **Environment Injection**: Secrets via environment variables

## 🛠 Available Scripts

### Development
```bash
# Start development environment with Neon Local
npm run docker:dev

# Stop development environment
npm run docker:dev:down

# View application logs
npm run docker:dev:logs

# Run database migrations in development
npm run docker:dev:migrate

# Build development Docker image only
npm run docker:build:dev
```

### Production
```bash
# Start production environment (detached)
npm run docker:prod

# Stop production environment
npm run docker:prod:down

# View application logs
npm run docker:prod:logs

# Run database migrations in production
npm run docker:prod:migrate

# Build production Docker image only
npm run docker:build:prod
```

### Standard Scripts
```bash
# Run locally without Docker
npm run dev

# Run in production mode locally
npm start

# Database operations
npm run db:generate    # Generate new migrations
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio
```

## 🔧 Configuration

### Environment Variables

#### Development (`.env.development`)
```bash
# Automatically used by docker-compose.dev.yml
DATABASE_URL=postgresql://postgres:password@neon-local:5432/neondb
NODE_ENV=development
LOG_LEVEL=debug
JWT_SECRET=development-secret-change-in-production
```

#### Production (Environment Variables)
```bash
# Must be set in your deployment environment
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secure-production-secret
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
```

### Database URLs

#### Development (Neon Local)
- **Internal**: `postgresql://postgres:password@neon-local:5432/neondb`
- **External**: `postgresql://postgres:password@localhost:5432/neondb`

#### Production (Neon Cloud)
- Format: `postgresql://user:password@endpoint.aws.neon.tech/dbname?sslmode=require`
- Example: `postgresql://neondb_owner:xxx@ep-sweet-morning-a1by3xpu-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/sign-up` - User registration
- `POST /api/v1/auth/sign-in` - User login
- `POST /api/v1/auth/sign-out` - User logout

### Utility
- `GET /health` - Health check endpoint
- `GET /` - Basic API info

### Example Requests

#### Sign Up
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-up \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

#### Sign In
```bash
curl -X POST http://localhost:3000/api/v1/auth/sign-in \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Authentication**: Secure token-based auth
- **Secure Cookies**: httpOnly, sameSite, secure in production
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing
- **Input Validation**: Zod schema validation
- **Non-root User**: Production containers run as non-root
- **Read-only Filesystem**: Enhanced container security

## 🏗 Deployment

### Docker Swarm
```bash
# Deploy to Docker Swarm
docker stack deploy -c docker-compose.prod.yml acquisitions
```

### Kubernetes
```bash
# Convert docker-compose to k8s manifests using kompose
kompose convert -f docker-compose.prod.yml
kubectl apply -f .
```

### Cloud Platforms

#### Railway
```bash
railway up --detach
```

#### Render
- Connect your GitHub repository
- Set environment variables in Render dashboard
- Deploy using `docker-compose.prod.yml`

#### AWS ECS/Fargate
- Build and push image to ECR
- Create ECS task definition
- Deploy as ECS service

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if Neon Local is running
docker ps | grep neon-local

# Check database connectivity
docker exec -it neon-local pg_isready -U postgres

# View database logs
docker logs neon-local
```

#### Application Issues
```bash
# Check application logs
npm run docker:dev:logs

# Restart development environment
npm run docker:dev:down && npm run docker:dev

# Rebuild containers
docker compose -f docker-compose.dev.yml up --build --force-recreate
```

#### Production Issues
```bash
# Check production logs
npm run docker:prod:logs

# Verify environment variables
docker exec acquisitions-prod env | grep DATABASE_URL

# Health check
curl http://localhost:3000/health
```

### Debugging

#### Access Container Shell
```bash
# Development
docker exec -it acquisitions-dev sh

# Production
docker exec -it acquisitions-prod sh
```

#### Database Access
```bash
# Connect to Neon Local
docker exec -it neon-local psql -U postgres -d neondb

# View database tables
\\dt

# Check migrations
SELECT * FROM __drizzle_migrations;
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test with `npm run docker:dev`
4. Ensure production build works: `npm run docker:build:prod`
5. Submit a pull request

## 📝 License

ISC License

## 🆘 Support

- GitHub Issues: [Create an issue](https://github.com/Abhishek-Gaire/acquitions/issues)
- Neon Database: [Neon Documentation](https://neon.com/docs)
- Docker: [Docker Documentation](https://docs.docker.com)