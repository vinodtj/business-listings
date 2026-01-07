# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest | :x:                |

## Reporting a Vulnerability

We take the security of our application seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do NOT** create a public GitHub issue

Security vulnerabilities should be reported privately to protect users.

### 2. Email Security Team

Please email security concerns to: **security@yourdomain.com**

Include the following information:
- Type of vulnerability
- Location of the affected code
- Step-by-step instructions to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (typically 30-90 days)

### 4. Disclosure Policy

- We will acknowledge receipt of your report
- We will keep you informed of the progress
- We will credit you in the security advisory (if desired)
- We will not disclose your identity without permission

## Security Best Practices

### For Users

1. **Never share your credentials**
2. **Use strong, unique passwords**
3. **Enable two-factor authentication** (when available)
4. **Keep your software updated**
5. **Report suspicious activity immediately**

### For Developers

1. **Never commit secrets or credentials**
2. **Use environment variables for sensitive data**
3. **Review dependencies regularly**
4. **Follow secure coding practices**
5. **Keep dependencies updated**

## Known Security Features

- ✅ Leaked password protection (HaveIBeenPwned integration)
- ✅ Secure password hashing (via Supabase Auth)
- ✅ HTTPS enforcement
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Row Level Security (RLS) on database
- ✅ Input validation and sanitization
- ✅ SQL injection protection (via Prisma ORM)
- ✅ XSS protection (React's built-in escaping)

## Security Updates

Security updates are released as needed. We recommend:

- Keeping your dependencies updated
- Monitoring security advisories
- Following our release notes

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/going-to-production#security)

## Security Checklist

Before deploying to production:

- [ ] All environment variables are set securely
- [ ] No secrets are committed to the repository
- [ ] Dependencies are up to date
- [ ] Security headers are configured
- [ ] Database RLS policies are in place
- [ ] Input validation is implemented
- [ ] Error messages don't leak sensitive information
- [ ] Logging doesn't include sensitive data
- [ ] HTTPS is enforced
- [ ] Rate limiting is configured

---

**Thank you for helping keep our application secure!**


