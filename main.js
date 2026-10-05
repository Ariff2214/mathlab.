import html2pdf from 'html2pdf.js';

// ==========================================================================
// 1. DATA MODELS & STATE MANAGEMENT
// ==========================================================================

const INITIAL_MODULES_100 = [
  { id: 1, title: 'Course Overview', percent: 100, duration: '5 min', completed: true },
  { id: 2, title: 'State Machines and Stateflow', percent: 100, duration: '5 min', completed: true },
  { id: 3, title: 'Creating State Charts', percent: 100, duration: '20 min', completed: true },
  { id: 4, title: 'Stateflow Symbols and Data', percent: 100, duration: '10 min', completed: true },
  { id: 5, title: 'Chart Actions', percent: 100, duration: '10 min', completed: true },
  { id: 6, title: 'Chart Execution', percent: 100, duration: '5 min', completed: true },
  { id: 7, title: 'Flow Charts', percent: 100, duration: '10 min', completed: true },
  { id: 8, title: 'Functions in Stateflow', percent: 100, duration: '10 min', completed: true },
  { id: 9, title: 'Chart Hierarchy', percent: 100, duration: '5 min', completed: true },
  { id: 10, title: 'Project - Robotic Vacuum Driving Modes', percent: 100, duration: '10 min', completed: true },
  { id: 11, title: 'Conclusion', percent: 100, duration: '5 min', completed: true },
];

const INITIAL_MODULES_54 = [
  { id: 1, title: 'Course Overview', percent: 100, duration: '5 min', completed: true },
  { id: 2, title: 'State Machines and Stateflow', percent: 100, duration: '5 min', completed: true },
  { id: 3, title: 'Creating State Charts', percent: 40, duration: '20 min', completed: false },
  { id: 4, title: 'Stateflow Symbols and Data', percent: 33, duration: '10 min', completed: false },
  { id: 5, title: 'Chart Actions', percent: 33, duration: '10 min', completed: false },
  { id: 6, title: 'Chart Execution', percent: 100, duration: '5 min', completed: true },
  { id: 7, title: 'Flow Charts', percent: 66, duration: '10 min', completed: false },
  { id: 8, title: 'Functions in Stateflow', percent: 33, duration: '10 min', completed: false },
  { id: 9, title: 'Chart Hierarchy', percent: 50, duration: '5 min', completed: false },
  { id: 10, title: 'Project - Robotic Vacuum Driving Modes', percent: 33, duration: '10 min', completed: false },
  { id: 11, title: 'Conclusion', percent: 100, duration: '5 min', completed: true },
];

let appState = {
  isCompleted: true, // Default 100% completed state as requested in items 18-22
  studentName: 'Abdul Ariff S',
  courseName: 'Stateflow Onramp',
  completionDate: '4 October 2026',
  modules: [...INITIAL_MODULES_100],
  overallPercent: 100,
};

// ==========================================================================
// 2. DOM ELEMENTS
// ==========================================================================

const modulesContainer = document.getElementById('modules-list-container');
const heroProgressBar = document.getElementById('hero-progress-bar');
const heroProgressText = document.getElementById('hero-progress-text');
const heroStatusBadge = document.getElementById('hero-status-badge');
const mainCourseBtn = document.getElementById('main-course-btn');

// Modals & Triggers
const modalCertReport = document.getElementById('modal-cert-report');
const modalCertViewer = document.getElementById('modal-cert-viewer');
const modalShareCourse = document.getElementById('modal-share-course');
const modalSettings = document.getElementById('modal-settings');

const linkCertReport = document.getElementById('link-cert-report');
const linkShareCourse = document.getElementById('link-share-course');
const linkSettings = document.getElementById('link-settings');
const linkChangeVersion = document.getElementById('link-change-version');

const btnCloseCertModal = document.getElementById('btn-close-cert-modal');
const btnCloseCertViewer = document.getElementById('btn-close-cert-viewer');
const btnCloseShareModal = document.getElementById('btn-close-share-modal');
const btnCloseSettingsModal = document.getElementById('btn-close-settings-modal');

// Modal Tabs
const tabBtnCert = document.getElementById('tab-btn-cert');
const tabBtnReport = document.getElementById('tab-btn-report');
const tabContentCert = document.getElementById('tab-content-cert');
const tabContentReport = document.getElementById('tab-content-report');

// Certificate Tab Actions
const btnViewPdf = document.getElementById('btn-view-pdf');
const btnCopyCertLink = document.getElementById('btn-copy-cert-link');
const shareUrlInput = document.getElementById('share-url-input');

// Certificate Printable Display Elements
const certDisplayName = document.getElementById('cert-display-name');
const certDisplayPercent = document.getElementById('cert-display-percent');
const certDisplayCourse = document.getElementById('cert-display-course');
const certDisplayDate = document.getElementById('cert-display-date');

// Certificate Viewer Tools
const btnPrintCert = document.getElementById('btn-print-cert');
const btnDownloadCertPdf = document.getElementById('btn-download-cert-pdf');

