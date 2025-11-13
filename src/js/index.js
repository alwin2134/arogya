// ============================================
// STATE MANAGEMENT
// ============================================
let appState = {
  currentScreen: 'WELCOME',
  isListening: false,
  isProcessing: false,
  transcript: '',
  entities: [],
  selectedSpecialty: null,
  selectedHospital: null,
  appointmentData: null,
  conversationHistory: []
};

// ============================================
// DEMO DATA
// ============================================
const demoSymptoms = ['fever', 'stomach pain', 'headache', 'nausea'];
const demoSpecialties = [
  { id: 1, name: 'General Physician', reason: 'For general symptoms and initial diagnosis', iconType: 'stethoscope' },
  { id: 2, name: 'Gastroenterologist', reason: 'Specialized in digestive system issues', iconType: 'activity' }
];
const demoHospitals = [
  { 
    id: 1, 
    name: 'Dr. Sharma', 
    specialty: 'General Physician',
    clinic: 'City Health Center',
    distance: '2.3 km',
    rating: 4.8,
    nextSlot: '3:15 PM Today',
    needsVerification: true,
    available: true
  },
  { 
    id: 2, 
    name: 'Dr. Patel', 
    specialty: 'General Physician',
    clinic: 'Apollo Clinic',
    distance: '3.1 km',
    rating: 4.9,
    nextSlot: '4:00 PM Today',
    needsVerification: false,
    available: true
  }
];

