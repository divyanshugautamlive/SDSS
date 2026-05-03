// ===================================================
//  CAREERS PAGE — SDSS Join Our Team — Script
// ===================================================

(function () {
  'use strict';

  // --- CONFIG ---
  const COMPANY_PHONE = '919599961692';
  const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzMY-kTucdDIX6P-jDu3-cnf-43k0N8Bl3IxPHA_BZ3zS3gVkPyEW7FookQvEsagkG4/exec';
  const ADMIN_EMAIL = ''; // Handled server-side via Apps Script

  // --- DOM REFS ---
  const roleCards = document.querySelectorAll('.role-card');
  const form = document.getElementById('jobApplicationForm');
  const selectedRoleText = document.getElementById('selectedRoleText');
  const roleInput = document.getElementById('applicantRole');
  const nameInput = document.getElementById('applicantName');
  const phoneInput = document.getElementById('applicantPhone');
  const locationInput = document.getElementById('applicantLocation');
  const fileInput = document.getElementById('applicantFile');
  const uploadArea = document.getElementById('uploadArea');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadPreview = document.getElementById('uploadPreview');
  const uploadFileName = document.getElementById('uploadFileName');
  const removeFileBtn = document.getElementById('removeFileBtn');
  const submitBtn = document.getElementById('submitBtn');
  const changeRoleBtn = document.getElementById('changeRoleBtn');
  const stickyApplyBar = document.getElementById('stickyApplyBar');
  const confirmationScreen = document.getElementById('confirmationScreen');
  const applicationFlow = document.getElementById('applicationFlow');
  const confirmDetails = document.getElementById('confirmDetails');
  const whatsappCTA = document.getElementById('whatsappCTA');
  const submitAnotherBtn = document.getElementById('submitAnotherBtn');
  const langToggle = document.getElementById('langToggle');

  // Guard against non-careers pages
  if (!form) return;

  // --- STATE ---
  let selectedRole = '';
  let isSubmitting = false;
  let currentLang = 'en';

  // --- DUPLICATE PREVENTION ---
  const SUBMITTED_PHONES_KEY = 'sdss_submitted_phones';

  function getSubmittedPhones() {
    try {
      return JSON.parse(localStorage.getItem(SUBMITTED_PHONES_KEY) || '[]');
    } catch { return []; }
  }

  function addSubmittedPhone(phone) {
    const phones = getSubmittedPhones();
    if (!phones.includes(phone)) {
      phones.push(phone);
      localStorage.setItem(SUBMITTED_PHONES_KEY, JSON.stringify(phones));
    }
  }

  function isPhoneDuplicate(phone) {
    return getSubmittedPhones().includes(phone);
  }

  // --- LANGUAGE TOGGLE ---
  langToggle?.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn || btn.classList.contains('active')) return;

    langToggle.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLang = btn.dataset.lang;
    applyLanguage(currentLang);
  });

  function applyLanguage(lang) {
    document.querySelectorAll('[data-' + lang + ']').forEach(el => {
      el.textContent = el.getAttribute('data-' + lang);
    });
    // Update placeholders
    document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
      el.placeholder = el.getAttribute('data-placeholder-' + lang);
    });
  }

  // --- ROLE SELECTION ---
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedRole = card.dataset.role;
      roleInput.value = selectedRole;
      selectedRoleText.textContent = selectedRole;

      // Auto-scroll to form after small delay
      setTimeout(() => {
        document.getElementById('applicationForm').scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 400);
    });
  });

  // Change Role button
  changeRoleBtn?.addEventListener('click', () => {
    document.getElementById('roleSelection').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  // --- FILE UPLOAD ---
  uploadArea?.addEventListener('click', () => fileInput?.click());

  // Drag and drop
  uploadArea?.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea?.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea?.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFileSelect(fileInput.files[0]);
    }
  });

  function handleFileSelect(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    clearError('fileError');

    if (file.size > maxSize) {
      showError('fileError', currentLang === 'hi' ? 'फ़ाइल 5MB से छोटी होनी चाहिए' : 'File must be under 5MB');
      fileInput.value = '';
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      showError('fileError', currentLang === 'hi' ? 'केवल PDF, JPG, PNG, DOC फ़ाइलें' : 'Only PDF, JPG, PNG, DOC files allowed');
      fileInput.value = '';
      return;
    }

    uploadPlaceholder.style.display = 'none';
    uploadPreview.style.display = 'flex';
    uploadFileName.textContent = file.name;
  }

  removeFileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.value = '';
    uploadPlaceholder.style.display = '';
    uploadPreview.style.display = 'none';
    uploadFileName.textContent = '';
    clearError('fileError');
  });

  // --- VALIDATION ---
  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      showError('nameError', currentLang === 'hi' ? 'कृपया अपना नाम लिखें' : 'Please enter your name');
      nameInput.classList.add('error');
      nameInput.classList.remove('valid');
      return false;
    }
    if (val.length < 2) {
      showError('nameError', currentLang === 'hi' ? 'नाम बहुत छोटा है' : 'Name is too short');
      nameInput.classList.add('error');
      nameInput.classList.remove('valid');
      return false;
    }
    clearError('nameError');
    nameInput.classList.remove('error');
    nameInput.classList.add('valid');
    return true;
  }

  function validatePhone() {
    const val = phoneInput.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!val) {
      showError('phoneError', currentLang === 'hi' ? 'कृपया मोबाइल नंबर लिखें' : 'Please enter your mobile number');
      phoneInput.classList.add('error');
      phoneInput.classList.remove('valid');
      return false;
    }
    if (!phoneRegex.test(val)) {
      showError('phoneError', currentLang === 'hi' ? 'कृपया सही 10 अंकों का नंबर लिखें' : 'Please enter a valid 10-digit mobile number');
      phoneInput.classList.add('error');
      phoneInput.classList.remove('valid');
      return false;
    }
    if (isPhoneDuplicate(val)) {
      showError('phoneError', currentLang === 'hi' ? 'यह नंबर पहले से सबमिट किया जा चुका है' : 'This number has already been submitted');
      phoneInput.classList.add('error');
      phoneInput.classList.remove('valid');
      return false;
    }
    clearError('phoneError');
    phoneInput.classList.remove('error');
    phoneInput.classList.add('valid');
    return true;
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + msg;
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  }

  // Inline validation on blur
  nameInput?.addEventListener('blur', validateName);
  phoneInput?.addEventListener('blur', validatePhone);

  // Phone: only allow digits
  phoneInput?.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    if (phoneInput.value.length === 10) {
      validatePhone();
    }
  });

  // Auto-focus first input when scrolled to form
  const formObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !selectedRole) {
        // Don't auto-focus if no role selected
      } else if (entry.isIntersecting && !nameInput.value) {
        nameInput.focus();
      }
    });
  }, { threshold: 0.3 });

  const formSection = document.getElementById('applicationForm');
  if (formSection) formObserver.observe(formSection);

  // --- FORM SUBMISSION ---
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double-click

    // Validate role
    if (!selectedRole) {
      document.getElementById('roleSelection').scrollIntoView({ behavior: 'smooth' });
      // Briefly shake the cards
      document.querySelector('.role-cards-grid')?.classList.add('shake');
      setTimeout(() => document.querySelector('.role-cards-grid')?.classList.remove('shake'), 600);
      return;
    }

    // Validate fields
    const nameValid = validateName();
    const phoneValid = validatePhone();

    if (!nameValid || !phoneValid) {
      // Focus first invalid
      if (!nameValid) nameInput.focus();
      else phoneInput.focus();
      return;
    }

    // --- SUBMIT ---
    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'inline-flex';

    const formData = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      role: selectedRole,
      location: locationInput.value.trim() || 'Not specified',
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      hasFile: fileInput.files.length > 0 ? 'Yes' : 'No',
      fileName: fileInput.files.length > 0 ? fileInput.files[0].name : 'None',
      fileData: '',
      fileType: ''
    };

    // If file is attached, read it as base64
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      formData.fileType = file.type;
      formData.fileData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]); // base64 only
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    }

    try {
      // Send to Google Sheet + Drive
      if (GOOGLE_SHEET_ENDPOINT) {
        await fetch(GOOGLE_SHEET_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
      }

      // Mark phone as submitted
      addSubmittedPhone(formData.phone);

      // Show confirmation
      showConfirmation(formData);

    } catch (err) {
      console.error('Submission error:', err);
      // Still show confirmation (data can be sent via WhatsApp)
      addSubmittedPhone(formData.phone);
      showConfirmation(formData);
    } finally {
      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').style.display = '';
      submitBtn.querySelector('.btn-loader').style.display = 'none';
    }
  });

  // --- SHOW CONFIRMATION ---
  function showConfirmation(data) {
    // Hide main flow
    applicationFlow.style.display = 'none';
    stickyApplyBar?.classList.remove('visible');
    document.querySelector('.lang-toggle')?.style.setProperty('display', 'none');

    // Show confirmation
    confirmationScreen.style.display = 'flex';

    // Fill details
    confirmDetails.innerHTML = `
      <div class="confirm-detail-row"><i class="fas fa-user"></i><strong>${currentLang === 'hi' ? 'नाम:' : 'Name:'}</strong><span>${data.name}</span></div>
      <div class="confirm-detail-row"><i class="fas fa-phone"></i><strong>${currentLang === 'hi' ? 'फ़ोन:' : 'Phone:'}</strong><span>+91 ${data.phone}</span></div>
      <div class="confirm-detail-row"><i class="fas fa-briefcase"></i><strong>${currentLang === 'hi' ? 'पद:' : 'Role:'}</strong><span>${data.role}</span></div>
      <div class="confirm-detail-row"><i class="fas fa-location-dot"></i><strong>${currentLang === 'hi' ? 'स्थान:' : 'Location:'}</strong><span>${data.location}</span></div>
    `;

    // WhatsApp pre-filled message
    const waMessage = `Hi, I applied for a job.\n\nName: ${data.name}\nRole: ${data.role}\nPhone: +91 ${data.phone}\nLocation: ${data.location}`;
    whatsappCTA.href = `https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent(waMessage)}`;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-init AOS for confirmation animations
    if (typeof AOS !== 'undefined') {
      setTimeout(() => AOS.refresh(), 100);
    }
  }

  // --- SUBMIT ANOTHER ---
  submitAnotherBtn?.addEventListener('click', () => {
    confirmationScreen.style.display = 'none';
    applicationFlow.style.display = '';
    document.querySelector('.lang-toggle')?.style.setProperty('display', '');

    // Reset form
    form.reset();
    roleCards.forEach(c => c.classList.remove('selected'));
    selectedRole = '';
    roleInput.value = '';
    selectedRoleText.textContent = '—';
    nameInput.classList.remove('valid', 'error');
    phoneInput.classList.remove('valid', 'error');
    clearError('nameError');
    clearError('phoneError');
    clearError('fileError');
    uploadPlaceholder.style.display = '';
    uploadPreview.style.display = 'none';
    uploadFileName.textContent = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- STICKY APPLY BAR VISIBILITY ---
  function handleStickyBar() {
    if (!stickyApplyBar || window.innerWidth > 768) return;

    const heroBottom = document.getElementById('careersHero')?.getBoundingClientRect().bottom || 0;
    const formTop = formSection?.getBoundingClientRect().top || 0;

    if (heroBottom < 0 && formTop > window.innerHeight * 0.5) {
      stickyApplyBar.classList.add('visible');
    } else {
      stickyApplyBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleStickyBar, { passive: true });
  window.addEventListener('resize', handleStickyBar, { passive: true });

  // --- SHAKE ANIMATION (CSS injected) ---
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
    .shake { animation: shake .5s ease; }
  `;
  document.head.appendChild(shakeStyle);

  // --- SMOOTH SCROLL for anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
