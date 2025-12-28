# Visual Guide: CDK Conversion

## Before & After Comparison

### Architecture Before (Traditional NestJS)

```
┌─────────────────────────────────────────┐
│         Browser/Client                  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  Load Balancer / NGX  │
        └──────────────┬───────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
   ┌─────────────────┐          ┌─────────────────┐
   │  NestJS App 1   │          │  NestJS App 2   │
   │   (Express)     │          │   (Express)     │
   │  Controllers    │          │  Controllers    │
   │  Services       │          │  Services       │
   │  Database Pool  │          │  Database Pool  │
   └────────┬────────┘          └────────┬────────┘
            │                            │
            └────────────┬───────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  PostgreSQL Database   │
            │  - Local or RDS        │
            │  - Always running      │
            │  - Manages connections │
            └────────────────────────┘

Challenges:
❌ Fixed infrastructure costs
❌ Manual scaling
❌ Deployment complexity
❌ Infrastructure management
❌ Always-on databases
```

### Architecture After (AWS Lambda + CDK)

```
┌─────────────────────────────────────────┐
│         Browser/Client                  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │    Route 53 (DNS)    │
        │   (Optional CDN)     │
        └──────────────┬───────┘
                       │
                       ▼
        ┌──────────────────────┐
        │    API Gateway       │
        │  - REST Endpoint     │
        │  - Request Routing   │
        │  - Authorization     │
        │  - Rate Limiting     │
        │  - Logging           │
        └──────────────┬───────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐       ┌─────────┐       ┌─────────┐
│ Lambda  │       │ Lambda  │       │ Lambda  │
│ Sign Up │       │ Get User│       │ Quotation
│         │       │         │       │         │
│ Auto    │       │ Auto    │       │ Auto    │
│ Scaled  │       │ Scaled  │       │ Scaled  │
└────┬────┘       └────┬────┘       └────┬────┘
     │                 │                 │
     │    VPC (Private Network)           │
     ▼                 ▼                 ▼
     └─────────────────┬─────────────────┘
                       │
            ┌──────────▼──────────┐
            │  Security Groups    │
            │  (Port 5432)        │
            └──────────┬──────────┘
                       │
                       ▼
            ┌────────────────────────┐
            │  RDS PostgreSQL        │
            │  - Managed Service     │
            │  - Auto Scaling        │
            │  - Automated Backups   │
            │  - Multi-AZ Ready      │
            └────────────────────────┘

Benefits:
✅ Pay-per-use pricing
✅ Auto-scaling
✅ No infrastructure management
✅ IAC with CDK
✅ Built-in monitoring
✅ Serverless database connections
✅ Simple deployment
```

## Request Flow

### Before: NestJS Request

```
Client Request
    │
    ▼
Express Router
    │
    ├─ Authenticate (JWT Guard)
    │
    ├─ Authorize (Roles Guard)
    │
    ▼
Controller Method
    │
    ├─ Parse @Body()
    ├─ Extract @Param()
    ├─ Get @Query()
    │
    ▼
Service/Use Case
    │
    ├─ Validate
    ├─ Business Logic
    ├─ Database Query
    │
    ▼
Format Response
    │
    ▼
Send Response
```

### After: Lambda Request

```
Client Request
    │
    ▼
API Gateway (Authorizer - optional)
    │
    ├─ Validate JWT Token
    │
    ▼
Lambda Handler Invocation
    │
    ├─ Parse event.body
    ├─ Extract event.pathParameters
    ├─ Get event.queryStringParameters
    │
    ├─ Validate JWT (if no authorizer)
    │
    ▼
Business Logic (Reused Use Cases)
    │
    ├─ Validate
    ├─ Business Logic
    ├─ Database Query
    │
    ▼
Format APIGatewayProxyResult
    │
    ├─ statusCode
    ├─ body (JSON string)
    ├─ headers
    │
    ▼
Send Response
```

## Deployment Flow

### Before: Traditional Deployment

```
Code Commit
    │
    ▼
Build Docker Image
    │
    ▼
Push to Registry
    │
    ▼
SSH to Server
    │
    ▼
Pull Image
    │
    ▼
Stop Old Container
    │
    ▼
Start New Container
    │
    ▼
Manual Verification
    │
    ▼
Done (5-15 min)
```

