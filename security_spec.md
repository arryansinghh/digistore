# Security Specification

## Data Invariants
1. A user profile (`/users/{uid}`) can only be created and managed by the authenticated owner.
2. An order (`/orders/{id}`) must have a valid `userId` matching the authenticated user.
3. Once an order is created with `status: 'completed'`, it is immutable for the client (except for potential server-side updates).
4. All timestamps must be server-generated.

## The "Dirty Dozen" Payloads (Deny Cases)
1. Creating a user profile for someone else's UID.
2. Updating an order to `status: 'completed'` without Razorpay IDs.
3. Injecting a massive string into the `orderId`.
4. Creating an order with a negative amount.
5. Modifying the `email` field in a user profile after creation.
6. Reading someone else's order list.
7. Spoofing a Razorpay signature in a client write (Rules will verify presence, but server should verify signature; client rules are first line of defense).
8. Creating a user profile with a non-verified email (if configured, but here we'll allow standard Google login).
9. Updating an immutable `createdAt` field.
10. Creating an order with a mismatched `userId`.
11. Bypassing the `isValidId` check with special characters in document paths.
12. Creating an order with an empty `items` array if enforced.

## Tests
Verified via `firestore.rules.test.ts` (conceptual).
