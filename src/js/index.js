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
  selectedSlot: null,
  patientInfo: null,
  paymentInfo: null,
  appointmentData: null,
  conversationHistory: [],
  uploadedFiles: []
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
    available: true,
    consultationFee: 500,
    slots: [] // Will be populated dynamically
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
    available: true,
    consultationFee: 600,
    slots: [
      { id: 's1', date: '2025-11-14', time: '4:00 PM', available: true },
      { id: 's2', date: '2025-11-14', time: '5:00 PM', available: true },
      { id: 's3', date: '2025-11-15', time: '10:00 AM', available: true },
      { id: 's4', date: '2025-11-15', time: '11:00 AM', available: true },
      { id: 's5', date: '2025-11-15', time: '3:00 PM', available: true }
    ]
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
  
  addMessage('user', `Book with ${hospital.name} at ${hospital.clinic}`);
  addMessage('bot', `Great choice! Let me show you the available time slots for ${hospital.name}.`);
  
  // Show slot selection
  setTimeout(() => {
    showSlotSelection(hospital);
  }, 800);
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

// ============================================
// SLOT SELECTION
// ============================================
function showSlotSelection(hospital) {
  appState.selectedHospital = hospital;
  
  // Hide hospital section
  document.getElementById('hospitalSection').classList.add('hidden');
  
  // Show slot section
  const slotSection = document.getElementById('slotSection');
  slotSection.classList.remove('hidden');
  
  // Check if slots need verification
  if (hospital.needsVerification || !hospital.slots || hospital.slots.length === 0) {
    // Show verification notice
    document.getElementById('slotVerificationNotice').classList.remove('hidden');
    document.getElementById('slotSectionSubtext').textContent = 'Checking availability with hospital...';
    
    // Simulate calling hospital for slot verification
    setTimeout(() => {
      verifyAndShowSlots(hospital);
    }, 3000);
  } else {
    // Show available slots immediately
    displaySlots(hospital.slots);
  }
  
  scrollToBottom();
}

function verifyAndShowSlots(hospital) {
  // Hide verification notice
  document.getElementById('slotVerificationNotice').classList.add('hidden');
  document.getElementById('slotSectionSubtext').textContent = 'Choose your preferred date and time';
  
  // Generate slots (simulating hospital confirmation)
  const slots = [
    { id: 's1', date: '2025-11-14', time: '3:15 PM', available: true },
    { id: 's2', date: '2025-11-14', time: '4:30 PM', available: true },
    { id: 's3', date: '2025-11-14', time: '5:45 PM', available: true },
    { id: 's4', date: '2025-11-15', time: '9:00 AM', available: true },
    { id: 's5', date: '2025-11-15', time: '10:30 AM', available: true },
    { id: 's6', date: '2025-11-15', time: '2:00 PM', available: true }
  ];
  
  hospital.slots = slots;
  displaySlots(slots);
  
  addMessage('bot', `I've confirmed ${slots.length} available slots with ${hospital.clinic}. Please select your preferred time.`);
}