// ============================================
// VOICE INTERACTION
// ============================================
function toggleVoice() {
  if (appState.isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  appState.isListening = true;
  
  // Update UI
  document.getElementById('voiceButton').classList.add('listening-pulse', 'breathe-animation');
  document.getElementById('voiceButtonText').textContent = 'Listening...';
  document.getElementById('transcriptArea').classList.remove('hidden');
  
  // Hide welcome screen, show conversation
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('conversationArea').classList.remove('hidden');
  updateMainContentAlignment();
  
  // Simulate live transcription
  simulateLiveTranscription();
}

function stopListening() {
  appState.isListening = false;
  appState.isProcessing = true;
  
  // Update UI
  document.getElementById('voiceButton').classList.remove('listening-pulse', 'breathe-animation');
  document.getElementById('micIcon').classList.add('hidden');
  document.getElementById('spinnerIcon').classList.remove('hidden');
  document.getElementById('voiceButtonText').textContent = 'Processing...';
  
  // Process the input
  setTimeout(() => {
    processSymptoms();
  }, 1500);
}

function simulateLiveTranscription() {
  const fullText = "I have fever and stomach pain for the last 2 days";
  let index = 0;
  const transcriptEl = document.getElementById('liveTranscript');
  
  const interval = setInterval(() => {
    if (!appState.isListening) {
      clearInterval(interval);
      return;
    }
    
    if (index < fullText.length) {
      appState.transcript = fullText.substring(0, index + 1);
      transcriptEl.textContent = appState.transcript;
      index++;
    } else {
      clearInterval(interval);
      setTimeout(() => stopListening(), 800);
    }
  }, 100);
}

// ============================================
// TEXT INPUT
// ============================================
function showTypeInput() {
  document.getElementById('voiceInputSection').classList.add('hidden');
  document.getElementById('textInputSection').classList.remove('hidden');
  document.getElementById('textInput').focus();
}

function showVoiceInput() {
  document.getElementById('textInputSection').classList.add('hidden');
  document.getElementById('voiceInputSection').classList.remove('hidden');
}

function submitText() {
  const input = document.getElementById('textInput').value.trim();
  if (!input) return;
  
  appState.transcript = input;
  
  // Hide welcome, show conversation
  document.getElementById('welcomeScreen').classList.add('hidden');
  document.getElementById('conversationArea').classList.remove('hidden');
  updateMainContentAlignment();
  
  // Add user message
  addMessage('user', input);
  
  // Clear input
  document.getElementById('textInput').value = '';
  
  // Hide text input section
  document.getElementById('textInputSection').classList.add('hidden');
  document.getElementById('voiceInputSection').classList.remove('hidden');
  
  // Process
  appState.isProcessing = true;
  document.getElementById('micIcon').classList.add('hidden');
  document.getElementById('spinnerIcon').classList.remove('hidden');
  document.getElementById('voiceButtonText').textContent = 'Processing...';
  
  setTimeout(() => {
    processSymptoms();
  }, 1500);
}

// ============================================
// SYMPTOM PROCESSING
// ============================================
function processSymptoms() {
  // Extract entities
  appState.entities = [
    { id: 1, text: 'Fever', type: 'symptom' },
    { id: 2, text: 'Stomach Pain', type: 'symptom' },
    { id: 3, text: '2 Days', type: 'duration' }
  ];
  
  // Add AI response
  addMessage('ai', "Thank you. I've noted your symptoms. Let me recommend the best specialists for you...");
  
  // Show entities
  displayEntities();
  
  // Reset voice button
  resetVoiceButton();
  
  // Show specialties after a delay
  setTimeout(() => {
    displaySpecialties();
  }, 1500);
}

function displayEntities() {
  const container = document.getElementById('entityPills');
  const section = document.getElementById('entitySection');
  
  container.innerHTML = '';
  appState.entities.forEach(entity => {
    const pill = document.createElement('div');
    pill.className = 'bg-teal-100 text-teal-800 text-sm font-medium px-3 py-2 rounded-full flex items-center gap-2 fade-in';
    pill.innerHTML = `
      <span>${entity.text}</span>
      <button onclick="removeEntity(${entity.id})" class="hover:bg-teal-200 rounded-full p-0.5 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    container.appendChild(pill);
  });
  
  section.classList.remove('hidden');
  scrollToBottom();
}

function removeEntity(id) {
  appState.entities = appState.entities.filter(e => e.id !== id);
  displayEntities();
  
  if (appState.entities.length === 0) {
    document.getElementById('entitySection').classList.add('hidden');
    addMessage('ai', "I notice you removed all symptoms. Could you please tell me what's bothering you?");
    resetVoiceButton();
  }
}

// ============================================
// SPECIALTY SELECTION
// ============================================
function getSpecialtyIcon(iconType) {
  const icons = {
    'stethoscope': `<svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
      <circle cx="20" cy="10" r="2"></circle>
    </svg>`,
    'activity': `<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>`
  };
  return icons[iconType] || icons['stethoscope'];
}

function displaySpecialties() {
  const container = document.getElementById('specialtyCards');
  const section = document.getElementById('specialtySection');
  
  addMessage('ai', "Based on your symptoms, I recommend seeing one of these specialists:");
  
  container.innerHTML = '';
  demoSpecialties.forEach(specialty => {
    const card = document.createElement('div');
    card.className = 'bg-white border-2 border-slate-200 hover:border-teal-500 rounded-lg p-4 cursor-pointer transition-all fade-in';
    card.onclick = () => selectSpecialty(specialty);
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">${getSpecialtyIcon(specialty.iconType)}</div>
        <div class="flex-1">
          <h4 class="font-semibold text-slate-900">${specialty.name}</h4>
          <p class="text-sm text-slate-600 mt-1">${specialty.reason}</p>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </div>
    `;
    container.appendChild(card);
  });
  
  section.classList.remove('hidden');
  scrollToBottom();
}

function selectSpecialty(specialty) {
  appState.selectedSpecialty = specialty;
  
  // Hide specialty section
  document.getElementById('specialtySection').classList.add('hidden');
  
  addMessage('ai', `Great choice. Let me find available ${specialty.name} doctors near you...`);
  
  setTimeout(() => {
    displayHospitals();
  }, 1500);
}

// ============================================
// HOSPITAL SELECTION
// ============================================
function displayHospitals() {
  const container = document.getElementById('hospitalCards');
  const section = document.getElementById('hospitalSection');
  
  addMessage('ai', "Here are the best options for you:");
  
  container.innerHTML = '';
  demoHospitals.forEach(hospital => {
    const card = document.createElement('div');
    card.className = 'bg-white border-2 border-slate-200 hover:border-teal-500 rounded-lg p-4 cursor-pointer transition-all fade-in';
    card.onclick = () => selectHospital(hospital);
    card.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div>
          <h4 class="font-semibold text-slate-900">${hospital.name}</h4>
          <p class="text-sm text-slate-600">${hospital.clinic}</p>
        </div>
        <div class="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
          <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="text-sm font-medium text-yellow-900">${hospital.rating}</span>
        </div>
      </div>
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-600 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          ${hospital.distance}
        </span>
        <span class="font-medium text-teal-700">${hospital.nextSlot}</span>
      </div>
      ${hospital.needsVerification ? '<p class="text-xs text-blue-600 mt-2 flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>Requires verification call</p>' : ''}
    `;
    container.appendChild(card);
  });
  
  section.classList.remove('hidden');
  scrollToBottom();
}

function selectHospital(hospital) {
  appState.selectedHospital = hospital;
  
  // Hide hospital section
  document.getElementById('hospitalSection').classList.add('hidden');
  
  if (hospital.needsVerification) {
    addMessage('ai', `${hospital.name}'s clinic isn't in our instant network. To verify the slot, I will now call the clinic on your behalf. This may take 1-2 minutes.`);
    
    setTimeout(() => {
      showVerificationModal();
    }, 1000);
  } else {
    confirmAppointment();
  }
}

// ============================================
// VERIFICATION PROCESS
// ============================================
function showVerificationModal() {
  const overlay = document.getElementById('verificationOverlay');
  const stepsList = document.getElementById('verificationStepsList');
  
  const steps = [
    { id: 1, text: "Calling clinic", detail: `Contacting ${appState.selectedHospital.name}'s reception...`, status: 'processing' },
    { id: 2, text: "On hold", detail: "Speaking with the automated system...", status: 'pending' },
    { id: 3, text: "Querying availability", detail: "Asking the receptionist for a slot around 3:00 PM...", status: 'pending' },
    { id: 4, text: "Confirmed", detail: "Your appointment is booked!", status: 'pending' }
  ];
  
  stepsList.innerHTML = '';
  steps.forEach(step => {
    const stepEl = document.createElement('div');
    stepEl.id = `step-${step.id}`;
    stepEl.className = 'flex items-start gap-3';
    stepEl.innerHTML = `
      <div class="flex-shrink-0 mt-1">
        ${step.status === 'processing' ? 
          '<svg class="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>' :
        step.status === 'complete' ?
          '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
          '<div class="w-5 h-5 rounded-full border-2 border-slate-300"></div>'
        }
      </div>
      <div class="flex-1">
        <p class="font-medium text-slate-900">${step.text}</p>
        <p class="text-sm text-slate-600 mt-0.5">${step.detail}</p>
      </div>
    `;
    stepsList.appendChild(stepEl);
  });
  
  overlay.classList.remove('hidden');
  
  // Simulate step progression
  simulateVerificationSteps(steps);
}

function simulateVerificationSteps(steps) {
  let currentStep = 0;
  
  const interval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      // Mark current as complete
      const currentEl = document.getElementById(`step-${steps[currentStep].id}`);
      currentEl.querySelector('div').innerHTML = '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      
      currentStep++;
      
      // Mark next as processing
      const nextEl = document.getElementById(`step-${steps[currentStep].id}`);
      nextEl.querySelector('div').innerHTML = '<svg class="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    } else {
      // Final step - complete
      const finalEl = document.getElementById(`step-${steps[currentStep].id}`);
      finalEl.querySelector('div').innerHTML = '<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
      
      clearInterval(interval);
      
      setTimeout(() => {
        hideVerificationModal();
        confirmAppointment();
      }, 1500);
    }
  }, 2000);
}

