// Logo typing animation - Smooth implementation
class ArogyaLogoTyping {
  constructor(textSelector, texts) {
    this.textElement = document.querySelector(textSelector);
    this.texts = texts;
    
    this.state = {
      textIndex: 0,
      charIndex: 0,
      isDeleting: false,
      isPaused: false,
      displayText: ''
    };

    this.timings = {
      typing: 75,
      deleting: 60,
      pauseAfterType: 2000,
      pauseAfterDelete: 500
    };

    this.timing = {
      lastFrameTime: 0,
      accumulatedTime: 0,
      nextEventTime: 75
    };

    this.start();
  }

  start() {
    this.updateCharacter();
    this.animate(performance.now());
  }

  animate = (timestamp) => {
    if (this.timing.lastFrameTime === 0) {
      this.timing.lastFrameTime = timestamp;
    }

    const deltaTime = timestamp - this.timing.lastFrameTime;
    this.timing.lastFrameTime = timestamp;

    const cappedDelta = Math.min(deltaTime, 16.66);

    if (!this.state.isPaused) {
      this.timing.accumulatedTime += cappedDelta;

      if (this.timing.accumulatedTime >= this.timing.nextEventTime) {
        this.timing.accumulatedTime = 0;
        this.updateCharacter();

        this.timing.nextEventTime = this.state.isDeleting 
          ? this.timings.deleting 
          : this.timings.typing;
      }
    }

    requestAnimationFrame(this.animate);
  };

  updateCharacter() {
    const currentText = this.texts[this.state.textIndex];
    const maxChars = currentText.length;

    if (!this.state.isDeleting) {
      if (this.state.charIndex < maxChars) {
        this.state.charIndex++;
        this.renderText();

        if (this.state.charIndex === maxChars) {
          this.state.isPaused = true;
          
          setTimeout(() => {
            this.state.isPaused = false;
            this.state.isDeleting = true;
            this.timing.nextEventTime = this.timings.deleting;
            this.timing.accumulatedTime = 0;
            this.timing.lastFrameTime = 0;
          }, this.timings.pauseAfterType);
        }
      }
    } else {
      if (this.state.charIndex > 0) {
        this.state.charIndex--;
        this.renderText();

        if (this.state.charIndex === 0) {
          this.state.textIndex = (this.state.textIndex + 1) % this.texts.length;
          this.state.isPaused = true;
          
          setTimeout(() => {
            this.state.isPaused = false;
            this.state.isDeleting = false;
            this.timing.nextEventTime = this.timings.typing;
            this.timing.accumulatedTime = 0;
            this.timing.lastFrameTime = 0;
          }, this.timings.pauseAfterDelete);
        }
      }
    }
  }

  renderText() {
    const currentText = this.texts[this.state.textIndex];
    this.state.displayText = currentText.substring(0, this.state.charIndex);
    this.textElement.textContent = this.state.displayText;
  }
}

// Initialize logo typing animation
setTimeout(() => {
  new ArogyaLogoTyping('#logoText', ['आरोग्य', 'Arogya']);
}, 1000);

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navLinks.classList.remove('active');
      mobileMenuBtn.innerHTML = '☰';
    }
  });
});

