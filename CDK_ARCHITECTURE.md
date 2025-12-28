# CDK Architecture Guide

## Overview

This document explains the architecture of the CDK-based deployment of your NestJS application as serverless Lambda functions orchestrated through API Gateway.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Internet Gateway                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway                              │
│  - REST API Endpoint                                        │
│  - Route Mapping (POST /users → Lambda)                     │
│  - Request/Response Transformation                          │
│  - Logging & Metrics                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
    ┌────────┐     ┌────────┐      ┌────────┐    ┌────────┐
    │ Auth   │     │ Users  │      │Quotations   │Complains
    │Lambda  │     │Lambda  │      │Lambda │    │Lambda  │
    └───┬────┘     └───┬────┘      └───┬───┘    └────┬───┘
        │              │               │             │
        └──────────────┼───────────────┴─────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │           VPC (10.0.0.0/16)      │
        │                                  │
        │  ┌──────────────────────────┐   │
        │  │  Public Subnet           │   │
        │  │  (NAT Gateway, IGW)      │   │
        │  └──────────────────────────┘   │
        │                                  │
        │  ┌──────────────────────────┐   │
        │  │  Private Subnet (AZ 1)   │   │
        │  │  - Lambda Functions      │   │
        │  └──────────────────────────┘   │
        │                                  │
        │  ┌──────────────────────────┐   │
        │  │  Private Subnet (AZ 2)   │   │
        │  │  - Lambda Functions      │   │
        │  │  - RDS (Primary/Replica) │   │
        │  └──────────────────────────┘   │
        │                                  │
        └──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────┐
        │  RDS PostgreSQL Database         │
        │  - Connection pooling            │
        │  - Automated backups             │
        │  - Multi-AZ deployment           │
        └──────────────────────────────────┘
```

## Components

### 1. API Gateway

**Role**: Public entry point for all HTTP requests

**Features**:

- RESTful API with resource-based routing
- Automatic request/response transformation
- CloudWatch integration for logging and metrics
- Rate limiting and throttling
- CORS configuration support

**Routes**:

```
POST   /authentication/sign-up
POST   /authentication/sign-in
POST   /authentication/refresh-tokens
POST   /authentication/forgot-password
POST   /authentication/reset-password

GET    /users
POST   /users
GET    /users/{id}
PATCH  /users/{id}
DELETE /users/{id}
POST   /users/delete

GET    /quotations
POST   /quotations
GET    /quotations/{id}
PATCH  /quotations/{id}
DELETE /quotations/{id}
POST   /quotations/delete

GET    /complains
POST   /complains
GET    /complains/{id}
PATCH  /complains/{id}
DELETE /complains/{id}

GET    /contact-us
POST   /contact-us
GET    /contact-us/{id}
DELETE /contact-us/{id}

GET    /localities
GET    /localities/{id}

GET    /lov
GET    /lov/{id}

GET    /roles
GET    /roles/{id}
```

### 2. Lambda Functions

**Role**: Business logic execution

**Structure**:

- Each controller endpoint maps to a Lambda handler
- Handlers are organized by module (authentication, users, etc.)
- Shared utilities in `src/lambda/utils/` for response formatting

**Execution Flow**:

```
API Gateway Request
        │
        ▼
Lambda Handler Entry Point
        │
        ├─► Parse & Validate Request Body
        ├─► Extract Path/Query Parameters
        ├─► Extract JWT Token (if required)
        │
        ▼
Business Logic (Use Cases)
        │
        ├─► Database Operations (TypeORM)
        ├─► External Service Calls (Twilio, SendGrid)
        ├─► Caching & Validation
        │
        ▼
Format Response
        │
        ├─► Success Response (200, 201, etc.)
        └─► Error Response (400, 401, 500, etc.)
        │
        ▼
