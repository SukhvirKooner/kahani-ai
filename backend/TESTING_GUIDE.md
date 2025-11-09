# Testing Guide - Story Arc Engine Backend

Complete guide to testing the Story Arc Engine backend API.

## 🎯 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Run Tests
```bash
npm test
```

That's it! Tests will:
- Use an in-memory MongoDB (no setup needed)
- Mock external API calls (Gemini)
- Clean up after themselves

## 📊 Test Suite Overview

### What's Tested

#### ✅ API Endpoints (Integration Tests)
- **Production Plans**: Create, read, update, delete stories
- **Gemini Operations**: Image and video generation
- **Chat System**: Sessions, messages, history

#### ✅ Database Models (Unit Tests)
- **ProductionPlan Model**: Validation, schemas, indexes
- **ChatSession Model**: Validation, messages, references

#### ✅ Features Tested
- Data validation
- Error handling
- Database persistence
- API responses
- Rate limiting readiness
- CORS configuration

## 🧪 Test Examples

### Example 1: Testing Production Plan Creation

```typescript
// Located in: tests/integration/productionPlan.test.ts

it('should create a new production plan with valid data', async () => {
  const mockData = {
    drawingDesc: 'A brave knight with a red cape',
    parentPrompt: 'Teach the importance of courage',
    language: 'English',
    imageBase64: 'base64_encoded_image',
    imageMimeType: 'image/png',
    userId: 'test-user-123'
  };

  const response = await request(app)
    .post('/api/production-plans')
    .send(mockData)
    .expect(201);

  expect(response.body.success).toBe(true);
  expect(response.body.data.id).toBeDefined();
  expect(response.body.data.characterModel).toBeDefined();
});
```

**What it tests:**
- ✅ API accepts valid data
- ✅ Returns 201 status
- ✅ Response has correct structure
- ✅ Data is saved to database

### Example 2: Testing Error Handling

```typescript
it('should return 400 if parentPrompt is missing', async () => {
  const response = await request(app)
    .post('/api/production-plans')
    .send({
      drawingDesc: 'A brave knight',
      language: 'English'
      // parentPrompt is missing
    })
    .expect(400);

  expect(response.body.error).toBeDefined();
});
```

**What it tests:**
- ✅ Validates required fields
- ✅ Returns appropriate error code
- ✅ Provides error message

### Example 3: Testing Database Model

```typescript
// Located in: tests/unit/models/ProductionPlan.test.ts

it('should create a valid production plan', async () => {
  const validPlan = new ProductionPlan({
    characterModel: {
      source: 'A brave knight',
      action: 'Generate character'
    },
    storyAnalysis: {
      hero: 'Sir Brave',
      parentPrompt: 'Teach courage',
      coreLesson: 'Be brave',
      villain: 'Shadow Beast',
      characterArc: 'From scared to brave',
      characterPersona: 'A friendly knight'
    },
    // ... other required fields
  });

  const savedPlan = await validPlan.save();
  
  expect(savedPlan._id).toBeDefined();
  expect(savedPlan.characterModel.source).toBe('A brave knight');
  expect(savedPlan.createdAt).toBeDefined();
});
```

**What it tests:**
- ✅ Model saves to database
- ✅ Fields are stored correctly
- ✅ Timestamps are auto-generated
- ✅ IDs are assigned

## 📋 Test Coverage Report

### Current Coverage

Run coverage report:
```bash
npm run test:coverage
```

Example output:
```
---------------------|---------|----------|---------|---------|
File                 | % Stmts | % Branch | % Funcs | % Lines |
---------------------|---------|----------|---------|---------|
All files            |   85.23 |    78.45 |   82.67 |   85.89 |
 controllers/        |   88.34 |    82.15 |   85.71 |   88.92 |
 models/             |   92.45 |    85.32 |   90.23 |   93.12 |
 routes/             |   78.23 |    70.45 |   75.89 |   79.34 |
 services/           |   81.67 |    75.23 |   80.12 |   82.45 |
---------------------|---------|----------|---------|---------|
```

### View HTML Report
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🎨 Test Categories

### Integration Tests (`tests/integration/`)

Test complete workflows through the API:

```bash
# Run only integration tests
npm run test:integration
```

**Files:**
- `productionPlan.test.ts` - Production plan CRUD operations
- `gemini.test.ts` - AI generation endpoints
- `chat.test.ts` - Chat system functionality

### Unit Tests (`tests/unit/`)

Test individual components:

```bash
# Run only unit tests
npm run test:unit
```

