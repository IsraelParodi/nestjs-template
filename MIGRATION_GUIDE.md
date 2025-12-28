# Migration Guide: NestJS to AWS Lambda & CDK

This guide explains how to migrate your existing NestJS code to work with the new Lambda-based architecture using AWS CDK.

## Overview

Your NestJS application has been restructured into:

1. **Lambda Functions**: Serverless compute replacing NestJS controllers
2. **API Gateway**: REST API routing replacing Express routing
3. **AWS CDK**: Infrastructure as Code replacing Docker Compose
4. **RDS**: Database instance replacing local PostgreSQL

## Migration Steps

### Step 1: Install Dependencies

```bash
npm install
```

This installs both NestJS and AWS CDK dependencies.

### Step 2: Understand the New Structure

#### Old Structure (NestJS)

```
src/
├── app.module.ts          # Main module
├── main.ts                # Express server entry
├── iam/
│   ├── presenters/
│   │   └── http/
│   │       └── authentication.controller.ts  # HTTP controller
│   └── application/
│       └── ports/
│           └── inbound/   # Use cases
└── users/
    ├── presentation/
    │   └── http/
    │       └── users.controller.ts
    └── application/
        └── ports/
            └── inbound/
```

#### New Structure (Lambda + CDK)

```
cdk/                               # CDK Infrastructure
├── lib/
│   └── nestjs-template-stack.ts  # Stack definition
└── bin/
    └── app.ts                    # CDK app entry

src/
├── lambda/                       # Lambda handlers
│   ├── handlers/
│   │   ├── authentication/       # Auth handlers
│   │   ├── users/                # User handlers
│   │   └── ...
│   └── utils/
│       └── lambda-response.ts    # Shared utilities
├── iam/
│   └── application/
│       └── ports/
│           └── inbound/          # Use cases (reused)
└── users/
    └── application/
        └── ports/
            └── inbound/          # Use cases (reused)
```

### Step 3: Adapt Use Cases for Lambda

Your existing use cases remain mostly unchanged. However, they need to be adapted to work in Lambda environment.

#### Before (NestJS)

```typescript
// users/application/ports/inbound/create-user.use-case.ts
export interface CreateUserUseCase {
  execute(command: CreateUserCommand): Promise<User>;
}

// Used in controller
@Post()
async create(@Body() dto: CreateUserDto) {
  const command = { ...dto, createdBy: activeUser.sub };
  return this.createUserUseCase.execute(command);
}
```

#### After (Lambda)

```typescript
// src/lambda/handlers/users/create-user.ts
import { CreateUserUseCase } from '@users/application/ports/inbound/create-user.use-case';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      // Parse input
      const body = parseJsonBody<CreateUserRequestDto>(event.body);

      // Extract user from JWT (from Authorizer or parse token)
      const activeUser = event.requestContext?.authorizer?.claims;

      // Create command
      const command: CreateUserCommand = {
        ...body,
        createdBy: activeUser.sub,
      };

      // Execute use case (same as before)
      const user = await createUserUseCase.execute(command);

      // Return result (framework handles formatting)
      return user;
    },
    event,
    context,
  );
}
```

### Step 4: Migrate Controllers to Lambda Handlers

For each NestJS controller, create corresponding Lambda handlers.

#### Example: AuthenticationController

**Original NestJS Controller**:

```typescript
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.signUpUseCase.execute({
      email: dto.email,
      password: dto.password,
      // ...
    });
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    return this.signInUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
  }
}
```

**New Lambda Handlers**:

`src/lambda/handlers/authentication/sign-up.ts`:

```typescript
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<SignUpRequestDto>(event.body);

      // TODO: Inject SignUpUseCase
      // For now, import and use directly
      const command = {
        email: body.email,
        password: body.password,
        name: body.name,
        lastname: body.lastname,
        businessTaxId: body.businessTaxId,
        legalName: body.legalName,
        country: body.country,
      };

      // const result = await signUpUseCase.execute(command);
      // return result;

      // Placeholder
      return {
        id: '1',
        email: body.email,
        name: body.name,
      };
    },
    event,
    context,
  );
}
```

`src/lambda/handlers/authentication/sign-in.ts`:

```typescript
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<SignInRequestDto>(event.body);

      // TODO: Inject and execute SignInUseCase
      const result = {
        accessToken: 'token_placeholder',
        refreshToken: 'refresh_placeholder',
      };

      return result;
    },
    event,
    context,
  );
}
```

### Step 5: Setup Infrastructure with CDK

#### Configure AWS Credentials

```bash
# Option 1: Using AWS CLI
aws configure

# Option 2: Using environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1
```

#### Bootstrap CDK (First time only)

```bash
npm run cdk:bootstrap
```

#### Synthesize CDK Stack

```bash
npm run cdk:synth
```

This generates CloudFormation templates without deploying.

#### Deploy Stack

```bash
npm run cdk:deploy
```

This will:

1. Build your Lambda functions
2. Create AWS resources (VPC, Lambda, API Gateway, RDS)
3. Deploy everything to AWS
4. Output the API Gateway URL

### Step 6: Implement Dependency Injection in Lambda

Lambda functions need access to use cases. Set up dependency injection:

#### Option 1: Simple Factory (Recommended for start)

```typescript
// src/lambda/utils/di-container.ts
import { CreateUserUseCase } from '@users/application/ports/inbound/create-user.use-case';
import { CreateUserService } from '@users/application/ports/inbound/create-user.use-case';

class DIContainer {
  private static instance: DIContainer;
  private useCases: Map<string, any> = new Map();

  private constructor() {
    this.initialize();
  }

  private initialize() {
    // Register use cases
    // this.useCases.set('CreateUserUseCase', new CreateUserService(...));
    // this.useCases.set('SignUpUseCase', new SignUpService(...));
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  getUseCase<T>(name: string): T {
    return this.useCases.get(name);
  }
}

export const diContainer = DIContainer.getInstance();
```

