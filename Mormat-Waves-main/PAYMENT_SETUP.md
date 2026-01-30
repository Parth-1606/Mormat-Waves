# Payment Gateway & Authentication Setup Guide

## Features Implemented

### 1. JWT Authentication
- User registration and login
- JWT token storage in localStorage
- Protected routes and user state management

### 2. Payment Gateway Integration
- Razorpay integration for Indian payments (₹)
- Payment flow when clicking buy buttons
- Test mode ready

### 3. Start Selling Onboarding
- Multi-step form for seller registration
- Collects: artist type, music genres, license preferences, bio, social links
- Requires authentication before access

## Setup Instructions

### 1. Razorpay Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings → API Keys
3. Add to your `.env.local` file:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

4. For production, use live keys (remove `_test` from key ID)

### 2. Backend Integration (Required for Production)

The current implementation uses a mock payment flow. For production, you need to:

1. **Create Payment Order API** (`/api/create-order`):
   - Create order on Razorpay backend
   - Return `order_id` to frontend
   - Store order details in database

2. **Verify Payment API** (`/api/verify-payment`):
   - Verify payment signature
   - Update order status
   - Grant access to purchased beat

3. **Update `src/lib/payment.ts`**:
   - Replace mock `orderId` with API call
   - Implement payment verification

### 3. Authentication Backend (Required for Production)

The current JWT implementation is client-side only. For production:

1. **Create Auth API endpoints**:
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `POST /api/auth/verify` - Verify JWT token

2. **Update `src/contexts/AuthContext.tsx`**:
   - Replace mock authentication with API calls
   - Implement proper password hashing (bcrypt)
   - Store JWT in httpOnly cookies for security

### 4. Environment Variables

Create `.env.local` file:

```env
# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret

# JWT
JWT_SECRET=your-super-secret-key-change-in-production

# Database (if using)
DATABASE_URL=your_database_url
```

## Usage

### Sign In
- Click "Sign In" button in navbar
- Enter email and password
- For demo, any credentials work (in production, use real authentication)

### Start Selling
- Click "Start Selling" button
- Must be signed in first
- Complete 3-step onboarding form:
  1. Select if you're an artist or producer
  2. Choose music genres you create
  3. Set default license, add bio and social links

### Purchase Beat
- Click the buy button (₹) on any beat
- Must be signed in
- Razorpay payment modal will open
- Complete payment (use test card: 4111 1111 1111 1111)
- Payment success will be shown

## Test Payment Cards (Razorpay Test Mode)

- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Security Notes

⚠️ **Important for Production:**

1. Never expose `RAZORPAY_KEY_SECRET` in client-side code
2. Always verify payments on backend
3. Use httpOnly cookies for JWT storage
4. Implement rate limiting on auth endpoints
5. Use HTTPS in production
6. Validate all user inputs server-side

## Next Steps

1. Set up backend API endpoints
2. Integrate with database (user accounts, orders, beats)
3. Implement email verification
4. Add password reset functionality
5. Set up webhook for Razorpay payment notifications
6. Add order history page
7. Implement download functionality after purchase
