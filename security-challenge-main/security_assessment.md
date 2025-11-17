# Lendesk Security Challenge – Web Application Security Assessment
This assessment takes a close look at a simple Notes API built with Node.js and TypeScript. Although the application works as intended, it has several major security issues — including a few critical ones — that completely break authentication and allow attackers to access or modify any user's notes.

During the review, I focused on understanding how the app handles login, user creation, notes storage, JWT token logic, and general API behavior. I looked at the code, traced the user flow, and reviewed the security controls around authentication, authorization, and error handling.

Here’s the big picture:

3 Critical issues

2 High issues

3 Medium issues

2 Low issues

The most severe problem is that the application does not actually validate JWT tokens. Because of this, anyone can forge a token and act as any user — meaning authentication is essentially broken.

The rest of this report explains how I tested, what I found, and how to fix everything.

1. Testing Methodology
1.1 How I Tested

To get a full view of the app’s security posture, I combined:

Manual code review (TypeScript files, routes, controllers, utilities)

Static analysis techniques

Searching the codebase for known insecure patterns

Reviewing dependencies and configuration files

Testing authentication, notes access, and error responses

Validating how input is handled and how data is stored

I specifically looked at:

How authentication works (login, token creation)

How authorization is enforced (who can access which notes)

Input validation (or lack of it)

JWT handling and secret management

Redis/file storage interactions

Error management and data leaks

CORS configuration

Password and rate-limit policies

1.2 Scope of Testing

The following parts of the app were in scope:

/authentication/create-user

/authentication/login

/users/:username/notes (GET)

/users/:username/notes (POST)

JWT logic (creation & validation)

Redis storage and file-based user storage

Password hashing

Input validation & error handling code

I walked through the entire authentication flow, traced how notes were stored and retrieved, and followed how JWTs were being used across the system.

2. Detailed Findings

Below are all findings grouped by severity, written in a clearer, more conversational tone while keeping full technical accuracy.

🔴 CRITICAL-01: JWT Tokens Aren’t Actually Validated

Why this is critical:
The app uses jwt.decode() instead of jwt.verify(). That means the server never checks the token’s signature. Anyone can forge a valid-looking JWT and pretend to be any user — no password needed.

Where it happens:
src/routes/notes.ts (lines 15–18)

What this means in simple terms:
Authentication can be bypassed completely.

Proof-of-Concept:

TOKEN=$(echo -n '{"alg":"none"}' | base64).$(echo -n '{"username":"alice"}' | base64).

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/users/alice/notes


This works because the server never checks if the token was legitimately created.

How to fix it:
Switch from decode() to verify() and use a strong secret stored in environment variables.

🔴 CRITICAL-02: JWT Secret Key Is Hardcoded and Weak

Issue:
The app signs tokens using the literal string "JWT". This is extremely weak (3 characters) and should never be hardcoded.

Impact:
Anyone who sees the code can generate real, valid tokens for any user.

Fix:
Use a strong random secret stored in .env.

🔴 CRITICAL-03: No Authorization Checks on Notes Endpoints

Issue:
Even if authentication worked properly (which it doesn’t), the app still allows any logged-in user to access any other user's notes.

There’s no check for:

if (req.user.username === req.params.username)


Impact:
Anyone can view or modify anyone else’s notes.

Fix:
Add explicit authorization checks before processing notes.

🟠 HIGH-01: Error Responses Leak Sensitive Internal Details

What’s happening:
When something fails, the API responds with:

Full error message

Full stack trace

Internal file paths

This gives attackers insights into how the app works.

Fix:
In production:
Return simple, generic errors.
Log detailed errors only on the server.

🟠 HIGH-02: CORS Allows Every Domain

Using cors() with no config means any website from anywhere can send requests to the API.

If a user is logged in, a malicious website can:

Read their notes

Add notes

Steal tokens

Fix:
Restrict CORS to trusted domains only.

🟡 MEDIUM-01: Notes Input Is Not Validated at All

Users can send:

Empty notes

Giant notes (MBs)

Potentially harmful content

Fix:
Add input validation (length, type, emptiness checks).

🟡 MEDIUM-02: Password Policy Too Weak

Minimum password length is 4 characters.

That’s not secure in 2025 (or any year).

Fix:
Set minimum length to 12 characters and add complexity requirements.

🟡 MEDIUM-03: No Rate Limiting on Login or User Creation

Anyone can:

Try unlimited passwords

Enumerate users

Hammer the API until it falls over

Fix:
Use express-rate-limit on sensitive routes.

🔵 LOW-01: Missing Security Headers

The API doesn’t set:

CSP

HSTS

X-Frame-Options

X-XSS-Protection

X-Content-Type-Options

These don’t fix everything, but they help reduce common attacks.

Fix:
Use helmet() middleware.

🔵 LOW-02: Insecure File Storage (for Dev Mode)

User data stored in users.json on disk is not protected with file permissions or encryption.

Fix:
Restrict file permissions and/or avoid storing sensitive data on disk altogether.

3. Summary of Results
3.1 The Overall Risk Level

Overall, the application is in a critical risk state.
The authentication system is broken due to the combination of:

No JWT validation

Hardcoded secret

No authorization checks

This means any attacker can become any user instantly.

3.2 Top Issue to Fix First

The biggest problem is the JWT token verification bypass. Fixing this immediately will restore authentication integrity.

3.3 What Should Be Fixed Next

After fixing token validation, the next priorities are:

Remove hardcoded JWT secret

Add proper authorization

Add secure error handling

Restrict CORS

Add rate limiting

Strengthen password requirements

Add security headers

Fixing these will drastically improve the app’s security posture.

4. Conclusion

This assessment uncovered several severe issues in how the application handles security-critical operations.

The top-level problems boil down to:

Authentication that isn’t real

Authorization that doesn’t exist

Sensitive details that leak

Weak or missing security best practices

The good news is: all of these issues are fixable, and most of them only require changes in a few places in the codebase.

Once the critical issues are resolved and the recommended improvements are applied, the application can reach a much safer and more reliable security level suitable for production environments.

Prepared by:
Sai Teja Bandi
Date: November 17, 2025
Classification: Confidential
