/* ============================================================
   RAFID ADMIN PANEL — admin.js
   Firebase Auth + Firestore Content Management
============================================================ */

/* ----------------------------------------------------------
   FIREBASE CONFIG
   Replace these values with your own Firebase project config.
   Get them from: Firebase Console → Project Settings → General
---------------------------------------------------------- */
const FIREBASE_CONFIG = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

/* ----------------------------------------------------------
   DEMO MODE
   If Firebase is not configured, the panel runs in demo mode
   (localStorage only). Set to false once Firebase is set up.
---------------------------------------------------------- */
const DEMO_MODE = true;

/* ----------------------------------------------------------
   DEFAULT DATA
---------------------------------------------------------- */
const DEFAULT_PROJECTS = [
  { title: 'Brand Identity — Studio X', category: 'design', tags: 'Brand Identity, Design', desc: 'Complete visual identity system including logo, color palette, typography, and brand guidelines.', img: '', liveUrl: '#', githubUrl: '#' },
  { title: 'E-Commerce Website — ShopFlow', category: 'development', tags: 'Web Design, Development', desc: 'Full responsive e-commerce site with product filtering, cart system, and smooth checkout.', img: '', liveUrl: '#', githubUrl: '#' },
  { title: 'Social Campaign — GrowthLab', category: 'marketing', tags: 'Social Media, Marketing', desc: 'Full social media strategy and content calendar that grew client following by 300%.', img: '', liveUrl: '#', githubUrl: '#' },
];

const DEFAULT_SKILLS = [
  { name: 'UI/UX Design', category: 'Design', percent: 92 },
  { name: 'Brand Identity', category: 'Design', percent: 88 },
  { name: 'HTML / CSS', category: 'Development', percent: 90 },
  { name: 'JavaScript', category: 'Development', percent: 75 },
  { name: 'Social Media', category: 'Marketing', percent: 95 },
];

const DEFAULT_EXP = [
  { type: 'work', date: '2022 — Present', role: 'Senior Creative Designer', company: 'Freelance / Self-Employed', desc: 'Leading brand identity, UI/UX, and digital marketing projects for international clients.' },
  { type: 'work', date: '2020 — 2022', role: 'UI/UX Designer', company: 'Digital Agency — Dhaka', desc: 'Designed user interfaces for web and mobile applications.' },
  { type: 'education', date: '2016 — 2020', role: 'Bachelor of Fine Arts', company: 'University of Dhaka', desc: 'Majored in Visual Communication Design. Graduated with honors.' },
];

/* ----------------------------------------------------------
   STATE
---------------------------------------------------------- */
let projects   = JSON.parse(localStorage.getItem('rf_projects'))   || DEFAULT_PROJECTS;
let skills     = JSON.parse(localStorage.getItem('rf_skills'))     || DEFAULT_SKILLS;
let experience = JSON.parse(localStorage.getItem('rf_experience')) || DEFAULT_EXP;

/* ----------------------------------------------------------
   DOM REFS
---------------------------------------------------------- */
const loginScreen = document.getElementById('loginScreen');
const dashboard   = document.getElementById('dashboard');
const loginForm   = document.getElementById('loginForm');
const loginError  = document.getElementById('loginError');
const logoutBtn   = document.getElementById('logoutBtn');
const topbarUser  = document.getElementById('topbarUser');
const tabTitle    = document.getElementById('tabTitle');

/* ----------------------------------------------------------
   AUTH — DEMO MODE (localStorage)
---------------------------------------------------------- */
function demoLogin(email, password) {
  // Simple demo credentials — change these
  if (email === 'admin@rafid.com' && password === 'rafid2025') {
    localStorage.setItem('rf_auth', email);
    showDashboard(email);
  } else {
    loginError.textContent = 'Invalid email or password.';
  }
}

function checkAuth() {
  const saved = localStorage.getItem('rf_auth');
  if (saved) showDashboard(saved);
}

function showDashboard(email) {
  loginScreen.style.display = 'none';
  dashboard.classList.remove('hidden');
  topbarUser.textContent = email;
  renderAll();
}

function doLogout() {
  localStorage.removeItem('rf_auth');
  dashboard.classList.add('hidden');
  loginScreen.style.display = 'flex';
}

/* ----------------------------------------------------------
   LOGIN FORM
---------------------------------------------------------- */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  loginError.textContent = '';
  demoLogin(email, password);
});

logoutBtn.addEventListener('click', doLogout);

/* ----------------------------------------------------------
   TAB NAVIGATION
---------------------------------------------------------- */
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = link.getAttribute('data-tab');
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    tabTitle.textContent = link.querySelector('span').textContent;
  });
});

/* ----------------------------------------------------------
   RENDER FUNCTIONS
---------------------------------------------------------- */
function renderAll() {
  renderProjects();
  renderSkills();
  renderExp();
}

