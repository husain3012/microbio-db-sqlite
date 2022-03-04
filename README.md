# LAB EXPERIMENT TRACKING SYSTEM

## ENV Vars

```env
JWT_SECRET=token_encryption_secret_for_jwt
```

## API DOCS

### Auth Routes

| Use     | URL              | Method | Params                    | Access | Status |
| ------- | ---------------- | ------ | ------------------------- | ------ | ------ |
| Login   | /api/auth/login  | POST   | username, password        | Public | OK     |
| Sign up | /api/auth/signup | POST   | username, password, level | Public | OK     |

---

### Sample Routes

| Use                      | URL              | Method | Params           | Access       | Status |
| ------------------------ | ---------------- | ------ | ---------------- | ------------ | ------ |
| Create Sample            | /api/auth/login  | POST   | {...SampleData}  | Private/User | OK     |
| Update Sample            | /api/auth/signup | POST   | {...SampleData}  | Private/User | OK     |
| Sample Search            | /api/auth/signup | POST   | {...SearchQuery} | Private/User | OK     |
| Get by date (Deprecated) | /api/auth/signup | GET    | \_\_             | Private/User | OK     |
| Get Sample By ID         | /api/auth/signup | GET    | sampleId         | Private/User | OK     |
| Generate Report          | /api/auth/signup | POST   | sampleId         | Private/User | OK     |
