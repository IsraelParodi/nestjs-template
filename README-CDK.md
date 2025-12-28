# NestJS Template - Serverless Edition

This project has been converted from a traditional NestJS application to a serverless architecture using **AWS Lambda** and **API Gateway**, orchestrated with **AWS CDK**.

## 🏗️ Architecture

```
                        ┌─────────────────┐
                        │  API Gateway    │
                        │ (REST Endpoint) │
                        └────────┬────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
            ┌───▼──┐        ┌────▼────┐      ┌──▼────┐
            │ Auth │        │  Users  │      │Others │
            │Lambda│        │ Lambda  │      │Lambda │
            └───┬──┘        └────┬────┘      └──┬────┘
                │                │              │
                └────────────────┼──────────────┘
                                 │
                        ┌────────▼────────┐
                        │  RDS PostgreSQL │
                        │   (Private VPC) │
                        └─────────────────┘
```

## ✨ Key Features

- ✅ **Serverless**: No server management, auto-scaling
- ✅ **Cost-Effective**: Pay only for what you use (~$60-90/month baseline)
- ✅ **Infrastructure as Code**: All AWS resources defined in CDK
- ✅ **Easy Deployment**: One command deployment and updates
- ✅ **Monitoring**: Built-in CloudWatch integration
- ✅ **Database**: Managed RDS PostgreSQL instance
- ✅ **API Management**: REST API with API Gateway

## 📁 Project Structure

```
nestjs-template/
├── cdk/                          # AWS CDK Infrastructure
│   ├── bin/
│   │   └── app.ts               # CDK app entry point
│   ├── lib/
│   │   └── nestjs-template-stack.ts  # CDK stack definition
│   ├── cdk.json                 # CDK configuration
│   └── tsconfig.json            # TypeScript config
│
├── src/
│   ├── lambda/                  # Lambda handlers (NEW)
│   │   ├── handlers/
│   │   │   ├── authentication/
│   │   │   │   ├── sign-up.ts
│   │   │   │   ├── sign-in.ts
│   │   │   │   ├── refresh-token.ts
│   │   │   │   ├── forgot-password.ts
│   │   │   │   └── reset-password.ts
│   │   │   ├── users/
│   │   │   │   ├── create-user.ts
│   │   │   │   ├── list-users.ts
│   │   │   │   ├── get-user.ts
│   │   │   │   ├── update-user.ts
│   │   │   │   ├── delete-user.ts
│   │   │   │   └── delete-many-users.ts
│   │   │   ├── quotations/
│   │   │   ├── complains/
│   │   │   ├── contact-us/
│   │   │   ├── localities/
│   │   │   ├── lov/
│   │   │   └── roles/
│   │   └── utils/
│   │       └── lambda-response.ts     # Response formatting
│   │
│   ├── iam/                     # Identity & Access Management (REUSED)
│   ├── users/                   # User management (REUSED)
│   ├── quotations/              # Quotations (REUSED)
│   ├── complains/               # Complains (REUSED)
│   ├── contact-us/              # Contact Us (REUSED)
│   ├── localities/              # Localities (REUSED)
│   ├── lov/                     # List of Values (REUSED)
│   ├── common/                  # Common utilities (REUSED)
│   ├── app.module.ts            # (Not used in Lambda, kept for reference)
│   └── main.ts                  # (Not used in Lambda, kept for reference)
│
├── migrations/                  # Database migrations
├── test/                        # Test files
├── CDK_ARCHITECTURE.md          # Architecture documentation
├── CDK_DEPLOYMENT_GUIDE.md      # Detailed deployment guide
├── MIGRATION_GUIDE.md           # Migration instructions
├── QUICK_START.md               # Quick start guide
├── package.json                 # Dependencies & scripts
└── tsconfig.json                # TypeScript config
```

## 🚀 Quick Start

### 1. Prerequisites

- Node.js 20+
- AWS Account
- AWS CLI configured
- AWS CDK CLI installed

```bash
# Install CDK CLI globally
npm install -g aws-cdk
```

### 2. Installation & Deployment

```bash
# Install dependencies
npm install

# Bootstrap CDK (first time only)
npm run cdk:bootstrap

# Build and deploy
npm run cdk:deploy
```

### 3. Test the API

```bash
# Get API endpoint from deployment output
# Then test:
curl -X POST https://<api-id>.execute-api.us-east-1.amazonaws.com/prod/authentication/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "John",
    "lastname": "Doe",
    "country": "US"
  }'
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup
- **[CDK_DEPLOYMENT_GUIDE.md](./CDK_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[CDK_ARCHITECTURE.md](./CDK_ARCHITECTURE.md)** - Architecture overview
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - How to migrate NestJS code

## 🛠️ Common Commands

```bash
# Development
npm run build                   # Build NestJS and Lambda handlers
npm run start:dev              # Run NestJS locally (old way)

