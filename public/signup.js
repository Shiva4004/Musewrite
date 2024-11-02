// Import Firebase configuration and auth functions
import { signUpWithEmail, signInWithGoogle } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
const signupForm = document.querySelector('form');
const googleBtn = document.querySelector('.social-btn.google');
const facebookBtn = document.querySelector('.social-btn.facebook');
const twitterBtn = document.querySelector('.social-btn.twitter');

// Password strength checker
const passwordInput = document.getElementById('password');
const strengthMeter = document.querySelector('.strength-meter');

passwordInput.addEventListener('input', () => {
const strength = checkPasswordStrength(passwordInput.value);
updateStrengthMeter(strength);
});

// Google Sign In
googleBtn.addEventListener('click', async () => {
try {
    const user = await signInWithGoogle();
    if (user) {
        showSuccessToast('Successfully signed in!');
        window.location.href = '/write.html';
    }
} catch (error) {
    showErrorToast(error.message);
}
});

// Facebook and Twitter buttons show "Coming Soon" toast
[facebookBtn, twitterBtn].forEach(btn => {
btn.addEventListener('click', () => {
    showInfoToast('Coming soon! Please use Google Sign In for now.');
});
});

// Email Sign Up
signupForm.addEventListener('submit', async (e) => {
e.preventDefault();

const formData = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    birthdate: document.getElementById('birthdate').value
};

if (!validateForm(formData)) return;

try {
    const user = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.birthdate
    );

    if (user) {
        showSuccessToast('Account created successfully!');
        window.location.href = '/confirm.html';
    }
} catch (error) {
    showErrorToast(error.message);
}
});
});

// Utility Functions
function checkPasswordStrength(password) {
const criteria = {
length: password.length >= 8,
hasUpper: /[A-Z]/.test(password),
hasLower: /[a-z]/.test(password),
hasNumber: /\d/.test(password),
hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
};

const strength = Object.values(criteria).filter(Boolean).length;
return strength < 3 ? 'weak' : strength < 4 ? 'medium' : 'strong';
}

function updateStrengthMeter(strength) {
const strengthMeter = document.querySelector('.strength-meter');
strengthMeter.className = 'strength-meter ' + strength;
}

function validateForm(data) {
if (!data.email || !data.password || !data.firstName || !data.lastName || !data.birthdate) {
showErrorToast('Please fill in all fields');
return false;
}

if (checkPasswordStrength(data.password) === 'weak') {
showErrorToast('Please choose a stronger password');
return false;
}

return true;
}

// Toast Notifications
function showToast(message, type) {
const toast = document.createElement('div');
toast.className = `toast ${type}`;
toast.textContent = message;
document.body.appendChild(toast);

setTimeout(() => {
toast.classList.add('show');
setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
}, 3000);
}, 100);
}

const showSuccessToast = msg => showToast(msg, 'success');
const showErrorToast = msg => showToast(msg, 'error');
const showInfoToast = msg => showToast(msg, 'info');

// CSS for toasts (add to your existing CSS)
const toastStyles = `
.toast {
position: fixed;
top: 20px;
right: 20px;
padding: 15px 25px;
border-radius: 10px;
color: white;
transform: translateX(120%);
transition: transform 0.3s ease;
z-index: 1000;
}

.toast.show {
transform: translateX(0);
}

.toast.success {
background: #2ecc71;
}

.toast.error {
background: #e74c3c;
}

.toast.info {
background: #3498db;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);
