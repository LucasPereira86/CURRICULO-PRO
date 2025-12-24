/* ================================================
   CURRÍCULO PRO - Application Logic
   ================================================ */

// State
let currentStep = 1;
let experienceCount = 1;
let educationCount = 1;
let resumeData = {};
let userPhotoData = null; // Base64 photo data
let selectedColor = 'indigo'; // Default template color

// Color palette configuration
const colorPalette = {
    indigo: { primary: '#6366f1', dark: '#4f46e5', light: '#818cf8' },
    emerald: { primary: '#10b981', dark: '#059669', light: '#34d399' },
    rose: { primary: '#f43f5e', dark: '#e11d48', light: '#fb7185' },
    amber: { primary: '#f59e0b', dark: '#d97706', light: '#fbbf24' },
    cyan: { primary: '#06b6d4', dark: '#0891b2', light: '#22d3ee' },
    purple: { primary: '#8b5cf6', dark: '#7c3aed', light: '#a78bfa' },
    slate: { primary: '#475569', dark: '#334155', light: '#64748b' }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    initApp();
});

function initApp() {
    // Template selector event
    document.querySelectorAll('.template-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.template-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            this.querySelector('input').checked = true;
            updatePreviewLive();
        });
    });

    // Template cards in showcase
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', function () {
            const template = this.dataset.template;
            document.querySelector('#criar').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                document.querySelectorAll('.template-option input').forEach(input => {
                    if (input.value === template) {
                        input.checked = true;
                        input.closest('.template-option').click();
                    }
                });
            }, 500);
        });
    });

    // Mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            const nav = document.querySelector('.nav');
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Auto-update preview on input change
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', debounce(updatePreviewLive, 500));
    });

    // Load saved data if exists
    loadSavedData();

    // Initialize photo upload
    initPhotoUpload();

    // Initialize color picker
    initColorPicker();

    // Initialize dark mode
    initDarkMode();

    // Initialize FAQ accordion
    initFAQ();

    // Initialize phone mask
    initPhoneMask();

    // Initialize field validation
    initFieldValidation();

    // Initialize premium animations
    initParticles();
    initCounterAnimation();
    initScrollAnimations();

    console.log('CurrículoPro initialized with premium features! ✨');
}

// Debounce utility
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

// Step Navigation
function nextStep(step) {
    if (!validateCurrentStep()) return;

    document.querySelector('.form-step.active').classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');

    document.querySelectorAll('.progress-step').forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (stepNum < step) s.classList.add('completed');
        if (stepNum === step) s.classList.add('active');
    });

    currentStep = step;
    saveData();
}

function prevStep(step) {
    document.querySelector('.form-step.active').classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');

    document.querySelectorAll('.progress-step').forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (stepNum < step) s.classList.add('completed');
        if (stepNum === step) s.classList.add('active');
    });

    currentStep = step;
}

function validateCurrentStep() {
    if (currentStep === 1) {
        const nome = document.getElementById('nome').value.trim();
        const cargo = document.getElementById('cargo').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!nome) {
            toast('Por favor, informe seu nome completo', 'error');
            document.getElementById('nome').focus();
            return false;
        }
        if (!cargo) {
            toast('Por favor, informe o cargo desejado', 'error');
            document.getElementById('cargo').focus();
            return false;
        }
        if (!email || !isValidEmail(email)) {
            toast('Por favor, informe um e-mail válido', 'error');
            document.getElementById('email').focus();
            return false;
        }
    }
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add Experience
function addExperience() {
    const container = document.getElementById('experiencias-container');
    const newItem = document.createElement('div');
    newItem.className = 'experience-item';
    newItem.dataset.index = experienceCount;
    newItem.innerHTML = `
        <div class="form-group">
            <label>Cargo</label>
            <input type="text" class="exp-cargo" placeholder="Ex: Analista de Marketing">
        </div>
        <div class="form-group">
            <label>Empresa</label>
            <input type="text" class="exp-empresa" placeholder="Nome da empresa">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Início</label>
                <input type="text" class="exp-inicio" placeholder="Jan 2020">
            </div>
            <div class="form-group">
                <label>Fim</label>
                <input type="text" class="exp-fim" placeholder="Atual">
            </div>
        </div>
        <div class="form-group">
            <label>Descrição das Atividades</label>
            <textarea class="exp-descricao" rows="3" placeholder="Descreva suas principais responsabilidades..."></textarea>
        </div>
        <button type="button" class="btn btn-sm btn-outline" onclick="removeItem(this)" style="color: #ef4444; border-color: #ef4444;">
            Remover
        </button>
    `;
    container.appendChild(newItem);
    experienceCount++;
}

