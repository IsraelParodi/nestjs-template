# CDK Implementation Checklist

Use this checklist to track your progress implementing and deploying the serverless version.

## Phase 1: Setup & Deployment

- [ ] Install dependencies

  ```bash
  npm install
  ```

- [ ] Configure AWS credentials

  ```bash
  aws configure
  ```

- [ ] Bootstrap CDK (first time only)

  ```bash
  npm run cdk:bootstrap
  ```

- [ ] Build application

  ```bash
  npm run build
  ```

- [ ] Synthesize CDK stack

  ```bash
  npm run cdk:synth
  ```

- [ ] Deploy to AWS

  ```bash
  npm run cdk:deploy
  ```

- [ ] Verify API Gateway endpoint created
  - Check AWS Console or CloudFormation outputs
  - Note the endpoint URL

- [ ] Verify Lambda functions created
  - 5+ Authentication functions
  - 6+ User functions
  - Other module functions

- [ ] Verify RDS database created
  - Check AWS Console
  - Verify security group for port 5432

## Phase 2: Database Setup

- [ ] Run database migrations

  ```bash
  npm run migration:run:prod
  ```

- [ ] Verify database tables created

  ```bash
  # Connect to RDS and verify tables
  psql -h <rds-endpoint> -U postgres -d nestjs_db
  \dt  # List tables
  ```

- [ ] Test database connectivity from Lambda
  - Check CloudWatch logs for connection errors

## Phase 3: Implement Use Cases in Handlers

### Authentication Handlers

- [ ] **Sign Up** (`src/lambda/handlers/authentication/sign-up.ts`)
  - [ ] Parse request body
  - [ ] Inject SignUpUseCase
  - [ ] Execute use case
  - [ ] Return response
  - [ ] Test endpoint

- [ ] **Sign In** (`src/lambda/handlers/authentication/sign-in.ts`)
  - [ ] Parse request body
  - [ ] Inject SignInUseCase
  - [ ] Execute use case
  - [ ] Return tokens
  - [ ] Test endpoint

- [ ] **Refresh Token** (`src/lambda/handlers/authentication/refresh-token.ts`)
  - [ ] Implement token refresh logic
  - [ ] Test endpoint

- [ ] **Forgot Password** (`src/lambda/handlers/authentication/forgot-password.ts`)
  - [ ] Implement forgot password logic
  - [ ] Test endpoint

- [ ] **Reset Password** (`src/lambda/handlers/authentication/reset-password.ts`)
  - [ ] Implement reset password logic
  - [ ] Test endpoint

### User Handlers

- [ ] **Create User** (`src/lambda/handlers/users/create-user.ts`)
  - [ ] Implement user creation
  - [ ] Add role-based access control
  - [ ] Test endpoint

- [ ] **List Users** (`src/lambda/handlers/users/list-users.ts`)
  - [ ] Implement pagination
  - [ ] Implement filtering
  - [ ] Test endpoint

- [ ] **Get User** (`src/lambda/handlers/users/get-user.ts`)
  - [ ] Implement user retrieval
  - [ ] Test endpoint

- [ ] **Update User** (`src/lambda/handlers/users/update-user.ts`)
  - [ ] Implement user update
  - [ ] Add authorization checks
  - [ ] Test endpoint

- [ ] **Delete User** (`src/lambda/handlers/users/delete-user.ts`)
  - [ ] Implement user deletion
  - [ ] Add authorization checks
  - [ ] Test endpoint

- [ ] **Delete Many Users** (`src/lambda/handlers/users/delete-many-users.ts`)
  - [ ] Implement bulk deletion
  - [ ] Test endpoint

### Other Module Handlers

- [ ] Quotations handlers (6 files)
- [ ] Complains handlers (5 files)
- [ ] Contact Us handlers (4 files)
- [ ] Localities handlers (2 files)
- [ ] LOV handlers (2 files)
- [ ] Roles handlers (2 files)

## Phase 4: Authentication & Security

- [ ] Implement JWT validation in Lambda Authorizer

  ```typescript
  // Create JWT authorizer in CDK stack
  // Add to API Gateway
  ```

- [ ] Add JWT token validation to sensitive endpoints
  - [ ] Extract token from Authorization header
  - [ ] Verify token signature
  - [ ] Check token expiration
  - [ ] Extract user claims

- [ ] Implement role-based access control (RBAC)
  - [ ] Add role validation in handlers
  - [ ] Check permissions for admin endpoints
  - [ ] Add Roles decorator/middleware equivalent

- [ ] Test authenticated endpoints
  - [ ] Test with valid token
  - [ ] Test with invalid token
  - [ ] Test with expired token

## Phase 5: Error Handling & Validation

- [ ] Implement request validation
  - [ ] Validate email format
  - [ ] Validate required fields
  - [ ] Validate data types

- [ ] Implement proper error responses
  - [ ] 400 Bad Request for validation errors
  - [ ] 401 Unauthorized for auth errors
  - [ ] 403 Forbidden for permission errors
  - [ ] 404 Not Found for missing resources
  - [ ] 500 Internal Server Error for server errors

- [ ] Test error handling
  - [ ] Test with invalid input
  - [ ] Test with missing fields
  - [ ] Test with unauthorized access

## Phase 6: Dependency Injection

- [ ] Create DI container or factory

  ```typescript
  // src/lambda/utils/di-container.ts
  ```

