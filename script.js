// Global variables
let particleSystem = null;
let missionDay = 1;
let simulationData = {
  water: 0,
  tools: 0,
  fuel: 0,
  shield: 0
};

// Machine data
const machineData = {
  ai: {
    name: "AI Sorting Machine",
    subtitle: "Hyperspectral Vision System",
    description: "Advanced robotic arms equipped with hyperspectral cameras for precise waste identification and sorting with 99% accuracy.",
    features: [
      "Hyperspectral cameras with 200+ bands (vs human 3)",
      "99% material classification accuracy",
      "Detects invisible chemical signatures",
      "Identifies contaminated and degraded waste",
      "Separates plastics, metals, fabrics automatically"
    ],
    specifications: {
      accuracy: "99%",
      power: "0.5 kW",
      size: "Desktop-sized unit",
      temperature: "25°C",
      rate: "50 items/minute"
    },
    advantages: [
      "Highest accuracy in material identification",
      "Low power consumption",
      "Compact design suitable for space",
      "Real-time chemical analysis capability"
    ],
    limitations: [
      "Requires clean optical surfaces",
      "Cannot process heavily contaminated items",
      "Limited to surface analysis only"
    ]
  },
  refab: {
    name: "Refabricator",
    subtitle: "3D Printing & Plastic Recycling",
    description: "Mini-fridge sized device that shreds and melts plastic waste into 3D printing filament for tool fabrication.",
    features: [
      "Integrated shredding and melting system",
      "Converts waste to 3D printer filament",
      "Closed-loop recycling capability",
      "Fabricates tools and daily-use items",
      "Space-tested technology on ISS"
    ],
    specifications: {
      accuracy: "85%",
      power: "0.3 kW",
      size: "Mini-fridge sized (60cm³)",
      temperature: "150°C",
      rate: "2 kg plastic/hour"
    },
    advantages: [
      "Proven space technology (tested on ISS)",
      "Low power requirements",
      "Compact and lightweight design",
      "Enables on-demand tool manufacturing"
    ],
    limitations: [
      "Works only on thermoplastics",
      "Filament quality degrades after repeated cycles",
      "Cannot process mixed material waste",
      "Limited to plastic materials only"
    ]
  },
  oscar: {
    name: "OSCAR",
    subtitle: "Orbital Syngas/Commodity Augmentation Reactor",
    description: "High-temperature pyrolysis system converting mixed waste into syngas for fuel and propellant production.",
    features: [
      "Pyrolysis at 800-1200°C temperatures",
      "Converts mixed waste to syngas (H₂, CO, CO₂, CH₄)",
      "Produces fuel cell electricity",
      "Generates rocket propellant components",
      "Enables water recovery from waste"
    ],
    specifications: {
      accuracy: "90%",
      power: "2.0 kW",
      size: "Large cabinet (2m³)",
      temperature: "800-1200°C",
      rate: "5 kg waste/hour"
    },
    advantages: [
      "Handles mixed waste streams",
      "Produces valuable propellant components",
      "High energy recovery potential",
      "Can process organic and inorganic waste"
    ],
    limitations: [
      "High energy demand for operation",
      "Requires extensive cooling systems",
      "Complex safety protocols needed",
      "Produces some toxic intermediates"
    ]
  },
  hmc: {
    name: "HMC",
    subtitle: "Heat Melt Compactor",
    description: "Thermal compaction system creating sterile tiles for radiation shielding while recovering water.",
    features: [
      "Thermal compaction at 150°C",
      "Creates odor-free waste tiles",
      "Water recovery up to 100ml/kg waste",
      "Radiation shielding material production",
      "Complete sterilization capability"
    ],
    specifications: {
      accuracy: "95%",
      power: "1.0 kW",
      size: "Washing machine sized (1.5m³)",
      temperature: "150°C",
      rate: "10 kg waste/cycle"
    },
    advantages: [
      "Excellent volume reduction (87.5%)",
      "Produces useful radiation shielding",
      "Water recovery capability",
      "Complete sterilization of waste"
    ],
    limitations: [
      "Power-intensive operation (1 kW per cycle)",
      "Multi-hour processing time",
      "Cannot separate materials",
      "Limited to compactable waste types"
    ]
  },
  facm: {
    name: "FACM",
    subtitle: "Fully Automatic",
    description: "Melting System Of Metals To Form Essential Metal Parts",
    features: [
      "DC Melting Furnace",
      "Titanium Pipe For Passing Molten Metal",
      "Transfer Pipe Covered With Thermal Insulation",
      "Ingot Mold Pre-Heated To Avoid Slack",
      "Robotic Arm Will Shift The Mold"
    ],
    specifications: {
      accuracy: "95%",
      power: "0.3 kW",
      size: "Mid Washing machine sized (1.3 m³)",
      temperature: "800°C",
      rate: "1 kg waste/cycle"
    },
    advantages: [
      "DC Furnace Allowing Less Maintenance",
      "Compact Build Allowing Smoother Process",
      "Integrated Manufacturing System",
      "Metal Recovering System"
    ],
    limitations: [
      "High Power Consuming Process",
      "High Temperature Requirements",
      "Compact Build Restricting To Less Payload Acceptance",
      "Only Metals Are Recyclable"
    ]
  }
};