// Add Education
function addEducation() {
    const container = document.getElementById('formacoes-container');
    const newItem = document.createElement('div');
    newItem.className = 'education-item';
    newItem.dataset.index = educationCount;
    newItem.innerHTML = `
        <div class="form-group">
            <label>Curso</label>
            <input type="text" class="edu-curso" placeholder="Ex: Administração de Empresas">
        </div>
        <div class="form-group">
            <label>Instituição</label>
            <input type="text" class="edu-instituicao" placeholder="Nome da universidade/escola">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Início</label>
                <input type="text" class="edu-inicio" placeholder="2018">
            </div>
            <div class="form-group">
                <label>Conclusão</label>
                <input type="text" class="edu-fim" placeholder="2022">
            </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline" onclick="removeItem(this)" style="color: #ef4444; border-color: #ef4444;">
            Remover
        </button>
    `;
    container.appendChild(newItem);
    educationCount++;
}

function removeItem(btn) {
    btn.closest('.experience-item, .education-item').remove();
}

// Photo Upload
function initPhotoUpload() {
    const photoInput = document.getElementById('photoInput');
    const photoPreview = document.getElementById('photoPreview');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const removePhotoBtn = document.getElementById('removePhoto');
    const photoPlaceholder = document.querySelector('.photo-placeholder');

    if (!photoInput) return;

    // Click on preview to trigger file input
    photoPreview.addEventListener('click', () => photoInput.click());

    // Handle file selection
    photoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                toast('Por favor, selecione uma imagem válida.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                userPhotoData = event.target.result;
                photoPreviewImg.src = userPhotoData;
                photoPreviewImg.style.display = 'block';
                photoPlaceholder.style.display = 'none';
                photoPreview.classList.add('has-photo');
                removePhotoBtn.style.display = 'block';
                updatePreviewLive();
            };
            reader.readAsDataURL(file);
        }
    });

    // Remove photo
    removePhotoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        userPhotoData = null;
        photoPreviewImg.src = '';
        photoPreviewImg.style.display = 'none';
        photoPlaceholder.style.display = 'flex';
        photoPreview.classList.remove('has-photo');
        removePhotoBtn.style.display = 'none';
        photoInput.value = '';
        updatePreviewLive();
    });
}

// Collect Form Data
function collectFormData() {
    const portfolioEl = document.getElementById('portfolio');
    const data = {
        nome: document.getElementById('nome').value.trim(),
        cargo: document.getElementById('cargo').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        email: document.getElementById('email').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value.trim(),
        linkedin: document.getElementById('linkedin').value.trim(),
        portfolio: portfolioEl ? portfolioEl.value.trim() : '',
        resumo: document.getElementById('resumo').value.trim(),
        habilidades: document.getElementById('habilidades').value.trim(),
        idiomas: document.getElementById('idiomas').value.trim(),
        cursos: document.getElementById('cursos').value.trim(),
        experiencias: [],
        formacoes: [],
        template: document.querySelector('input[name="template"]:checked')?.value || 'moderno'
    };

    // Collect experiences
    document.querySelectorAll('.experience-item').forEach(item => {
        const exp = {
            cargo: item.querySelector('.exp-cargo').value.trim(),
            empresa: item.querySelector('.exp-empresa').value.trim(),
            inicio: item.querySelector('.exp-inicio').value.trim(),
            fim: item.querySelector('.exp-fim').value.trim(),
            descricao: item.querySelector('.exp-descricao').value.trim()
        };
        if (exp.cargo || exp.empresa) {
            data.experiencias.push(exp);
        }
    });

    // Collect education
    document.querySelectorAll('.education-item').forEach(item => {
        const edu = {
            curso: item.querySelector('.edu-curso').value.trim(),
            instituicao: item.querySelector('.edu-instituicao').value.trim(),
            inicio: item.querySelector('.edu-inicio').value.trim(),
            fim: item.querySelector('.edu-fim').value.trim()
        };
        if (edu.curso || edu.instituicao) {
            data.formacoes.push(edu);
        }
    });

    return data;
}

