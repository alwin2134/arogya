// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initDashboard();
});

function initDashboard() {
  // Mobile sidebar toggle
  const createMobileToggle = () => {
    if (window.innerWidth <= 768) {
      const existingToggle = document.querySelector('.mobile-toggle');
      if (!existingToggle) {
        const toggle = document.createElement('button');
        toggle.className = 'btn btn-secondary mobile-toggle';
        toggle.style.position = 'fixed';
        toggle.style.bottom = '2rem';
        toggle.style.right = '2rem';
        toggle.style.zIndex = '200';
        toggle.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        toggle.innerHTML = '<i data-lucide="menu"></i>';
        
        toggle.addEventListener('click', () => {
          document.querySelector('.sidebar').classList.toggle('open');
          lucide.createIcons();
        });
        
        document.body.appendChild(toggle);
        lucide.createIcons();
      }
    }
  };

  createMobileToggle();
  window.addEventListener('resize', createMobileToggle);

  // Appointment action buttons
  document.querySelectorAll('.btn-success').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const appointmentItem = e.target.closest('.appointment-item');
      appointmentItem.style.background = 'rgba(16, 185, 129, 0.1)';
      appointmentItem.style.borderColor = 'var(--success)';
      
      setTimeout(() => {
        appointmentItem.style.opacity = '0';
        setTimeout(() => appointmentItem.remove(), 300);
      }, 1000);
    });
  });

  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const appointmentItem = e.target.closest('.appointment-item');
      if (confirm('Are you sure you want to cancel this appointment?')) {
        appointmentItem.style.opacity = '0';
        setTimeout(() => appointmentItem.remove(), 300);
      }
    });
  });

  // User info menu toggle
  document.getElementById('userInfoBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
  });

  // Close user menu when clicking outside
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('userMenu');
    const userInfo = document.getElementById('userInfoBtn');
    if (!menu.contains(e.target) && !userInfo.contains(e.target)) {
      menu.classList.remove('show');
    }
  });

  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = './auth.html';
    }
  });

  // New appointment button
  document.querySelector('.header .btn-primary').addEventListener('click', () => {
    openModal('appointmentModal');
  });

  // Export button
  document.querySelector('.header .btn-secondary').addEventListener('click', () => {
    openModal('exportModal');
  });

  // Quick action clicks
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const actionTitle = btn.querySelector('h4').textContent;
      
      if (actionTitle.includes('Schedule Appointment')) {
        openModal('appointmentModal');
      } else if (actionTitle.includes('Add New Patient')) {
        openModal('patientModal');
      } else if (actionTitle.includes('Notifications')) {
        alert('Notifications: 3 new appointment requests pending review');
      }
    });
  });
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => lucide.createIcons(), 100);
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
  document.body.style.overflow = '';
  
  // Reset form
  const form = modal.querySelector('form');
  if (form) form.reset();
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay.id);
    }
  });
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

// Save Appointment
function saveAppointment() {
  const form = document.getElementById('appointmentForm');
  if (form.checkValidity()) {
    // Simulate saving
    closeModal('appointmentModal');
    
    // Show success message
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, var(--success), #059669);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '✓ Appointment scheduled successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-10px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  } else {
    form.reportValidity();
  }
}

// Save Patient
function savePatient() {
  const form = document.getElementById('patientForm');
  if (form.checkValidity()) {
    closeModal('patientModal');
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '✓ Patient added successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-10px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  } else {
    form.reportValidity();
  }
}

// Export Data
function exportData() {
  const form = document.getElementById('exportForm');
  if (form.checkValidity()) {
    closeModal('exportModal');
    
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, var(--warning), #d97706);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2000;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '⏳ Preparing your export...';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.innerHTML = '✓ Export downloaded successfully!';
      notification.style.background = 'linear-gradient(135deg, var(--success), #059669)';
      
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    }, 1500);
  } else {
    form.reportValidity();
  }
}

// Update stats in real-time (simulation)
function updateStats() {
  const statsValues = document.querySelectorAll('.stat-value');
  statsValues.forEach(stat => {
    const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
    // Simulate random updates
    if (Math.random() > 0.8) {
      const newValue = currentValue + Math.floor(Math.random() * 3);
      stat.textContent = newValue.toLocaleString();
    }
  });
}

// Update every 30 seconds
setInterval(updateStats, 30000);