### After: CDK Deployment

```
Code Commit
    │
    ▼
npm run build
    │
    ▼
cdk synth
    │
    ▼
Generate CloudFormation
    │
    ▼
npm run cdk:deploy
    │
    ▼
Upload to S3
    │
    ▼
CloudFormation Deploy
    │
    ├─ Create/Update Lambda
    ├─ Create/Update API Gateway
    ├─ Create/Update RDS
    ├─ Create/Update VPC
    │
    ▼
CloudWatch Auto Monitoring
    │
    ▼
Done (5-10 min)
```

## File Organization Comparison

### Before

```
src/
├── iam/
│   ├── presenters/http/authentication.controller.ts
│   └── application/ports/
├── users/
│   ├── presentation/http/users.controller.ts
│   └── application/ports/
└── ...
```

### After

```
cdk/
├── lib/nestjs-template-stack.ts  ← Infrastructure
└── bin/app.ts                     ← CDK Entry Point

src/
├── lambda/                        ← Lambda Handlers
│   ├── handlers/
│   │   ├── authentication/
│   │   ├── users/
│   │   └── ...
│   └── utils/lambda-response.ts
├── iam/
│   └── application/ports/        ← Reused
├── users/
│   └── application/ports/        ← Reused
└── ...
```

## Scaling Comparison

### Before: NestJS

```
User Load Increases
    │
    ▼
Manual Intervention
    │
    ├─ Provision new server
    ├─ Configure load balancer
    ├─ Deploy application
    │
    ▼
Response to Traffic (Hours to Days)
```

### After: Lambda

```
User Load Increases
    │
    ▼
API Gateway Detects
    │
    ▼
Automatic Lambda Scaling
    │
    ├─ 100s → 1000s → 10000s invocations
    ├─ Concurrent execution increases
    ├─ Auto-scaled instantly
    │
    ▼
Response to Traffic (Seconds to Minutes)
```

## Cost Comparison

### Before: NestJS/Docker (Monthly Estimate)

```
EC2 Instance (t3.large)     $100
├─ Compute
├─ Always running
└─ Minimal utilization

Database (RDS)              $50
├─ Always running
└─ Unused capacity

Load Balancer              $20
├─ Always active
└─ Simple setup

Network/Data Transfer      $10

────────────────────────────────
Total Monthly              $180
```

### After: Lambda/Serverless (Monthly Estimate)

```
Lambda Executions          $20
├─ Only pay for invocations
└─ 1M requests = $20

API Gateway               $3.50
├─ 1M requests
└─ No unused capacity

Database (RDS)           $30-50
├─ Smaller instance type
└─ Better for serverless

Network/Data Transfer     $5-10

────────────────────────────────
Total Monthly            $60-90
(50% Savings!)
```

## Cold Start Comparison

### Before: NestJS

```
Request → Express Start → Middleware → Route → Response
(Always warm, instant response)
```

### After: Lambda

```
Request → Lambda Cold Start (1-5s) → Response
    OR
Request → Lambda Warm (100-300ms) → Response

Solution: Scheduled "warmup" invocations
```

## Monitoring Comparison

### Before: NestJS

```
Custom Logging
    ↓
Log Files
    ↓
Manual Parsing
    ↓
Limited Visibility
```

### After: Lambda + CloudWatch

```
Automatic Logging
    ↓
CloudWatch Logs
    ↓
Automatic Parsing
    ↓
Dashboards & Alerts
    ↓
Full Visibility
```

## Development Workflow Comparison

### Before: NestJS

```
1. npm start:dev
2. Local Express Server
3. Connect to Local DB
4. Manual Testing
5. Git Push
6. Manual Deployment
7. Server Logs
```

### After: Lambda + CDK

```
1. npm run cdk:watch (continuous deployment)
2. Local Testing (SAM CLI optional)
3. Lambda in AWS
4. Automated Integration Tests
5. Git Push (triggers CI/CD)
6. Automatic CDK Deploy
7. CloudWatch Logs
8. Automated Alerts
```

---

This visual guide shows the transformation from traditional NestJS to serverless Lambda architecture. The new architecture offers better scalability, cost efficiency, and operational simplicity.