// Save Data to LocalStorage
function saveData() {
    const data = collectFormData();
    try {
        localStorage.setItem('curriculo_data', JSON.stringify(data));
    } catch (e) {
        console.log('Could not save data');
    }
}

function loadSavedData() {
    try {
        const saved = localStorage.getItem('curriculo_data');
        if (saved) {
            const data = JSON.parse(saved);

            // Fill basic fields
            if (data.nome) document.getElementById('nome').value = data.nome;
            if (data.cargo) document.getElementById('cargo').value = data.cargo;
            if (data.telefone) document.getElementById('telefone').value = data.telefone;
            if (data.email) document.getElementById('email').value = data.email;
            if (data.cidade) document.getElementById('cidade').value = data.cidade;
            if (data.estado) document.getElementById('estado').value = data.estado;
            if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
            if (data.resumo) document.getElementById('resumo').value = data.resumo;
            if (data.habilidades) document.getElementById('habilidades').value = data.habilidades;
            if (data.idiomas) document.getElementById('idiomas').value = data.idiomas;
            if (data.cursos) document.getElementById('cursos').value = data.cursos;

            toast('Dados anteriores restaurados!', 'success');
        }
    } catch (e) {
        console.log('Could not load data');
    }
}

// Update Preview Live
function updatePreviewLive() {
    const nome = document.getElementById('nome').value.trim();
    if (nome) {
        generateResume(true);
    }
}

// Generate Resume
function generateResume(isLive = false) {
    const data = collectFormData();
    resumeData = data;

    if (!data.nome) {
        if (!isLive) toast('Por favor, preencha pelo menos seu nome', 'error');
        return;
    }

    const preview = document.getElementById('resumePreview');
    const template = data.template;

    let html = '';

    switch (template) {
        case 'moderno':
            html = generateModernoTemplate(data);
            break;
        case 'classico':
            html = generateClassicoTemplate(data);
            break;
        case 'criativo':
            html = generateCriativoTemplate(data);
            break;
        case 'minimalista':
            html = generateMinimalistaTemplate(data);
            break;
        case 'executivo':
            html = generateExecutivoTemplate(data);
            break;
        default:
            html = generateModernoTemplate(data);
    }

    preview.innerHTML = html;
    document.getElementById('btnDownload').disabled = false;

    if (!isLive) {
        toast('🎉 Currículo gerado com sucesso!', 'success');
        triggerConfetti();
        saveData();
    }
}

