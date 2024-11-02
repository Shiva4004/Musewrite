// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgCsFBQxndn6jqx6BWy0nMGrNy0A7tGXQ",
    authDomain: "musewrite-71e8c.firebaseapp.com",
    projectId: "musewrite-71e8c",
    storageBucket: "musewrite-71e8c.appspot.com",
    messagingSenderId: "497700060224",
    appId: "1:497700060224:web:6d23b3dafaa68a954b73a5",
    measurementId: "G-HB7J9XZSB5"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Google Auth Provider with custom parameters
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  googleProvider.setCustomParameters({
      prompt: 'select_account'
  });
  
  // Authentication State Observer
  auth.onAuthStateChanged((user) => {
      if (user) {
          const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
          };
          localStorage.setItem('user', JSON.stringify(userData));
      } else {
          localStorage.removeItem('user');
      }
  });
  
  // Google Sign In Function
  function signInWithGoogle() {
      return auth.signInWithPopup(googleProvider)
          .then((result) => {
              return result.user;
          })
          .catch((error) => {
              throw new Error(error.message);
          });
  }
  
  // Email/Password Sign Up Function
  function signUpWithEmail(email, password, firstName, lastName, birthdate) {
      return auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
              const user = userCredential.user;
              return user.updateProfile({
                  displayName: `${firstName} ${lastName}`,
                  customClaims: {
                      birthdate: birthdate
                  }
              });
          })
          .catch((error) => {
              throw new Error(error.message);
          });
  }
  
  // Sign Out Function
  function signOut() {
      return auth.signOut()
          .then(() => {
              localStorage.removeItem('user');
              window.location.href = '/login.html';
          })
          .catch((error) => {
              throw new Error(error.message);
          });
  }
  
  // Check Authentication Status
  function isAuthenticated() {
      return !!auth.currentUser;
  }
  
  // Get Current User
  function getCurrentUser() {
      return auth.currentUser;
  }
  
  // Export all functions
  export {
      signInWithGoogle,
      signUpWithEmail,
      signOut,
      isAuthenticated,
      getCurrentUser
  };
  