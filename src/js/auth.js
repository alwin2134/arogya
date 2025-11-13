// State management
let currentUserType = 'patient';
let currentTab = 'signin';
let currentPhone = '';
let otpTimer = null;
let otpTimeLeft = 30;

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initializeAuth();
});

function initializeAuth() {
  // Check URL parameters for user type
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  
  if (typeParam === 'hospital') {
    switchUserType('hospital');
  }

  // User type toggle
  document.querySelectorAll('.user-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      switchUserType(type);
    });
  });

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabType = tab.dataset.tab;
      switchTab(tabType);
    });
  });

  // Footer link
  document.getElementById('footerLink').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab(currentTab === 'signin' ? 'signup' : 'signin');
  });

  // Password toggle
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const inputId = btn.dataset.input;
      const input = document.getElementById(inputId);
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
      } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
      }
      lucide.createIcons();
    });
  });

  // Form submissions
  document.getElementById('signinForm').addEventListener('submit', handleSignIn);
  document.getElementById('signupForm').addEventListener('submit', handleSignUp);
  document.getElementById('verifyOtpBtn').addEventListener('click', handleVerifyOtp);
  document.getElementById('changePhoneBtn').addEventListener('click', handleChangePhone);
  document.getElementById('resendOtpBtn').addEventListener('click', handleResendOtp);

  // OTP inputs
  initializeOtpInputs();

  // Phone input validation
  document.querySelectorAll('.phone-input').forEach(input => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
  });
}

function switchUserType(type) {
  currentUserType = type;
  
  // Update button states
  document.querySelectorAll('.user-type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  // Update title and subtitle
  const authTitle = document.getElementById('authTitle');
  const authSubtitle = document.getElementById('authSubtitle');
  
  if (type === 'hospital') {
    authTitle.textContent = currentTab === 'signin' ? 'Hospital Login' : 'Register Your Hospital';
    authSubtitle.textContent = currentTab === 'signin' ? 
      'Manage appointments and patient records' : 
      'Join our network of verified healthcare providers';
  } else {
    authTitle.textContent = currentTab === 'signin' ? 'Welcome Back' : 'Create Account';
    authSubtitle.textContent = currentTab === 'signin' ? 
      'Sign in to book appointments instantly' : 
      'Get started with AI-powered healthcare';
  }
}

function switchTab(tab) {
  currentTab = tab;
  
  // Update tab states
  document.querySelectorAll('.auth-tab').forEach(tabBtn => {
    tabBtn.classList.toggle('active', tabBtn.dataset.tab === tab);
  });

  // Update form visibility
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  
  if (tab === 'signin') {
    document.getElementById('signinForm').classList.add('active');
    document.getElementById('footerText').innerHTML = 
      'Don\'t have an account? <a href="#" id="footerLink">Sign Up</a>';
  } else {
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('footerText').innerHTML = 
      'Already have an account? <a href="#" id="footerLink">Sign In</a>';
  }

  // Re-attach footer link listener
  document.getElementById('footerLink').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab(currentTab === 'signin' ? 'signup' : 'signin');
  });

  // Update title and subtitle
  switchUserType(currentUserType);
}

function handleSignIn(e) {
  e.preventDefault();
  
  const phone = document.getElementById('signinPhone').value;
  const password = document.getElementById('signinPassword').value;
  
  // Validation
  let isValid = true;
  
  if (!phone || phone.length !== 10) {
    showError('signinPhone', 'signinPhoneError');
    isValid = false;
  } else {
    hideError('signinPhone', 'signinPhoneError');
  }
  
  if (!password) {
    showError('signinPassword', 'signinPasswordError');
    isValid = false;
  } else {
    hideError('signinPassword', 'signinPasswordError');
  }
  
  if (!isValid) return;

  // Show loading state
  const btn = e.target.querySelector('.btn-primary');
  btn.classList.add('btn-loading');

  // Simulate API call
  setTimeout(() => {
    btn.classList.remove('btn-loading');
    currentPhone = '+91' + phone;
    showOtpSection();
  }, 1000);
}

function handleSignUp(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  
  // Validation
  let isValid = true;
  
  if (!name || name.trim().length < 2) {
    showError('signupName', 'signupNameError');
    isValid = false;
  } else {
    hideError('signupName', 'signupNameError');
  }
  
  if (!phone || phone.length !== 10) {
    showError('signupPhone', 'signupPhoneError');
    isValid = false;
  } else {
    hideError('signupPhone', 'signupPhoneError');
  }
  
  if (!password || password.length < 6) {
    showError('signupPassword', 'signupPasswordError');
    isValid = false;
  } else {
    hideError('signupPassword', 'signupPasswordError');
  }
  
  if (!isValid) return;

  // Show loading state
  const btn = e.target.querySelector('.btn-primary');
  btn.classList.add('btn-loading');

  // Simulate API call
  setTimeout(() => {
    btn.classList.remove('btn-loading');
    currentPhone = '+91' + phone;
    showOtpSection();
  }, 1000);
}