# CDK Commands
npm run cdk:synth              # Synthesize CDK stack
npm run cdk:deploy             # Deploy to dev
npm run cdk:deploy:prod        # Deploy to production
npm run cdk:destroy            # Destroy stack
npm run cdk:diff               # Show differences
npm run cdk:watch              # Watch for changes

# Database
npm run migration:run          # Run migrations
npm run migration:generate -- --name=MyMigration  # Generate migration
npm run migration:revert       # Revert migration

# Testing
npm run test                   # Run unit tests
npm run test:e2e               # Run e2e tests
npm run test:cov               # Run with coverage
```

## 🔄 Converting Your Code

### Controller → Lambda Handler

**Before (NestJS)**:

```typescript
@Post('sign-up')
signUp(@Body() dto: SignUpDto) {
  return this.signUpUseCase.execute(command);
}
```

**After (Lambda)**:

```typescript
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<SignUpRequestDto>(event.body);
      return this.signUpUseCase.execute(command);
    },
    event,
    context,
  );
}
```

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for complete examples.

## 📊 API Endpoints

### Authentication

- `POST /authentication/sign-up`
- `POST /authentication/sign-in`
- `POST /authentication/refresh-tokens`
- `POST /authentication/forgot-password`
- `POST /authentication/reset-password`

### Users

- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/{id}` - Get user
- `PATCH /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `POST /users/delete` - Delete multiple

### Quotations, Complains, Contact Us, Localities, LOV, Roles

See [CDK_DEPLOYMENT_GUIDE.md](./CDK_DEPLOYMENT_GUIDE.md) for full API documentation.

## 💰 Cost Breakdown

**Monthly Estimate** (1M API requests):

| Service       | Cost        |
| ------------- | ----------- |
| Lambda        | $20         |
| API Gateway   | $3.50       |
| RDS           | $30-50      |
| Data Transfer | $5-10       |
| CloudWatch    | $5-10       |
| **Total**     | **~$60-90** |

_Costs scale linearly with usage. Production deployments may be higher._

## 🔐 Security

- ✅ Lambda functions run in private VPC
- ✅ RDS in private subnets
- ✅ Security groups restrict traffic
- ✅ Credentials in Secrets Manager
- ✅ API Gateway for access control
- ✅ JWT token support

## 📈 Monitoring

```bash
# View Lambda logs
aws logs tail /aws/lambda/nestjs-template-dev-stack-SignUpHandler -f

# View metrics in CloudWatch
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

## ⚡ Performance

- **Cold start**: ~1-5 seconds
- **Warm invocation**: ~100-300ms
- **Lambda timeout**: 30 seconds
- **Lambda memory**: 512MB (configurable)

## 🐛 Troubleshooting

### Issue: "Handler not found"

- Check Lambda handler file exists: `dist/src/lambda/handlers/<path>.js`
- Verify handler function is exported

### Issue: "Cannot connect to database"

- Check RDS endpoint in environment
- Verify security group allows port 5432
- Ensure Lambda is in same VPC as RDS

### Issue: "502 Bad Gateway"

- Check Lambda logs in CloudWatch
- Verify response format (must be APIGatewayProxyResult)
- Check Lambda timeout settings

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for more troubleshooting.

## 🔄 Updating & Redeployment

```bash
# Make code changes
# Edit files in src/lambda/handlers/

# Build and deploy
npm run cdk:deploy

# For production
npm run cdk:deploy:prod
```

## 🚀 Production Deployment

```bash
# 1. Build with production optimizations
npm run build

# 2. Deploy to production stack
npm run cdk:deploy:prod

# 3. Run database migrations
npm run migration:run:prod

# 4. Monitor in CloudWatch
aws logs tail /aws/lambda/nestjs-template-prod-stack-* -f
```

## 📝 What's Different

| Aspect           | Before         | After          |
| ---------------- | -------------- | -------------- |
| Server           | Express/NestJS | AWS Lambda     |
| Request Handling | Controller     | Lambda Handler |
| Routing          | Express Router | API Gateway    |
| Database         | Local/RDS      | RDS in VPC     |
| Deployment       | Docker/Manual  | CDK (IaC)      |
| Scaling          | Manual         | Auto           |
| Monitoring       | Custom         | CloudWatch     |
| Cost             | Fixed          | Pay-per-use    |

## 📚 Additional Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [TypeORM Documentation](https://typeorm.io/)

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Test locally with `npm test`
4. Deploy to dev with `npm run cdk:deploy`
5. Create pull request

## 📄 License

UNLICENSED

## 🆘 Support

For issues and questions:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
3. Check [CDK_DEPLOYMENT_GUIDE.md](./CDK_DEPLOYMENT_GUIDE.md)
4. Review AWS documentation

---

**Next Steps**:

1. Run `npm run cdk:deploy` to deploy infrastructure
2. Complete TODO comments in Lambda handlers
3. Implement JWT authentication
4. Setup CI/CD pipeline
5. Configure custom domain