Return to API Gateway
```

**Handler Structure**:

```typescript
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { withErrorHandling, parseJsonBody } from '../../utils/lambda-response';

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      // Parse input
      const body = parseJsonBody<RequestDto>(event.body);

      // Execute business logic
      const result = await useCase.execute(body);

      // Return result (automatically formatted)
      return result;
    },
    event,
    context,
  );
}
```

### 3. VPC & Networking

**Components**:

- **VPC (10.0.0.0/16)**: Isolated network environment
- **Public Subnets**: NAT Gateway and Internet Gateway
- **Private Subnets**: Lambda functions and RDS (multi-AZ)
- **Security Groups**: Control traffic between resources

**Security Group Rules**:

```
Lambda Security Group:
  - Outbound: Allow all (for external services, RDS)
  - Inbound: Blocked (only invoked via API Gateway)

RDS Security Group:
  - Inbound: Allow port 5432 from Lambda SG
  - Outbound: Blocked
```

### 4. RDS Database

**Configuration**:

- **Engine**: PostgreSQL 15
- **Instance Type**: t3.micro (Free tier eligible)
- **Storage**: 20 GB GP2
- **Multi-AZ**: Disabled (can be enabled for production)
- **Backups**: Automated daily backups
- **Subnet**: Private subnet

**Connection**:

```
Lambda Functions
      │
      │ TCP:5432
      ▼
RDS Security Group
      │
      ▼
PostgreSQL Instance
```

## Data Flow Examples

### Example 1: User Sign-Up

```
1. Client sends POST /authentication/sign-up
   {
     "email": "user@example.com",
     "password": "password123",
     "name": "John",
     "lastname": "Doe"
   }

2. API Gateway routes to SignUp Lambda

3. Lambda:
   - Validates input (email format, password strength)
   - Hashes password using bcrypt
   - Inserts user into RDS
   - Sends verification email via SendGrid
   - Returns user data

4. Response:
   {
     "succeeded": true,
     "message": "User created successfully",
     "payload": {
       "id": 1,
       "email": "user@example.com",
       "name": "John",
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
   }
```

### Example 2: User List with Pagination

```
1. Client sends GET /users?page=1&limit=10&name=John

2. API Gateway routes to ListUsers Lambda

3. Lambda:
   - Validates authentication token
   - Parses query parameters
   - Executes ListUsersUseCase
   - Queries RDS with filters and pagination
   - Returns paginated result

4. Response:
   {
     "succeeded": true,
     "message": "Request successful",
     "payload": {
       "data": [...],
       "page": 1,
       "limit": 10,
       "total": 45,
       "totalPages": 5
     }
   }
```

## Request/Response Format

### Standard Response Structure

```typescript
interface LambdaResponse<T> {
  succeeded: boolean; // Success/failure indicator
  message: string; // Human-readable message
  timestamp: string; // ISO timestamp
  error?: any; // Error details (if failed)
  path?: string; // Request path (if failed)
  payload: T | null; // Response data
}
```

### Error Handling

```typescript
// Generic error
{
  "succeeded": false,
  "message": "Request failed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": {
    "message": "User not found",
    "code": "USER_NOT_FOUND"
  },
  "path": "/users/999",
  "payload": null
}

// Validation error
{
  "succeeded": false,
  "message": "Validation failed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "error": {
    "message": "Invalid email format",
    "field": "email"
  },
  "payload": null
}
```

## Lambda Performance Considerations

### Cold Starts

**Issue**: First invocation takes longer
**Mitigation**:

- Keep Lambda warm with scheduled invocations
- Use Lambda SnapStart (Java only)
- Optimize dependencies (tree-shake unused code)
- Use Lambda Layers for shared code

### Concurrency

**Configuration**:

- Reserved concurrency: Not set (uses account default)
- Provisioned concurrency: Not configured
- Burst limit: 3000 concurrent executions (default)

**Scaling**:

- Lambda automatically scales based on request volume
- No manual scaling needed

### Timeout

**Current Setting**: 30 seconds
**Considerations**:

- Increase for long-running operations
- RDS queries should complete within timeout
- Increase memory if hitting timeout (more CPU)

### Memory

**Current Setting**: 512 MB
**Considerations**:

- Increase for compute-intensive operations
- More memory = more CPU (proportional)
- Cost increases with memory

## Security Architecture

### Authentication Flow

```
1. User signs in with email/password
   │
   ▼
