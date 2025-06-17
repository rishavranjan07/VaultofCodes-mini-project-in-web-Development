
  // All skill options for selection:
  const skillOptions = [
    'JavaScript', 'HTML', 'CSS', 'React', 'Node.js', 'Python', 'Java',
    'C++', 'SQL', 'Git', 'Docker', 'AWS', 'TypeScript', 'Ruby',
    'Go', 'Swift', 'Kotlin', 'Machine Learning', 'UI/UX Design', 'Project Management',
  ];

  // Elements reference
  const appContainer = document.getElementById('app');
  const nameInput = document.getElementById('name-input');
  const emailInput = document.getElementById('email-input');
  const phoneInput = document.getElementById('phone-input');
  const summaryInput = document.getElementById('profile-summary');

  const educationRowsContainer = document.getElementById('education-rows');
  const addEducationBtn = document.getElementById('add-education-row');

  const skillsList = document.getElementById('skills-list');

  const experienceRowsContainer = document.getElementById('experience-rows');
  const addExperienceBtn = document.getElementById('add-experience-row');

  const clearFormBtn = document.getElementById('clear-form');
  const downloadBtn = document.getElementById('download-resume');

  // Preview elements
  const previewName = document.getElementById('preview-name');
  const previewContact = document.getElementById('preview-contact');
  const previewSummary = document.getElementById('preview-summary');

  const previewEducationList = document.getElementById('preview-education-list');
  const previewSkillsList = document.getElementById('preview-skills-list');
  const previewExperienceList = document.getElementById('preview-experience-list');

  // Progress bar
  const progressBar = document.getElementById('form-progress-bar');

  // State
  let selectedSkills = new Set();

  // Utility - create element with classes and attributes
  function createEl(name, options = {}) {
    const el = document.createElement(name);
    if (options.classes) {
      if (Array.isArray(options.classes)) el.classList.add(...options.classes);
      else el.classList.add(options.classes);
    }
    if (options.attrs) {
      for (const [k, v] of Object.entries(options.attrs)) el.setAttribute(k,v);
    }
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    return el;
  }

  // 1. Add skill tags
  function setupSkillTags() {
    skillsList.innerHTML = '';
    skillOptions.forEach(skill => {
      const tag = createEl('div', { classes: 'skill-tag', text: skill, attrs: {'role':'option', 'tabindex':'0'} });
      tag.addEventListener('click', () => toggleSkill(skill, tag));
      tag.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSkill(skill, tag);
        }
      });
      skillsList.appendChild(tag);
    });
  }

  function toggleSkill(skill, tagEl) {
    if (selectedSkills.has(skill)) {
      selectedSkills.delete(skill);
      tagEl.classList.remove('selected');
    } else {
      selectedSkills.add(skill);
      tagEl.classList.add('selected');
    }
    updateResume();
    updateProgress();
  }

  // 2. Dynamic Rows (Education & Experience)

  // Template for education row
  function createEducationRow(data = {}) {
    const container = createEl('div', { classes: 'dynamic-row' });
    // Degree / Qualification
    const degreeInput = createEl('input', { attrs: { type: 'text', placeholder: 'Degree or Qualification', 'aria-label': 'Degree or Qualification' } });
    degreeInput.value = data.degree || '';

    // Institution Name
    const instInput = createEl('input', { attrs: { type: 'text', placeholder: 'Institution Name', 'aria-label': 'Institution Name' } });
    instInput.value = data.institution || '';

    // Start Year
    const startInput = createEl('input', { attrs: { type: 'text', placeholder: 'Start Year', 'aria-label': 'Education Start Year (e.g., 2016)' } });
    startInput.value = data.start || '';

    // End Year
    const endInput = createEl('input', { attrs: { type: 'text', placeholder: 'End Year', 'aria-label': 'Education End Year (e.g., 2020 or Present)' } });
    endInput.value = data.end || '';

    // Remove button
    const removeBtn = createEl('button', { classes: 'btn-remove-row', attrs: { 'aria-label': 'Remove education entry', title: 'Remove education entry', type:'button' }, html: '&#x2716;' });
    removeBtn.addEventListener('click', () => {
      container.remove();
      updateResume();
      updateProgress();
    });

    // Add event listeners to inputs for live updates
    [degreeInput, instInput, startInput, endInput].forEach(input => {
      input.addEventListener('input', () => {
        updateResume();
        updateProgress();
      });
    });

    container.appendChild(degreeInput);
    container.appendChild(instInput);
    container.appendChild(startInput);
    container.appendChild(endInput);
    container.appendChild(removeBtn);

    return container;
  }

  // Template for experience row
  function createExperienceRow(data = {}) {
    const container = createEl('div', { classes: 'dynamic-row' });
    // Job Title
    const titleInput = createEl('input', { attrs: { type: 'text', placeholder: 'Job Title', 'aria-label': 'Job Title' } });
    titleInput.value = data.title || '';

    // Company
    const companyInput = createEl('input', { attrs: { type: 'text', placeholder: 'Company', 'aria-label': 'Company Name' } });
    companyInput.value = data.company || '';

    // Start Year
    const startInput = createEl('input', { attrs: { type: 'text', placeholder: 'Start Year', 'aria-label': 'Experience Start Year (e.g., 2018)' } });
    startInput.value = data.start || '';

    // End Year
    const endInput = createEl('input', { attrs: { type: 'text', placeholder: 'End Year', 'aria-label': 'Experience End Year (e.g., 2022 or Present)' } });
    endInput.value = data.end || '';

    // Description textarea
    const descInput = createEl('textarea', { attrs: { placeholder: 'Brief description or responsibilities', 'aria-label': 'Brief job description or responsibilities' } });
    descInput.value = data.description || '';

    // Remove button
    const removeBtn = createEl('button', { classes: 'btn-remove-row', attrs: { 'aria-label': 'Remove experience entry', title: 'Remove experience entry', type:'button' }, html: '&#x2716;' });
    removeBtn.addEventListener('click', () => {
      container.remove();
      updateResume();
      updateProgress();
    });

    [titleInput, companyInput, startInput, endInput, descInput].forEach(input => {
      input.addEventListener('input', () => {
        updateResume();
        updateProgress();
      });
    });

    // Structure grid differently for experience with textarea
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr)) 40px'; // textarea spans cols automagically

    container.appendChild(titleInput);
    container.appendChild(companyInput);
    container.appendChild(startInput);
    container.appendChild(endInput);
    container.appendChild(descInput);
    container.appendChild(removeBtn);

    return container;
  }

  // 3. Update Resume Preview
  function updateResume() {
    // Name and contact
    previewName.textContent = nameInput.value.trim() || 'Your Name';
    const emailPart = emailInput.value.trim() || 'youremail@example.com';
    const phonePart = phoneInput.value.trim() || '+123 456 7890';
    previewContact.textContent = `${emailPart} | ${phonePart}`;

    // Summary
    previewSummary.textContent = summaryInput.value.trim() || 'Professional summary will appear here.';

    // Education List
    previewEducationList.innerHTML = '';
    const educationRows = [...educationRowsContainer.children];
    if (educationRows.length === 0) {
      previewEducationList.innerHTML = '<p>No education added yet.</p>';
    } else {
      educationRows.forEach(row => {
        const vals = [...row.querySelectorAll('input')].map(i => i.value.trim());
        if (vals.every(v => v === '')) return; // skip empty

        const [degree, institution, startYear, endYear] = vals;
        const eduDiv = createEl('div', { classes: 'list-item' });
        const titleEl = createEl('div', { classes: 'list-item-title', text: degree || 'Degree' });
        const subEl = createEl('div', { classes: 'list-item-subtitle', text: institution || 'Institution' });
        const yearEl = createEl('div', { classes: 'list-item-subtitle', text: `${startYear || '?'} - ${endYear || '?'}` });
        eduDiv.appendChild(titleEl);
        eduDiv.appendChild(subEl);
        eduDiv.appendChild(yearEl);
        previewEducationList.appendChild(eduDiv);
      });
    }

    // Skills list
    previewSkillsList.innerHTML = '';
    if (selectedSkills.size === 0) {
      previewSkillsList.innerHTML = '<li>No skills selected.</li>';
    } else {
      selectedSkills.forEach(skill => {
        const li = createEl('li', { text: skill });
        previewSkillsList.appendChild(li);
      });
    }

    // Experience List
    previewExperienceList.innerHTML = '';
    const experienceRows = [...experienceRowsContainer.children];
    if (experienceRows.length === 0) {
      previewExperienceList.innerHTML = '<p>No experience added yet.</p>';
    } else {
      experienceRows.forEach(row => {
        const inputs = [...row.querySelectorAll('input')];
        const textarea = row.querySelector('textarea');
        const vals = inputs.map(i => i.value.trim());
        const description = textarea.value.trim();

        if (vals.every(v => v === '') && description === '') return; // skip empty

        const [title, company, startYear, endYear] = vals;
        const expDiv = createEl('div', { classes: 'list-item' });
        const titleEl = createEl('div', { classes: 'list-item-title', text: title || 'Job Title' });
        const subEl = createEl('div', { classes: 'list-item-subtitle', text: company || 'Company' });
        const yearEl = createEl('div', { classes: 'list-item-subtitle', text: `${startYear || '?'} - ${endYear || '?'}` });
        const descEl = createEl('div', { classes: 'list-item-description', text: description || 'Description not provided.' });

        expDiv.appendChild(titleEl);
        expDiv.appendChild(subEl);
        expDiv.appendChild(yearEl);
        expDiv.appendChild(descEl);
        previewExperienceList.appendChild(expDiv);
      });
    }
  }

  // 4. Add rows dynamic handlers

  addEducationBtn.addEventListener('click', () => {
    educationRowsContainer.appendChild(createEducationRow());
    updateProgress();
  });

  addExperienceBtn.addEventListener('click', () => {
    experienceRowsContainer.appendChild(createExperienceRow());
    updateProgress();
  });

  // 5. Form input listeners for real-time update & progress bar
  [nameInput,emailInput,phoneInput,summaryInput].forEach(input => {
    input.addEventListener('input', () => {
      updateResume();
      updateProgress();
    });
  });

  // Update progress bar calculating filled inputs
  function updateProgress() {
    // Count total required inputs and filled ones (approximate)
    let totalFields = 4; // name, email, phone, summary (phone optional - will count if filled)
    let filledCount = 0;

    if (nameInput.value.trim()) filledCount++;
    if (emailInput.value.trim()) filledCount++;
    if (phoneInput.value.trim()) filledCount++;
    if (summaryInput.value.trim()) filledCount++;

    // Education rows: Each row counts as 4 fields
    const educationCount = educationRowsContainer.children.length;
    totalFields += educationCount * 4;
    [...educationRowsContainer.children].forEach(row => {
      [...row.querySelectorAll('input')].forEach(input => {
        if (input.value.trim()) filledCount++;
      });
    });

    // Skills: each skill counts as 1
    const totalSkills = skillOptions.length;
    totalFields += totalSkills;
    filledCount += selectedSkills.size;

    // Experience rows: 5 fields each
    const experienceCount = experienceRowsContainer.children.length;
    totalFields += experienceCount * 5;
    [...experienceRowsContainer.children].forEach(row => {
      [...row.querySelectorAll('input')].forEach(input => {
        if (input.value.trim()) filledCount++;
      });
      const textarea = row.querySelector('textarea');
      if (textarea && textarea.value.trim()) filledCount++;
    });

    const progressPercent = Math.min(100, Math.round((filledCount / totalFields) * 100));
    progressBar.style.width = progressPercent + '%';
  }

  // 6. Clear form and reset state
  clearFormBtn.addEventListener('click', e => {
    // Prevent default reset to properly clear dynamic rows & skills as well
    e.preventDefault();

    // Clear inputs
    nameInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    summaryInput.value = '';

    // Remove all dynamic rows
    educationRowsContainer.innerHTML = '';
    experienceRowsContainer.innerHTML = '';

    // Clear skills selection
    selectedSkills.clear();
    [...skillsList.children].forEach(t => t.classList.remove('selected'));

    // Update preview and progress
    updateResume();
    updateProgress();
  });

  // 7. Download resume as PDF using jsPDF and html2canvas
  // We load external libraries dynamically to keep file self-contained in HTML

  function loadExternalScript(src, onload) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = onload;
    document.body.appendChild(script);
  }

  function downloadResumePDF() {
    if (typeof html2canvas === 'undefined' || typeof jsPDF === 'undefined') {
      loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', () => {
        loadExternalScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => {
          createPDF();
        });
      });
    } else {
      createPDF();
    }
  }

  function createPDF() {
    // Scroll to top of preview before capture
    const previewSection = document.getElementById('resume-preview');
    previewSection.scrollTop = 0;

    // Capture the resume preview's visible area as image for PDF
    html2canvas(previewSection, { scale: 2, useCORS: true, backgroundColor: null }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      // A4 size at 72 DPI default, but using canvas for fit
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Calculate image dimensions for PDF fit (max 560pt width with margin)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save('resume.pdf');
    }).catch(e => {
      alert('Failed to generate PDF. Please try again.');
      console.error(e);
    });
  }

  downloadBtn.addEventListener('click', downloadResumePDF);

  // Initialization
  function init() {
    setupSkillTags();
    // Start with one education and one experience row
    educationRowsContainer.appendChild(createEducationRow());
    experienceRowsContainer.appendChild(createExperienceRow());
    updateResume();
    updateProgress();
  }

  window.addEventListener('load', init);