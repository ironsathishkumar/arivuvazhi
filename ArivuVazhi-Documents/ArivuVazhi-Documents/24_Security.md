# Security

> **Product:** ArivuVazhi (அறிவுவழி) — AI-powered government exam preparation platform

## Authentication
- JWT
- Argon2 password hashing
- Refresh/session strategy as appropriate

## API
- Helmet
- CORS
- Rate limiting
- Joi validation
- Authorization middleware
- Secure error handling

## AI
- Provider secrets only on backend
- Prompt injection controls
- Knowledge authorization
- Request limits
- Output validation
- Audit logging
- Cost limits

## Admin
- Role-based permissions
- Sensitive action audit logs
- Strong authentication
- No API keys in browser storage

## Data
- Least privilege
- Encrypted transport
- Backups
- Retention policy