function showOtpSection() {
  // Hide forms
  document.querySelectorAll('.auth-form').forEach(form => {
    form.style.display = 'none';
  });
  document.getElementById('formFooter').style.display = 'none';
  document.querySelector('.auth-tabs').style.display = 'none';

  // Show OTP section
  document.getElementById('otpSection').classList.add('show');
  document.getElementById('otpPhoneDisplay').textContent = currentPhone;

  // Update title
  document.getElementById('authTitle').textContent = 'Verify Your Phone';
  document.getElementById('authSubtitle').textContent = 'Enter the OTP sent to your phone';

  // Start OTP timer
  startOtpTimer();

  // Focus first OTP input
  document.querySelector('.otp-input').focus();
}

function initializeOtpInputs() {
  const inputs = document.querySelectorAll('.otp-input');
  
  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Only allow numbers
      if (!/^[0-9]$/.test(value)) {
        e.target.value = '';
        return;
      }

      // Add filled class
      if (value) {
        e.target.classList.add('filled');
      } else {
        e.target.classList.remove('filled');
      }

      // Auto-focus next input
      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }

      // Auto-verify when all filled
      const allFilled = Array.from(inputs).every(inp => inp.value);
      if (allFilled) {
        setTimeout(() => handleVerifyOtp(), 300);
      }
    });

    input.addEventListener('keydown', (e) => {
      // Handle backspace
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }

      // Handle paste
      if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        navigator.clipboard.readText().then(text => {
          const digits = text.replace(/[^0-9]/g, '').slice(0, 6);
          digits.split('').forEach((digit, i) => {
            if (inputs[i]) {
              inputs[i].value = digit;
              inputs[i].classList.add('filled');
            }
          });
          if (inputs[digits.length]) {
            inputs[digits.length].focus();
          }
        });
      }
    });
  });
}

function startOtpTimer() {
  otpTimeLeft = 30;
  updateOtpTimer();
  
  otpTimer = setInterval(() => {
    otpTimeLeft--;
    updateOtpTimer();
    
    if (otpTimeLeft <= 0) {
      clearInterval(otpTimer);
      document.getElementById('resendOtpBtn').disabled = false;
    }
  }, 1000);
}

function updateOtpTimer() {
  document.getElementById('otpTimer').textContent = `(${otpTimeLeft}s)`;
}

function handleResendOtp() {
  const btn = document.getElementById('resendOtpBtn');
  btn.disabled = true;
  
  // Clear existing inputs
  document.querySelectorAll('.otp-input').forEach(input => {
    input.value = '';
    input.classList.remove('filled');
  });

  // Simulate API call
  setTimeout(() => {
    startOtpTimer();
    document.querySelector('.otp-input').focus();
  }, 1000);
}

function handleVerifyOtp() {
  const inputs = document.querySelectorAll('.otp-input');
  const otp = Array.from(inputs).map(input => input.value).join('');
  
  if (otp.length !== 6) {
    document.getElementById('otpError').classList.add('show');
    return;
  }

  document.getElementById('otpError').classList.remove('show');

  // Show loading state
  const btn = document.getElementById('verifyOtpBtn');
  btn.classList.add('btn-loading');

  // Simulate API call
  setTimeout(() => {
    btn.classList.remove('btn-loading');
    
    // Clear timer
    if (otpTimer) clearInterval(otpTimer);

    // Show success
    document.getElementById('otpSection').style.display = 'none';
    document.getElementById('successMessage').classList.add('show');
    lucide.createIcons();

    // Redirect after 2 seconds
    setTimeout(() => {
      if (currentUserType === 'hospital') {
        window.location.href = './dashboard.html';
      } else {
        window.location.href = './index.html';
      }
    }, 2000);
  }, 1500);
}

function handleChangePhone() {
  // Clear timer
  if (otpTimer) clearInterval(otpTimer);

  // Reset OTP section
  document.getElementById('otpSection').classList.remove('show');
  document.querySelectorAll('.otp-input').forEach(input => {
    input.value = '';
    input.classList.remove('filled');
  });

  // Show form again
  document.querySelector('.auth-tabs').style.display = 'flex';
  document.getElementById('formFooter').style.display = 'block';
  
  if (currentTab === 'signin') {
    document.getElementById('signinForm').style.display = 'block';
    document.getElementById('signinForm').classList.add('active');
  } else {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('signupForm').classList.add('active');
  }

  // Update title
  switchUserType(currentUserType);
}

function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  
  if (input.classList) {
    input.classList.add('error');
  } else {
    input.parentElement.querySelector('.phone-input').classList.add('error');
  }
  error.classList.add('show');
}

function hideError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  
  if (input.classList) {
    input.classList.remove('error');
  } else {
    input.parentElement.querySelector('.phone-input').classList.remove('error');
  }
  error.classList.remove('show');
}
