export function getFriendlyAuthErrorMessage(errorCode, defaultFallback = 'An error occurred during authentication.') {
  if (!errorCode) return defaultFallback;

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled in the Firebase Console.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a password with at least 6 characters.';
    case 'auth/user-disabled':
      return 'This donor account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No registered donor account found with this email. Please check your spelling or register.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please verify and try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please check your internet connection.';
    case 'auth/requires-recent-login':
      return 'This operation is sensitive and requires recent authentication. Please log in again.';
    case 'permission-denied':
      return 'Database write permission denied. Please verify your Firestore security rules for the donors collection.';
    case 'unavailable':
      return 'Cloud Firestore is currently unreachable. Please check your internet connection and try again.';
    case 'not-found':
      return 'Firestore database or collection not found. Please verify your Firebase project configuration.';
    case 'unauthenticated':
      return 'Authentication required to write to Firestore. Please try signing in again.';
    default:
      return defaultFallback;
  }
}