function hideVerificationModal() {
  document.getElementById('verificationOverlay').classList.add('hidden');
}

// ============================================
// CONFIRMATION
// ============================================
function confirmAppointment() {
  appState.appointmentData = {
    doctor: appState.selectedHospital.name,
    specialty: appState.selectedSpecialty.name,
    clinic: appState.selectedHospital.clinic,
    time: appState.selectedHospital.nextSlot,
    date: 'Today, November 13, 2025',
    address: '123 Health Street, New Delhi'
  };
  
  // Hide all sections
  document.getElementById('conversationArea').classList.add('hidden');
  document.getElementById('entitySection').classList.add('hidden');
  document.getElementById('voiceInputSection').classList.add('hidden');
  
  // Show confirmation
  const confirmScreen = document.getElementById('confirmationScreen');
  const detailsContainer = document.getElementById('appointmentDetails');
  
  detailsContainer.innerHTML = `
    <div class="flex items-start gap-3 pb-4 border-b border-slate-200">
      <svg class="w-5 h-5 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <div>
        <p class="text-xs text-slate-500">Doctor</p>
        <p class="font-semibold text-slate-900">${appState.appointmentData.doctor}</p>
        <p class="text-sm text-slate-600">${appState.appointmentData.specialty}</p>
      </div>
    </div>
    <div class="flex items-start gap-3 pb-4 border-b border-slate-200">
      <svg class="w-5 h-5 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <div>
        <p class="text-xs text-slate-500">Date & Time</p>
        <p class="font-semibold text-slate-900">${appState.appointmentData.time}</p>
        <p class="text-sm text-slate-600">${appState.appointmentData.date}</p>
      </div>
    </div>
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 text-slate-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
      <div>
        <p class="text-xs text-slate-500">Location</p>
        <p class="font-semibold text-slate-900">${appState.appointmentData.clinic}</p>
        <p class="text-sm text-slate-600">${appState.appointmentData.address}</p>
      </div>
    </div>
  `;
  
  confirmScreen.classList.remove('hidden');
  scrollToBottom();
}