#### Option 2: AWS Lambda Extensions

Use Lambda Extensions for external DI frameworks (Advanced).

### Step 7: Update Request/Response Handling

#### Request Parsing

```typescript
// Get JSON body
const body = parseJsonBody<MyDto>(event.body);

// Get path parameter
const id = getPathParameter(event, 'id');

// Get query parameter
const page = getQueryParameter(event, 'page');
```

#### Response Formatting

All responses are automatically formatted using `LambdaResponseFormatter`:

```typescript
// Success response
{
  "succeeded": true,
  "message": "User created successfully",
  "payload": {
    "id": 1,
    "email": "user@example.com"
  }
}

// Error response
{
  "succeeded": false,
  "message": "Validation failed",
  "error": { "field": "email" },
  "payload": null
}
```

### Step 8: Implement Authentication

#### Option 1: API Gateway Authorizer (Recommended)

Create a Lambda authorizer that validates JWT tokens:

```typescript
// src/lambda/authorizers/jwt-authorizer.ts
export async function handler(event: any) {
  const token = event.authorizationToken;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      principalId: decoded.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
      context: {
        claims: decoded,
      },
    };
  } catch (error) {
    throw new Error('Unauthorized');
  }
}
```

Then attach to API Gateway:

```typescript
// In CDK stack
const authorizer = new apigateway.TokenAuthorizer(this, 'JwtAuthorizer', {
  handler: authorizerLambda,
});

resource.addMethod('GET', integration, {
  authorizer,
});
```

#### Option 2: Manual Validation in Handlers

```typescript
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      // Extract token from header
      const token = event.headers['Authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new Error('Missing authorization token');
      }

      // Validate token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Use decoded user info
      const userId = decoded.sub;
      // ...
    },
    event,
    context,
  );
}
```

### Step 9: Database Connectivity

Lambda functions connect to RDS automatically through VPC:

```typescript
// src/lambda/utils/database.ts
import { createConnection } from 'typeorm';
import { DataSource } from 'typeorm';

let dataSource: DataSource;

export async function getDatabase(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
      /* your entities */
    ],
    synchronize: false,
  });

  await dataSource.initialize();
  return dataSource;
}
```

### Step 10: Deploy to Production

```bash
# Build production code
npm run build

# Deploy to production
npm run cdk:deploy:prod

# Run migrations on production database
npm run migration:run:prod
```

## Troubleshooting

### Lambda Handler Not Found

**Error**: "Handler not found"

**Solution**:

- Ensure handler file exists: `dist/src/lambda/handlers/<path>.js`
- Ensure handler function is exported: `export async function handler(...)`
- Check CDK stack references correct path

### Cannot Connect to Database

**Error**: "ECONNREFUSED" or timeout

**Solution**:

- Check security group allows port 5432 from Lambda
- Verify RDS endpoint in environment variable
- Check database credentials
- Ensure Lambda is in same VPC as RDS

### 502 Bad Gateway

**Error**: API Gateway returns 502

**Solution**:

- Check Lambda logs in CloudWatch
- Verify response format matches APIGatewayProxyResult
- Check Lambda timeout (increase if needed)
- Verify dependencies are bundled

### Use Case Not Defined

**Error**: "UseCase is not a constructor"

**Solution**:

- Set up dependency injection in Lambda
- Import use case implementations
- Create instances before using

## Performance Optimization

### Cold Starts

Lambda functions experience cold starts on first invocation:

**Mitigation**:

```bash
# Keep Lambda warm with scheduled invocation
# Add to CDK stack

const rule = new events.Rule(this, 'WarmUpRule', {
  schedule: events.Schedule.rate(Duration.minutes(5)),
});

rule.addTarget(new targets.LambdaFunction(lambdaFunction));
```

### Memory Configuration

Increase memory for better performance (currently 512 MB):

```typescript
// In CDK stack
memorySize: 1024, // Increase from 512
```

### Concurrency

Set reserved concurrency if needed:

```typescript
lambdaFunction.reservedConcurrentExecutions = 100;
```

## Testing Lambda Functions Locally

```bash
# Install SAM CLI
brew install aws-sam-cli

# Start local Lambda environment
sam local start-api

# Invoke specific function
sam local invoke CreateUserHandler --event event.json
```

## Next Steps

1. **Complete TODO comments** in Lambda handlers with actual use case implementations
2. **Implement JWT Authorizer** for API Gateway
3. **Add CloudWatch Alarms** for monitoring
4. **Setup CI/CD Pipeline** for automated deployments
5. **Optimize costs** based on usage patterns
6. **Add custom domain** to API Gateway
7. **Implement API versioning** strategy
8. **Setup observability** with X-Ray tracing

## Rollback Procedure

If something goes wrong:

```bash
# View previous deployments
cdk diff

# Destroy current stack
npm run cdk:destroy

# Re-deploy previous version (if code is committed)
git checkout <previous-commit>
npm run build
npm run cdk:deploy
```

## Support

Refer to:

- [CDK_DEPLOYMENT_GUIDE.md](./CDK_DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [CDK_ARCHITECTURE.md](./CDK_ARCHITECTURE.md) - Architecture overview
- AWS CDK Documentation: https://docs.aws.amazon.com/cdk/
- AWS Lambda Documentation: https://docs.aws.amazon.com/lambda/
