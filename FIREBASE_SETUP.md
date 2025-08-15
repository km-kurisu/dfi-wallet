# Firebase Setup Guide

## Prerequisites

- Firebase account
- Node.js and npm installed

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "dfi-wallet")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### 3. Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### 4. Get Firebase Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register app with a nickname
5. Copy the configuration object

### 5. Update Firebase Config

Replace the placeholder configuration in `lib/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 6. Set Up Firestore Security Rules

In Firebase Console > Firestore Database > Rules, update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Install Dependencies

```bash
npm install firebase js-cookie
```

### 8. Test the Application

```bash
npm run dev
```

## Features Implemented

### Authentication

- ✅ Email/password signup and signin
- ✅ Client-side session management with cookies
- ✅ Automatic session persistence
- ✅ Secure logout functionality

### User Data Storage

- ✅ User profiles stored in Firestore
- ✅ Wallet addresses linked to user accounts
- ✅ Identity verification status tracking
- ✅ Onboarding completion tracking

### Security

- ✅ Client-side session management (no server-side cookies)
- ✅ Firebase Authentication integration
- ✅ Firestore security rules
- ✅ User data isolation

### User Experience

- ✅ Dynamic navigation based on authentication status
- ✅ Loading states and error handling
- ✅ Form validation and feedback
- ✅ Responsive design with icons

## Database Schema

### Users Collection

```javascript
{
  uid: "firebase-auth-uid",
  displayName: "User's full name",
  email: "user@example.com",
  createdAt: "2024-01-01T00:00:00.000Z",
  walletAddress: "0x...", // Ethereum wallet address
  isVerified: false,
  verifiedAt: "2024-01-01T00:00:00.000Z", // Optional
  verificationDocument: "document.pdf", // Optional
  onboardingCompleted: false
}
```

## Session Management

The application uses client-side session management with:

- **js-cookie**: For storing session data in browser cookies
- **Firebase Auth**: For secure authentication
- **Context API**: For state management across components

Session data includes:

- `sessionId`: Unique session identifier
- `userData`: Serialized user information

## Security Considerations

1. **No Server-Side Sessions**: All session management is client-side
2. **Firebase Security Rules**: Protect user data at the database level
3. **Authentication State**: Firebase handles secure authentication
4. **Data Validation**: Client-side validation with Firebase security rules

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables if needed
4. Deploy

### Environment Variables (Optional)

Create `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check configuration in `lib/firebase.js`
2. **Authentication errors**: Verify Firebase Auth is enabled
3. **Database access denied**: Check Firestore security rules
4. **Session not persisting**: Check cookie settings and browser permissions

### Debug Mode

Enable Firebase debug mode in browser console:

```javascript
localStorage.setItem('debug', 'firebase:*');
```