function addToCalendar() {
  alert('Calendar integration would be implemented here. In production, this would add the appointment to your calendar app.');
}

function startOver() {
  // Reset state
  appState = {
    currentScreen: 'WELCOME',
    isListening: false,
    isProcessing: false,
    transcript: '',
    entities: [],
    selectedSpecialty: null,
    selectedHospital: null,
    appointmentData: null,
    conversationHistory: []
  };
  
  // Reset UI
  document.getElementById('confirmationScreen').classList.add('hidden');
  document.getElementById('welcomeScreen').classList.remove('hidden');
  document.getElementById('conversationArea').innerHTML = '';
  document.getElementById('voiceInputSection').classList.remove('hidden');
  document.getElementById('transcriptArea').classList.add('hidden');
  updateMainContentAlignment();
  
  resetVoiceButton();
  scrollToTop();
}

// ============================================
// MESSAGE HANDLING
// ============================================
function addMessage(type, text) {
  const container = document.getElementById('conversationArea');
  const messageDiv = document.createElement('div');
  messageDiv.className = `fade-in ${type === 'user' ? 'flex justify-end' : ''}`;
  
  const bubble = document.createElement('div');
  bubble.className = `max-w-[85%] px-4 py-3 rounded-lg ${
    type === 'user' 
      ? 'bg-teal-600 text-white rounded-br-none' 
      : 'bg-slate-100 text-slate-900 rounded-bl-none'
  }`;
  bubble.textContent = text;
  
  messageDiv.appendChild(bubble);
  container.appendChild(messageDiv);
  
  appState.conversationHistory.push({ type, text });
  scrollToBottom();
}

// ============================================
// UI UTILITIES
// ============================================
function resetVoiceButton() {
  appState.isProcessing = false;
  document.getElementById('micIcon').classList.remove('hidden');
  document.getElementById('spinnerIcon').classList.add('hidden');
  document.getElementById('voiceButtonText').textContent = 'Tap to speak again';
  document.getElementById('transcriptArea').classList.add('hidden');
}

function scrollToBottom() {
  const mainContent = document.getElementById('mainContent');
  setTimeout(() => {
    mainContent.scrollTop = mainContent.scrollHeight;
  }, 100);
}

function scrollToTop() {
  const mainContent = document.getElementById('mainContent');
  mainContent.scrollTop = 0;
}

function updateMainContentAlignment() {
  const mainContent = document.getElementById('mainContent');
  const welcomeScreen = document.getElementById('welcomeScreen');
  
  if (!welcomeScreen.classList.contains('hidden')) {
    // Welcome screen is visible - center it with gradient
    mainContent.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-b', 'from-teal-50/30', 'to-white');
  } else {
    // Other screens are visible - align to top, remove gradient
    mainContent.classList.remove('flex', 'items-center', 'justify-center', 'bg-gradient-to-b', 'from-teal-50/30', 'to-white');
  }
}

// ============================================
// KEYBOARD SUPPORT
// ============================================
document.getElementById('textInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    submitText();
  }
});

// ============================================
// PWA & INITIALIZATION
// ============================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed'));
  });
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Arogya AI Appointment Booking - Ready');
  // Initialize main content alignment for welcome screen
  updateMainContentAlignment();
});