// Template: Moderno
function generateModernoTemplate(data) {
    const initials = getInitials(data.nome);
    const skills = data.habilidades ? data.habilidades.split(',').map(s => s.trim()).filter(s => s) : [];
    const idiomas = data.idiomas ? data.idiomas.split(',').map(s => s.trim()).filter(s => s) : [];

    let experienciasHtml = '';
    data.experiencias.forEach(exp => {
        experienciasHtml += `
            <div class="exp-item">
                <div class="exp-header">
                    <span class="exp-title">${escapeHtml(exp.cargo)}</span>
                    <span class="exp-date">${escapeHtml(exp.inicio)} - ${escapeHtml(exp.fim)}</span>
                </div>
                <div class="exp-company">${escapeHtml(exp.empresa)}</div>
                <div class="exp-desc">${escapeHtml(exp.descricao)}</div>
            </div>
        `;
    });

    let formacoesHtml = '';
    data.formacoes.forEach(edu => {
        formacoesHtml += `
            <div class="edu-item">
                <div class="edu-header">
                    <span class="edu-title">${escapeHtml(edu.curso)}</span>
                    <span class="edu-date">${escapeHtml(edu.inicio)} - ${escapeHtml(edu.fim)}</span>
                </div>
                <div class="edu-school">${escapeHtml(edu.instituicao)}</div>
            </div>
        `;
    });

    let skillsHtml = skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
    let idiomasHtml = idiomas.map(s => `<div class="contact-item">🌐 ${escapeHtml(s)}</div>`).join('');

    return `
        <div class="resume-template resume-moderno" id="resumeContent">
            <div class="sidebar">
                <div class="profile-section">
                    ${userPhotoData
            ? `<div class="profile-avatar profile-photo"><img src="${userPhotoData}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"></div>`
            : `<div class="profile-avatar">${initials}</div>`
        }
                    <div class="profile-name">${escapeHtml(data.nome)}</div>
                    <div class="profile-title">${escapeHtml(data.cargo)}</div>
                </div>
                
                <div class="sidebar-section">
                    <div class="sidebar-title">Contato</div>
                    ${data.telefone ? `<div class="contact-item">📱 ${escapeHtml(data.telefone)}</div>` : ''}
                    ${data.email ? `<div class="contact-item">✉️ ${escapeHtml(data.email)}</div>` : ''}
                    ${data.cidade ? `<div class="contact-item">📍 ${escapeHtml(data.cidade)}${data.estado ? ', ' + escapeHtml(data.estado) : ''}</div>` : ''}
                    ${data.linkedin ? `<div class="contact-item">💼 ${escapeHtml(data.linkedin)}</div>` : ''}
                </div>
                
                ${skills.length > 0 ? `
                    <div class="sidebar-section">
                        <div class="sidebar-title">Habilidades</div>
                        ${skillsHtml}
                    </div>
                ` : ''}
                
                ${idiomas.length > 0 ? `
                    <div class="sidebar-section">
                        <div class="sidebar-title">Idiomas</div>
                        ${idiomasHtml}
                    </div>
                ` : ''}
            </div>
            
            <div class="main">
                ${data.resumo ? `
                    <div class="section">
                        <div class="section-title">Resumo Profissional</div>
                        <div class="summary">${escapeHtml(data.resumo)}</div>
                    </div>
                ` : ''}
                
                ${data.experiencias.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Experiência Profissional</div>
                        ${experienciasHtml}
                    </div>
                ` : ''}
                
                ${data.formacoes.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Formação Acadêmica</div>
                        ${formacoesHtml}
                    </div>
                ` : ''}
                
                ${data.cursos ? `
                    <div class="section">
                        <div class="section-title">Cursos Complementares</div>
                        <div class="summary">${escapeHtml(data.cursos)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Template: Clássico
function generateClassicoTemplate(data) {
    const skills = data.habilidades ? data.habilidades.split(',').map(s => s.trim()).filter(s => s) : [];

    let experienciasHtml = '';
    data.experiencias.forEach(exp => {
        experienciasHtml += `
            <div class="exp-item">
                <div class="exp-title">${escapeHtml(exp.cargo)}</div>
                <div class="exp-meta">${escapeHtml(exp.empresa)} | ${escapeHtml(exp.inicio)} - ${escapeHtml(exp.fim)}</div>
                <div class="exp-desc">${escapeHtml(exp.descricao)}</div>
            </div>
        `;
    });

    let formacoesHtml = '';
    data.formacoes.forEach(edu => {
        formacoesHtml += `
            <div class="edu-item">
                <div class="edu-title">${escapeHtml(edu.curso)}</div>
                <div class="edu-meta">${escapeHtml(edu.instituicao)} | ${escapeHtml(edu.inicio)} - ${escapeHtml(edu.fim)}</div>
            </div>
        `;
    });

    let skillsHtml = skills.map(s => `<span class="skill-item">${escapeHtml(s)}</span>`).join('');

    return `
        <div class="resume-template resume-classico" id="resumeContent">
            <div class="header-bar">
                ${userPhotoData
            ? `<img src="${userPhotoData}" alt="Foto" class="header-photo" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 3px solid white; margin-right: 20px;">`
            : ''
        }
                <div class="header-info">
                    <div class="header-name">${escapeHtml(data.nome)}</div>
                    <div class="header-title">${escapeHtml(data.cargo)}</div>
                </div>
            </div>
            
            <div class="contact-bar">
                ${data.telefone ? `<span>📱 ${escapeHtml(data.telefone)}</span>` : ''}
                ${data.email ? `<span>✉️ ${escapeHtml(data.email)}</span>` : ''}
                ${data.cidade ? `<span>📍 ${escapeHtml(data.cidade)}${data.estado ? ', ' + escapeHtml(data.estado) : ''}</span>` : ''}
                ${data.linkedin ? `<span>💼 ${escapeHtml(data.linkedin)}</span>` : ''}
            </div>
            
            <div class="content">
                ${data.resumo ? `
                    <div class="section">
                        <div class="section-title">Resumo Profissional</div>
                        <div class="summary">${escapeHtml(data.resumo)}</div>
                    </div>
                ` : ''}
                
                ${data.experiencias.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Experiência Profissional</div>
                        ${experienciasHtml}
                    </div>
                ` : ''}
                
                ${data.formacoes.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Formação Acadêmica</div>
                        ${formacoesHtml}
                    </div>
                ` : ''}
                
                ${skills.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Habilidades</div>
                        <div class="skills-list">${skillsHtml}</div>
                    </div>
                ` : ''}
                
                ${data.idiomas ? `
                    <div class="section">
                        <div class="section-title">Idiomas</div>
                        <div class="summary">${escapeHtml(data.idiomas)}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Template: Criativo
function generateCriativoTemplate(data) {
    const initials = getInitials(data.nome);
    const skills = data.habilidades ? data.habilidades.split(',').map(s => s.trim()).filter(s => s) : [];

    let experienciasHtml = '';
    data.experiencias.forEach(exp => {
        experienciasHtml += `
            <div class="exp-item">
                <div class="exp-title">${escapeHtml(exp.cargo)}</div>
                <div class="exp-meta">${escapeHtml(exp.empresa)}</div>
                <div class="exp-date">${escapeHtml(exp.inicio)} - ${escapeHtml(exp.fim)}</div>
                <div class="exp-desc">${escapeHtml(exp.descricao)}</div>
            </div>
        `;
    });

    let formacoesHtml = '';
    data.formacoes.forEach(edu => {
        formacoesHtml += `
            <div class="edu-item">
                <div class="edu-title">${escapeHtml(edu.curso)}</div>
                <div class="edu-meta">${escapeHtml(edu.instituicao)}</div>
                <div class="edu-date">${escapeHtml(edu.inicio)} - ${escapeHtml(edu.fim)}</div>
            </div>
        `;
    });

    let skillsHtml = skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');

    return `
        <div class="resume-template resume-criativo" id="resumeContent">
            <div class="accent-bar"></div>
            <div class="content">
                <div class="header">
                    ${userPhotoData
            ? `<div class="avatar avatar-photo"><img src="${userPhotoData}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"></div>`
            : `<div class="avatar">${initials}</div>`
        }
                    <div class="header-info">
                        <h1>${escapeHtml(data.nome)}</h1>
                        <h2>${escapeHtml(data.cargo)}</h2>
                    </div>
                </div>
                
                <div class="contact-row">
                    ${data.telefone ? `<span class="contact-item">📱 ${escapeHtml(data.telefone)}</span>` : ''}
                    ${data.email ? `<span class="contact-item">✉️ ${escapeHtml(data.email)}</span>` : ''}
                    ${data.cidade ? `<span class="contact-item">📍 ${escapeHtml(data.cidade)}${data.estado ? ', ' + escapeHtml(data.estado) : ''}</span>` : ''}
                    ${data.linkedin ? `<span class="contact-item">💼 ${escapeHtml(data.linkedin)}</span>` : ''}
                </div>
                
                ${data.resumo ? `
                    <div class="section">
                        <div class="section-title">Sobre Mim</div>
                        <div class="summary">${escapeHtml(data.resumo)}</div>
                    </div>
                ` : ''}
                
                ${data.experiencias.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Experiência</div>
                        ${experienciasHtml}
                    </div>
                ` : ''}
                
                ${data.formacoes.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Formação</div>
                        ${formacoesHtml}
                    </div>
                ` : ''}
                
                ${skills.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Habilidades</div>
                        <div class="skills-grid">${skillsHtml}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Download PDF - Fixed version with robust library checking
async function downloadPDF() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('hidden');

    try {
        // Check if libraries are loaded first
        if (typeof html2canvas === 'undefined') {
            throw new Error('Biblioteca html2canvas não carregada. Por favor, abra o site usando um servidor local (http://) ao invés de file://. Ou verifique sua conexão com a internet.');
        }

        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error('Biblioteca jsPDF não carregada. Por favor, abra o site usando um servidor local (http://) ao invés de file://. Ou verifique sua conexão com a internet.');
        }

        const element = document.getElementById('resumeContent');
        if (!element) {
            loadingOverlay.classList.add('hidden');
            toast('Gere o currículo primeiro!', 'error');
            return;
        }

        // Clone element for better rendering
        const clone = element.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = element.offsetWidth + 'px';
        document.body.appendChild(clone);

        // Wait a bit for images to load
        await new Promise(resolve => setTimeout(resolve, 200));

        // Use html2canvas with better options
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            imageTimeout: 15000
        });

        // Remove clone
        document.body.removeChild(clone);

        const imgData = canvas.toDataURL('image/png', 1.0);

        const { jsPDF } = window.jspdf;

        // A4 dimensions in mm
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate dimensions preserving aspect ratio
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Scale to fit page width with some margin
        const margin = 10; // 10mm margin
        const availableWidth = pdfWidth - (margin * 2);
        const availableHeight = pdfHeight - (margin * 2);

        const scaleX = availableWidth / (imgWidth / 2); // Divide by scale factor
        const scaleY = availableHeight / (imgHeight / 2);
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

        const finalWidth = (imgWidth / 2) * scale;
        const finalHeight = (imgHeight / 2) * scale;

        const imgX = (pdfWidth - finalWidth) / 2;
        const imgY = margin;

        pdf.addImage(imgData, 'PNG', imgX, imgY, finalWidth, finalHeight, undefined, 'FAST');

        // Generate filename with proper sanitization
        const safeName = (resumeData.nome || 'meu_curriculo')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '') // Remove leading/trailing underscores
            .toLowerCase() || 'meu_curriculo';

        const fileName = `curriculo_${safeName}.pdf`;

        // Use jsPDF's built-in save method
        pdf.save(fileName);

        toast('✅ PDF baixado com sucesso! Verifique sua pasta de Downloads.', 'success');
        triggerConfetti();
    } catch (error) {
        console.error('Error generating PDF:', error);

        // Provide more helpful error messages
        let errorMsg = error.message;
        if (error.message.includes('html2canvas') || error.message.includes('jsPDF')) {
            errorMsg = '⚠️ ' + error.message;
        } else if (window.location.protocol === 'file:') {
            errorMsg = '⚠️ Para gerar PDFs, acesse o site via servidor local (http://localhost:...) ao invés de abrir diretamente o arquivo.';
        }

        toast(errorMsg, 'error');
    } finally {
        loadingOverlay.classList.add('hidden');
    }
}

// Utilities
function getInitials(name) {
    if (!name) return '?';
    const parts = name.split(' ').filter(p => p);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function toast(message, type = 'success') {
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.className = `toast ${type} show`;

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(e => console.log('SW:', e));
}

/* ================================================
   PREMIUM ANIMATIONS
   ================================================ */

// Particles Animation
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            hue: Math.random() * 60 + 220 // Purple-blue range
        };
    }

    function initParticlesArray() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < Math.min(particleCount, 50); i++) {
            particles.push(createParticle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticlesArray();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticlesArray();
    });
}

// Counter Animation
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target) || 0;
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);

        element.textContent = current.toLocaleString('pt-BR');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => observer.observe(card));

    // Observe template cards
    document.querySelectorAll('.template-card').forEach(card => observer.observe(card));

    // Observe section titles
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Confetti Celebration
function triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#ef4444'];
    const shapes = ['square', 'circle'];

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 2;

        confetti.style.cssText = `
            left: ${left}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: ${shape === 'circle' ? '50%' : '2px'};
            animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
        `;

        container.appendChild(confetti);
    }

    // Remove container after animation
    setTimeout(() => {
        container.remove();
    }, 4000);
}

/* ================================================
   NEW FEATURES - Color Picker, Dark Mode, FAQ, etc.
   ================================================ */

// Color Picker
function initColorPicker() {
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
            updatePreviewLive();
        });
    });
}

// Dark Mode
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;

    // Check saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            this.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            this.textContent = '☀️';
        }
    });
}

// FAQ Accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked if wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Phone Mask
function initPhoneMask() {
    const phoneInput = document.getElementById('telefone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 0) {
            value = '(' + value;
        }
        if (value.length > 3) {
            value = value.slice(0, 3) + ') ' + value.slice(3);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + '-' + value.slice(10);
        }

        e.target.value = value;
    });
}

// Field Validation
function initFieldValidation() {
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');

    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            const group = this.closest('.form-group');
            group.classList.remove('error', 'success');

            if (this.value.trim() === '') return;

            if (isValidEmail(this.value)) {
                group.classList.add('success');
            } else {
                group.classList.add('error');
            }
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('blur', function () {
            const group = this.closest('.form-group');
            group.classList.remove('error', 'success');

            if (this.value.trim() === '') return;

            const phoneDigits = this.value.replace(/\D/g, '');
            if (phoneDigits.length >= 10 && phoneDigits.length <= 11) {
                group.classList.add('success');
            } else {
                group.classList.add('error');
            }
        });
    }
}

// Clear All Data
function clearAllData() {
    if (!confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
        return;
    }

    // Clear all inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea').forEach(input => {
        input.value = '';
    });

    // Clear photo
    userPhotoData = null;
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoPlaceholder = document.querySelector('.photo-placeholder');
    const removePhotoBtn = document.getElementById('removePhoto');
    const photoPreview = document.getElementById('photoPreview');

    if (photoPreviewImg) {
        photoPreviewImg.src = '';
        photoPreviewImg.style.display = 'none';
    }
    if (photoPlaceholder) photoPlaceholder.style.display = 'flex';
    if (removePhotoBtn) removePhotoBtn.style.display = 'none';
    if (photoPreview) photoPreview.classList.remove('has-photo');

    // Remove extra experience/education items
    document.querySelectorAll('.experience-item:not(:first-child)').forEach(el => el.remove());
    document.querySelectorAll('.education-item:not(:first-child)').forEach(el => el.remove());
    experienceCount = 1;
    educationCount = 1;

    // Clear localStorage
    localStorage.removeItem('curriculo_data');

    // Reset preview
    const preview = document.getElementById('resumePreview');
    if (preview) {
        preview.innerHTML = `
            <div class="preview-placeholder">
                <span>👆</span>
                <p>Preencha os dados ao lado para ver a pré-visualização do seu currículo</p>
            </div>
        `;
    }
    document.getElementById('btnDownload').disabled = true;

    // Go back to step 1
    currentStep = 1;
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    document.querySelectorAll('.progress-step').forEach(s => {
        s.classList.remove('active', 'completed');
    });
    document.querySelector('.progress-step[data-step="1"]').classList.add('active');

    toast('Todos os dados foram apagados!', 'success');
}

// Template: Minimalista
function generateMinimalistaTemplate(data) {
    const skills = data.habilidades ? data.habilidades.split(',').map(s => s.trim()).filter(s => s) : [];

    let experienciasHtml = '';
    data.experiencias.forEach(exp => {
        experienciasHtml += `
            <div class="exp-item">
                <div class="exp-title">${escapeHtml(exp.cargo)}</div>
                <div class="exp-meta">${escapeHtml(exp.empresa)} | ${escapeHtml(exp.inicio)} - ${escapeHtml(exp.fim)}</div>
                <div class="exp-desc">${escapeHtml(exp.descricao)}</div>
            </div>
        `;
    });

    let formacoesHtml = '';
    data.formacoes.forEach(edu => {
        formacoesHtml += `
            <div class="edu-item">
                <div class="edu-title">${escapeHtml(edu.curso)}</div>
                <div class="edu-meta">${escapeHtml(edu.instituicao)} | ${escapeHtml(edu.inicio)} - ${escapeHtml(edu.fim)}</div>
            </div>
        `;
    });

    let skillsHtml = skills.map(s => `<span class="skill-item">${escapeHtml(s)}</span>`).join('');

    return `
        <div class="resume-template resume-minimalista" id="resumeContent">
            <div class="header">
                <div class="header-name">${escapeHtml(data.nome)}</div>
                <div class="header-title">${escapeHtml(data.cargo)}</div>
                <div class="contact-row">
                    ${data.telefone ? `<span>📱 ${escapeHtml(data.telefone)}</span>` : ''}
                    ${data.email ? `<span>✉️ ${escapeHtml(data.email)}</span>` : ''}
                    ${data.cidade ? `<span>📍 ${escapeHtml(data.cidade)}${data.estado ? ', ' + escapeHtml(data.estado) : ''}</span>` : ''}
                </div>
            </div>
            
            ${data.resumo ? `
                <div class="section">
                    <div class="section-title">Sobre</div>
                    <div class="summary">${escapeHtml(data.resumo)}</div>
                </div>
            ` : ''}
            
            ${data.experiencias.length > 0 ? `
                <div class="section">
                    <div class="section-title">Experiência</div>
                    ${experienciasHtml}
                </div>
            ` : ''}
            
            ${data.formacoes.length > 0 ? `
                <div class="section">
                    <div class="section-title">Formação</div>
                    ${formacoesHtml}
                </div>
            ` : ''}
            
            ${skills.length > 0 ? `
                <div class="section">
                    <div class="section-title">Habilidades</div>
                    <div class="skills-list">${skillsHtml}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Template: Executivo
function generateExecutivoTemplate(data) {
    const initials = getInitials(data.nome);
    const skills = data.habilidades ? data.habilidades.split(',').map(s => s.trim()).filter(s => s) : [];

    let experienciasHtml = '';
    data.experiencias.forEach(exp => {
        experienciasHtml += `
            <div class="exp-item">
                <div class="exp-title">${escapeHtml(exp.cargo)}</div>
                <div class="exp-meta">${escapeHtml(exp.empresa)} | ${escapeHtml(exp.inicio)} - ${escapeHtml(exp.fim)}</div>
                <div class="exp-desc">${escapeHtml(exp.descricao)}</div>
            </div>
        `;
    });

    let formacoesHtml = '';
    data.formacoes.forEach(edu => {
        formacoesHtml += `
            <div class="edu-item">
                <div class="edu-title">${escapeHtml(edu.curso)}</div>
                <div class="edu-meta">${escapeHtml(edu.instituicao)} | ${escapeHtml(edu.inicio)} - ${escapeHtml(edu.fim)}</div>
            </div>
        `;
    });

    let skillsHtml = skills.map(s => `<span class="skill-item">${escapeHtml(s)}</span>`).join('');

    return `
        <div class="resume-template resume-executivo" id="resumeContent">
            <div class="header-section">
                ${userPhotoData
            ? `<img src="${userPhotoData}" alt="Foto" class="header-photo">`
            : `<div class="header-initials">${initials}</div>`
        }
                <div class="header-info">
                    <h1>${escapeHtml(data.nome)}</h1>
                    <h2>${escapeHtml(data.cargo)}</h2>
                </div>
            </div>
            <div class="gold-bar"></div>
            
            <div class="contact-bar">
                ${data.telefone ? `<span>📱 ${escapeHtml(data.telefone)}</span>` : ''}
                ${data.email ? `<span>✉️ ${escapeHtml(data.email)}</span>` : ''}
                ${data.cidade ? `<span>📍 ${escapeHtml(data.cidade)}${data.estado ? ', ' + escapeHtml(data.estado) : ''}</span>` : ''}
                ${data.linkedin ? `<span>💼 ${escapeHtml(data.linkedin)}</span>` : ''}
            </div>
            
            <div class="content">
                ${data.resumo ? `
                    <div class="section">
                        <div class="section-title">Perfil Executivo</div>
                        <div class="summary">${escapeHtml(data.resumo)}</div>
                    </div>
                ` : ''}
                
                ${data.experiencias.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Trajetória Profissional</div>
                        ${experienciasHtml}
                    </div>
                ` : ''}
                
                ${data.formacoes.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Formação Acadêmica</div>
                        ${formacoesHtml}
                    </div>
                ` : ''}
                
                ${skills.length > 0 ? `
                    <div class="section">
                        <div class="section-title">Competências</div>
                        <div class="skills-list">${skillsHtml}</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