// Simulation scenarios
const scenarios = [
  {
    id: 'daily',
    title: 'Daily Operations',
    description: 'Process routine daily waste from 8 astronauts',
    outputs: { water: 1.1, tools: 2, fuel: 0.8, shield: 1.5 }
  },
  {
    id: 'emergency',
    title: 'Emergency Repair',
    description: 'Fabricate critical spare parts for life support system',
    outputs: { water: 0.5, tools: 12, fuel: 0.2, shield: 0.8 }
  },
  {
    id: 'propellant',
    title: 'Propellant Production',
    description: 'Generate fuel for return journey preparation',
    outputs: { water: 2.0, tools: 1, fuel: 15, shield: 3.2 }
  }
];

let currentScenario = 0;
let draggedElement = null;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeParticleSystem();
  initializeNavigation();
  initializeAnimations();
  initializeSimulation();
  initializeMachineCards();
  initializeModal();
  
  // Start animations when page loads
  setTimeout(() => {
    animateCounters();
    animateSpecBars();
  }, 1000);
});

// Particle System
function initializeParticleSystem() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  
  particleSystem = {
    container: particlesContainer,
    particles: [],
    maxParticles: 50
  };
  
  createParticles();
}

function createParticles() {
  if (!particleSystem) return;
  
  for (let i = 0; i < particleSystem.maxParticles; i++) {
    setTimeout(() => {
      createParticle();
    }, i * 200);
  }
}

function createParticle() {
  if (!particleSystem || !particleSystem.container) return;
  
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random position and animation duration
  const startX = Math.random() * window.innerWidth;
  const duration = 15 + Math.random() * 10;
  const delay = Math.random() * 2;
  
  particle.style.left = startX + 'px';
  particle.style.animationDuration = duration + 's';
  particle.style.animationDelay = delay + 's';
  particle.style.opacity = Math.random() * 0.6 + 0.2;
  
  particleSystem.container.appendChild(particle);
  
  // Remove particle after animation completes
  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle);
      createParticle(); // Create new particle to maintain count
    }
  }, (duration + delay) * 1000);
}

// Navigation
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('nav-hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
      
      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Close mobile menu if open
      if (navMenu) {
        navMenu.classList.remove('active');
      }
    });
  });
  
  // Mobile hamburger menu
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // Update active nav on scroll
  window.addEventListener('scroll', updateActiveNav);
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const navbar = document.querySelector('.navbar');
    const navHeight = navbar ? navbar.offsetHeight : 80;
    const targetPosition = section.offsetTop - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');
  const navHeight = navbar ? navbar.offsetHeight : 80;
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
}

// Animation Functions
function initializeAnimations() {
  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Trigger specific animations based on section
        const sectionId = entry.target.id;
        if (sectionId === 'impact') {
          setTimeout(() => animateCounters('.metric-value'), 500);
        }
        if (sectionId === 'machines') {
          setTimeout(() => animateSpecBars(), 500);
        }
      }
    });
  }, observerOptions);
  
  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });
}

function animateCounters(selector = '.stat-number') {
  const counters = document.querySelectorAll(selector);
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);
      
      counter.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }
    
    requestAnimationFrame(updateCounter);
  });
}