// Progress Report Elements
const reportOverallPercent = document.getElementById('report-overall-percent');
const reportProgressFill = document.getElementById('report-progress-fill');
const reportModulesContainer = document.getElementById('report-modules-container');
const reportStatusBadge = document.getElementById('report-status-badge');

// Expand/Collapse All
const btnToggleAllModules = document.getElementById('btn-toggle-all-modules');

// State Switchers in Settings
const btnSet100 = document.getElementById('btn-set-100');
const btnSet54 = document.getElementById('btn-set-54');

// ==========================================================================
// 3. RENDER FUNCTIONS
// ==========================================================================

function updateUI() {
  const percent = appState.isCompleted ? 100 : 54;
  appState.overallPercent = percent;

  // Hero section update
  if (heroProgressText) heroProgressText.textContent = `${percent}%`;
  if (heroProgressBar) heroProgressBar.style.width = `${percent}%`;
  
  if (appState.isCompleted) {
    if (heroProgressBar) heroProgressBar.classList.add('completed-100');
    if (heroStatusBadge) {
      heroStatusBadge.textContent = 'Completed';
      heroStatusBadge.style.display = 'inline-block';
    }
    if (mainCourseBtn) mainCourseBtn.textContent = 'Review course';
  } else {
    if (heroProgressBar) heroProgressBar.classList.remove('completed-100');
    if (heroStatusBadge) {
      heroStatusBadge.textContent = 'In Progress';
      heroStatusBadge.style.display = 'none';
    }
    if (mainCourseBtn) mainCourseBtn.textContent = 'Resume course';
  }

  // Certificate Display update
  if (certDisplayName) certDisplayName.textContent = appState.studentName;
  if (certDisplayPercent) certDisplayPercent.textContent = `${percent}%`;
  if (certDisplayCourse) certDisplayCourse.textContent = appState.courseName;
  if (certDisplayDate) certDisplayDate.textContent = appState.completionDate;

  // Render Modules List
  renderModules();

  // Render Progress Report
  renderProgressReport();
}

function renderModules() {
  if (!modulesContainer) return;
  modulesContainer.innerHTML = '';

  appState.modules.forEach((mod) => {
    const isFull = mod.percent === 100;
    
    // SVG Icon for status
    const iconSvg = isFull
      ? `<svg class="status-icon-svg completed" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
         </svg>`
      : `<svg class="status-icon-svg partial" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14v12c3.31 0 6-2.69 6-6s-2.69-6-6-6z"/>
         </svg>`;

    const row = document.createElement('div');
    row.className = 'mw-module-row';
    row.dataset.moduleId = mod.id;

    row.innerHTML = `
      <div class="mw-module-header-clickable">
        <span class="module-status-icon">${iconSvg}</span>
        <span class="module-arrow-icon">▶</span>
        <span class="module-title">${mod.id}. ${mod.title}</span>
        <div class="module-meta">
          <span class="module-percent">${mod.percent}%</span>
          <span class="divider">|</span>
          <span class="module-duration">${mod.duration}</span>
        </div>
      </div>
      <div class="mw-module-body">
        <div class="module-details">
          <p class="text-sm text-gray-600 mb-2">Module Topics &amp; Practice Tasks:</p>
          <ul class="module-lesson-list">
            <li class="lesson-item">
              <span class="lesson-title">Interactive Exercise: Stateflow Logic Simulation</span>
              <span class="lesson-badge">${isFull ? '✓ Completed' : 'In Progress'}</span>
            </li>
            <li class="lesson-item">
              <span class="lesson-title">Knowledge Assessment</span>
              <span class="lesson-badge">${isFull ? '✓ Completed' : 'In Progress'}</span>
            </li>
          </ul>
        </div>
      </div>
    `;

    // Click handler for accordion
    const headerClickable = row.querySelector('.mw-module-header-clickable');
    headerClickable.addEventListener('click', () => {
      row.classList.toggle('expanded');
    });

    modulesContainer.appendChild(row);
  });
}

function renderProgressReport() {
  if (!reportModulesContainer) return;

  const percent = appState.overallPercent;
  reportOverallPercent.textContent = `${percent}%`;
  reportProgressFill.style.width = `${percent}%`;

  if (appState.isCompleted) {
    reportProgressFill.classList.add('completed-100');
    reportStatusBadge.textContent = 'Course Completed';
    reportStatusBadge.className = 'report-status-tag completed';
  } else {
    reportProgressFill.classList.remove('completed-100');
    reportStatusBadge.textContent = 'In Progress (54%)';
    reportStatusBadge.className = 'report-status-tag';
  }

  reportModulesContainer.innerHTML = '';
  appState.modules.forEach((mod) => {
    const isFull = mod.percent === 100;
    const item = document.createElement('div');
    item.className = `report-module-item ${isFull ? 'completed' : ''}`;
    item.innerHTML = `
      <span class="report-mod-name">${mod.id}. ${mod.title}</span>
      <span class="report-mod-stat">${isFull ? '✓ Completed — 100%' : `${mod.percent}%`}</span>
    `;
    reportModulesContainer.appendChild(item);
  });
}

// ==========================================================================
// 4. EVENT HANDLERS & MODAL CONTROL
// ==========================================================================

function openModal(modal) {
  if (modal) modal.classList.remove('hidden');
}