- [ ] Register all use cases
  - [ ] Authentication use cases
  - [ ] User use cases
  - [ ] Other module use cases

- [ ] Inject use cases in handlers
  - [ ] Update all handler files
  - [ ] Remove TODO comments
  - [ ] Test implementations

## Phase 7: Testing

- [ ] Unit tests for Lambda handlers

  ```bash
  npm test
  ```

- [ ] Integration tests
  - [ ] Test database connections
  - [ ] Test external service calls

- [ ] E2E tests

  ```bash
  npm run test:e2e
  ```

- [ ] Manual API testing
  - [ ] Test all endpoints
  - [ ] Test with various payloads
  - [ ] Test error scenarios

- [ ] Performance testing
  - [ ] Test Lambda duration
  - [ ] Test concurrent invocations
  - [ ] Check cold start impact

## Phase 8: Monitoring & Logging

- [ ] Setup CloudWatch logs
  - [ ] View Lambda logs
  - [ ] View API Gateway logs
  - [ ] View RDS logs

- [ ] Create CloudWatch alarms
  - [ ] Lambda errors alarm
  - [ ] Lambda duration alarm
  - [ ] RDS CPU alarm
  - [ ] RDS storage alarm

- [ ] Setup custom metrics
  - [ ] Track business metrics
  - [ ] Track performance metrics

- [ ] Configure log retention
  - [ ] Set appropriate retention period
  - [ ] Reduce costs

- [ ] Monitor costs
  - [ ] Check daily costs
  - [ ] Identify cost drivers
  - [ ] Optimize expensive operations

## Phase 9: Optimization

- [ ] Optimize Lambda performance
  - [ ] Increase memory if needed
  - [ ] Optimize cold start time
  - [ ] Profile handler execution

- [ ] Optimize database queries
  - [ ] Add indexes for frequently queried fields
  - [ ] Optimize complex queries
  - [ ] Use connection pooling

- [ ] Optimize costs
  - [ ] Reduce Lambda memory if possible
  - [ ] Use reserved capacity for RDS
  - [ ] Implement data caching

- [ ] Setup Lambda warmup
  - [ ] Create scheduled warmup invocations
  - [ ] Reduce cold start impact

## Phase 10: Production Deployment

- [ ] Setup production environment

  ```bash
  npm run cdk:deploy:prod
  ```

- [ ] Run production migrations

  ```bash
  npm run migration:run:prod
  ```

- [ ] Verify production deployment
  - [ ] Test production endpoints
  - [ ] Verify database connectivity
  - [ ] Check CloudWatch logs

- [ ] Setup monitoring in production
  - [ ] Configure alerts
  - [ ] Setup dashboards
  - [ ] Monitor key metrics

- [ ] Setup backup strategy
  - [ ] Configure RDS automated backups
  - [ ] Test recovery procedure
  - [ ] Document recovery process

- [ ] Setup CI/CD pipeline
  - [ ] Automate builds
  - [ ] Automate tests
  - [ ] Automate deployments

## Phase 11: Additional Features

- [ ] Add custom domain to API Gateway
  - [ ] Purchase domain (or use existing)
  - [ ] Configure Route 53
  - [ ] Add SSL certificate

- [ ] Add API documentation
  - [ ] Generate OpenAPI/Swagger docs
  - [ ] Publish API documentation
  - [ ] Add examples

- [ ] Add rate limiting
  - [ ] Configure API Gateway throttling
  - [ ] Implement custom rate limiting

- [ ] Add CORS support
  - [ ] Configure API Gateway CORS
  - [ ] Test CORS from browser

- [ ] Add API keys & usage plans
  - [ ] Create API keys for clients
  - [ ] Setup usage plans
  - [ ] Monitor API key usage

## Phase 12: Documentation & Handoff

- [ ] Update README
  - [ ] Add new deployment instructions
  - [ ] Update architecture diagrams
  - [ ] Add troubleshooting section

- [ ] Create runbooks
  - [ ] Deployment runbook
  - [ ] Rollback runbook
  - [ ] Incident response runbook

- [ ] Create architecture documentation
  - [ ] Document design decisions
  - [ ] Document data flow
  - [ ] Document security measures

- [ ] Create team training materials
  - [ ] Video tutorials
  - [ ] Written guides
  - [ ] Live training sessions

- [ ] Collect feedback
  - [ ] From development team
  - [ ] From operations team
  - [ ] Identify improvements

## Useful Links

| Task           | Command                         |
| -------------- | ------------------------------- |
| Build          | `npm run build`                 |
| Deploy Dev     | `npm run cdk:deploy`            |
| Deploy Prod    | `npm run cdk:deploy:prod`       |
| Destroy Dev    | `npm run cdk:destroy`           |
| View Logs      | `aws logs tail /aws/lambda/...` |
| Run Migrations | `npm run migration:run:prod`    |
| Test           | `npm run test`                  |
| Watch          | `npm run cdk:watch`             |

## Notes

Use this section to track important details:

```
- Deployment Date: ___________
- API Endpoint: ___________
- RDS Endpoint: ___________
- Team Members Trained: ___________
- Issues Encountered: ___________
- Resolution: ___________
```

## Sign Off

- [ ] Development Complete
- [ ] Testing Complete
- [ ] Production Deployed
- [ ] Team Trained
- [ ] Documentation Complete

**Date Completed**: ****\_\_\_****
**Completed By**: ****\_\_\_****
**Approved By**: ****\_\_\_****