function animateSpecBars() {
  const specBars = document.querySelectorAll('.spec-fill');
  
  specBars.forEach((bar, index) => {
    setTimeout(() => {
      const width = bar.getAttribute('data-width');
      if (width) {
        bar.style.width = width + '%';
      }
    }, index * 200);
  });
}

// Machine Cards
function initializeMachineCards() {
  const detailButtons = document.querySelectorAll('.machine-details-btn');
  
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const machineCard = button.closest('.machine-card');
      const machineType = machineCard.getAttribute('data-machine');
      showMachineDetails(machineType);
    });
  });
}

function showMachineDetails(machineType) {
  const machine = machineData[machineType];
  if (!machine) return;
  
  const modal = document.getElementById('machine-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  
  if (!modal || !modalTitle || !modalBody) return;
  
  modalTitle.textContent = machine.name;
  
  modalBody.innerHTML = `
    <div class="machine-details">
      <div class="machine-detail-header">
        <h4>${machine.subtitle}</h4>
        <p>${machine.description}</p>
      </div>
      
      <div class="detail-section">
        <h5>Key Features</h5>
        <ul>
          ${machine.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>
      
      <div class="detail-section">
        <h5>Technical Specifications</h5>
        <div class="spec-grid">
          <div class="spec-detail">
            <strong>Accuracy:</strong> ${machine.specifications.accuracy}
          </div>
          <div class="spec-detail">
            <strong>Power:</strong> ${machine.specifications.power}
          </div>
          <div class="spec-detail">
            <strong>Size:</strong> ${machine.specifications.size}
          </div>
          <div class="spec-detail">
            <strong>Temperature:</strong> ${machine.specifications.temperature}
          </div>
          <div class="spec-detail">
            <strong>Processing Rate:</strong> ${machine.specifications.rate}
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h5>Advantages</h5>
        <ul class="advantages-list">
          ${machine.advantages.map(advantage => `<li class="advantage">${advantage}</li>`).join('')}
        </ul>
      </div>
      
      <div class="detail-section">
        <h5>Limitations</h5>
        <ul class="limitations-list">
          ${machine.limitations.map(limitation => `<li class="limitation">${limitation}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

// Modal System
function initializeModal() {
  const modal = document.getElementById('machine-modal');
  const closeButton = document.getElementById('modal-close');
  
  if (!modal || !closeButton) return;
  
  function closeModal() {
    modal.classList.add('hidden');
  }
  
  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// Simulation System
function initializeSimulation() {
  initializeDragAndDrop();
  initializeSimulationControls();
  loadScenario(currentScenario);
}

function initializeDragAndDrop() {
  const wasteItems = document.querySelectorAll('.waste-item');
  const machines = document.querySelectorAll('.sim-machine');
  
  // Make waste items draggable
  wasteItems.forEach(item => {
    item.draggable = true;
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
  
  // Set up drop zones
  machines.forEach(machine => {
    machine.addEventListener('dragover', handleDragOver);
    machine.addEventListener('drop', handleDrop);
    machine.addEventListener('dragenter', handleDragEnter);
    machine.addEventListener('dragleave', handleDragLeave);
  });
}

function handleDragStart(e) {
  draggedElement = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.outerHTML);
  e.dataTransfer.setData('text/plain', e.target.getAttribute('data-type'));
  e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
  e.target.style.opacity = '1';
  draggedElement = null;
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const wasteType = e.dataTransfer.getData('text/plain');
  const machineType = e.currentTarget.getAttribute('data-machine');
  
  if (wasteType && machineType) {
    processWaste(wasteType, machineType);
    
    // Visual feedback - briefly highlight the waste item
    if (draggedElement) {
      draggedElement.style.background = 'rgba(0, 212, 255, 0.4)';
      setTimeout(() => {
        if (draggedElement) {
          draggedElement.style.background = '';
        }
      }, 1000);
    }
  }
}

function processWaste(wasteType, machineType) {
  const machine = document.getElementById(`sim-${machineType}`);
  if (!machine) return;
  
  const status = machine.querySelector('.machine-status');
  if (!status) return;
  
  // Set machine to processing
  status.textContent = 'Processing...';
  status.className = 'machine-status processing';
  
  // Simulate processing time
  setTimeout(() => {
    status.textContent = 'Complete';
    status.className = 'machine-status complete';
    
    // Update outputs based on waste type and machine
    updateSimulationOutputs(wasteType, machineType);
    
    // Reset status after delay
    setTimeout(() => {
      status.textContent = 'Ready';
      status.className = 'machine-status idle';
    }, 2000);
  }, 2000);
}

function updateSimulationOutputs(wasteType, machineType) {
  const scenario = scenarios[currentScenario];
  const baseOutputs = scenario.outputs;
  
  // Calculate outputs based on waste type and machine compatibility
  let multiplier = 0.1; // Base multiplier for single item
  
  // Adjust multiplier based on compatibility
  if ((wasteType === 'plastic' && machineType === 'refab') ||
      (wasteType === 'metal' && machineType === 'ai') ||
      (machineType === 'oscar') ||
      (machineType === 'hmc')) {
    multiplier = 0.2; // Higher efficiency for good matches
  }
  
  // Update outputs
  simulationData.water += baseOutputs.water * multiplier;
  simulationData.tools += Math.floor(baseOutputs.tools * multiplier);
  simulationData.fuel += baseOutputs.fuel * multiplier;
  simulationData.shield += baseOutputs.shield * multiplier;
  
  // Update display
  updateOutputDisplay();
  
  // Advance mission day
  missionDay++;
  const missionDayElement = document.getElementById('mission-day');
  if (missionDayElement) {
    missionDayElement.textContent = missionDay;
  }
}

function updateOutputDisplay() {
  const waterOutput = document.getElementById('water-output');
  const toolsOutput = document.getElementById('tools-output');
  const fuelOutput = document.getElementById('fuel-output');
  const shieldOutput = document.getElementById('shield-output');
  
  if (waterOutput) waterOutput.textContent = simulationData.water.toFixed(1);
  if (toolsOutput) toolsOutput.textContent = simulationData.tools;
  if (fuelOutput) fuelOutput.textContent = simulationData.fuel.toFixed(1);
  if (shieldOutput) shieldOutput.textContent = simulationData.shield.toFixed(1);
}

function initializeSimulationControls() {
  const resetButton = document.getElementById('reset-simulation');
  const scenarioButton = document.getElementById('change-scenario');
  const processButton = document.getElementById('process-waste');
  
  if (resetButton) {
    resetButton.addEventListener('click', resetSimulation);
  }
  
  if (scenarioButton) {
    scenarioButton.addEventListener('click', changeScenario);
  }
  
  if (processButton) {
    processButton.addEventListener('click', processAllWaste);
  }
}

function resetSimulation() {
  simulationData = { water: 0, tools: 0, fuel: 0, shield: 0 };
  missionDay = 1;
  
  updateOutputDisplay();
  
  const missionDayElement = document.getElementById('mission-day');
  if (missionDayElement) {
    missionDayElement.textContent = '1';
  }
  
  // Reset machine statuses
  document.querySelectorAll('.machine-status').forEach(status => {
    status.textContent = 'Ready';
    status.className = 'machine-status idle';
  });
}

function changeScenario() {
  currentScenario = (currentScenario + 1) % scenarios.length;
  loadScenario(currentScenario);
}

function loadScenario(scenarioIndex) {
  const scenario = scenarios[scenarioIndex];
  const titleElement = document.getElementById('scenario-title');
  const descriptionElement = document.getElementById('scenario-description');
  
  if (titleElement) titleElement.textContent = scenario.title;
  if (descriptionElement) descriptionElement.textContent = scenario.description;
}

function processAllWaste() {
  const wasteItems = document.querySelectorAll('.waste-item');
  const machines = ['ai', 'refab', 'oscar', 'hmc'];
  
  wasteItems.forEach((item, index) => {
    setTimeout(() => {
      const wasteType = item.getAttribute('data-type');
      const machineType = machines[index % machines.length];
      processWaste(wasteType, machineType);
    }, index * 800);
  });
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Global scroll functions for buttons
window.scrollToSection = scrollToSection;

// Resize handler for responsive design
window.addEventListener('resize', debounce(() => {
  // Recreate particles on resize
  const particles = document.querySelectorAll('.particle');
  particles.forEach(particle => particle.remove());
  if (particleSystem) {
    createParticles();
  }
}, 250));

// Loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});