// Intersection Observer for feature cards animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card').forEach(card => {
  observer.observe(card);
});

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  
  // Member card data
  const memberData = {
    om: {
      name: 'Om Singh',
      role: 'Team Lead & Frontend Developer',
      avatar: '../src/assets/images/profile-pics/om-singh.webp',
      bio: 'BTech CSE Core, 1st year student at Galgotias University. Leading the Arogya project and passionate about creating innovative web solutions that make a difference in healthcare.',
      github: 'https://github.com/omsingh02',
      linkedin: 'https://www.linkedin.com/in/omsingh02/',
      portfolio: 'https://omsingh.me/',
      projects: [
        { 
          name: 'Arogya', 
          desc: 'AI-powered healthcare appointment system with voice interface and real-time hospital verification',
          preview: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
          liveUrl: 'https://arogya.omsingh.me',
          codeUrl: 'https://github.com/hawkeye-exe/arogya'
        },
        { 
          name: 'Bunny Runner', 
          desc: 'Cute endless adventure game with smooth animations and engaging gameplay mechanics',
          preview: 'https://raw.githubusercontent.com/omsingh02/bunny/main/preview.png',
          liveUrl: 'https://omsingh.me/bunny',
          codeUrl: 'https://github.com/omsingh02/bunny'
        }
      ]
    },
    noman: {
      name: 'Noman Aqil',
      role: 'Backend Lead',
      avatar: '../src/assets/images/profile-pics/noman-aqil.webp',
      bio: 'BTech AI and Data Science, 1st year student at Galgotias University. Backend specialist building robust and scalable server architectures for Arogya\'s verification and booking systems.',
      github: 'https://github.com/nomanaqil56',
      linkedin: 'https://www.linkedin.com/in/noman-aqil-7a3ab0385/',
      portfolio: null,
      projects: [
        { 
          name: 'Arogya Backend', 
          desc: 'Hospital verification system with real-time booking API and secure data management',
          preview: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
          liveUrl: null,
          codeUrl: 'https://github.com/hawkeye-exe/arogya'
        },
        { 
          name: 'Database Architecture', 
          desc: 'Optimized database schema for efficient hospital and appointment data management',
          preview: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',
          liveUrl: null,
          codeUrl: 'https://github.com/hawkeye-exe/arogya'
        }
      ]
    },
    alwin: {
      name: 'Alwin Mathew',
      role: 'AI API Lead',
      avatar: '../src/assets/images/profile-pics/alwin-mathew.webp',
      bio: 'BTech AI and Data Science, 1st year student at Galgotias University. AI enthusiast specializing in conversational AI and NLP, developing Arogya\'s intelligent symptom analysis system.',
      github: 'https://github.com/alwin2134',
      linkedin: 'https://www.linkedin.com/in/alwin-mathew26/',
      portfolio: 'https://alwins-portfolio.netlify.app/',
      projects: [
        { 
          name: 'AI Symptom Analyzer', 
          desc: 'Smart symptom-to-specialty matching engine using natural language processing and medical knowledge graphs',
          preview: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
          liveUrl: null,
          codeUrl: 'https://github.com/hawkeye-exe/arogya'
        },
        { 
          name: 'Voice Integration', 
          desc: 'Agora SDK implementation for seamless voice interface with real-time audio processing',
          preview: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=300&fit=crop',
          liveUrl: null,
          codeUrl: 'https://github.com/hawkeye-exe/arogya'
        }
      ]
    }
  };

  // Member card functionality
  const overlay = document.getElementById('memberCardOverlay');
  const card = document.getElementById('memberCard');
  const closeBtn = document.getElementById('memberCardClose');
  const cardContent = card.querySelector('.member-card-content');

  function openMemberCard(memberId) {
    const member = memberData[memberId];
    if (!member) return;

    cardContent.innerHTML = `
      <div class="member-card-header">
        <img src="${member.avatar}" alt="${member.name}" class="member-card-avatar" />
        <div class="member-card-info">
          <h3 class="member-card-name">${member.name}</h3>
          <p class="member-card-role">${member.role}</p>
          <p class="member-card-bio">${member.bio}</p>
          <div class="member-card-social">
            <a href="${member.github}" target="_blank" rel="noopener" class="member-card-social-link">
              <i data-lucide="github"></i>
              <span>GitHub</span>
            </a>
            <a href="${member.linkedin}" target="_blank" rel="noopener" class="member-card-social-link">
              <i data-lucide="linkedin"></i>
              <span>LinkedIn</span>
            </a>
            ${member.portfolio ? `
              <a href="${member.portfolio}" target="_blank" rel="noopener" class="member-card-social-link">
                <i data-lucide="globe"></i>
                <span>Portfolio</span>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
      <div class="member-card-body">
        <div class="member-card-section">
          <h4 class="member-card-section-title">
            <i data-lucide="briefcase"></i>
            <span>Projects & Contributions</span>
          </h4>
          <div class="member-projects">
            ${member.projects.map(project => `
              <div class="member-project">
                <img src="${project.preview}" alt="${project.name}" class="member-project-preview" loading="lazy" />
                <div class="member-project-content">
                  <div class="member-project-name">${project.name}</div>
                  <div class="member-project-desc">${project.desc}</div>
                  <div class="member-project-links">
                    ${project.liveUrl ? `
                      <a href="${project.liveUrl}" target="_blank" rel="noopener" class="member-project-link primary">
                        <i data-lucide="external-link"></i>
                        <span>Live Demo</span>
                      </a>
                    ` : ''}
                    ${project.codeUrl ? `
                      <a href="${project.codeUrl}" target="_blank" rel="noopener" class="member-project-link">
                        <i data-lucide="github"></i>
                        <span>Code</span>
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Re-initialize icons for the new content
    setTimeout(() => lucide.createIcons(), 50);
  }

  function closeMemberCard() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('click', () => {
      const memberId = member.getAttribute('data-member');
      openMemberCard(memberId);
    });
  });

  closeBtn.addEventListener('click', closeMemberCard);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMemberCard();
    }
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMemberCard();
    }
  });

  // Interactive Benefits Section Features
  
  // 1. Animated counter for comparison items
  function animateCounter(element, targetText, duration = 1500) {
    if (!element || element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    // Check if text contains a number to animate
    const match = targetText.match(/\d+/);
    if (!match) return;
    
    const targetNumber = parseInt(match[0]);
    const prefix = targetText.substring(0, match.index);
    const suffix = targetText.substring(match.index + match[0].length);
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentNumber = Math.floor(progress * targetNumber);
      element.textContent = prefix + currentNumber + suffix;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // 2. Observe comparison items and animate on scroll
  const comparisonObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const highlightText = entry.target.querySelector('.comparison-item.highlight p');
        if (highlightText && !highlightText.dataset.animated) {
          const originalText = highlightText.textContent;
          animateCounter(highlightText, originalText);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.comparison-row').forEach(row => {
    comparisonObserver.observe(row);
  });

  // 3. Add ripple effect to comparison rows on click
  document.querySelectorAll('.comparison-row').forEach(row => {
    row.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(20, 184, 166, 0.4)';
      ripple.style.width = ripple.style.height = '100px';
      ripple.style.left = (e.clientX - this.getBoundingClientRect().left - 50) + 'px';
      ripple.style.top = (e.clientY - this.getBoundingClientRect().top - 50) + 'px';
      ripple.style.animation = 'rippleEffect 0.6s ease-out';
      ripple.style.pointerEvents = 'none';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // 4. Benefit items click feedback
  document.querySelectorAll('.benefit-item').forEach(item => {
    item.addEventListener('click', function() {
      this.style.transform = 'translateX(15px) scale(0.98)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    });
  });

  // 5. Stagger animation for benefit items on initial load
  const benefitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 100);
        benefitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.benefit-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    benefitObserver.observe(item);
  });

  // 6. Add CSS animation for ripple effect
  if (!document.querySelector('#ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
      @keyframes rippleEffect {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 7. Tooltip functionality for comparison rows
  let tooltipElement = null;

  function showTooltip(element, text) {
    if (!tooltipElement) {
      tooltipElement = document.createElement('div');
      tooltipElement.className = 'tooltip-popup';
      document.body.appendChild(tooltipElement);
    }

    tooltipElement.textContent = text;
    const rect = element.getBoundingClientRect();
    tooltipElement.style.left = rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2 + 'px';
    tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 12 + window.scrollY + 'px';
    
    setTimeout(() => tooltipElement.classList.add('show'), 10);
  }

  function hideTooltip() {
    if (tooltipElement) {
      tooltipElement.classList.remove('show');
    }
  }

  document.querySelectorAll('.comparison-row[data-tooltip]').forEach(row => {
    row.addEventListener('mouseenter', function() {
      const tooltipText = this.dataset.tooltip;
      if (tooltipText) {
        showTooltip(this, tooltipText);
      }
    });

    row.addEventListener('mouseleave', hideTooltip);
  });

  // Hide tooltip on scroll
  window.addEventListener('scroll', hideTooltip);
});
