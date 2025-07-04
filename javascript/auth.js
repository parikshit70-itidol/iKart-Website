// javascript/auth.js
import { signupUser, loginUser, showCustomAlert } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // --- Login Form Handler ---
    if (loginForm) {
        console.log('AUTH.JS: Login form found. Attaching event listener.');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            e.stopPropagation(); // Stop event propagation

            console.log('AUTH.JS: Login form submitted.');
            if (loginForm.checkValidity()) {
                const identifier = document.getElementById('loginIdentifier').value;
                const password = document.getElementById('loginPassword').value;
                console.log('AUTH.JS: Login form is valid. Attempting login with:', { identifier, password });

                const user = loginUser(identifier, password);
                if (user) {
                    console.log('AUTH.JS: Login successful. Redirecting to index.html.');
                    window.location.href = 'index.html';
                } else {
                    console.warn('AUTH.JS: Login failed (loginUser returned null).');
                }
            } else {
                console.warn('AUTH.JS: Login form invalid due to HTML validation. Showing feedback.');
            }
            loginForm.classList.add('was-validated'); // Show Bootstrap validation feedback
        });
    } else {
        console.log('AUTH.JS: Login form (id="loginForm") not found on this page.');
    }

    // --- Signup Form Handler ---
    if (signupForm) {
        console.log('AUTH.JS: Signup form found. Attaching event listener.');
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            e.stopPropagation(); // Stop event propagation

            console.log('AUTH.JS: Signup form submitted.');
            if (signupForm.checkValidity()) {
                const email = document.getElementById('signupEmail').value;
                const username = document.getElementById('signupUsername').value;
                const password = document.getElementById('signupPassword').value;
                console.log('AUTH.JS: Signup form is valid. Attempting signup with:', { email, username, password });

                if (signupUser(email, username, password)) {
                    console.log('AUTH.JS: Signup successful. Redirecting to login.html.');
                    window.location.href = 'login.html';
                } else {
                    console.warn('AUTH.JS: Signup failed (signupUser returned false).');
                }
            } else {
                console.warn('AUTH.JS: Signup form invalid due to HTML validation. Showing feedback.');
            }
            signupForm.classList.add('was-validated'); // Show Bootstrap validation feedback
        });
    } else {
        console.log('AUTH.JS: Signup form (id="signupForm") not found on this page.');
    }
});