**Files:**
- `models/ProductionPlan.test.ts` - ProductionPlan model
- `models/ChatSession.test.ts` - ChatSession model

## 🔧 Test Configuration

### Jest Config (`jest.config.js`)

```javascript
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

### Test Setup (`tests/setup.ts`)

Automatically:
- Creates in-memory MongoDB
- Cleans database after each test
- Closes connections after all tests
- Suppresses console errors

## 📝 Writing New Tests

### 1. Create Test File

```bash
touch tests/integration/myNewFeature.test.ts
```

### 2. Use Template

```typescript
import request from 'supertest';
import express, { Application } from 'express';
import cors from 'cors';
import myRoutes from '../../src/routes/myRoutes.js';

describe('My New Feature Tests', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/my-endpoint', myRoutes);
  });

  describe('GET /api/my-endpoint', () => {
    it('should do something', async () => {
      const response = await request(app)
        .get('/api/my-endpoint')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
```

### 3. Run Your Test

```bash
npm test -- myNewFeature.test.ts
```

## 🐛 Debugging Tests

### Run Single Test
```bash
npm test -- -t "should create a new production plan"
```

### Run Single File
```bash
npm test -- productionPlan.test.ts
```

### Verbose Output
```bash
npm test -- --verbose
```

### Watch Mode (auto-run on changes)
```bash
npm run test:watch
```

## ✅ Test Checklist

Before committing:

- [ ] All tests pass: `npm test`
- [ ] No console errors or warnings
- [ ] Coverage stays above 80%: `npm run test:coverage`
- [ ] Tests are descriptive and clear
- [ ] Error cases are tested
- [ ] Happy path is tested
- [ ] Edge cases are considered

## 🚀 CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        working-directory: ./backend
        run: npm install
      
      - name: Run tests
        working-directory: ./backend
        run: npm test
      
      - name: Generate coverage
        working-directory: ./backend
        run: npm run test:coverage
```

## 📚 Test Data & Mocks

### Using Mock Data

```typescript
import { 
  mockProductionPlan,
  mockGeneratedImage,
  createMockProductionPlanData 
} from '../utils/testHelpers.js';

// Use predefined mock
const plan = mockProductionPlan;

// Create custom mock with overrides
const customPlan = createMockProductionPlanData({
  userId: 'custom-user',
  language: 'Hindi'
});
```

### Mocking Gemini Service

The Gemini service is automatically mocked in tests to:
- Avoid real API calls
- Avoid API costs
- Make tests faster
- Make tests deterministic

Located in: `tests/mocks/geminiServiceMock.ts`

## 🎯 Common Test Scenarios

### Scenario 1: Test Authentication (When Added)

```typescript
it('should require authentication', async () => {
  const response = await request(app)
    .get('/api/protected-endpoint')
    .expect(401);

  expect(response.body.error).toBe('Authentication required');
});
```

### Scenario 2: Test Pagination

```typescript
it('should support pagination', async () => {
  // Create test data
  for (let i = 0; i < 5; i++) {
    await createTestPlan();
  }

  const response = await request(app)
    .get('/api/plans?limit=2&page=1')
    .expect(200);

  expect(response.body.data).toHaveLength(2);
  expect(response.body.pagination.total).toBe(5);
  expect(response.body.pagination.pages).toBe(3);
});
```

### Scenario 3: Test Data Validation

```typescript
it('should validate email format', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({
      email: 'invalid-email'
    })
    .expect(400);

  expect(response.body.error).toContain('email');
});
```

## 🔍 Troubleshooting

### Issue: "Cannot find module"
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: "Timeout exceeded"
Increase timeout in jest.config.js:
```javascript
testTimeout: 60000, // 60 seconds
```

### Issue: "Port already in use"
Tests use in-memory database, no ports needed. If issue persists:
```bash
# Kill any hanging Node processes
pkill -f node
```

### Issue: Tests pass locally but fail in CI
- Check Node.js version matches
- Ensure all dependencies are installed
- Check environment variables

## 📖 Additional Resources

- Full test documentation: `tests/README.md`
- Test utilities: `tests/utils/testHelpers.ts`
- Test mocks: `tests/mocks/`

## 🎉 Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Keep tests isolated** (no dependencies between tests)
3. **Use descriptive names** (explain what and why)
4. **Test error cases** (not just happy path)
5. **Keep tests simple** (one concept per test)
6. **Maintain coverage** (aim for 80%+)
7. **Mock external services** (for speed and reliability)
8. **Clean up after tests** (handled automatically)

---

**Happy Testing! 🧪 Your tests make the codebase bulletproof! 💪**