function displaySlots(slots) {
  const container = document.getElementById('slotCards');
  container.innerHTML = '';
  
  // Group slots by date
  const slotsByDate = {};
  slots.forEach(slot => {
    if (!slotsByDate[slot.date]) {
      slotsByDate[slot.date] = [];
    }
    slotsByDate[slot.date].push(slot);
  });
  
  // Display slots grouped by date
  Object.keys(slotsByDate).forEach(date => {
    const dateLabel = formatDate(date);
    const dateHeader = document.createElement('div');
    dateHeader.className = 'text-sm font-semibold text-slate-700 mt-4 mb-2';
    dateHeader.textContent = dateLabel;
    container.appendChild(dateHeader);
    
    const slotsGrid = document.createElement('div');
    slotsGrid.className = 'grid grid-cols-3 gap-2';
    
    slotsByDate[date].forEach(slot => {
      const slotBtn = document.createElement('button');
      slotBtn.className = 'px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-sm font-medium text-slate-700';
      slotBtn.textContent = slot.time;
      slotBtn.onclick = () => selectSlot(slot);
      slotsGrid.appendChild(slotBtn);
    });
    
    container.appendChild(slotsGrid);
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
  }
}

function selectSlot(slot) {
  appState.selectedSlot = slot;
  
  addMessage('user', `${formatDate(slot.date)} at ${slot.time}`);
  addMessage('bot', 'Great! Now I need some information to complete your booking.');
  
  // Hide slot section and show patient info section
  document.getElementById('slotSection').classList.add('hidden');
  document.getElementById('patientInfoSection').classList.remove('hidden');
  
  scrollToBottom();
}

// ============================================
// PATIENT INFORMATION
// ============================================
function handleFileUpload(input) {
  const fileList = document.getElementById('uploadedFilesList');
  fileList.innerHTML = '';
  
  Array.from(input.files).forEach((file, index) => {
    appState.uploadedFiles.push(file);
    
    const fileItem = document.createElement('div');
    fileItem.className = 'flex items-center justify-between p-2 bg-slate-100 rounded text-xs';
    fileItem.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span class="text-slate-700">${file.name}</span>
      </div>
      <button onclick="removeFile(${index})" class="text-red-500 hover:text-red-700">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    fileList.appendChild(fileItem);
  });
}

function removeFile(index) {
  appState.uploadedFiles.splice(index, 1);
  // Re-render file list
  document.getElementById('uploadedFilesList').innerHTML = '';
  // Would need to update the file input here
}

function validatePatientInfo() {
  const name = document.getElementById('patientName').value.trim();
  const age = document.getElementById('patientAge').value;
  const gender = document.getElementById('patientGender').value;
  const phone = document.getElementById('patientPhone').value.trim();
  
  if (!name || !age || !gender || !phone) {
    alert('Please fill in all required fields (Name, Age, Gender, Phone)');
    return false;
  }
  
  if (age < 1 || age > 120) {
    alert('Please enter a valid age');
    return false;
  }
  
  if (phone.length < 10) {
    alert('Please enter a valid phone number');
    return false;
  }
  
  return true;
}

function proceedToPayment() {
  if (!validatePatientInfo()) {
    return;
  }
  
  // Collect patient information
  appState.patientInfo = {
    name: document.getElementById('patientName').value.trim(),
    age: document.getElementById('patientAge').value,
    gender: document.getElementById('patientGender').value,
    phone: document.getElementById('patientPhone').value.trim(),
    email: document.getElementById('patientEmail').value.trim(),
    notes: document.getElementById('patientNotes').value.trim(),
    medicalReports: appState.uploadedFiles
  };
  
  addMessage('bot', `Thank you, ${appState.patientInfo.name}! The consultation fee is ₹${appState.selectedHospital.consultationFee}. Please complete the payment to confirm your appointment.`);
  
  // Update payment amounts
  const consultationFee = appState.selectedHospital.consultationFee;
  const platformFee = 50;
  const total = consultationFee + platformFee;
  
  document.getElementById('consultationFee').textContent = `₹${consultationFee}`;
  document.getElementById('totalAmount').textContent = `₹${total}`;
  document.getElementById('payButtonAmount').textContent = total;
  
  // Hide patient info section and show payment section
  document.getElementById('patientInfoSection').classList.add('hidden');
  document.getElementById('paymentSection').classList.remove('hidden');
  
  scrollToBottom();
}

// ============================================
// PAYMENT PROCESSING
// ============================================
function processPayment() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  const payButton = document.getElementById('payButton');
  
  // Disable button and show loading
  payButton.disabled = true;
  payButton.innerHTML = `
    <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Processing Payment...
  `;
  
  // Simulate payment processing
  setTimeout(() => {
    const consultationFee = appState.selectedHospital.consultationFee;
    const platformFee = 50;
    const total = consultationFee + platformFee;
    
    appState.paymentInfo = {
      method: paymentMethod,
      amount: total,
      consultationFee: consultationFee,
      platformFee: platformFee,
      transactionId: 'TXN' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'SUCCESS'
    };
    
    // Payment successful - show confirmation
    showConfirmation();
  }, 2500);
}