function renderProjects() {
  const list = document.getElementById('projectsList');
  list.innerHTML = '';
  projects.forEach((p, i) => {
    list.innerHTML += `
      <div class="dynamic-item" id="proj-${i}">
        <button class="remove-btn" onclick="removeProject(${i})"><i class="fas fa-times"></i></button>
        <div class="field-group"><label>Title</label><input type="text" value="${p.title}" onchange="projects[${i}].title=this.value" /></div>
        <div class="field-group"><label>Category</label>
          <select onchange="projects[${i}].category=this.value">
            <option value="design" ${p.category==='design'?'selected':''}>Design</option>
            <option value="development" ${p.category==='development'?'selected':''}>Development</option>
            <option value="marketing" ${p.category==='marketing'?'selected':''}>Marketing</option>
          </select>
        </div>
        <div class="field-group"><label>Tags (comma separated)</label><input type="text" value="${p.tags}" onchange="projects[${i}].tags=this.value" /></div>
        <div class="field-group"><label>Description</label><textarea rows="2" onchange="projects[${i}].desc=this.value">${p.desc}</textarea></div>
        <div class="field-group"><label>Image URL</label><input type="url" value="${p.img}" placeholder="https://..." onchange="projects[${i}].img=this.value" /></div>
        <div class="field-group"><label>Live URL</label><input type="url" value="${p.liveUrl}" onchange="projects[${i}].liveUrl=this.value" /></div>
        <div class="field-group"><label>GitHub URL</label><input type="url" value="${p.githubUrl}" onchange="projects[${i}].githubUrl=this.value" /></div>
      </div>`;
  });
}

function renderSkills() {
  const list = document.getElementById('skillsList');
  list.innerHTML = '';
  skills.forEach((s, i) => {
    list.innerHTML += `
      <div class="dynamic-item">
        <button class="remove-btn" onclick="removeSkill(${i})"><i class="fas fa-times"></i></button>
        <div class="field-group"><label>Skill Name</label><input type="text" value="${s.name}" onchange="skills[${i}].name=this.value" /></div>
        <div class="field-group"><label>Category</label><input type="text" value="${s.category}" onchange="skills[${i}].category=this.value" /></div>
        <div class="field-group"><label>Percentage (0-100)</label><input type="number" min="0" max="100" value="${s.percent}" onchange="skills[${i}].percent=parseInt(this.value)" /></div>
      </div>`;
  });
}

function renderExp() {
  const list = document.getElementById('expList');
  list.innerHTML = '';
  experience.forEach((e, i) => {
    list.innerHTML += `
      <div class="dynamic-item">
        <button class="remove-btn" onclick="removeExp(${i})"><i class="fas fa-times"></i></button>
        <div class="field-group"><label>Type</label>
          <select onchange="experience[${i}].type=this.value">
            <option value="work" ${e.type==='work'?'selected':''}>Work Experience</option>
            <option value="education" ${e.type==='education'?'selected':''}>Education</option>
          </select>
        </div>
        <div class="field-group"><label>Date / Period</label><input type="text" value="${e.date}" onchange="experience[${i}].date=this.value" /></div>
        <div class="field-group"><label>Role / Degree</label><input type="text" value="${e.role}" onchange="experience[${i}].role=this.value" /></div>
        <div class="field-group"><label>Company / Institution</label><input type="text" value="${e.company}" onchange="experience[${i}].company=this.value" /></div>
        <div class="field-group"><label>Description</label><textarea rows="2" onchange="experience[${i}].desc=this.value">${e.desc}</textarea></div>
      </div>`;
  });
}

/* ----------------------------------------------------------
   ADD / REMOVE
---------------------------------------------------------- */
function addProject() {
  projects.push({ title: 'New Project', category: 'design', tags: '', desc: '', img: '', liveUrl: '#', githubUrl: '#' });
  renderProjects();
}
function removeProject(i) { projects.splice(i, 1); renderProjects(); }

function addSkill() {
  skills.push({ name: 'New Skill', category: 'Design', percent: 80 });
  renderSkills();
}
function removeSkill(i) { skills.splice(i, 1); renderSkills(); }

function addExp() {
  experience.push({ type: 'work', date: '2024', role: 'New Role', company: 'Company', desc: 'Description here.' });
  renderExp();
}
function removeExp(i) { experience.splice(i, 1); renderExp(); }

/* ----------------------------------------------------------
   SAVE SECTIONS
---------------------------------------------------------- */
function saveSection(section) {
  const msgEl = document.getElementById('save-' + section);

  if (section === 'hero') {
    const data = {
      name:      document.getElementById('heroName').value,
      title1:    document.getElementById('heroTitle1').value,
      title2:    document.getElementById('heroTitle2').value,
      title3:    document.getElementById('heroTitle3').value,
      desc:      document.getElementById('heroDesc').value,
      instagram: document.getElementById('heroInstagram').value,
      linkedin:  document.getElementById('heroLinkedin').value,
      github:    document.getElementById('heroGithub').value,
    };
    localStorage.setItem('rf_hero', JSON.stringify(data));
  }

  if (section === 'about') {
    const data = {
      lead:     document.getElementById('aboutLead').value,
      p2:       document.getElementById('aboutP2').value,
      p3:       document.getElementById('aboutP3').value,
      years:    document.getElementById('aboutYears').value,
      projects: document.getElementById('aboutProjects').value,
      clients:  document.getElementById('aboutClients').value,
    };
    localStorage.setItem('rf_about', JSON.stringify(data));
  }

  if (section === 'projects') {
    localStorage.setItem('rf_projects', JSON.stringify(projects));
  }

  if (section === 'skills') {
    localStorage.setItem('rf_skills', JSON.stringify(skills));
  }

  if (section === 'experience') {
    localStorage.setItem('rf_experience', JSON.stringify(experience));
  }

  if (section === 'contact') {
    const data = {
      email:    document.getElementById('contactEmail').value,
      location: document.getElementById('contactLocation').value,
      avail:    document.getElementById('contactAvail').value,
    };
    localStorage.setItem('rf_contact', JSON.stringify(data));
  }

  msgEl.textContent = '✓ Saved successfully!';
  setTimeout(() => { msgEl.textContent = ''; }, 3000);
}

/* ----------------------------------------------------------
   INIT
---------------------------------------------------------- */
checkAuth();