2. SignIn Lambda validates credentials
   │
   ▼
3. Generate JWT tokens (access + refresh)
   │
   ├─ Access Token (short-lived, ~1 hour)
   └─ Refresh Token (long-lived, ~7 days)
   │
   ▼
4. Return tokens to client
   │
   ▼
5. Client includes access token in Authorization header
   │
   ▼
6. API Gateway validates token (or Lambda validates)
   │
   ├─ Valid: Process request
   └─ Invalid: Return 401 Unauthorized
```

### Database Security

- **Encryption at rest**: Can be enabled (additional cost)
- **Encryption in transit**: SSL/TLS connections
- **Network isolation**: Private subnets, security groups
- **Credentials**: Stored in Secrets Manager
- **Backups**: Automated daily, encrypted

## Deployment Stages

### Development

- Stack name: `nestjs-template-dev-stack`
- Lambda memory: 512 MB
- RDS: db.t3.micro
- Multi-AZ: Disabled
- Backups: 7 days retention

### Staging

- Stack name: `nestjs-template-stage-stack`
- Lambda memory: 1024 MB
- RDS: db.t3.small
- Multi-AZ: Enabled
- Backups: 30 days retention

### Production

- Stack name: `nestjs-template-prod-stack`
- Lambda memory: 2048 MB
- RDS: db.t3.large with read replicas
- Multi-AZ: Enabled
- Backups: 60 days retention
- Reserved concurrency: 100+

## Cost Breakdown (Estimated Monthly)

**Assumptions**: 1M API requests/month, 50K database queries/month

| Service         | Cost                                 |
| --------------- | ------------------------------------ |
| Lambda          | $20 (1M invocations × $0.20/million) |
| API Gateway     | $3.50 (1M requests × $3.50/million)  |
| RDS             | $30-50 (t3.micro compute + storage)  |
| Data Transfer   | $5-10 (varies by region)             |
| CloudWatch Logs | $5-10 (log retention)                |
| **Total**       | **$63-123/month**                    |

_Note: Costs will be higher in production with multi-AZ and larger instances_

## Monitoring & Observability

### CloudWatch Metrics

**Lambda**:

- Invocations
- Duration
- Errors
- Throttles
- Concurrent executions

**API Gateway**:

- Requests
- 4xx/5xx errors
- Latency
- Cache hit rate

**RDS**:

- CPU utilization
- Database connections
- Read/write latency
- Storage used

### CloudWatch Logs

**Log Groups**:

- `/aws/lambda/nestjs-template-dev-stack-*` - Lambda logs
- `/aws/apigateway/*/api-calls` - API Gateway logs
- `/aws/rds/instance/*/error` - RDS error logs

## Disaster Recovery

### Backup Strategy

- **RDS Automated Backups**: Daily, 7-day retention (configurable)
- **Manual Snapshots**: Can be created before major changes
- **Multi-AZ**: Automatic failover within same region

### Recovery Procedure

1. **Database Failure**:
   - RDS automatic failover to replica (Multi-AZ)
   - Manual snapshot restore (if needed)

2. **Lambda Function Failure**:
   - Code stored in Lambda service
   - Redeploy using CDK if needed

3. **Full Stack Failure**:
   - Redeploy stack using CDK (takes ~10-15 minutes)
   - Restore database from snapshot

## Future Enhancements

1. **API Gateway Authorizers**: JWT validation at gateway level
2. **Lambda Layers**: Shared code and dependencies
3. **CloudFront**: CDN for API responses
4. **DynamoDB**: Caching layer for frequently accessed data
5. **SQS/SNS**: Async processing for long-running operations
6. **EventBridge**: Scheduled tasks (migrations, cleanup)
7. **S3**: File storage for user uploads
8. **Route 53**: DNS management
9. **WAF**: Web Application Firewall for API Gateway
10. **X-Ray**: Distributed tracing and debugging