// ============================================
// CONFIRMATION & RECEIPT
// ============================================
function showConfirmation() {
  // Hide payment section
  document.getElementById('paymentSection').classList.add('hidden');
  
  // Hide voice input section
  document.getElementById('voiceInputSection').classList.add('hidden');
  
  // Show confirmation screen
  const confirmationScreen = document.getElementById('confirmationScreen');
  confirmationScreen.classList.remove('hidden');
  
  // Populate receipt
  const receiptNumber = 'APT-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
  const paymentDate = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  
  document.getElementById('receiptNumber').textContent = receiptNumber;
  document.getElementById('paymentDate').textContent = paymentDate;
  document.getElementById('receiptConsultationFee').textContent = `₹${appState.paymentInfo.consultationFee}`;
  document.getElementById('receiptTotalAmount').textContent = `₹${appState.paymentInfo.amount}`;
  document.getElementById('receiptPaymentMethod').textContent = appState.paymentInfo.method.toUpperCase();
  document.getElementById('receiptTransactionId').textContent = appState.paymentInfo.transactionId;
  
  // Populate appointment details
  const appointmentDetails = document.getElementById('appointmentDetails');
  appointmentDetails.innerHTML = `
    <div class="flex items-start gap-3 pb-3 border-b border-slate-300">
      <svg class="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <div class="flex-1">
        <p class="text-xs text-slate-500">Doctor</p>
        <p class="font-semibold text-slate-900">${appState.selectedHospital.name}</p>
        <p class="text-sm text-slate-600">${appState.selectedHospital.specialty}</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3 pb-3 border-b border-slate-300">
      <svg class="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <div class="flex-1">
        <p class="text-xs text-slate-500">Hospital</p>
        <p class="font-semibold text-slate-900">${appState.selectedHospital.clinic}</p>
        <p class="text-sm text-slate-600">${appState.selectedHospital.distance} away</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3 pb-3 border-b border-slate-300">
      <svg class="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <div class="flex-1">
        <p class="text-xs text-slate-500">Appointment</p>
        <p class="font-semibold text-slate-900">${formatDate(appState.selectedSlot.date)}</p>
        <p class="text-sm text-slate-600">${appState.selectedSlot.time}</p>
      </div>
    </div>
    
    <div class="flex items-start gap-3">
      <svg class="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      <div class="flex-1">
        <p class="text-xs text-slate-500">Patient</p>
        <p class="font-semibold text-slate-900">${appState.patientInfo.name}</p>
        <p class="text-sm text-slate-600">${appState.patientInfo.age} years, ${appState.patientInfo.gender}</p>
        <p class="text-sm text-slate-600">${appState.patientInfo.phone}</p>
      </div>
    </div>
  `;
  
  // Store complete appointment data
  appState.appointmentData = {
    receiptNumber,
    paymentDate,
    doctor: appState.selectedHospital,
    slot: appState.selectedSlot,
    patient: appState.patientInfo,
    payment: appState.paymentInfo,
    symptoms: appState.entities,
    specialty: appState.selectedSpecialty
  };
  
  scrollToTop();
  
  addMessage('bot', '🎉 Your appointment has been confirmed! You will receive a confirmation SMS shortly.');
}

function downloadReceipt() {
  // Generate receipt text
  const receipt = `
═══════════════════════════════════
       APPOINTMENT RECEIPT
═══════════════════════════════════

Receipt No: ${appState.appointmentData.receiptNumber}
Date: ${appState.appointmentData.paymentDate}

PAYMENT DETAILS
───────────────────────────────────
Consultation Fee:     ₹${appState.paymentInfo.consultationFee}
Platform Fee:         ₹${appState.paymentInfo.platformFee}
Total Paid:          ₹${appState.paymentInfo.amount}

Payment Method:      ${appState.paymentInfo.method.toUpperCase()}
Transaction ID:      ${appState.paymentInfo.transactionId}
Status:              PAID ✓

APPOINTMENT DETAILS
───────────────────────────────────
Doctor:              ${appState.selectedHospital.name}
Specialty:           ${appState.selectedHospital.specialty}
Hospital:            ${appState.selectedHospital.clinic}

Date:                ${formatDate(appState.selectedSlot.date)}
Time:                ${appState.selectedSlot.time}

PATIENT DETAILS
───────────────────────────────────
Name:                ${appState.patientInfo.name}
Age/Gender:          ${appState.patientInfo.age} years, ${appState.patientInfo.gender}
Phone:               ${appState.patientInfo.phone}
${appState.patientInfo.email ? `Email:               ${appState.patientInfo.email}` : ''}

═══════════════════════════════════
       Thank you for using Arogya
═══════════════════════════════════
  `;
  
  // Create blob and download
  const blob = new Blob([receipt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Arogya-Receipt-${appState.appointmentData.receiptNumber}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addMessage('bot', 'Receipt downloaded successfully!');
}

function addToCalendar() {
  const startDate = new Date(appState.selectedSlot.date + ' ' + appState.selectedSlot.time);
  const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes
  
  const event = {
    title: `Doctor Appointment - ${appState.selectedHospital.name}`,
    description: `Appointment with ${appState.selectedHospital.name}, ${appState.selectedHospital.specialty} at ${appState.selectedHospital.clinic}`,
    location: appState.selectedHospital.clinic,
    start: startDate.toISOString(),
    end: endDate.toISOString()
  };
  
  // Create iCal format
  const ical = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${event.start.replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${event.end.replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
  
  const blob = new Blob([ical], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'appointment.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addMessage('bot', 'Calendar event created! You can import it to your calendar app.');
}