function closeModal(modal) {
  if (modal) modal.classList.add('hidden');
}

// Triggers
if (linkCertReport) {
  linkCertReport.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(modalCertReport);
  });
}

if (linkShareCourse) {
  linkShareCourse.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(modalShareCourse);
  });
}

if (linkSettings) {
  linkSettings.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(modalSettings);
  });
}

if (linkChangeVersion) {
  linkChangeVersion.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(modalSettings);
  });
}

// Close buttons
if (btnCloseCertModal) btnCloseCertModal.addEventListener('click', () => closeModal(modalCertReport));
if (btnCloseCertViewer) btnCloseCertViewer.addEventListener('click', () => closeModal(modalCertViewer));
if (btnCloseShareModal) btnCloseShareModal.addEventListener('click', () => closeModal(modalShareCourse));
if (btnCloseSettingsModal) btnCloseSettingsModal.addEventListener('click', () => closeModal(modalSettings));

// Close on backdrop click
[modalCertReport, modalCertViewer, modalShareCourse, modalSettings].forEach((modal) => {
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  }
});

// Tabs inside Certificate & Progress Report Modal
tabBtnCert.addEventListener('click', () => {
  tabBtnCert.classList.add('active');
  tabBtnReport.classList.remove('active');
  tabContentCert.classList.add('active');
  tabContentReport.classList.remove('active');
});

tabBtnReport.addEventListener('click', () => {
  tabBtnReport.classList.add('active');
  tabBtnCert.classList.remove('active');
  tabContentReport.classList.add('active');
  tabContentCert.classList.remove('active');
});

// "View PDF" button opens the Certificate Viewer Modal
btnViewPdf.addEventListener('click', () => {
  openModal(modalCertViewer);
});

// Copy Certificate URL
btnCopyCertLink.addEventListener('click', () => {
  navigator.clipboard.writeText(shareUrlInput.value).then(() => {
    btnCopyCertLink.textContent = 'Copied!';
    btnCopyCertLink.classList.add('copied');
    setTimeout(() => {
      btnCopyCertLink.textContent = 'Copy';
      btnCopyCertLink.classList.remove('copied');
    }, 2000);
  });
});

// Copy Course Share URL
const btnCopyCourseLink = document.getElementById('btn-copy-course-link');
if (btnCopyCourseLink) {
  btnCopyCourseLink.addEventListener('click', () => {
    const courseUrl = document.getElementById('share-course-url');
    navigator.clipboard.writeText(courseUrl.value).then(() => {
      btnCopyCourseLink.textContent = 'Copied!';
      btnCopyCourseLink.classList.add('copied');
      setTimeout(() => {
        btnCopyCourseLink.textContent = 'Copy';
        btnCopyCourseLink.classList.remove('copied');
      }, 2000);
    });
  });
}

// Print Certificate
btnPrintCert.addEventListener('click', () => {
  window.print();
});

// Download PDF Certificate using html2pdf
btnDownloadCertPdf.addEventListener('click', () => {
  const element = document.getElementById('certificate-printable-area');
  const originalText = btnDownloadCertPdf.textContent;
  btnDownloadCertPdf.textContent = 'Generating PDF...';

  const opt = {
    margin: 0,
    filename: `Stateflow_Onramp_Certificate_${appState.studentName.replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'pt', format: [960, 620], orientation: 'landscape' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    btnDownloadCertPdf.textContent = originalText;
  }).catch((err) => {
    console.error('PDF Generation Error:', err);
    btnDownloadCertPdf.textContent = originalText;
    // Fallback print
    window.print();
  });
});

// Expand / Collapse All Modules
let allExpanded = false;
btnToggleAllModules.addEventListener('click', () => {
  allExpanded = !allExpanded;
  const rows = document.querySelectorAll('.mw-module-row');
  rows.forEach((r) => {
    if (allExpanded) {
      r.classList.add('expanded');
    } else {
      r.classList.remove('expanded');
    }
  });
  btnToggleAllModules.textContent = allExpanded ? 'Collapse All' : 'Expand All';
});

// State Switchers in Settings (100% vs 54%)
btnSet100.addEventListener('click', () => {
  appState.isCompleted = true;
  appState.modules = [...INITIAL_MODULES_100];
  btnSet100.classList.add('active');
  btnSet54.classList.remove('active');
  updateUI();
});

btnSet54.addEventListener('click', () => {
  appState.isCompleted = false;
  appState.modules = [...INITIAL_MODULES_54];
  btnSet54.classList.add('active');
  btnSet100.classList.remove('active');
  updateUI();
});

// Main course button click handler
if (mainCourseBtn) {
  mainCourseBtn.addEventListener('click', () => {
    // Scroll smoothly to modules section or open first module
    const modulesSec = document.querySelector('.mw-modules-section');
    if (modulesSec) {
      modulesSec.scrollIntoView({ behavior: 'smooth' });
      const firstRow = document.querySelector('.mw-module-row');
      if (firstRow) firstRow.classList.add('expanded');
    }
  });
}

// Initialize app UI on page load
document.addEventListener('DOMContentLoaded', () => {
  updateUI();
});
