/* ==========================================================================
   GramSathi AI - Application Script
   Interactive Features & Dashboard Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initLanguageSelector();
    initScrollAnimations();
    initMobileMenu();
    initHeaderScroll();
    initGapCounters();
    initRadarChart();
    initIncomeSimulator();
    initSchemeShield();
    initAIAssistant();
    initVillageDashboard();
    initInteractiveMap();
    initModalEvents();
    initTestimonialCarousel();
});

/* ==========================================================================
   Theme Toggle System
   ========================================================================== */

function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (toggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            toggle.querySelector('i').className = 'fa-solid fa-sun';
        }
        
        toggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            toggle.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
}

/* ==========================================================================
   Scroll-Linked & Global Animations
   ========================================================================== */

function initScrollAnimations() {
    const animElements = document.querySelectorAll('.scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's the gap section, trigger counters
                if (entry.target.id === 'gap' || entry.target.querySelector('.gap-number')) {
                    triggerCountersInContainer(entry.target);
                }
            }
        });
    }, {
        threshold: 0.15
    });

    animElements.forEach(el => observer.observe(el));
}

function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const links = document.getElementById('nav-links');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
            if (links.style.display === 'flex') {
                links.style.position = 'absolute';
                links.style.top = '70px';
                links.style.left = '0';
                links.style.width = '100%';
                links.style.flexDirection = 'column';
                links.style.background = 'rgba(255, 255, 255, 0.98)';
                links.style.padding = '2rem';
                links.style.borderBottom = '1px solid var(--border-light)';
                links.style.gap = '1.5rem';
            }
        });
    }
}

function initGapCounters() {
    // Handled inside observer trigger to run on scroll
}

function triggerCountersInContainer(container) {
    const counters = container.querySelectorAll('.gap-number');
    counters.forEach(counter => {
        if (counter.classList.contains('counted')) return;
        counter.classList.add('counted');
        
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // ms
        const startTime = performance.now();
        const prefix = counter.textContent.includes('₹') ? '₹' : '';
        const suffix = counter.textContent.includes('%') ? '%' : counter.textContent.includes('+') ? '+' : '';

        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                if (suffix === '+') {
                    counter.textContent = prefix + target + suffix;
                } else if (prefix === '₹') {
                    counter.textContent = prefix + (target / 10) + 'B';
                } else {
                    counter.textContent = target + suffix;
                }
                return;
            }
            
            const progress = elapsedTime / duration;
            const currentVal = Math.floor(progress * target);
            if (prefix === '₹') {
                counter.textContent = prefix + (currentVal / 10).toFixed(1) + 'B';
            } else {
                counter.textContent = currentVal + suffix;
            }
            requestAnimationFrame(updateCounter);
        }
        requestAnimationFrame(updateCounter);
    });
}

/* ==========================================================================
   Opportunity Radar & Profile Engine
   ========================================================================== */

// Available schemes database
const SCHEMES_DATABASE = {
    Farmer: [
        { name: "PM Kisan Samman Nidhi", cat: "Agriculture", val: "₹6,000/yr", desc: "Direct income support of ₹6,000 per year in three equal installments to small and marginal farmer families.", link: "https://pmkisan.gov.in/" },
        { name: "Pradhan Mantri Fasal Bima Yojana", cat: "Agriculture", val: "Premium Subsidy", desc: "Crop insurance scheme offering comprehensive risk cover against crop failure due to natural calamities.", link: "https://pmfby.gov.in/" },
        { name: "PM Surya Ghar (Solar Agriculture Pump)", cat: "Agriculture", val: "90% Subsidy", desc: "Subsidies for solar-powered water pumps, eliminating electricity and diesel overheads.", link: "https://pmsuryaghar.gov.in/" },
        { name: "Ayushman Bharat Jan Arogya Yojana", cat: "Healthcare", val: "₹5 Lakhs/yr", desc: "Provides free health insurance cover up to ₹5,00,000 per family per year for secondary/tertiary hospitalisation.", link: "https://dashboard.pmjay.gov.in/" },
        { name: "Kisan Credit Card (KCC) Low Interest Loan", cat: "Finance", val: "4% Interest rate", desc: "Access to institutional credit at highly subsidized interest rates for crop cultivation and farm upkeep.", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ],
    Student: [
        { name: "Post-Matric Scholarship Scheme", cat: "Education", val: "Full Fee Waiver", desc: "Financial support for students belonging to low income groups for post-matriculation or post-secondary courses.", link: "https://scholarships.gov.in/" },
        { name: "PM Skill Development (PMKVY) Training", cat: "Employment", val: "Free Placement", desc: "Skill certification scheme enabling youth to take up industry-relevant skill training with job placement support.", link: "https://www.pmkvyofficial.org/" },
        { name: "Pradhan Mantri Vidya Lakshmi Program", cat: "Education", val: "Easy Education Loans", desc: "Portal for education loan applications with low interest rates and flexible moratorium periods.", link: "https://www.vidyalakshmi.co.in/" },
        { name: "Free Student Digital Device Program", cat: "Education", val: "Free Tablet/Laptop", desc: "State-sponsored initiative providing free tablets or laptops to merit students from rural schools.", link: "https://upcmo.up.nic.in/" }
    ],
    JobSeeker: [
        { name: "PM Skill Development (PMKVY) Training", cat: "Employment", val: "Free Course & Placement", desc: "Skill certification scheme enabling youth to take up industry-relevant skill training.", link: "https://www.pmkvyofficial.org/" },
        { name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana", cat: "Employment", val: "Residential Course", desc: "Placement-linked skill training program exclusively targeting rural poor youth.", link: "http://ddugky.gov.in/" },
        { name: "Mudra Loan Scheme (Shishu Category)", cat: "Finance", val: "Up to ₹50,000 Loan", desc: "Collateral-free business setup loans for starting small service or manufacturing units.", link: "https://www.mudra.org.in/" },
        { name: "Ayushman Bharat Health Card", cat: "Healthcare", val: "₹5 Lakhs Cover", desc: "Cashless secondary and tertiary healthcare coverage.", link: "https://dashboard.pmjay.gov.in/" }
    ],
    Entrepreneur: [
        { name: "Stand-Up India Scheme", cat: "Entrepreneurship", val: "₹10L - ₹1Cr Loan", desc: "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch.", link: "https://www.standupmitra.in/" },
        { name: "Prime Minister's Employment Generation Program (PMEGP)", cat: "Entrepreneurship", val: "35% Subsidy", desc: "Credit-linked subsidy program for setting up new micro-enterprises in rural areas.", link: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp" },
        { name: "Mudra Loan Scheme (Kishore & Tarun)", cat: "Finance", val: "₹50k - ₹10 Lakhs", desc: "Collateral-free loans for micro and small business expansion.", link: "https://www.mudra.org.in/" },
        { name: "Udyam Assist Registration Portal", cat: "Entrepreneurship", val: "MSME Benefits", desc: "Instant certification enabling small businesses to access formal banking credit and subsidy schemes.", link: "https://udyamassist.gov.in/" }
    ],
    Artisan: [
        { name: "PM Vishwakarma Scheme", cat: "Entrepreneurship", val: "Toolkits + Loan", desc: "End-to-end support for traditional artisans including toolkit incentive of ₹15,000, training, and collateral-free credit.", link: "https://pmvishwakarma.gov.in/" },
        { name: "Mudra Loan Scheme (Shishu)", cat: "Finance", val: "Up to ₹50,000", desc: "Collateral-free credit to scale small micro-units.", link: "https://www.mudra.org.in/" },
        { name: "PM Garib Kalyan Anna Yojana", cat: "Healthcare", val: "Free Foodgrains", desc: "Welfare scheme providing 5 kg of free foodgrains per month to eligible families.", link: "https://www.myscheme.gov.in/schemes/pmgkay" }
    ],
    Retired: [
        { name: "Atal Pension Yojana", cat: "Finance", val: "₹1,000-₹5,000/mo", desc: "Guaranteed minimum monthly pension for citizens in the unorganized sector starting from age 60.", link: "https://www.npscra.nsdl.co.in/" },
        { name: "Indira Gandhi National Old Age Pension Scheme", cat: "Finance", val: "Pension Subvention", desc: "Monthly financial pension assistance for senior citizens belonging to below-poverty-line families.", link: "https://nsap.nic.in/" },
        { name: "Ayushman Bharat Senior Citizen Care", cat: "Healthcare", val: "₹5 Lakhs Cover", desc: "Special health cards ensuring cashless medical treatment at empanelled private/public hospitals.", link: "https://dashboard.pmjay.gov.in/" }
    ]
};

// Initial default radar values
let currentRadarValues = {
    Agriculture: 50,
    Education: 50,
    Healthcare: 50,
    Employment: 50,
    Entrepreneurship: 50,
    Finance: 50
};

const radarAngles = {
    Agriculture: 0,
    Education: 60,
    Healthcare: 120,
    Employment: 180,
    Entrepreneurship: 240,
    Finance: 300
};

const categoryColors = {
    Agriculture: "#22C55E",
    Education: "#3B82F6",
    Healthcare: "#EF4444",
    Employment: "#F59E0B",
    Entrepreneurship: "#EC4899",
    Finance: "#8B5CF6"
};

function initRadarChart() {
    renderRadar(currentRadarValues);
    
    // Add radar category selection trigger
    const catItems = document.querySelectorAll('.radar-category-item');
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            catItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const category = item.getAttribute('data-category');
            renderCategorySchemes(category);
        });
    });

    // Profile Form calculations
    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateProfileOpportunity();
        });
    }
}

function renderRadar(values) {
    const svg = document.getElementById('radar-svg');
    if (!svg) return;
    svg.innerHTML = ''; // Clear SVG

    const cx = 100;
    const cy = 100;
    const maxRadius = 70;

    // Draw concentric background hexagons (25%, 50%, 75%, 100%)
    const ringLevels = [0.25, 0.5, 0.75, 1];
    ringLevels.forEach(level => {
        const points = [];
        Object.keys(radarAngles).forEach(cat => {
            const angle = radarAngles[cat];
            const r = maxRadius * level;
            const x = cx + r * Math.cos((angle - 90) * Math.PI / 180);
            const y = cy + r * Math.sin((angle - 90) * Math.PI / 180);
            points.push(`${x},${y}`);
        });
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", points.join(" "));
        polygon.setAttribute("fill", "none");
        polygon.setAttribute("stroke", "rgba(22, 163, 74, 0.08)");
        polygon.setAttribute("stroke-width", "1");
        svg.appendChild(polygon);
    });

    // Draw Axis lines and category text labels
    Object.keys(radarAngles).forEach(cat => {
        const angle = radarAngles[cat];
        const rad = (angle - 90) * Math.PI / 180;
        const outerX = cx + maxRadius * Math.cos(rad);
        const outerY = cy + maxRadius * Math.sin(rad);

        // Draw axis line
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", cx.toString());
        line.setAttribute("y1", cy.toString());
        line.setAttribute("x2", outerX.toString());
        line.setAttribute("y2", outerY.toString());
        line.setAttribute("stroke", "rgba(22, 163, 74, 0.12)");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);

        // Draw labels
        const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        const labelRadius = maxRadius + 15;
        const labelX = cx + labelRadius * Math.cos(rad);
        const labelY = cy + labelRadius * Math.sin(rad);
        
        labelText.textContent = cat.substring(0, 4) + '..'; // Truncate slightly
        labelText.setAttribute("x", labelX.toString());
        labelText.setAttribute("y", (labelY + 3).toString());
        labelText.setAttribute("text-anchor", "middle");
        labelText.setAttribute("fill", "var(--text-muted)");
        labelText.setAttribute("font-size", "8px");
        labelText.setAttribute("font-weight", "600");
        svg.appendChild(labelText);
    });

    // Draw values filled polygon
    const valPoints = [];
    Object.keys(radarAngles).forEach(cat => {
        const angle = radarAngles[cat];
        const valPct = (values[cat] || 0) / 100;
        const r = maxRadius * valPct;
        const x = cx + r * Math.cos((angle - 90) * Math.PI / 180);
        const y = cy + r * Math.sin((angle - 90) * Math.PI / 180);
        valPoints.push(`${x},${y}`);
    });

    const valPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    valPolygon.setAttribute("points", valPoints.join(" "));
    valPolygon.setAttribute("fill", "rgba(22, 163, 74, 0.25)");
    valPolygon.setAttribute("stroke", "var(--primary)");
    valPolygon.setAttribute("stroke-width", "2");
    svg.appendChild(valPolygon);

    // Draw markers on value vertexes
    Object.keys(radarAngles).forEach(cat => {
        const angle = radarAngles[cat];
        const valPct = (values[cat] || 0) / 100;
        const r = maxRadius * valPct;
        const x = cx + r * Math.cos((angle - 90) * Math.PI / 180);
        const y = cy + r * Math.sin((angle - 90) * Math.PI / 180);

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", "3.5");
        circle.setAttribute("fill", categoryColors[cat]);
        circle.setAttribute("stroke", "#FFFFFF");
        circle.setAttribute("stroke-width", "1");
        svg.appendChild(circle);
    });
}

let activeMatchedSchemes = [];

function calculateProfileOpportunity() {
    const name = document.getElementById('profile-name').value;
    const occupation = document.getElementById('profile-occupation').value;
    const income = parseInt(document.getElementById('profile-income').value) || 0;
    const land = document.getElementById('profile-land').value;

    if (!occupation) return;

    // Reset radar values
    currentRadarValues = {
        Agriculture: 10,
        Education: 10,
        Healthcare: 10,
        Employment: 10,
        Entrepreneurship: 10,
        Finance: 10
    };

    // Pull from database based on occupation
    activeMatchedSchemes = [...(SCHEMES_DATABASE[occupation] || [])];

    // Add extra BPL schemes if income is low
    if (income < 10000) {
        activeMatchedSchemes.push({
            name: "PM Garib Kalyan Anna Yojana",
            cat: "Healthcare",
            val: "Free Foodgrains",
            desc: "Free 5 kg foodgrains per person monthly for lower income households.",
            link: "#"
        });
    }

    // Distribute radar weights based on schemes matched
    activeMatchedSchemes.forEach(scheme => {
        if (currentRadarValues[scheme.cat] !== undefined) {
            currentRadarValues[scheme.cat] = Math.min(100, currentRadarValues[scheme.cat] + 35);
        }
    });

    // Make active weights nice and varied
    Object.keys(currentRadarValues).forEach(cat => {
        if (currentRadarValues[cat] === 10) {
            currentRadarValues[cat] = Math.floor(Math.random() * 20) + 15; // Random ambient level
        }
    });

    // Re-render Radar Chart
    renderRadar(currentRadarValues);

    // Update Counts in UI Sidebar
    const counts = { Agriculture: 0, Education: 0, Healthcare: 0, Employment: 0, Entrepreneurship: 0, Finance: 0 };
    activeMatchedSchemes.forEach(s => counts[s.cat]++);
    
    document.getElementById('count-agri').textContent = counts.Agriculture;
    document.getElementById('count-edu').textContent = counts.Education;
    document.getElementById('count-health').textContent = counts.Healthcare;
    document.getElementById('count-emp').textContent = counts.Employment;
    document.getElementById('count-ent').textContent = counts.Entrepreneurship;
    document.getElementById('count-fin').textContent = counts.Finance;

    // Calculate score
    const totalMatchCount = activeMatchedSchemes.length;
    const opportunityScore = Math.min(100, 40 + (totalMatchCount * 12));

    // Update radial progress
    const fillCircle = document.getElementById('radial-score-circle');
    const textVal = document.getElementById('radial-score-val');
    
    // dashoffset mapping (r=40 -> 2*pi*r = 251.2)
    const offset = 251.2 - (251.2 * opportunityScore) / 100;
    fillCircle.style.strokeDashoffset = offset.toString();
    textVal.textContent = opportunityScore + '%';

    // Update Hero score cards if present
    const heroScore = document.getElementById('hero-score-val');
    if (heroScore) heroScore.textContent = opportunityScore + '%';
    const heroCount = document.getElementById('hero-matches-count');
    if (heroCount) heroCount.textContent = totalMatchCount;
    const heroBenefits = document.getElementById('hero-benefits-val');
    if (heroBenefits) {
        const estValue = totalMatchCount * 12000;
        heroBenefits.textContent = '₹' + estValue.toLocaleString('en-IN');
    }

    // Update Results headlines
    document.getElementById('results-headline').textContent = `Congratulations, ${name.split(' ')[0]}!`;
    document.getElementById('results-subheading').textContent = `We discovered ${totalMatchCount} matching schemes for you. Select a category below.`;

    // Render active category schemes
    // Select the category of first matched scheme, or default to first tab
    const activeCat = activeMatchedSchemes.length > 0 ? activeMatchedSchemes[0].cat : "Agriculture";
    
    // Set active class on sidebar items
    const catItems = document.querySelectorAll('.radar-category-item');
    catItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-category') === activeCat) {
            item.classList.add('active');
        }
    });

    renderCategorySchemes(activeCat);
}

function renderCategorySchemes(category) {
    const container = document.getElementById('schemes-list');
    if (!container) return;

    const filtered = activeMatchedSchemes.filter(s => s.cat === category);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="scheme-result-card" style="justify-content: center; border-style: dashed; padding: 2rem;">
                <p style="color: var(--text-muted); font-size: 0.95rem;">
                    <i class="fa-solid fa-circle-info"></i> No matching schemes found in ${category}. Try updating your profile parameters.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    filtered.forEach(scheme => {
        const card = document.createElement('div');
        card.className = 'scheme-result-card';
        card.innerHTML = `
            <div class="scheme-result-info">
                <h5>${scheme.name}</h5>
                <p>${scheme.desc}</p>
                <span class="scheme-tag">${scheme.val}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem; flex-shrink: 0;">
                <button class="scheme-action-btn" onclick="simulateApplyScheme('${scheme.name}')">
                    Apply <i class="fa-solid fa-arrow-right"></i>
                </button>
                <button class="scheme-action-btn" style="background-color: var(--primary-glow); border-color: rgba(22, 163, 74, 0.2);" onclick="openApplicationModal('${scheme.name}')">
                    Form Summary <i class="fa-solid fa-file-invoice"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Global scope helper for applying
window.simulateApplyScheme = function(schemeName) {
    let matchedScheme = null;
    Object.keys(SCHEMES_DATABASE).forEach(key => {
        const found = SCHEMES_DATABASE[key].find(s => s.name === schemeName);
        if (found) matchedScheme = found;
    });
    
    if (matchedScheme && matchedScheme.link && matchedScheme.link !== '#') {
        alert(`Success! Redirecting you to the official government portal for "${schemeName}": ${matchedScheme.link}. Please ensure you only input data on verified domains.`);
        window.open(matchedScheme.link, '_blank');
    } else {
        alert(`Opening official National Single Window Portal (myScheme.gov.in) for "${schemeName}".`);
        window.open('https://www.myscheme.gov.in/', '_blank');
    }
};

// Application modal logic
window.openApplicationModal = function(schemeName) {
    const modal = document.getElementById('application-modal');
    if (!modal) return;

    // Retrieve form parameters, fallback to placeholder if empty
    const nameVal = document.getElementById('profile-name').value || "Guest Citizen";
    const ageVal = document.getElementById('profile-age').value || "42";
    const occVal = document.getElementById('profile-occupation').value || "Farmer / Agriculture";
    const stateVal = document.getElementById('profile-state').value || "Maharashtra";
    const scoreVal = document.getElementById('radial-score-val').textContent || "84%";
    const incomeVal = document.getElementById('profile-income').value || "8000";

    // Update modal text fields
    document.getElementById('cert-name').textContent = nameVal;
    document.getElementById('cert-age').textContent = ageVal + " Years";
    document.getElementById('cert-occupation').textContent = occVal;
    document.getElementById('cert-region').textContent = `${stateVal} / Pune`;
    document.getElementById('cert-score').textContent = `${scoreVal}`;
    document.getElementById('cert-income').textContent = "₹" + parseInt(incomeVal).toLocaleString('en-IN');

    // Find scheme details in database
    let matchedScheme = null;
    Object.keys(SCHEMES_DATABASE).forEach(key => {
        const found = SCHEMES_DATABASE[key].find(s => s.name === schemeName);
        if (found) matchedScheme = found;
    });

    const detailsContainer = document.getElementById('cert-scheme-details');
    if (detailsContainer && matchedScheme) {
        detailsContainer.innerHTML = `
            <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.35rem; color: var(--primary-dark);">${matchedScheme.name}</div>
            <p style="margin: 0; font-size: 0.85rem; line-height: 1.4; color: var(--text-main);">${matchedScheme.desc}</p>
            <div style="margin-top: 0.5rem; font-weight: 700; font-size: 0.85rem; color: var(--primary-dark);">Value/Coverage: ${matchedScheme.val}</div>
        `;
    }

    modal.classList.add('active');
};

function initModalEvents() {
    const modal = document.getElementById('application-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const closeBottomBtn = document.getElementById('close-modal-bottom-btn');

    if (!modal) return;
    const closeModal = () => modal.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBottomBtn) closeBottomBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}


/* ==========================================================================
   Future Income Simulator
   ========================================================================== */

let baseIncome = 8000;
let selectedSimulatorSchemes = {
    "pm-kisan": 500, // active by default
    "scholarship": 0,
    "skill-dev": 0,
    "solar-subsidy": 0
};

function initIncomeSimulator() {
    const slider = document.getElementById('base-income-slider');
    const sliderVal = document.getElementById('base-income-val');
    
    if (slider) {
        slider.addEventListener('input', (e) => {
            baseIncome = parseInt(e.target.value);
            sliderVal.textContent = '₹' + baseIncome.toLocaleString('en-IN');
            updateSimulationChart();
        });
    }

    // Toggle items click handler
    const pmKisanChk = document.getElementById('toggle-pmkisan');
    const scholarshipChk = document.getElementById('toggle-scholarship');
    const skillDevChk = document.getElementById('toggle-skill-dev');
    const solarChk = document.getElementById('toggle-solar');

    const updateCheckboxes = () => {
        selectedSimulatorSchemes["pm-kisan"] = pmKisanChk.checked ? 500 : 0;
        selectedSimulatorSchemes["scholarship"] = scholarshipChk.checked ? 1500 : 0;
        selectedSimulatorSchemes["skill-dev"] = skillDevChk.checked ? 3500 : 0;
        selectedSimulatorSchemes["solar-subsidy"] = solarChk.checked ? 2500 : 0;

        // Toggle card visual style
        document.querySelectorAll('.toggle-item').forEach(card => {
            const schemeId = card.getAttribute('data-scheme');
            const chk = card.querySelector('input[type="checkbox"]');
            if (chk.checked) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        updateSimulationChart();
    };

    if (pmKisanChk) pmKisanChk.addEventListener('change', updateCheckboxes);
    if (scholarshipChk) scholarshipChk.addEventListener('change', updateCheckboxes);
    if (skillDevChk) skillDevChk.addEventListener('change', updateCheckboxes);
    if (solarChk) solarChk.addEventListener('change', updateCheckboxes);

    // Initial render
    updateSimulationChart();
}

function updateSimulationChart() {
    const baselineText = document.getElementById('stat-baseline');
    const projectedText = document.getElementById('stat-projected');
    
    if (!baselineText || !projectedText) return;

    // Calculations
    const pmKisanVal = selectedSimulatorSchemes["pm-kisan"];
    const scholarshipVal = selectedSimulatorSchemes["scholarship"];
    const skillDevVal = selectedSimulatorSchemes["skill-dev"];
    const solarVal = selectedSimulatorSchemes["solar-subsidy"];

    const projectedIncome = baseIncome + pmKisanVal + scholarshipVal + skillDevVal + solarVal;

    baselineText.textContent = '₹' + baseIncome.toLocaleString('en-IN');
    projectedText.textContent = '₹' + projectedIncome.toLocaleString('en-IN');

    // Chart scale parameters
    // Y range 170 (value=0) to 20 (value=30000)
    const scaleY = (val) => {
        const heightRange = 150; // 170 - 20
        const ratio = Math.min(1, val / 30000);
        return 170 - (ratio * heightRange);
    };

    // Calculate dynamic points (Cumulative growth)
    const y0 = scaleY(baseIncome);
    const y1 = scaleY(baseIncome + pmKisanVal);
    const y2 = scaleY(baseIncome + pmKisanVal + skillDevVal);
    const y3 = scaleY(projectedIncome);

    const x0 = 50;
    const x1 = 193;
    const x2 = 336;
    const x3 = 480;

    // Update markers
    document.getElementById('mark-0').setAttribute('cx', x0.toString());
    document.getElementById('mark-0').setAttribute('cy', y0.toString());

    document.getElementById('mark-1').setAttribute('cx', x1.toString());
    document.getElementById('mark-1').setAttribute('cy', y1.toString());

    document.getElementById('mark-2').setAttribute('cx', x2.toString());
    document.getElementById('mark-2').setAttribute('cy', y2.toString());

    document.getElementById('mark-3').setAttribute('cx', x3.toString());
    document.getElementById('mark-3').setAttribute('cy', y3.toString());

    // Update lines paths
    const strokeLine = document.querySelector('.chart-line');
    const bgArea = document.querySelector('.chart-line-bg');

    const pathData = `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}`;
    const bgData = `${pathData} L ${x3} 170 L ${x0} 170 Z`;

    strokeLine.setAttribute('d', pathData);
    bgArea.setAttribute('d', bgData);
}

/* ==========================================================================
   SchemeShield AI
   ========================================================================== */

function initSchemeShield() {
    // Shield Tabs
    const tabs = document.querySelectorAll('.shield-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const targetPane = tab.getAttribute('data-tab');
            document.querySelectorAll('.shield-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(`pane-${targetPane}`).classList.add('active');
        });
    });

    // Drag-Drop simulation
    const dropzone = document.getElementById('shield-dropzone');
    const fileInput = document.getElementById('shield-file-input');
    
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--primary-light)';
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.style.borderColor = 'var(--border-light)';
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--border-light)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                dropzone.querySelector('p').textContent = `Selected: ${files[0].name}`;
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                dropzone.querySelector('p').textContent = `Selected: ${fileInput.files[0].name}`;
            }
        });
    }

    // Run Scanner Button
    const runBtn = document.getElementById('run-shield-btn');
    if (runBtn) {
        runBtn.addEventListener('click', () => {
            runShieldScan();
        });
    }
}

function runShieldScan() {
    const idleState = document.getElementById('shield-state-idle');
    const scanningState = document.getElementById('shield-state-scanning');
    const reportState = document.getElementById('shield-state-report');
    const statusText = document.getElementById('scan-step-text');

    if (!idleState || !scanningState || !reportState) return;

    // Get input data
    const urlVal = document.getElementById('shield-url').value;
    const textVal = document.getElementById('shield-text').value;
    const fileUploaded = document.getElementById('shield-file-input').files.length > 0;

    let scanTarget = urlVal || textVal || (fileUploaded ? "Uploaded PDF/Image Document" : "");
    if (!scanTarget) {
        alert("Please enter a URL, upload a screenshot, or paste a WhatsApp SMS prompt first.");
        return;
    }

    // Switch states
    idleState.classList.remove('active');
    reportState.classList.remove('active');
    scanningState.classList.add('active');

    // Simulate scanning phases
    const steps = [
        "Resolving server routing coordinates...",
        "Checking WHOIS domain registration histories...",
        "Running SSL verification benchmarks...",
        "Parsing language for scam indicators...",
        "Synthesizing security trust report..."
    ];

    let currentStepIdx = 0;
    statusText.textContent = steps[currentStepIdx];

    const stepInterval = setInterval(() => {
        currentStepIdx++;
        if (currentStepIdx < steps.length) {
            statusText.textContent = steps[currentStepIdx];
        } else {
            clearInterval(stepInterval);
            finishShieldScan(scanTarget);
        }
    }, 500);
}

function finishShieldScan(target) {
    const scanningState = document.getElementById('shield-state-scanning');
    const reportState = document.getElementById('shield-state-report');
    const reportCard = document.getElementById('shield-report-card');

    scanningState.classList.remove('active');
    reportState.classList.add('active');

    // Apply certificate style classes
    reportCard.className = 'shield-report-card certificate';

    let isSafe = true;
    let score = 100;
    let indicators = [];
    let isURL = false;
    let isGovernmentKeyword = false;
    let hasGovernmentExtension = false;
    let parsedUrl = null;

    const urlMatch = target.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[\w\-]+\.[\w\-]+[^\s]*)/i);
    let scannedText = target.trim();
    let urlString = urlMatch ? urlMatch[0] : "";
    
    if (urlString) {
        isURL = true;
        let cleanUrl = urlString;
        if (!/^https?:\/\//i.test(cleanUrl)) {
            cleanUrl = 'http://' + cleanUrl;
        }
        try {
            parsedUrl = new URL(cleanUrl);
        } catch (e) {
            parsedUrl = null;
        }
    }

    const govKeywords = ["pmkisan", "pm-kisan", "subsidy", "loan", "solar", "scholarship", "yojana", "mudra", "welfare", "government", "suryaghar", "fasalbima", "vishwakarma", "ayushman"];
    const lowercaseTarget = scannedText.toLowerCase();
    
    govKeywords.forEach(kw => {
        if (lowercaseTarget.includes(kw)) {
            isGovernmentKeyword = true;
        }
    });

    if (parsedUrl) {
        const hostname = parsedUrl.hostname.toLowerCase();
        
        if (hostname.endsWith('.gov.in') || hostname.endsWith('.nic.in')) {
            hasGovernmentExtension = true;
        }

        if (parsedUrl.protocol === 'https:') {
            indicators.push({ icon: "fa-circle-check", class: "success", text: "SSL Secure connection (HTTPS active)" });
        } else {
            score -= 15;
            indicators.push({ icon: "fa-triangle-exclamation", class: "warning", text: "Unencrypted protocol (HTTP). Real portals always use HTTPS secure connections" });
        }

        if (isGovernmentKeyword && !hasGovernmentExtension) {
            score -= 75;
            isSafe = false;
            indicators.push({ 
                icon: "fa-triangle-exclamation", 
                class: "danger", 
                text: `Mimicking domain. The domain "${hostname}" contains government keywords but does not end in .gov.in or .nic.in`
            });
        }

        if ((hostname.includes('-free') || hostname.includes('-bonus') || hostname.includes('subsidy')) && !hasGovernmentExtension) {
            score -= 10;
            isSafe = false;
            indicators.push({ icon: "fa-triangle-exclamation", class: "danger", text: "Domain contains bait words like '-free' or '-bonus' to lure victims" });
        }

        const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if (ipPattern.test(hostname)) {
            score -= 30;
            isSafe = false;
            indicators.push({ icon: "fa-triangle-exclamation", class: "danger", text: "Uses raw numerical IP address instead of a registered domain name" });
        }
    } else {
        const urgentKws = ["immediately", "urgent", "last day", "expires today", "within 24 hours"];
        const feeKws = ["processing fee", "registration charge", "security deposit", "send money", "pay rs", "pay rupees", "pay ₹"];
        const lureKws = ["congratulations", "won free", "lucky draw", "gift", "approved without document", "100% free loan", "instant cash"];
        const credentialKws = ["share otp", "verify otp", "provide password", "aadhaar password", "atm pin", "cvv"];

        let foundUrgent = urgentKws.some(kw => lowercaseTarget.includes(kw));
        let foundFee = feeKws.some(kw => lowercaseTarget.includes(kw));
        let foundLure = lureKws.some(kw => lowercaseTarget.includes(kw));
        let foundCredential = credentialKws.some(kw => lowercaseTarget.includes(kw));

        if (foundUrgent) {
            score -= 15;
            isSafe = false;
            indicators.push({ icon: "fa-triangle-exclamation", class: "warning", text: "Urgency tactics: Text presses for immediate action to bypass logical checking" });
        }
        if (foundFee) {
            score -= 25;
            isSafe = false;
            indicators.push({ icon: "fa-triangle-exclamation", class: "danger", text: "Advance Fee Scam: Direct requests for registration/processing fees. Official schemes never charge citizens" });
        }
        if (foundLure) {
            score -= 20;
            isSafe = false;
            indicators.push({ icon: "fa-star", class: "warning", text: "Bait Tactics: Suspicious claims of winnings, lottery, or 100% free payouts" });
        }
        if (foundCredential) {
            score -= 30;
            isSafe = false;
            indicators.push({ icon: "fa-key", class: "danger", text: "Credential Harvesting: Solicits high-security credentials (OTP, ATM Pin, Aadhaar passwords)" });
        }
    }

    if (isURL && hasGovernmentExtension) {
        isSafe = true;
        score = 99;
        indicators.unshift({ icon: "fa-circle-check", class: "success", text: "Official government domain (.gov.in / .nic.in) verified" });
        indicators.push({ icon: "fa-circle-check", class: "success", text: "Domain is registered with the National Informatics Centre (NIC), Government of India" });
    }

    score = Math.max(5, Math.min(score, 99));

    let verdictTitle = "Verified Official Government Portal";
    let alertClass = "safe";
    if (score < 50) {
        verdictTitle = "Potential Cybersecurity Scam Detected";
        alertClass = "scam";
    } else if (score < 80) {
        verdictTitle = "Suspicious Link / Verification Advised";
        alertClass = "warning";
    }

    if (indicators.length === 0) {
        if (score >= 80) {
            indicators.push({ icon: "fa-circle-check", class: "success", text: "No threat indicators detected in text audit" });
            indicators.push({ icon: "fa-circle-check", class: "success", text: "Information seems safe for public consumption" });
        } else {
            indicators.push({ icon: "fa-triangle-exclamation", class: "warning", text: "Unverifiable content. Exercise standard digital caution" });
        }
    }

    reportCard.innerHTML = `
        <div class="report-badge-stamp ${alertClass}"></div>
        <div class="report-header">
            <div class="report-title">
                <h4>${verdictTitle}</h4>
                <span>Target: ${target.substring(0, 32)}${target.length > 32 ? '...' : ''}</span>
            </div>
            <div class="report-score-box">
                <div class="report-score-num ${alertClass}">${score}%</div>
                <div class="report-score-lbl">Trust Score</div>
            </div>
        </div>

        <div class="report-indicator-row ${alertClass}">
            <i class="fa-solid ${score >= 80 ? 'fa-shield-halved' : 'fa-circle-exclamation'}"></i>
            <span>${score >= 80 ? 'Official Government Portal' : score >= 50 ? 'Medium Security Risk' : 'High Cyber Security Risk'}</span>
        </div>

        <div class="report-details-list">
            ${indicators.map(ind => `
                <div class="report-detail-item ${ind.class}">
                    <i class="fa-solid ${ind.icon}"></i>
                    <span>${ind.text}</span>
                </div>
            `).join('')}
        </div>

        <div class="report-actions">
            <button class="report-action-btn primary" onclick="simulateResolveScan('${verdictTitle}')">
                ${score >= 80 ? 'Proceed to Official Portal' : 'Block & Report Scam'}
            </button>
            <button class="report-action-btn secondary" onclick="simulateReportDownload()">
                <i class="fa-solid fa-download"></i> Get PDF
            </button>
        </div>
    `;
}

window.simulateResolveScan = function(verdict) {
    if (verdict.includes('Verified')) {
        alert("Redirecting securely to verified portal. Secure KYC enabled.");
    } else {
        alert("Threat Blocked! Logging URL to National Cyber Crime Reporting Portal (1930 Helpline). Thank you for keeping communities secure!");
    }
};

window.simulateReportDownload = function() {
    alert("Downloading PDF Risk Report. Check your downloads directory.");
};

/* ==========================================================================
   AI Assistant Demo (Voice & Dialog)
   ========================================================================== */

const MULTILINGUAL_QUERIES = {
    en: {
        suggested: [
            "What agriculture schemes am I eligible for?",
            "Is the website http://pmkisan-free.org safe?",
            "How do I apply for Ayushman Bharat health card?"
        ],
        responses: {
            "What agriculture schemes am I eligible for?": "Based on a Farmer profile with small landholding, you qualify for PM Kisan Samman Nidhi (₹6,000/yr), PM Surya Ghar Solar Pump Subsidy (90% subsidy), and Crop Insurance. Fill out the profile above to run details.",
            "Is the website http://pmkisan-free.org safe?": "No. The official portal is pmkisan.gov.in. Any portal ending in .org, .net, or requesting money for processing is a scam. SchemeShield flags http://pmkisan-free.org with a 14% Trust Score.",
            "How do I apply for Ayushman Bharat health card?": "You can apply via the official BIS portal using your Aadhaar or Ration Card. Alternatively, visit your nearest Common Service Centre (CSC) for biometric verification. The card is free."
        },
        voiceText: {
            "What agriculture schemes am I eligible for?": "You are eligible for PM Kisan, PM Surya Ghar Solar pump subsidies, and crop insurance.",
            "Is the website http://pmkisan-free.org safe?": "No, it is a scam. The official site is pmkisan dot gov dot in.",
            "How do I apply for Ayushman Bharat health card?": "Apply online using Aadhaar or visit a nearby Common Service Centre."
        }
    },
    hi: {
        suggested: [
            "मैं किन कृषि योजनाओं के लिए पात्र हूँ?",
            "क्या वेबसाइट http://pmkisan-free.org सुरक्षित है?",
            "मैं आयुष्मान भारत स्वास्थ्य कार्ड के लिए कैसे आवेदन करूँ?"
        ],
        responses: {
            "मैं किन कृषि योजनाओं के लिए पात्र हूँ?": "एक छोटे किसान प्रोफ़ाइल के आधार पर, आप पीएम किसान सम्मान निधि (₹6,000/वर्ष), पीएम सूर्य घर सौर पंप सब्सिडी (90% सब्सिडी), और फसल बीमा के लिए पात्र हैं। विवरण देखने के लिए ऊपर अपना प्रोफ़ाइल भरें।",
            "क्या वेबसाइट http://pmkisan-free.org सुरक्षित है?": "नहीं। आधिकारिक पोर्टल pmkisan.gov.in है। .org, .net पर समाप्त होने वाले या पंजीकरण शुल्क मांगने वाले पोर्टल धोखाधड़ी हैं।",
            "मैं आयुष्मान भारत स्वास्थ्य कार्ड के लिए कैसे आवेदन करूँ?": "आप अपने आधार कार्ड या राशन कार्ड का उपयोग करके आधिकारिक बीआईएस पोर्टल के माध्यम से आवेदन कर सकते हैं। अथवा नजदीकी कॉमन सर्विस सेंटर (CSC) पर जाएं।"
        },
        voiceText: {
            "मैं किन कृषि योजनाओं के लिए पात्र हूँ?": "आप पीएम किसान सम्मान निधि और सौर पंप योजना के पात्र हैं।",
            "क्या वेबसाइट http://pmkisan-free.org सुरक्षित है?": "नहीं, यह वेबसाइट फर्जी है। आधिकारिक वेबसाइट पीएम किसान डॉट जीओवी डॉट इन है।",
            "मैं आयुष्मान भारत स्वास्थ्य कार्ड के लिए कैसे आवेदन करूँ?": "आधार कार्ड के साथ नजदीकी ग्राहक सेवा केंद्र पर जाकर आयुष्मान कार्ड बनवाएं।"
        }
    },
    mr: {
        suggested: [
            "मी कोणत्या कृषी योजनांसाठी पात्र आहे?",
            "http://pmkisan-free.org ही वेबसाइट सुरक्षित आहे का?",
            "आयुष्मान भारत आरोग्य कार्डसाठी कसा अर्ज करावा?"
        ],
        responses: {
            "मी कोणत्या कृषी योजनांसाठी पात्र आहे?": "लघु शेतकरी म्हणून, तुम्ही पीएम किसान (₹६,०००/वर्ष), पीएम सूर्य घर सौर कृषी पंप योजना (९०% सबसिडी) आणि पीक विम्यासाठी पात्र आहात. अधिक माहितीसाठी वरील फॉर्म भरा.",
            "http://pmkisan-free.org ही वेबसाइट सुरक्षित आहे का?": "नाही! अधिकृत पोर्टल pmkisan.gov.in आहे. इतर कोणतीही वेबसाइट जी पैसे मागते ती बनावट आहे.",
            "आयुष्मान भारत आरोग्य कार्डसाठी कसा अर्ज करावा?": "तुम्ही आधार किंवा रेशन कार्ड वापरून अधिकृत BIS पोर्टलवर अर्ज करू शकता किंवा जवळच्या सीएससी केंद्राला भेट देऊ शकता."
        },
        voiceText: {
            "मी कोणत्या कृषी योजनांसाठी पात्र आहे?": "तुम्ही पीएम किसान योजना आणि सौर पंप योजनेसाठी पात्र आहात.",
            "http://pmkisan-free.org ही वेबसाइट सुरक्षित आहे का?": "नाही, ही बनावट वेबसाईट आहे. सावध रहा.",
            "आयुष्मान भारत आरोग्य कार्डसाठी कसा अर्ज करावा?": "आधार कार्ड घेऊन जवळच्या महा ई सेवा केंद्रात भेट द्या."
        }
    },
    ta: {
        suggested: [
            "நான் என்ன விவசாய திட்டங்களுக்கு தகுதியானவன்?",
            "http://pmkisan-free.org என்ற இணையதளம் பாதுகாப்பானதா?",
            "ஆயுஷ்மான் பாரத் அட்டைக்கு விண்ணப்பிப்பது எப்படி?"
        ],
        responses: {
            "நான் என்ன விவசாய திட்டங்களுக்கு தகுதியானவன்?": "சிறு விவசாயி என்ற முறையில் நீங்கள் பிரதமரின் கிசான் சம்மான் நிதி (ஆண்டுக்கு ₹6,000) மற்றும் சோலார் பம்ப் மானியம் பெற தகுதியுடையவர்.",
            "http://pmkisan-free.org என்ற இணையதளம் பாதுகாப்பானதா?": "இல்லை! அதிகாரப்பூர்வ தளம் pmkisan.gov.in ஆகும். மற்றவை போலியானவை, பணம் செலுத்த வேண்டாம்.",
            "ஆயுஷ்மான் பாரத் அட்டைக்கு விண்ணப்பிப்பது எப்படி?": "ஆதார் கார்டு மூலம் அதிகாரப்பூர்வ BIS போர்ட்டல் அல்லது பொது சேவை மையத்தில் விண்ணப்பிக்கலாம்."
        },
        voiceText: {
            "நான் என்ன விவசாய திட்டங்களுக்கு தகுதியானவன்?": "நீங்கள் பிஎம் கிசான் மற்றும் சோலார் பம்ப் மானியம் பெற தகுதியுடையவர்.",
            "http://pmkisan-free.org என்ற இணையதளம் பாதுகாப்பானதா?": "இல்லை, இது போலியான இணையதளம்.",
            "ஆயுஷ்மான் பாரத் அட்டைக்கு விண்ணப்பிப்பது எப்படி?": "பொது சேவை மையத்திற்கு சென்று விண்ணப்பிக்கவும்."
        }
    },
    te: {
        suggested: [
            "నేను ఏ వ్యవసాయ పథకాలకు అర్హుడిని?",
            "http://pmkisan-free.org వెబ్‌సైట్ సురక్షితమేనా?",
            "ఆయుష్మాన్ భారత్ హెల్త్ కార్డ్ ఎలా పొందాలి?"
        ],
        responses: {
            "నేను ఏ వ్యవసాయ పథకాలకు అర్హుడిని?": "చిన్న రైతుగా మీరు పీఎం కిసాన్ (సంవత్సరానికి ₹6,000) మరియు సోలార్ పంప్ సబ్సిడీ పథకాలకు అర్హులు.",
            "http://pmkisan-free.org వెబ్‌సైట్ సురక్షితమేనా?": "కాదు! అధికారిక సైట్ pmkisan.gov.in మాత్రమే. ఇతర నకిలీ లింకులను క్లిక్ చేయకండి.",
            "ఆయుష్మాన్ భారత్ హెల్త్ కార్డ్ ఎలా పొందాలి?": "మీ ఆధార్ కార్డు ద్వారా సమీప కామన్ సర్వీస్ సెంటర్ లో దరఖాస్తు చేసుకోవచ్చు."
        },
        voiceText: {
            "నేను ఏ వ్యవసాయ పథకాలకు అర్హుడిని?": "మీరు పీఎం కిసాన్ మరియు సోలార్ పంప్ పథకాలకు అర్హులు.",
            "http://pmkisan-free.org వెబ్‌సైట్ సురక్షితమేనా?": "కాదు, ఇది నకిలీ వెబ్‌సైట్.",
            "ఆయుష్మాన్ భారత్ హెల్త్ కార్డ్ ఎలా పొందాలి?": "ఆధార్ కార్డుతో మీ సమీప సేవా కేంద్రంలో దరఖాస్తు చేసుకోండి."
        }
    },
    kn: {
        suggested: [
            "ನಾನು ಯಾವ ಕೃಷಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹನಾಗಿದ್ದೇನೆ?",
            "http://pmkisan-free.org ವೆಬ್‌ಸೈಟ್ ಸುರಕ್ಷಿತವೇ?",
            "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯುವುದು ಹೇಗೆ?"
        ],
        responses: {
            "ನಾನು ಯಾವ ಕೃಷಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹನಾಗಿದ್ದೇನೆ?": "ಸಣ್ಣ ರೈತರಿಗೆ ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ (ವರ್ಷಕ್ಕೆ ₹6,000) ಮತ್ತು ಸೌರ ಪಂಪ್ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ.",
            "http://pmkisan-free.org ವೆಬ್‌ಸೈಟ್ ಸುರಕ್ಷಿತವೇ?": "ಇಲ್ಲ, ಇದು ನಕಲಿ ವೆಬ್‌ಸೈಟ್. ಅಧಿಕೃತ ಸೈಟ್ pmkisan.gov.in ಆಗಿದೆ.",
            "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯುವುದು ಹೇಗೆ?": "ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ನೊಂದಿಗೆ ಹತ್ತಿರದ ಸಿಎಸ್ ಸಿ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ."
        },
        voiceText: {
            "ನಾನು ಯಾವ ಕೃಷಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹನಾಗಿದ್ದೇನೆ?": "ನೀವು ಪಿಎಂ ಕಿಸಾನ್ ಮತ್ತು ಸೋಲಾರ್ ಪಂಪ್ ಯೋಜನೆಗೆ ಅರ್ಹರಾಗಿದ್ದೀರಿ.",
            "http://pmkisan-free.org ವೆಬ್‌ಸೈಟ್ ಸುರಕ್ಷಿತವೇ?": "ಇಲ್ಲ, ಇದು ನಕಲಿ ವೆಬ್‌ಸೈಟ್ ಆಗಿದೆ.",
            "ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯುವುದು ಹೇಗೆ?": "ನಿಮ್ಮ ಹತ್ತಿರದ ಸಿಎಸ್ ಸಿ ಕೇಂದ್ರದಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ."
        }
    }
};

let currentLang = 'en';

function initAIAssistant() {
    const langPills = document.querySelectorAll('#assistant-langs .lang-pill');
    
    langPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const lang = pill.getAttribute('data-lang');
            syncLanguage(lang);
        });
    });

    // Form Send Action
    const form = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (text) {
                processUserMessage(text);
                chatInput.value = '';
            }
        });
    }

    // Voice button simulation
    const voiceBtn = document.getElementById('voice-input-btn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            voiceBtn.classList.add('recording');
            chatInput.placeholder = "Listening...";
            
            setTimeout(() => {
                voiceBtn.classList.remove('recording');
                // Select a random query from language
                const queries = MULTILINGUAL_QUERIES[currentLang].suggested;
                const randomQuery = queries[Math.floor(Math.random() * queries.length)];
                chatInput.value = randomQuery;
                chatInput.placeholder = "Type your query...";
            }, 1800);
        });
    }

    // Initial render
    renderSuggestedQuestions();
}

function renderSuggestedQuestions() {
    const container = document.getElementById('suggested-questions');
    if (!container) return;

    const queries = MULTILINGUAL_QUERIES[currentLang].suggested;
    container.innerHTML = '';
    queries.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'suggested-question-btn';
        btn.textContent = q;
        btn.addEventListener('click', () => processUserMessage(q));
        container.appendChild(btn);
    });
}

function processUserMessage(text) {
    appendChatMessage(text, 'user');
    
    // Simulate thinking and typing
    setTimeout(() => {
        let answer = "I am searching official guidelines. Please refine your query or try checking with SchemeShield.";
        let voiceSpoken = answer;

        const langData = MULTILINGUAL_QUERIES[currentLang];
        if (langData.responses && langData.responses[text]) {
            answer = langData.responses[text];
            voiceSpoken = langData.voiceText[text];
        }

        appendChatMessage(answer, 'bot');

        // Play TTS Voice synthesiser
        speakText(voiceSpoken, currentLang);
    }, 800);
}

function appendChatMessage(text, sender) {
    const chatBody = document.getElementById('chat-body');
    if (!chatBody) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const msg = document.createElement('div');
    msg.className = `chat-message ${sender}`;
    msg.innerHTML = `
        ${text}
        <span class="chat-message-time">${timeStr}</span>
    `;
    
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function speakText(text, lang) {
    if ('speechSynthesis' in window) {
        // Cancel active Speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Map language locale codes
        const langMap = {
            en: 'en-IN',
            hi: 'hi-IN',
            mr: 'mr-IN',
            ta: 'ta-IN',
            te: 'te-IN',
            kn: 'kn-IN'
        };
        utterance.lang = langMap[lang] || 'en-IN';
        utterance.rate = 0.95; // slightly slower for clarity in rural setups
        
        window.speechSynthesis.speak(utterance);
    }
}

/* ==========================================================================
   Village Intelligence Dashboard
   ========================================================================== */

const VILLAGE_DATA = {
    Maharashtra: {
        Pune: {
            Khed: {
                subsidies: "₹2.4M",
                scams: 3,
                inclusion: "84%",
                bars: [
                    { name: "Agri Solar Subsidies Unclaimed", value: 72, amt: "₹1,20,000" },
                    { name: "Post-Matric Scholarships Pending", value: 45, amt: "₹85,000" },
                    { name: "Women Entrepreneurship Loans Blocked", value: 30, amt: "₹45,000" },
                    { name: "Health Insurance Cards Not Generated", value: 85, amt: "₹3,40,000" }
                ]
            },
            Manchar: {
                subsidies: "₹1.8M",
                scams: 5,
                inclusion: "78%",
                bars: [
                    { name: "Agri Solar Subsidies Unclaimed", value: 50, amt: "₹80,000" },
                    { name: "Post-Matric Scholarships Pending", value: 65, amt: "₹1,10,000" },
                    { name: "Women Entrepreneurship Loans Blocked", value: 40, amt: "₹60,000" },
                    { name: "Health Insurance Cards Not Generated", value: 70, amt: "₹2,60,000" }
                ]
            },
            Junnar: {
                subsidies: "₹3.1M",
                scams: 1,
                inclusion: "90%",
                bars: [
                    { name: "Agri Solar Subsidies Unclaimed", value: 85, amt: "₹1,90,000" },
                    { name: "Post-Matric Scholarships Pending", value: 20, amt: "₹35,000" },
                    { name: "Women Entrepreneurship Loans Blocked", value: 15, amt: "₹20,000" },
                    { name: "Health Insurance Cards Not Generated", value: 92, amt: "₹4,10,000" }
                ]
            }
        }
    },
    UttarPradesh: {
        Nashik: { // Fallback/Placeholder structure for simplicity
            Khed: {
                subsidies: "₹4.2M",
                scams: 14,
                inclusion: "65%",
                bars: [
                    { name: "Agri Solar Subsidies Unclaimed", value: 90, amt: "₹2,20,000" },
                    { name: "Post-Matric Scholarships Pending", value: 80, amt: "₹1,85,000" },
                    { name: "Women Entrepreneurship Loans Blocked", value: 60, amt: "₹1,10,000" },
                    { name: "Health Insurance Cards Not Generated", value: 95, amt: "₹5,20,000" }
                ]
            }
        }
    }
};

function initVillageDashboard() {
    const stateSel = document.getElementById('db-state');
    const districtSel = document.getElementById('db-district');
    const villageSel = document.getElementById('db-village');

    if (stateSel) {
        stateSel.addEventListener('change', () => {
            updateDistrictDropdown();
            renderDashboardData();
        });
    }

    if (districtSel) {
        districtSel.addEventListener('change', () => {
            updateVillageDropdown();
            renderDashboardData();
            
            // Sync interactive map active outline highlight
            const activeDist = districtSel.value;
            document.querySelectorAll('.map-district-path').forEach(p => {
                if (p.getAttribute('data-district') === activeDist) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        });
    }

    if (villageSel) {
        villageSel.addEventListener('change', () => {
            renderDashboardData();
        });
    }

    // Trigger initial render
    renderDashboardData();
}

function updateDistrictDropdown() {
    const state = document.getElementById('db-state').value;
    const distSel = document.getElementById('db-district');
    distSel.innerHTML = '';
    
    if (state === 'Maharashtra') {
        distSel.innerHTML = `
            <option value="Pune">Pune District</option>
            <option value="Nashik">Nashik District</option>
            <option value="Satara">Satara District</option>
        `;
    } else if (state === 'UttarPradesh') {
        distSel.innerHTML = `
            <option value="Varanasi">Varanasi District</option>
            <option value="Gorakhpur">Gorakhpur District</option>
        `;
    } else {
        distSel.innerHTML = `
            <option value="Chennai">Chennai District</option>
            <option value="Coimbatore">Coimbatore District</option>
        `;
    }
    updateVillageDropdown();
}

function updateVillageDropdown() {
    const dist = document.getElementById('db-district').value;
    const vilSel = document.getElementById('db-village');
    vilSel.innerHTML = '';

    if (dist === 'Pune') {
        vilSel.innerHTML = `
            <option value="Khed">Khed Village</option>
            <option value="Manchar">Manchar Village</option>
            <option value="Junnar">Junnar Village</option>
        `;
    } else {
        vilSel.innerHTML = `
            <option value="Village-A">Village A</option>
            <option value="Village-B">Village B</option>
        `;
    }
}

function renderDashboardData() {
    const state = document.getElementById('db-state').value;
    const dist = document.getElementById('db-district').value;
    const vil = document.getElementById('db-village').value;

    // Fetch from database, fallback if not matched
    let data = VILLAGE_DATA.Maharashtra.Pune.Khed; // default
    if (VILLAGE_DATA[state] && VILLAGE_DATA[state][dist] && VILLAGE_DATA[state][dist][vil]) {
        data = VILLAGE_DATA[state][dist][vil];
    } else {
        // Generate pseudo-random mock data so the UI always reacts
        const seed = (state.length + dist.length + vil.length) % 10;
        data = {
            subsidies: `₹${(1.5 + (seed * 0.4)).toFixed(1)}M`,
            scams: seed * 2 + 1,
            inclusion: `${70 + seed * 3}%`,
            bars: [
                { name: "Agri Solar Subsidies Unclaimed", value: 35 + seed * 6, amt: `₹${30000 + seed * 15000}` },
                { name: "Post-Matric Scholarships Pending", value: 20 + seed * 8, amt: `₹${20000 + seed * 10000}` },
                { name: "Women Entrepreneurship Loans Blocked", value: 15 + seed * 7, amt: `₹${15000 + seed * 8000}` },
                { name: "Health Insurance Cards Not Generated", value: 40 + seed * 5, amt: `₹${100000 + seed * 45000}` }
            ]
        };
    }

    // Update main text indicators
    document.getElementById('db-val-subsidies').textContent = data.subsidies;
    document.getElementById('db-val-scams').textContent = data.scams;
    document.getElementById('db-val-inclusion').textContent = data.inclusion;

    // Render bars
    const barsContainer = document.getElementById('dashboard-bars');
    if (!barsContainer) return;
    
    barsContainer.innerHTML = '';
    data.bars.forEach(bar => {
        const item = document.createElement('div');
        item.className = 'subsidy-bar-item';
        item.innerHTML = `
            <div class="subsidy-meta">
                <span>${bar.name}</span>
                <span class="subsidy-amount">${bar.amt}</span>
            </div>
            <div class="subsidy-track">
                <div class="subsidy-fill" style="width: 0%;"></div>
            </div>
        `;
        barsContainer.appendChild(item);

        // Animate fill bar slightly delayed
        setTimeout(() => {
            item.querySelector('.subsidy-fill').style.width = bar.value + '%';
        }, 100);
    });
}

/* ==========================================================================
   Impact Stories Carousel
   ========================================================================== */

let currentStoryIdx = 0;

function initTestimonialCarousel() {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const container = document.getElementById('stories-container');
    const dots = document.querySelectorAll('#carousel-indicators .indicator-dot');

    if (!container) return;

    const updateCarousel = () => {
        container.style.transform = `translateX(-${currentStoryIdx * 100}%)`;
        
        dots.forEach(dot => dot.classList.remove('active'));
        const activeDot = document.querySelector(`#carousel-indicators .indicator-dot[data-slide="${currentStoryIdx}"]`);
        if (activeDot) activeDot.classList.add('active');
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentStoryIdx = (currentStoryIdx + 1) % 3;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentStoryIdx = (currentStoryIdx - 1 + 3) % 3;
            updateCarousel();
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentStoryIdx = parseInt(dot.getAttribute('data-slide'));
            updateCarousel();
        });
    });
}

/* ==========================================================================
   Interactive Map Handler
   ========================================================================== */
function initInteractiveMap() {
    const paths = document.querySelectorAll('.map-district-path');
    const districtSel = document.getElementById('db-district');
    
    paths.forEach(path => {
        path.addEventListener('click', () => {
            paths.forEach(p => p.classList.remove('active'));
            path.classList.add('active');
            
            const dist = path.getAttribute('data-district');
            if (districtSel) {
                districtSel.value = dist;
                // Trigger change event to fire cascading filters
                const event = new Event('change');
                districtSel.dispatchEvent(event);
            }
        });
    });
}

/* ==========================================================================
   Language Selector & Full Page Translation System
   ========================================================================== */

function initLanguageSelector() {
    const headerLang = document.getElementById('header-lang');
    if (headerLang) {
        headerLang.addEventListener('change', (e) => {
            const lang = e.target.value;
            syncLanguage(lang);
        });
    }
}

function syncLanguage(lang) {
    currentLang = lang;
    
    // Update header dropdown
    const headerLang = document.getElementById('header-lang');
    if (headerLang && headerLang.value !== lang) {
        headerLang.value = lang;
    }
    
    // Update Assistant language pills
    const pills = document.querySelectorAll('#assistant-langs .lang-pill');
    pills.forEach(pill => {
        if (pill.getAttribute('data-lang') === lang) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    // Translate the page
    translatePage(lang);

    // Update suggested questions in the assistant
    if (typeof renderSuggestedQuestions === 'function') {
        renderSuggestedQuestions();
    }
}

function translatePage(lang) {
    currentLang = lang;
    const translation = UI_TRANSLATIONS[lang];
    if (!translation) return;

    // Translate all standard data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translation[key]) {
            if (translation[key].includes('<') || translation[key].includes('&')) {
                el.innerHTML = translation[key];
            } else {
                el.textContent = translation[key];
            }
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translation[key]) {
            el.setAttribute('placeholder', translation[key]);
        }
    });
}

window.speakKey = function(key) {
    const translation = UI_TRANSLATIONS[currentLang];
    if (translation && translation[key]) {
        // Strip any HTML tags from translation (like <strong> or <br>) for clean TTS
        const rawText = translation[key].replace(/<[^>]*>/g, '');
        speakText(rawText, currentLang);
    }
};

const UI_TRANSLATIONS = {
    en: {
        "nav-home": "Home",
        "nav-problem": "Problem",
        "nav-opportunities": "Opportunities",
        "nav-simulator": "Simulator",
        "nav-schemeshield": "SchemeShield",
        "nav-assistant": "AI Assistant",
        "nav-village-dashboard": "Village Intel",
        "nav-btn-eligibility": "Check Eligibility",
        "ticker-1": '<i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; margin-right: 0.5rem;"></i> <strong>CYBER WARNING:</strong> Fake PM Kisan portals requesting verification fees flagged. Do not share OTPs or pay upfront.',
        "ticker-2": '<i class="fa-solid fa-bullhorn" style="color: var(--primary-light); margin-right: 0.5rem;"></i> <strong>NEW SCHEME:</strong> PM Surya Ghar Solar Subsidy is active. Calculate savings in our Simulator.',
        "ticker-3": '<i class="fa-solid fa-shield-halved" style="color: #3B82F6; margin-right: 0.5rem;"></i> <strong>VILLAGE INTEL:</strong> 3 phishing links successfully deflected in Pune District this week.',
        "hero-badge": "National Digital Mission Powered by AI",
        "hero-title": "Find Opportunities.<br>Stay Protected.<br>Empower Communities.",
        "hero-desc": "GramSathi AI is a digital companion for citizens across India. Instantly discover the government schemes, subsidies, and scholarships you qualify for, while securing yourself against online scams, phishing, and fake websites.",
        "hero-cta-discover": "Discover Opportunities",
        "hero-cta-scan": "Run SchemeShield Scan",
        "hero-stat-schemes-lbl": "Verified Schemes",
        "hero-stat-scams-lbl": "Scams Deflected",
        "hero-stat-villages-lbl": "Villages Empanelled",
        "hero-radar-title": "GramSathi Engine",
        "hero-radar-live": "LIVE RADAR",
        "hero-radar-score": "Match Score",
        "hero-radar-found": "Schemes Found",
        "hero-radar-val": "Est. Value/Yr",
        "problem-badge": "Critical Security & Access Alert",
        "problem-title": "The Double-Ended Crisis in Rural Digital India",
        "problem-desc": "As the nation progresses towards a 5-trillion dollar digital economy, millions of citizens in rural and semi-urban communities are left behind, facing two compounding issues.",
        "problem-alert-title": "Information Gap vs. Scam Inflation",
        "problem-alert-desc": "While billions in welfare go unclaimed due to scattered data and language barriers, digital literacy gaps have made these same citizens prime targets for sophisticated online financial frauds.",
        "problem-card1-title": "Scattered & Fragmented Portals",
        "problem-card1-desc": "Welfare programs are spread across hundreds of state and central websites. Requirements are dense, dry, and difficult to comprehend without expert assistance.",
        "problem-card2-title": "Rise of Spoof Scheme Sites",
        "problem-card2-desc": "Imposter sites designed to look like official portals request processing fees for subsidies like PM Kisan or fake student scholarships.",
        "problem-card3-title": "Phishing via Social Messaging",
        "problem-card3-desc": "Citizens receive malicious WhatsApp and SMS links promising free solar panels, cheap loans, or cash giveaways to harvest identity data.",
        "gap-badge": "THE IMPACT GAP",
        "gap-title": "Socio-Economic Opportunities Lost Everyday",
        "gap-desc": "A statistical breakdown of missed benefits and cybersecurity threats facing low digital-literacy users across the nation.",
        "gap-card1-lbl": "Unclaimed Welfare Subsidies Annually",
        "gap-card2-lbl": "Rural Citizens Unaware of Welfare Rights",
        "gap-card3-lbl": "Increase in Rural Cybersecurity Fraud",
        "gap-card4-lbl": "Citizens Hindered by Language Barriers",
        "works-badge": "HOW IT WORKS",
        "works-title": "A Secure Path from Discovery to Benefit",
        "works-desc": "GramSathi AI automates the complex pipeline of identifying, checking, and securing welfare eligibility in three simple steps.",
        "works-step1-title": "Build Digital Profile",
        "works-step1-desc": "Enter basic demographics (age, occupation, education, income, and region). Your data stays strictly encrypted on-device.",
        "works-step2-title": "Execute Opportunity Radar",
        "works-step2-desc": "Our cognitive engine parses hundreds of state and federal guidelines to output an instant visual radar map of matches.",
        "works-step3-title": "Verify via SchemeShield",
        "works-step3-desc": "Before applying or clicking links, pass website domains and messages through SchemeShield to run authenticity and scam checks.",
        "discovery-badge": "DISCOVERY ENGINE",
        "discovery-title": "Interactive Opportunity Matcher",
        "discovery-desc": "Input your profile details to dynamically update your Opportunity Radar and discover specific programs matching your parameters.",
        "profile-card-title": "Demographic Profile",
        "profile-card-desc": "Please enter your information to calculate matches",
        "profile-name-lbl": "Full Name",
        "profile-age-lbl": "Age",
        "profile-occupation-lbl": "Occupation",
        "profile-occ-default": "Select Occupation",
        "profile-occ-farmer": "Farmer / Agriculture",
        "profile-occ-student": "Student / Academic",
        "profile-occ-seeker": "Job Seeker / Unemployed",
        "profile-occ-ent": "Small Business / Entrepreneur",
        "profile-occ-artisan": "Artisan / Weaver",
        "profile-occ-retired": "Senior Citizen / Retired",
        "profile-state-lbl": "State",
        "profile-state-default": "Select State",
        "profile-edu-lbl": "Education",
        "profile-edu-default": "Select Education",
        "profile-edu-none": "Non-Literate / Basic Primary",
        "profile-edu-sec": "High School (10th/12th)",
        "profile-edu-grad": "Graduate / Degree Holder",
        "profile-edu-voc": "Diploma / Vocational Training",
        "profile-income-lbl": "Monthly Family Income (₹)",
        "profile-land-lbl": "Land Ownership",
        "profile-land-no": "No Land Owned",
        "profile-land-small": "Small-scale / Marginal Holder (< 2 Hectares)",
        "profile-land-large": "Large-scale Holder (> 2 Hectares)",
        "profile-btn-calc": "Calculate Opportunity Score",
        "radar-title": "Opportunity Radar",
        "radar-desc": "Click on any category to view specific scheme recommendations",
        "radar-cat-agri": "Agriculture",
        "radar-cat-edu": "Education",
        "radar-cat-health": "Healthcare",
        "radar-cat-emp": "Employment",
        "radar-cat-ent": "Entrepreneurship",
        "radar-cat-fin": "Finance",
        "results-headline-default": "Complete your profile",
        "results-subheading-default": "Submit demographic details to see eligible schemes.",
        "results-placeholder": "No profile calculated yet. Please fill out the form.",
        "sim-badge": "GROWTH SIMULATOR",
        "sim-title": "Future Impact Projections",
        "sim-desc": "Project how enrolling in eligible welfare schemes can step-up your family's monthly income and support long-term upward mobility.",
        "sim-params-title": "Income parameters",
        "sim-params-desc": "Adjust baseline parameters and toggle available welfare payouts",
        "sim-base-income-lbl": "Base Monthly Income",
        "sim-select-schemes": "Select Schemes to Apply",
        "sim-scheme1-name": "PM Kisan Samman Nidhi",
        "sim-scheme1-amt": "+₹500 / month (₹6,000/yr)",
        "sim-scheme2-name": "Post-Matric Student Scholarship",
        "sim-scheme2-amt": "+₹1,500 / month (₹18,000/yr)",
        "sim-scheme3-name": "PM Skill Development Job Placement",
        "sim-scheme3-amt": "+₹3,500 / month (Avg boost)",
        "sim-scheme4-name": "PM Surya Ghar Solar Subsidy (Savings)",
        "sim-scheme4-amt": "+₹2,500 / month (Reduced bill)",
        "sim-baseline-lbl": "Current Baseline",
        "sim-projected-lbl": "Projected Income",
        "sim-chart-x-base": "Baseline",
        "sim-chart-x-kisan": "PM Kisan",
        "sim-chart-x-skill": "Skill Dev",
        "sim-chart-x-solar": "Surya Solar",
        "sim-chart-note": "Graph shows cumulative projection. Projections are estimations based on average placements.",
        "shield-badge": "CYBER SECURITY",
        "shield-title": "SchemeShield AI Scan",
        "shield-desc": "Instantly evaluate schemes, messages, or portals. Our AI parses links, flags phishing attempts, and maps domains to official state domains.",
        "shield-panel-title": "Threat Analyzer",
        "shield-panel-desc": "Paste website links, upload portal screenshots, or paste doubtful SMS prompts",
        "shield-tab-url": "Website URL",
        "shield-tab-upload": "Upload Screenshot",
        "shield-tab-message": "SMS / WhatsApp",
        "shield-upload-drag": "Drag and drop screenshot or scheme PDF here",
        "shield-upload-limit": "Supports PNG, JPG, PDF up to 5MB",
        "shield-btn-scan": "Run Security Scan",
        "shield-idle-title": "System Idle & Protected",
        "shield-idle-desc": "Enter data and click 'Run Security Scan' to check for cyber threats.",
        "shield-scanning-title": "Parsing domain headers...",
        "shield-scanning-desc": "Parsing metadata and analyzing suspicious patterns...",
        "assistant-badge": "AI COMPANION",
        "assistant-title": "Speak with GramSathi AI",
        "assistant-desc": "Have eligibility questions? Try our multilingual voice-enabled assistant to get guidance in local languages.",
        "assistant-info-title": "Multilingual Dialog",
        "assistant-info-desc": "Select your language to view simulated queries or start chatting",
        "chat-name": "GramSathi Companion",
        "chat-online": "Online",
        "chat-voice-enabled": "Voice Enabled",
        "chat-bot-default": "Hello! I am your GramSathi AI assistant. Ask me anything about government schemes, eligibility, or cyber safety.",
        "db-badge": "REGIONAL ANALYTICS",
        "db-title": "Village Intelligence Dashboard",
        "db-desc": "Aggregating regional demographic data to show missed subsidies, scam alerts, and financial inclusion scores for communities.",
        "db-card1-title": "Unclaimed Welfare Subsidies",
        "db-card1-trend": "14% drop from last quarter",
        "db-card2-title": "Cyber Threat Alerts",
        "db-card2-trend": "3 active scam sites detected",
        "db-card3-title": "Financial Inclusion Score",
        "db-card3-trend": "5% growth in digital accounts",
        "db-wide-title": "Missed Subsidies Breakdowns",
        "db-wide-badge": "VILLAGE LEVEL ANALYSIS",
        "map-title": "Interactive District Vulnerability & Opportunity Map",
        "map-desc": "Select a region below to audit regional metrics, unclaimed subsidies, and cybersecurity alerts.",
        "stories-badge": "COMMUNITY IMPACT",
        "stories-title": "Citizen Impact Stories",
        "stories-desc": "Read about citizens who successfully secured subsidies or deflected online scams using the platform.",
        "story1-quote": '"I received a WhatsApp link promising 90% solar pump subsidies. Before paying the ₹1,500 registration fee, I checked it via SchemeShield. The tool flagged it as a fake government domain. GramSathi AI saved my hard-earned savings!"',
        "story1-author-job": "Farmer, Nashik District",
        "story2-quote": '"Finding scholarships used to take weeks of visiting offices. GramSathi analyzed my college student profile and recommended the Post-Matric program in Marathi. I got verified and my fees are sponsored."',
        "story2-author-job": "Undergraduate Student, Pune",
        "story3-quote": '"Starting my small tailoring business was difficult until the platform matched me with Stand-Up India. Within 2 months, I secured a mudra financial loan with zero collateral."',
        "story3-author-job": "Women Entrepreneur, Junnar",
        "vision-badge": "THE NATIONAL VISION",
        "vision-title": "Empowering 250 Million Rural Households",
        "vision-desc": "Our vision is to scale GramSathi AI across every block and gram panchayat in India, eliminating intermediate leakages and creating a secure, scam-free digital welfare network.",
        "vision-stat1-lbl": "Scam Detection Rate",
        "vision-stat2-lbl": "Scheduled Languages Support",
        "vision-stat3-lbl": "Direct Benefit Security Goal",
        "vision-btn-discover": "Check Your Eligible Subsidies",
        "vision-btn-report": "Report A Online scam",
        "footer-logo-text": "GramSathi AI",
        "footer-desc": "AI-powered Opportunity Discovery & Cyber Safety Platform. Empathetic technology built to safeguard and empower India's rural and semi-urban communities.",
        "footer-col-discovery": "Discovery Portals",
        "footer-link-farmers": "Farmers Subsidies",
        "footer-link-scholars": "Scholarships Finder",
        "footer-link-health": "Healthcare Subsidies",
        "footer-link-skills": "Skills Training Programs",
        "footer-col-safety": "Cyber Safety",
        "footer-link-verify": "Link Verification",
        "footer-link-report": "Report Fake Portals",
        "footer-link-feeds": "Fraud Alert Feeds",
        "footer-link-assistant": "Digital Literacy Assistant",
        "footer-col-news": "Subscribe to Cyber Alerts",
        "footer-news-desc": "Get weekly updates about trending scam designs and newly released government subsidy programs.",
        "footer-news-btn": "Join",
        "footer-bottom-copy": "&copy; 2026 GramSathi AI. Built under National Digital Governance Hackathon Initiative.",
        "footer-policy-privacy": "Privacy Policy",
        "footer-policy-terms": "Terms of Service",
        "footer-policy-api": "Report Threat API",
        "modal-title": "GramSathi AI Portal",
        "modal-subtitle": "National Welfare Verification Certificate",
        "modal-desc": "This document verifies eligibility parameters processed under the GramSathi Cognitive Intelligence Engine.",
        "modal-name-lbl": "Applicant Name:",
        "modal-age-lbl": "Age / Gender:",
        "modal-occupation-lbl": "Occupation:",
        "modal-region-lbl": "State / District:",
        "modal-score-lbl": "Opportunity Score:",
        "modal-income-lbl": "Monthly Income:",
        "modal-target-title": "Calculated Eligibility Target",
        "modal-qr-lbl": "SCAN SECURE KYC",
        "modal-gov-lbl": "Government of India",
        "modal-agency-lbl": "Cognitive Welfare Agency",
        "modal-status-lbl": "STATUS: ACTIVE / VERIFIED",
        "modal-btn-print": "Print / Save PDF",
        "modal-btn-close": "Close",
        "profile-name-placeholder": "E.g., Ramesh Kumar",
        "profile-age-placeholder": "E.g., 42",
        "profile-income-placeholder": "E.g., 12000",
        "shield-url-placeholder": "E.g., http://pmkisan-subsidy-free.in",
        "shield-text-placeholder": "Paste the message content here... E.g., 'Congratulations! You are selected for Pradhan Mantri Balika grant. Send Rs. 499 processing fee on link...'",
        "chat-input-placeholder": "Type your query...",
        "footer-news-placeholder": "Enter email address"
    },
    hi: {
        "nav-home": "मुख्यपृष्ठ",
        "nav-problem": "समस्या",
        "nav-opportunities": "अवसर",
        "nav-simulator": "सिम्युलेटर",
        "nav-schemeshield": "स्कीमशील्ड",
        "nav-assistant": "एआई सहायक",
        "nav-village-dashboard": "ग्राम जानकारी",
        "nav-btn-eligibility": "पात्रता जांचें",
        "ticker-1": '<i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; margin-right: 0.5rem;"></i> <strong>साइबर चेतावनी:</strong> पंजीकरण शुल्क मांगने वाले नकली पीएम किसान पोर्टल सक्रिय हैं। सावधान रहें।',
        "ticker-2": '<i class="fa-solid fa-bullhorn" style="color: var(--primary-light); margin-right: 0.5rem;"></i> <strong>नई योजना:</strong> पीएम सूर्य घर योजना सक्रिय है। सिम्युलेटर में बचत की गणना करें।',
        "ticker-3": '<i class="fa-solid fa-shield-halved" style="color: #3B82F6; margin-right: 0.5rem;"></i> <strong>ग्राम रक्षा:</strong> इस सप्ताह पुणे में 3 घोटाले रोके गए।',
        "hero-badge": "एआई द्वारा संचालित राष्ट्रीय डिजिटल मिशन",
        "hero-title": "अवसर खोजें।<br>सुरक्षित रहें।<br>समुदायों को सशक्त बनाएं।",
        "hero-desc": "ग्रामसाथी एआई भारत के नागरिकों के लिए एक डिजिटल साथी है। तुरंत सरकारी योजनाओं, सब्सिडी और छात्रवृत्ति का पता लगाएं, और खुद को ऑनलाइन धोखाधड़ी से बचाएं।",
        "hero-cta-discover": "अवसर खोजें",
        "hero-cta-scan": "स्कीमशील्ड स्कैन चलाएं",
        "hero-stat-schemes-lbl": "सत्यापित योजनाएं",
        "hero-stat-scams-lbl": "रोके गए घोटाले",
        "hero-stat-villages-lbl": "शामिल ग्राम",
        "hero-radar-title": "ग्रामसाथी इंजन",
        "hero-radar-live": "लाइव रडार",
        "hero-radar-score": "योग्यता स्कोर",
        "hero-radar-found": "योजनाएं मिलीं",
        "hero-radar-val": "अनुमानित मूल्य/वर्ष",
        "problem-badge": "महत्वपूर्ण सुरक्षा चेतावनी",
        "problem-title": "ग्रामीण डिजिटल भारत में दोहरा संकट",
        "problem-desc": "जैसे-जैसे देश डिजिटल अर्थव्यवस्था की ओर बढ़ रहा है, ग्रामीण नागरिकों को जानकारी की कमी और ऑनलाइन वित्तीय धोखाधड़ी जैसे दोहरे संकट का सामना करना पड़ता है।",
        "problem-alert-title": "जानकारी का अभाव बनाम घोटाला वृद्धि",
        "problem-alert-desc": "एक तरफ जानकारी के अभाव में कल्याणकारी लाभ नहीं मिल पाते, तो दूसरी तरफ डिजिटल साक्षरता की कमी के कारण वे ऑनलाइन धोखाधड़ी के शिकार हो जाते हैं।",
        "problem-card1-title": "बिखरे हुए पोर्टल",
        "problem-card1-desc": "कल्याणकारी योजनाएं सैकड़ों अलग-अलग वेबसाइटों पर बिखरी हुई हैं, जिससे इन्हें समझना कठिन हो जाता है।",
        "problem-card2-title": "नकली योजना वेबसाइटें",
        "problem-card2-desc": "पीएम किसान जैसी सब्सिडी के लिए शुल्क मांगने वाली नकली वेबसाइटें बनाई जा रही हैं।",
        "problem-card3-title": "संदेशों के जरिए धोखाधड़ी",
        "problem-card3-desc": "नागरिकों को मुफ्त सोलर या ऋण के नाम पर व्हाट्सएप और एसएमएस पर संदिग्ध लिंक भेजे जा रहे हैं।",
        "gap-badge": "प्रभाव का अंतर",
        "gap-title": "हर दिन गंवाए जा रहे सामाजिक-आर्थिक अवसर",
        "gap-desc": "ग्रामीण उपयोगकर्ताओं द्वारा गंवाए गए लाभ और साइबर सुरक्षा खतरों का सांख्यिकीय विवरण।",
        "gap-card1-lbl": "प्रतिवर्ष दावा न की गई सब्सिडी",
        "gap-card2-lbl": "योजनाओं से अनजान ग्रामीण नागरिक",
        "gap-card3-lbl": "ग्रामीण साइबर धोखाधड़ी में वृद्धि",
        "gap-card4-lbl": "भाषा की बाधा से प्रभावित नागरिक",
        "works-badge": "यह कैसे काम करता है",
        "works-title": "खोज से लेकर लाभ तक का सुरक्षित मार्ग",
        "works-desc": "ग्रामसाथी एआई तीन सरल चरणों में कल्याणकारी योजनाओं की खोज और सुरक्षा जांच को स्वचालित करता है।",
        "works-step1-title": "डिजिटल प्रोफाइल बनाएं",
        "works-step1-desc": "अपनी बुनियादी जानकारी दर्ज करें। आपका डेटा आपके डिवाइस पर पूरी तरह सुरक्षित और एन्क्रिप्टेड रहता है।",
        "works-step2-title": "अवसर रडार चलाएं",
        "works-step2-desc": "हमारा इंजन आपकी जानकारी के अनुसार तुरंत पात्र योजनाओं का मिलान करता है।",
        "works-step3-title": "स्कीमशील्ड से सत्यापित करें",
        "works-step3-desc": "आवेदन करने या लिंक पर क्लिक करने से पहले किसी भी वेबसाइट या संदेश की सत्यता की जांच करें।",
        "discovery-badge": "खोज इंजन",
        "discovery-title": "इंटरैक्टिव अवसर खोजक",
        "discovery-desc": "अपने रडार को अपडेट करने और अपने अनुकूल योजनाओं को देखने के लिए अपना प्रोफाइल विवरण दर्ज करें।",
        "profile-card-title": "जनसांख्यिकीय प्रोफ़ाइल",
        "profile-card-desc": "योजनाओं का मिलान करने के लिए कृपया अपनी जानकारी दर्ज करें",
        "profile-name-lbl": "पूरा नाम",
        "profile-age-lbl": "आयु",
        "profile-occupation-lbl": "व्यवसाय",
        "profile-occ-default": "व्यवसाय चुनें",
        "profile-occ-farmer": "किसान / कृषि",
        "profile-occ-student": "छात्र / शैक्षणिक",
        "profile-occ-seeker": "नौकरी चाहने वाले / बेरोजगार",
        "profile-occ-ent": "छोटा व्यवसाय / उद्यमी",
        "profile-occ-artisan": "कारीगर / बुनकर",
        "profile-occ-retired": "वरिष्ठ नागरिक / सेवानिवृत्त",
        "profile-state-lbl": "राज्य",
        "profile-state-default": "राज्य चुनें",
        "profile-edu-lbl": "शिक्षा",
        "profile-edu-default": "शिक्षा चुनें",
        "profile-edu-none": "निरक्षर / प्राथमिक शिक्षा",
        "profile-edu-sec": "हाई स्कूल (10वीं/12वीं)",
        "profile-edu-grad": "स्नातक / डिग्री धारक",
        "profile-edu-voc": "डिप्लोमा / व्यावसायिक प्रशिक्षण",
        "profile-income-lbl": "मासिक पारिवारिक आय (₹)",
        "profile-land-lbl": "भूमि का स्वामित्व",
        "profile-land-no": "कोई भूमि नहीं है",
        "profile-land-small": "छोटे पैमाने के धारक (< 2 हेक्टेयर)",
        "profile-land-large": "बड़े पैमाने के धारक (> 2 हेक्टेयर)",
        "profile-btn-calc": "अवसर स्कोर की गणना करें",
        "radar-title": "अवसर रडार",
        "radar-desc": "विशिष्ट योजना सिफारिशें देखने के लिए किसी भी श्रेणी पर क्लिक करें",
        "radar-cat-agri": "कृषि",
        "radar-cat-edu": "शिक्षा",
        "radar-cat-health": "स्वास्थ्य सेवा",
        "radar-cat-emp": "रोजगार",
        "radar-cat-ent": "उद्यमशीलता",
        "radar-cat-fin": "वित्त",
        "results-headline-default": "अपना प्रोफ़ाइल पूरा करें",
        "results-subheading-default": "योजनाओं को देखने के लिए जनसांख्यिकीय विवरण सबमिट करें।",
        "results-placeholder": "अभी तक प्रोफ़ाइल की गणना नहीं की गई है। कृपया फॉर्म भरें।",
        "sim-badge": "विकास सिम्युलेटर",
        "sim-title": "भविष्य के प्रभाव का अनुमान",
        "sim-desc": "देखें कि कल्याणकारी योजनाओं में शामिल होने से आपके परिवार की मासिक आय में कितनी वृद्धि हो सकती है।",
        "sim-params-title": "आय के पैरामीटर",
        "sim-params-desc": "मूल आय को समायोजित करें और कल्याणकारी लाभों को सक्रिय करें",
        "sim-base-income-lbl": "मूल मासिक आय",
        "sim-select-schemes": "लागू करने के लिए योजनाएं चुनें",
        "sim-scheme1-name": "पीएम किसान सम्मान निधि",
        "sim-scheme1-amt": "+₹500 / माह (₹6,000/वर्ष)",
        "sim-scheme2-name": "मैट्रिकोत्तर छात्रवृत्ति योजना",
        "sim-scheme2-amt": "+₹1,500 / माह (₹18,000/वर्ष)",
        "sim-scheme3-name": "पीएम कौशल विकास रोजगार प्रशिक्षण",
        "sim-scheme3-amt": "+₹3,500 / माह (औसत आय वृद्धि)",
        "sim-scheme4-name": "पीएम सूर्य घर सौर योजना (बचत)",
        "sim-scheme4-amt": "+₹2,500 / माह (कम हुआ बिजली बिल)",
        "sim-baseline-lbl": "वर्तमान मूल आय",
        "sim-projected-lbl": "अनुमानित आय",
        "sim-chart-x-base": "मूल आय",
        "sim-chart-x-kisan": "पीएम किसान",
        "sim-chart-x-skill": "कौशल विकास",
        "sim-chart-x-solar": "सूर्य सौर",
        "sim-chart-note": "ग्राफ संचयी अनुमान दिखाता है। ये केवल अनुमान हैं।",
        "shield-badge": "साइबर सुरक्षा",
        "shield-title": "स्कीमशील्ड एआई स्कैन",
        "shield-desc": "वेबसाइटों, संदेशों या योजनाओं का मूल्यांकन करें। हमारा एआई धोखाधड़ी के प्रयासों को पहचानता है।",
        "shield-panel-title": "खतरा विश्लेषक",
        "shield-panel-desc": "संदिग्ध वेबसाइट लिंक, संदेश या स्क्रीनशॉट अपलोड करें",
        "shield-tab-url": "वेबसाइट लिंक (URL)",
        "shield-tab-upload": "स्क्रीनशॉट अपलोड करें",
        "shield-tab-message": "एसएमएस / व्हाट्सएप",
        "shield-upload-drag": "स्क्रीनशॉट या योजना पीडीएफ यहां खींचें और छोड़ें",
        "shield-upload-limit": "PNG, JPG, PDF का समर्थन करता है (अधिकतम 5MB)",
        "shield-btn-scan": "सुरक्षा स्कैन चलाएं",
        "shield-idle-title": "प्रणाली सुरक्षित है",
        "shield-idle-desc": "जांच शुरू करने के लिए जानकारी दर्ज करें और 'सुरक्षा स्कैन चलाएं' पर क्लिक करें।",
        "shield-scanning-title": "डोमेन की जांच की जा रही है...",
        "shield-scanning-desc": "संदिग्ध पैटर्न और डोमेन विवरण का विश्लेषण किया जा रहा है...",
        "assistant-badge": "एआई साथी",
        "assistant-title": "ग्रामसाथी एआई से बात करें",
        "assistant-desc": "योजनाओं के बारे में प्रश्न हैं? अपनी स्थानीय भाषाओं में मार्गदर्शन प्राप्त करने के लिए हमारे एआई सहायक का उपयोग करें।",
        "assistant-info-title": "बहुभाषी संवाद",
        "assistant-info-desc": "बातचीत शुरू करने के लिए अपनी भाषा चुनें",
        "chat-name": "ग्रामसाथी साथी",
        "chat-online": "सक्रिय (Online)",
        "chat-voice-enabled": "आवाज सक्रिय",
        "chat-bot-default": "नमस्ते! मैं आपका ग्रामसाथी एआई सहायक हूँ। मुझसे सरकारी योजनाओं या साइबर सुरक्षा के बारे में कुछ भी पूछें।",
        "db-badge": "क्षेत्रीय विश्लेषण",
        "db-title": "ग्राम सूचना डैशबोर्ड",
        "db-desc": "समुदायों के लिए दावा न की गई सब्सिडी, घोटाला अलर्ट और वित्तीय समावेशन स्कोर की जानकारी।",
        "db-card1-title": "दावा न की गई सरकारी सब्सिडी",
        "db-card1-trend": "पिछली तिमाही से 14% की गिरावट",
        "db-card2-title": "साइबर खतरे के अलर्ट",
        "db-card2-trend": "3 सक्रिय घोटाले वाली साइटें पाई गईं",
        "db-card3-title": "वित्तीय समावेशन स्कोर",
        "db-card3-trend": "डिजिटल खातों में 5% की वृद्धि",
        "db-wide-title": "दावा न की गई सब्सिडी का विवरण",
        "db-wide-badge": "ग्राम स्तर का विश्लेषण",
        "map-title": "इंटरैक्टिव जिला भेद्यता एवं अवसर मानचित्र",
        "map-desc": "क्षेत्रीय आंकड़े, बिना दावा वाली सब्सिडी और साइबर अलर्ट देखने के लिए एक क्षेत्र चुनें।",
        "stories-badge": "सामुदायिक प्रभाव",
        "stories-title": "नागरिकों की सफलता की कहानियां",
        "stories-desc": "उन नागरिकों के बारे में पढ़ें जिन्होंने मंच का उपयोग करके सब्सिडी प्राप्त की या धोखाधड़ी से खुद को बचाया।",
        "story1-quote": '"मुझे 90% सौर पंप सब्सिडी देने का दावा करने वाला व्हाट्सएप लिंक मिला। स्कीमशील्ड से जांच करने पर पता चला कि यह एक नकली वेबसाइट है। ग्रामसाथी एआई ने मेरी मेहनत की कमाई बचा ली!"',
        "story1-author-job": "किसान, नासिक जिला",
        "story2-quote": '"छात्रवृत्ति खोजने में हफ़्तों लग जाते थे। ग्रामसाथी एआई ने मेरी प्रोफ़ाइल का विश्लेषण किया और मुझे मराठी में पोस्ट-मैट्रिक योजना की सिफारिश की। अब मुझे छात्रवृत्ति मिल रही है।"',
        "story2-author-job": "स्नातक छात्र, पुणे",
        "story3-quote": '"कपड़े सिलाई का व्यवसाय शुरू करना कठिन था, जब तक मुझे स्टैंड-अप इंडिया योजना की जानकारी नहीं मिली। मैंने बिना किसी सुरक्षा गारंटी के ऋण प्राप्त कर लिया।"',
        "story3-author-job": "महिला उद्यमी, जुन्नर",
        "vision-badge": "राष्ट्रीय दृष्टिकोण",
        "vision-title": "25 करोड़ ग्रामीण परिवारों को सशक्त बनाना",
        "vision-desc": "हमारा दृष्टिकोण ग्रामसाथी एआई को पूरे भारत में फैलाना है, ताकि भ्रष्टाचार मुक्त और सुरक्षित डिजिटल कल्याण नेटवर्क बनाया जा सके।",
        "vision-stat1-lbl": "घोटाला पहचान दर",
        "vision-stat2-lbl": "अनुसूचित भाषाओं का समर्थन",
        "vision-stat3-lbl": "प्रत्यक्ष लाभ सुरक्षा लक्ष्य",
        "vision-btn-discover": "अपनी सब्सिडी पात्रता जांचें",
        "vision-btn-report": "ऑनलाइन घोटाले की रिपोर्ट करें",
        "footer-logo-text": "ग्रामसाथी एआई",
        "footer-desc": "एआई-संचालित अवसर खोज और साइबर सुरक्षा मंच। भारत के ग्रामीण समुदायों को सशक्त बनाने के लिए निर्मित तकनीक।",
        "footer-col-discovery": "खोज पोर्टल",
        "footer-link-farmers": "किसान सब्सिडी",
        "footer-link-scholars": "छात्रवृत्ति खोजक",
        "footer-link-health": "स्वास्थ्य सेवाएं",
        "footer-link-skills": "कौशल प्रशिक्षण कार्यक्रम",
        "footer-col-safety": "साइबर सुरक्षा",
        "footer-link-verify": "लिंक सत्यापन",
        "footer-link-report": "फर्जी पोर्टल की रिपोर्ट करें",
        "footer-link-feeds": "धोखाधड़ी अलर्ट",
        "footer-link-assistant": "डिजिटल साक्षरता सहायक",
        "footer-col-news": "साइबर अलर्ट प्राप्त करें",
        "footer-news-desc": "धोखाधड़ी के नए तरीकों और हाल ही में जारी योजनाओं के बारे में साप्ताहिक अपडेट प्राप्त करें।",
        "footer-news-btn": "जुड़ें",
        "footer-bottom-copy": "&copy; 2026 ग्रामसाथी एआई। राष्ट्रीय डिजिटल गवर्नेंस हैकाथॉन पहल के तहत निर्मित।",
        "footer-policy-privacy": "गोपनीयता नीति",
        "footer-policy-terms": "सेवा की शर्तें",
        "footer-policy-api": "थ्रेट रिपोर्ट एपीआई",
        "modal-title": "ग्रामसाथी एआई पोर्टल",
        "modal-subtitle": "राष्ट्रीय कल्याण सत्यापन प्रमाणपत्र",
        "modal-desc": "यह दस्तावेज़ पात्रता मापदंडों को सत्यापित करता है।",
        "modal-name-lbl": "आवेदक का नाम:",
        "modal-age-lbl": "आयु / लिंग:",
        "modal-occupation-lbl": "व्यवसाय:",
        "modal-region-lbl": "राज्य / जिला:",
        "modal-score-lbl": "अवसर स्कोर:",
        "modal-income-lbl": "मासिक आय:",
        "modal-target-title": "सत्यापित पात्रता लक्ष्य",
        "modal-qr-lbl": "सुरक्षित केवाईसी स्कैन",
        "modal-gov-lbl": "भारत सरकार",
        "modal-agency-lbl": "संज्ञानात्मक कल्याण एजेंसी",
        "modal-status-lbl": "स्थिति: सक्रिय / सत्यापित",
        "modal-btn-print": "प्रिंट / पीडीएफ सहेजें",
        "modal-btn-close": "बंद करें",
        "profile-name-placeholder": "जैसे, रमेश कुमार",
        "profile-age-placeholder": "जैसे, 42",
        "profile-income-placeholder": "जैसे, 12000",
        "shield-url-placeholder": "जैसे, http://pmkisan-subsidy-free.in",
        "shield-text-placeholder": "संदेश सामग्री यहां चिपकाएं...",
        "chat-input-placeholder": "अपना प्रश्न टाइप करें...",
        "footer-news-placeholder": "ईमेल पता दर्ज करें"
    },
    mr: {
        "nav-home": "मुख्यपृष्ठ",
        "nav-problem": "अडचण",
        "nav-opportunities": "संधी",
        "nav-simulator": "सिम्युलेटर",
        "nav-schemeshield": "स्कीमशील्ड",
        "nav-assistant": "एआय सहाय्यक",
        "nav-village-dashboard": "ग्राम माहिती",
        "nav-btn-eligibility": "पात्रता तपासा",
        "ticker-1": '<i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; margin-right: 0.5rem;"></i> <strong>धोका अलर्ट:</strong> बनावट पीएम किसान पोर्टल सध्या लोकांकडून पैसे उकळत आहेत. काळजी घ्या.',
        "ticker-2": '<i class="fa-solid fa-bullhorn" style="color: var(--primary-light); margin-right: 0.5rem;"></i> <strong>नवीन योजना:</strong> पीएम सूर्य घर योजना सुरू झाली आहे. तुमची बचत तपासा.',
        "ticker-3": '<i class="fa-solid fa-shield-halved" style="color: #3B82F6; margin-right: 0.5rem;"></i> <strong>ग्राम सुरक्षा:</strong> या आठवड्यात ३ बनावट लिंक ब्लॉक केल्या आहेत.',
        "hero-badge": "एआय द्वारे संचालित राष्ट्रीय डिजिटल मिशन",
        "hero-title": "संधी शोधा।<br>सुरक्षित राहा।<br>ग्रामीण विकास करा।",
        "hero-desc": "ग्रामसाथी एआय हा भारतीय नागरिकांसाठी एक डिजिटल सोबती आहे. तात्काळ सरकारी योजना, सबसिडी आणि शिष्यवृत्ती शोधा आणि सायबर फसवणुकीपासून सुरक्षित राहा.",
        "hero-cta-discover": "संधी शोधा",
        "hero-cta-scan": "स्कीमशील्ड स्कॅन करा",
        "hero-stat-schemes-lbl": "सत्यापित योजना",
        "hero-stat-scams-lbl": "फसवणूक रोखली",
        "hero-stat-villages-lbl": "नोंदणीकृत गावे",
        "hero-radar-title": "ग्रामसाथी इंजिन",
        "hero-radar-live": "लाईव्ह रडार",
        "hero-radar-score": "पात्रता स्कोर",
        "hero-radar-found": "योजना मिळाल्या",
        "hero-radar-val": "वार्षिक फायदा/वर्ष",
        "problem-badge": "महत्वाची सुरक्षा सूचना",
        "problem-title": "ग्रामीण भागातील डिजिटल दुहेरी संकट",
        "problem-desc": "एकीकडे माहिती अभावी सरकारी योजनांचा लाभ घेता येत नाही, तर दुसरीकडे डिजिटल साक्षरतेच्या अभावामुळे नागरिक ऑनलाईन फसवणुकीचे बळी ठरत आहेत.",
        "problem-alert-title": "माहितीची दरी विरुद्ध सायबर फसवणूक",
        "problem-alert-desc": "लाखो रुपयांचे फायदे माहिती नसण्याने वाया जातात, तर साध्या नागरिकांना बनावट लिंक्स पाठवून ऑनलाईन बँक लुटली जाते.",
        "problem-card1-title": "विखुरलेली माहिती",
        "problem-card1-desc": "कल्याणकारी योजना विविध संकेतस्थळांवर विखुरलेल्या आहेत, ज्यामुळे ग्रामीण जनतेला त्या शोधणे कठीण होते.",
        "problem-card2-title": "बनावट वेबसाईटचा सुळसुळाट",
        "problem-card2-desc": "पीएम किसान किंवा इतर योजनांसाठी थेट पैशांची मागणी करणाऱ्या बनावट वेबसाईट तयार केल्या जात आहेत.",
        "problem-card3-title": "व्हाट्सएप फसवणूक संदेश",
        "problem-card3-desc": "मोफत सोलर किंवा थेट कर्जाच्या आमिषाने व्हाट्सएपवर बनावट लिंक्स पाठवून माहिती चोरली जाते.",
        "gap-badge": "तफावत आणि प्रभाव",
        "gap-title": "दररोज वाया जाणाऱ्या सामाजिक व आर्थिक संधी",
        "gap-desc": "ग्रामीण भागातील नागरिक गमावून बसलेला सरकारी लाभ आणि फसवणुकीची आकडेवारी.",
        "gap-card1-lbl": "दावा न केलेले सरकारी अनुदान (वार्षिक)",
        "gap-card2-lbl": "योजनांविषयी अनभिज्ञ असलेले नागरिक",
        "gap-card3-lbl": "ग्रामीण सायबर फसवणुकीतील वाढ",
        "gap-card4-lbl": "भाषेच्या अडचणीमुळे अडकलेले नागरिक",
        "works-badge": "हे कसे कार्य करते?",
        "works-title": "माहिती मिळवण्यापासून ते लाभापर्यंत सुरक्षित मार्ग",
        "works-desc": "ग्रामसाथी एआय तीन सोप्या टप्प्यात सरकारी योजनांची पात्रता आणि सुरक्षितता तपासायला मदत करते.",
        "works-step1-title": "प्रोफाईल तयार करा",
        "works-step1-desc": "तुमचे वय, व्यवसाय आणि उत्पन्न टाका. तुमची सर्व माहिती पूर्णपणे सुरक्षित राहते.",
        "works-step2-title": "संधी रडार चालवा",
        "works-step2-desc": "आमचे इंजिन तुमच्या प्रोफाईल नुसार योग्य असणाऱ्या सर्व योजनांचे विश्लेषण करते.",
        "works-step3-title": "स्कीमशील्डने तपासा",
        "works-step3-desc": "कोणत्याही वेबसाईटवर क्लिक करण्यापूर्वी किंवा पैसे देण्यापूर्वी त्याची सत्यता तपासा.",
        "discovery-badge": "शोध केंद्र",
        "discovery-title": "योजना जुळवणी सिम्युलेटर",
        "discovery-desc": "पात्र योजनांची यादी पाहण्यासाठी खालील माहिती भरा.",
        "profile-card-title": "वैयक्तिक माहिती",
        "profile-card-desc": "योजना शोधण्यासाठी तुमची माहिती भरा",
        "profile-name-lbl": "पूर्ण नाव",
        "profile-age-lbl": "वय",
        "profile-occupation-lbl": "व्यवसाय",
        "profile-occ-default": "व्यवसाय निवडा",
        "profile-occ-farmer": "शेतकरी / शेती",
        "profile-occ-student": "विद्यार्थी / शिक्षण",
        "profile-occ-seeker": "बेरोजगार / नोकरी शोधक",
        "profile-occ-ent": "लघु व्यावसायिक / उद्योजक",
        "profile-occ-artisan": "कारागीर / विणकर",
        "profile-occ-retired": "ज्येष्ठ नागरिक / निवृत्त",
        "profile-state-lbl": "राज्य",
        "profile-state-default": "राज्य निवडा",
        "profile-edu-lbl": "शिक्षण",
        "profile-edu-default": "शिक्षण निवडा",
        "profile-edu-none": "अशिक्षित / प्राथमिक शिक्षण",
        "profile-edu-sec": "माध्यमिक शिक्षण (10 वी/12 वी)",
        "profile-edu-grad": "पदवीधर",
        "profile-edu-voc": "डिप्लोमा / व्यावसायिक शिक्षण",
        "profile-income-lbl": "मासिक कौटुंबिक उत्पन्न (₹)",
        "profile-land-lbl": "जमीन मालकी",
        "profile-land-no": "जमीन नाही",
        "profile-land-small": "अल्पभूधारक शेतकरी (< २ हेक्टर)",
        "profile-land-large": "मोठे शेतकरी (> २ हेक्टर)",
        "profile-btn-calc": "पात्र योजनांची गणना करा",
        "radar-title": "संधी रडार",
        "radar-desc": "शिफारस केलेल्या योजना पाहण्यासाठी वर्गवारीवर क्लिक करा",
        "radar-cat-agri": "कृषी",
        "radar-cat-edu": "शिक्षण",
        "radar-cat-health": "आरोग्य",
        "radar-cat-emp": "रोजगार",
        "radar-cat-ent": "उद्योजकता",
        "radar-cat-fin": "वित्त पुरवठा",
        "results-headline-default": "प्रोफाईल पूर्ण करा",
        "results-subheading-default": "पात्र योजना पाहण्यासाठी वरील माहिती भरा.",
        "results-placeholder": "अजून कोणतीही माहिती भरलेली नाही. कृपया अर्ज भरा.",
        "sim-badge": "उत्पन्न वाढ सिम्युलेटर",
        "sim-title": "भविष्यातील उत्पन्नाचा अंदाज",
        "sim-desc": "विविध सरकारी योजना लागू केल्यास तुमचे उत्पन्न किती वाढू शकते हे तपासा.",
        "sim-params-title": "उत्पन्नाचे निकष",
        "sim-params-desc": "मूळ उत्पन्न बदला आणि योजना निवडून बदल पहा",
        "sim-base-income-lbl": "सध्याचे मासिक उत्पन्न",
        "sim-select-schemes": "लागू करायच्या योजना निवडा",
        "sim-scheme1-name": "पीएम किसान सम्मान निधि",
        "sim-scheme1-amt": "+₹५०० / महिना (₹६,०००/वर्ष)",
        "sim-scheme2-name": "पोस्ट-मॅट्रिक विद्यार्थी शिष्यवृत्ती",
        "sim-scheme2-amt": "+₹१,५०० / महिना (₹१८,०००/वर्ष)",
        "sim-scheme3-name": "पीएम कौशल्य विकास रोजगार प्रशिक्षण",
        "sim-scheme3-amt": "+₹३,५०० / महिना (अंदाजे वाढ)",
        "sim-scheme4-name": "पीएम सूर्य घर योजना (बचत)",
        "sim-scheme4-amt": "+₹२,५०० / महिना (कमी झालेले वीज बिल)",
        "sim-baseline-lbl": "सध्याचे उत्पन्न",
        "sim-projected-lbl": "अपेक्षित उत्पन्न",
        "sim-chart-x-base": "सध्याचे",
        "sim-chart-x-kisan": "पीएम किसान",
        "sim-chart-x-skill": "कौशल्य विकास",
        "sim-chart-x-solar": "सूर्य सोलर",
        "sim-chart-note": "हा आलेख अंदाजे एकत्रित वाढ दर्शवतो.",
        "shield-badge": "सायबर सुरक्षा",
        "shield-title": "स्कीमशील्ड ऑनलाईन स्कॅन",
        "shield-desc": "कोणताही मेसेज, लिंक किंवा स्क्रीनशॉट टाकून ती खरी आहे की खोटी हे तपासा.",
        "shield-panel-title": "फसवणूक तपासक",
        "shield-panel-desc": "संशयास्पद लिंक टाका किंवा स्क्रीनशॉट अपलोड करा",
        "shield-tab-url": "वेबसाईट लिंक (URL)",
        "shield-tab-upload": "स्क्रीनशॉट टाका",
        "shield-tab-message": "एसएमएस / व्हाट्सॲप",
        "shield-upload-drag": "स्क्रीनशॉट किंवा योजना पीडीएफ फाईल इथे टाका",
        "shield-upload-limit": "PNG, JPG, PDF फाईल (कमाल ५MB)",
        "shield-btn-scan": "सुरक्षा स्कॅन सुरू करा",
        "shield-idle-title": "सिस्टम सुरक्षित आहे",
        "shield-idle-desc": "माहिती टाका आणि 'सुरक्षा स्कॅन सुरू करा' वर क्लिक करा.",
        "shield-scanning-title": "वेबसाईटची पडताळणी सुरू आहे...",
        "shield-scanning-desc": "माहितीची पडताळणी आणि सायबर धोके तपासले जात आहेत...",
        "assistant-badge": "एआय सोबती",
        "assistant-title": "ग्रामसाथी एआय सोबत बोला",
        "assistant-desc": "योजनांविषयी शंका आहेत? आपल्या स्थानिक भाषेत एआय सहाय्यकाकडून माहिती मिळवा.",
        "assistant-info-title": "बहुभाषिक संवाद",
        "assistant-info-desc": "बोलण्यासाठी तुमची भाषा निवडा",
        "chat-name": "ग्रामसाथी सोबती",
        "chat-online": "सक्रिय (Online)",
        "chat-voice-enabled": "आवाज सुरू आहे",
        "chat-bot-default": "नमस्कार! मी तुमचा ग्रामसाथी एआय सहाय्यक आहे. मला सरकारी योजना किंवा सायबर सुरक्षेबद्दल काहीही विचारा.",
        "db-badge": "प्रादेशिक विश्लेषण",
        "db-title": "ग्राम माहिती डॅशबोर्ड",
        "db-desc": "दावा न केलेले सरकारी अनुदान, सायबर फसवणूक अलर्ट आणि डिजिटल प्रगतीचा अहवाल.",
        "db-card1-title": "दावा न केलेले सरकारी अनुदान",
        "db-card1-trend": "गेल्या तिमाहीपेक्षा १४% घट",
        "db-card2-title": "सायबर धोका अलर्ट",
        "db-card2-trend": "३ फसव्या वेबसाईट कार्यरत आहेत",
        "db-card3-title": "डिजिटल साक्षरता स्कोर",
        "db-card3-trend": "बँक खात्यांमध्ये ५% वाढ",
        "db-wide-title": "सुटलेल्या अनुदानाचा तपशील",
        "db-wide-badge": "ग्राम पातळीवरील विश्लेषण",
        "map-title": "प्रादेशिक सायबर सुरक्षा व संधी आलेख",
        "map-desc": "प्रादेशिक अहवाल पाहण्यासाठी नकाशावर जिल्हा निवडा.",
        "stories-badge": "गावातील बदल",
        "stories-title": "नागरिकांचे अनुभव",
        "stories-desc": "ग्रामसाथी एआय वापरून सायबर फसवणूक रोखलेल्या नागरिकांचे अनुभव.",
        "story1-quote": '"मला व्हाट्सॲपवर ९०% सोलर पंपाच्या अनुदानाची लिंक आली होती. ₹१,५०० भरण्यापूर्वी मी ती स्कीमशील्डवर तपासली, तर ती बनावट निघाली. माझे पैसे वाचले!"',
        "story1-author-job": "शेतकरी, नाशिक जिल्हा",
        "story2-quote": '"शिष्यवृत्ती शोधायला पूर्वी खूप फिरावे लागायचे. ग्रामसाथीने माझा प्रोफाईल बघून मला पोस्ट-मॅट्रिक शिष्यवृत्ती सुचवली. आता मला पैसे मिळत आहेत."',
        "story2-author-job": "महाविद्यालयीन विद्यार्थी, पुणे",
        "story3-quote": '"शिवणकाम व्यवसाय सुरू करायचा होता पण कर्ज मिळत नव्हते. या पोर्टलमुळे मला स्टँड-अप इंडिया योजनेची माहिती मिळाली आणि शून्य हमीवर कर्ज मिळाले."',
        "story3-author-job": "महिला उद्योजक, जुन्नर",
        "vision-badge": "राष्ट्रीय ध्येय",
        "vision-title": "२५ कोटी ग्रामीण कुटुंबांचे सक्षमीकरण",
        "vision-desc": "आमचे ध्येय ग्रामसाथी एआय भारताच्या प्रत्येक ग्रामपंचायतीमध्ये पोहोचवण्याचे आहे जेणेकरून भ्रष्टाचारमुक्त डिजिटल व्यवस्था निर्माण होईल.",
        "vision-stat1-lbl": "फसवणूक ओळखण्याचा दर",
        "vision-stat2-lbl": "स्थानिक भाषांचे समर्थन",
        "vision-stat3-lbl": "सुरक्षित थेट लाभ ध्येय",
        "vision-btn-discover": "पात्र योजना तपासा",
        "vision-btn-report": "ऑनलाईन फसवणुकीची तक्रार करा",
        "footer-logo-text": "ग्रामसाथी एआय",
        "footer-desc": "एआय-चालित संधी शोध व सायबर सुरक्षा मंच. ग्रामीण जनतेला आर्थिकदृष्ट्या सक्षम करण्यासाठी बनवलेले तंत्रज्ञान.",
        "footer-col-discovery": "योजना पोर्टल",
        "footer-link-farmers": "शेतकरी अनुदान",
        "footer-link-scholars": "शिष्यवृत्ती शोधक",
        "footer-link-health": "आरोग्य सेवा योजना",
        "footer-link-skills": "कौशल्य विकास कार्यक्रम",
        "footer-col-safety": "सायबर सुरक्षा",
        "footer-link-verify": "लिंक पडताळणी",
        "footer-link-report": "बनावट वेबसाईट तक्रार",
        "footer-link-feeds": "फसवणूक अलर्ट",
        "footer-link-assistant": "डिजिटल साक्षरता मदत",
        "footer-col-news": "सायबर अलर्ट मिळवा",
        "footer-news-desc": "फसवणुकीचे नवीन प्रकार आणि सरकारी योजनांविषयी दर आठवड्याला माहिती मिळवा.",
        "footer-news-btn": "सामील व्हा",
        "footer-bottom-copy": "&copy; 2026 ग्रामसाथी एआय. राष्ट्रीय डिजिटल गर्व्हनन्स हैकाथॉन अंतर्गत विकसित.",
        "footer-policy-privacy": "गोपनीयता धोरण",
        "footer-policy-terms": "वापरण्याच्या अटी",
        "footer-policy-api": "तक्रार एपीआय",
        "modal-title": "ग्रामसाथी एआय पोर्टल",
        "modal-subtitle": "राष्ट्रीय कल्याण पडताळणी प्रमाणपत्र",
        "modal-desc": "हे प्रमाणपत्र तुमच्या पात्रता निकषांची पडताळणी करते.",
        "modal-name-lbl": "अर्जदाराचे नाव:",
        "modal-age-lbl": "वय / लिंग:",
        "modal-occupation-lbl": "व्यवसाय:",
        "modal-region-lbl": "राज्य / जिल्हा:",
        "modal-score-lbl": "पात्रता स्कोर:",
        "modal-income-lbl": "मासिक उत्पन्न:",
        "modal-target-title": "पात्र ठरलेली योजना",
        "modal-qr-lbl": "सुरक्षित केवायसी स्कॅन",
        "modal-gov-lbl": "भारत सरकार",
        "modal-agency-lbl": "कल्याणकारी योजना विभाग",
        "modal-status-lbl": "स्थिती: सक्रिय / सत्यापित",
        "modal-btn-print": "प्रिंट करा / पीडीएफ बनवा",
        "modal-btn-close": "बंद करा",
        "profile-name-placeholder": "उदा., रमेश कुमार",
        "profile-age-placeholder": "उदा., ४२",
        "profile-income-placeholder": "उदा., १२०००",
        "shield-url-placeholder": "उदा., http://pmkisan-subsidy-free.in",
        "shield-text-placeholder": "संदेश इथे कॉपी करा...",
        "chat-input-placeholder": "तुमचा प्रश्न विचारा...",
        "footer-news-placeholder": "ईमेल पत्ता टाका"
    },
    ta: {
        "nav-home": "முகப்பு",
        "nav-problem": "பிரச்சனை",
        "nav-opportunities": "வாய்ப்புகள்",
        "nav-simulator": "சிமுலேட்டர்",
        "nav-schemeshield": "ஸ்கீம்ஷீல்ட்",
        "nav-assistant": "AI உதவியாளர்",
        "nav-village-dashboard": "கிராமத் தரவு",
        "nav-btn-eligibility": "தகுதி சரிபார்",
        "ticker-1": '<i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; margin-right: 0.5rem;"></i> <strong>எச்சரிக்கை:</strong> போலி பிஎம் கிசான் இணையதளங்கள் குறித்து எச்சரிக்கையாக இருக்கவும்.',
        "ticker-2": '<i class="fa-solid fa-bullhorn" style="color: var(--primary-light); margin-right: 0.5rem;"></i> <strong>புதிய திட்டம்:</strong> பிஎம் சூர்ய கர் திட்டம் நேரலையில் உள்ளது.',
        "ticker-3": '<i class="fa-solid fa-shield-halved" style="color: #3B82F6; margin-right: 0.5rem;"></i> <strong>கிராம காப்பு:</strong> இந்த வாரம் 3 போலி இணைப்புகள் முடக்கப்பட்டன.',
        "hero-badge": "AI ஆல் இயக்கப்படும் தேசிய டிஜிட்டல் பணி",
        "hero-title": "வாய்ப்புகளைக் கண்டறிவோம்.<br>பாதுகாப்பாக இருப்போம்.<br>சமூகங்களை மேம்படுத்துவோம்.",
        "hero-desc": "கிராம்சதி AI என்பது இந்திய குடிமக்களுக்கான டிஜிட்டல் தோழன். அரசு திட்டங்களை கண்டறிந்து, ஆன்லைன் மோசடிகளில் இருந்து உங்களை பாதுகாக்கவும்.",
        "hero-cta-discover": "வாய்ப்புகளை கண்டறியவும்",
        "hero-cta-scan": "ஸ்கீம்ஷீல்ட் ஸ்கேன் இயக்கு",
        "hero-stat-schemes-lbl": "சரிபார்க்கப்பட்ட திட்டங்கள்",
        "hero-stat-scams-lbl": "தடுக்கப்பட்ட மோசடிகள்",
        "hero-stat-villages-lbl": "இணைக்கப்பட்ட கிராமங்கள்",
        "hero-radar-title": "கிராம்சதி என்ஜின்",
        "hero-radar-live": "நேரலை ரேடார்",
        "hero-radar-score": "பொருத்த மதிப்பெண்",
        "hero-radar-found": "திட்டங்கள் கண்டறியப்பட்டன",
        "hero-radar-val": "மதிப்பிடப்பட்ட மதிப்பு/ஆண்டு",
        "problem-badge": "முக்கிய பாதுகாப்பு எச்சரிக்கை",
        "problem-title": "கிராமப்புற டிஜிட்டல் இந்தியாவின் இருமுனை நெருக்கடி",
        "problem-desc": "ஒரே நேரத்தில் அரசு திட்டங்கள் பற்றிய விழிப்புணர்வு இல்லாமையும், டிஜிட்டல் அறியாமையால் ஆன்லைன் பண மோசடிகளில் ஏமாறுவதும் கிராம மக்களுக்கு பெரும் சவாலாக உள்ளது.",
        "problem-alert-title": "தகவல் இடைவெளி மற்றும் மோசடி பெருக்கம்",
        "problem-alert-desc": "தகவல் கிடைக்காமல் அரசு சலுகைகள் வீணாகின்றன; அதே நேரத்தில் போலி செய்திகளால் மக்கள் பணத்தை இழக்கிறார்கள்.",
        "problem-card1-title": "சிதறிய போர்ட்டல்கள்",
        "problem-card1-desc": "அரசு திட்டங்கள் பல நூறு வெப்சைட்களில் சிதறிக் கிடப்பதால் மக்கள் குழப்பமடைகிறார்கள்.",
        "problem-card2-title": "போலி வெப்சைட்டுகள்",
        "problem-card2-desc": "பிஎம் கிசான் போல போலி முகவரி உருவாக்கி மக்களிடம் கட்டணம் வசூலிக்கும் போலி தளங்கள்.",
        "problem-card3-title": "வாட்ஸ்அப் மோசடி செய்திகள்",
        "problem-card3-desc": "இலவச சோலார் பம்ப் அல்லது எளிதான லோன் தருவதாக ஆசை காட்டும் வாட்ஸ்அப் போலி லிங்க்குகள்.",
        "gap-badge": "இழப்பு இடைவெளி",
        "gap-title": "தினமும் நாம் இழக்கும் சமூக-பொருளாதார வாய்ப்புகள்",
        "gap-desc": "விழிப்புணர்வு இல்லாததால் பெறாத நலத்திட்ட உதவிகள் மற்றும் மோசடி குறித்த புள்ளிவிவரங்கள்.",
        "gap-card1-lbl": "கோரப்படாத நலத்திட்ட நிதிகள் (ஆண்டுக்கு)",
        "gap-card2-lbl": "திட்டங்கள் பற்றி தெரியாத கிராம மக்கள்",
        "gap-card3-lbl": "கிராமப்புற சைபர் மோசடி அதிகரிப்பு",
        "gap-card4-lbl": "மொழி தடையால் பாதிக்கப்பட்ட மக்கள்",
        "works-badge": "இது எப்படி வேலை செய்கிறது?",
        "works-title": "பாதுகாப்பான முறையில் திட்டங்களின் பலனை பெறுக",
        "works-desc": "கிராம்சதி AI மூன்று எளிய படிகளில் திட்டங்களை கண்டறிந்து பாதுகாப்பு சோதனையை வழங்குகிறது.",
        "works-step1-title": "டிஜிட்டல் சுயவிவரம்",
        "works-step1-desc": "உங்களது வயது, தொழில், வருமானம் ஆகியவற்றை உள்ளிடவும். உங்கள் தரவு பாதுகாப்பாக இருக்கும்.",
        "works-step2-title": "வாய்ப்பு ரேடார் இயக்கு",
        "works-step2-desc": "உங்களது சுயவிவரத்தின்படி தகுதியான திட்டங்களை எங்கள் என்ஜின் உடனடியாக பட்டியலிடும்.",
        "works-step3-title": "ஸ்கீம்ஷீல்டில் சரிபார்",
        "works-step3-desc": "இணையதளத்தை கிளிக் செய்யும் முன் அல்லது பணம் செலுத்தும் முன் அதன் உண்மையை சரிபார்க்கவும்.",
        "discovery-badge": "கண்டறியும் என்ஜின்",
        "discovery-title": "திட்ட பொருத்த கருவி",
        "discovery-desc": "உங்களது தகுதியை கணக்கிட சுயவிவரத்தை நிரப்பவும்.",
        "profile-card-title": "மக்கள்தொகை சுயவிவரம்",
        "profile-card-desc": "பொருத்தங்களை கண்டறிய உங்களது விவரங்களை உள்ளிடவும்",
        "profile-name-lbl": "முழு பெயர்",
        "profile-age-lbl": "வயது",
        "profile-occupation-lbl": "தொழில்",
        "profile-occ-default": "தொழிலை தேர்ந்தெடுக்கவும்",
        "profile-occ-farmer": "விவசாயி / விவசாயம்",
        "profile-occ-student": "மாணவர் / கல்வி சார்ந்த",
        "profile-occ-seeker": "வேலை தேடுபவர் / வேலையில்லாதவர்",
        "profile-occ-ent": "சிறு தொழில் / தொழில்முனைவோர்",
        "profile-occ-artisan": "கைவினைஞர் / நெசவாளர்",
        "profile-occ-retired": "முதியோர் / ஓய்வு பெற்றவர்",
        "profile-state-lbl": "மாநிலம்",
        "profile-state-default": "மாநிலத்தை தேர்ந்தெடுக்கவும்",
        "profile-edu-lbl": "கல்வி தகுதி",
        "profile-edu-default": "கல்வியை தேர்ந்தெடுக்கவும்",
        "profile-edu-none": "படிக்காதவர் / ஆரம்ப கல்வி",
        "profile-edu-sec": "உயர்நிலை பள்ளி (10வது/12வது)",
        "profile-edu-grad": "பட்டதாரி",
        "profile-edu-voc": "டிப்ளமோ / தொழிற்கல்வி",
        "profile-income-lbl": "மாதாந்திர குடும்ப வருமானம் (₹)",
        "profile-land-lbl": "நில உரிமை",
        "profile-land-no": "நிலம் இல்லை",
        "profile-land-small": "சிறு குறு விவசாயி (< 2 ஹெக்டேர்)",
        "profile-land-large": "பெரிய விவசாயி (> 2 ஹெக்டேர்)",
        "profile-btn-calc": "பொருத்த வாய்ப்பை கணக்கிடு",
        "radar-title": "வாய்ப்பு ரேடார்",
        "radar-desc": "பரிந்துரைக்கப்பட்ட திட்டங்களை காண பிரிவுகளை கிளிக் செய்யவும்",
        "radar-cat-agri": "விவசாயம்",
        "radar-cat-edu": "கல்வி",
        "radar-cat-health": "சுகாதாரம்",
        "radar-cat-emp": "வேலைவாய்ப்பு",
        "radar-cat-ent": "தொழில்முனைவு",
        "radar-cat-fin": "நிதி உதவி",
        "results-headline-default": "விவரங்களை பூர்த்தி செய்யவும்",
        "results-subheading-default": "தகுதியான திட்டங்களைக் காண சுயவிவரத்தை சமர்ப்பிக்கவும்.",
        "results-placeholder": "சுயவிவரம் எதுவும் இன்னும் கணக்கிடப்படவில்லை.",
        "sim-badge": "வருமான சிமுலேட்டர்",
        "sim-title": "வருமான வளர்ச்சி மதிப்பீடு",
        "sim-desc": "அரசு திட்டங்கள் மூலம் உங்கள் குடும்ப வருமானம் எவ்வாறு உயரக்கூடும் என்பதை கணக்கிடுங்கள்.",
        "sim-params-title": "வருமான அளவுருக்கள்",
        "sim-params-desc": "வருமானத்தை மாற்றி திட்டங்களை தேர்வு செய்து பார்க்கவும்",
        "sim-base-income-lbl": "அடிப்படை மாத வருமானம்",
        "sim-select-schemes": "திட்டங்களை தேர்வு செய்க",
        "sim-scheme1-name": "பிஎம் கிசான் சம்மான் நிதி",
        "sim-scheme1-amt": "+₹500 / மாதம் (ஆண்டுக்கு ₹6,000)",
        "sim-scheme2-name": "மாணவர் கல்வி உதவித்தொகை",
        "sim-scheme2-amt": "+₹1,500 / மாதம் (ஆண்டுக்கு ₹18,000)",
        "sim-scheme3-name": "பிஎம் திறன் மேம்பாட்டு பயிற்சி",
        "sim-scheme3-amt": "+₹3,500 / மாதம் (சராசரி உயர்வு)",
        "sim-scheme4-name": "பிஎம் சூர்ய கர் சோலார் திட்டம் (சேமிப்பு)",
        "sim-scheme4-amt": "+₹2,500 / மாதம் (குறைந்த மின் கட்டணம்)",
        "sim-baseline-lbl": "தற்போதைய வருமானம்",
        "sim-projected-lbl": "எதிர்பார்க்கும் வருமானம்",
        "sim-chart-x-base": "அடிப்படை",
        "sim-chart-x-kisan": "பிஎம் கிசான்",
        "sim-chart-x-skill": "திறன் பயிற்சி",
        "sim-chart-x-solar": "சோலார் திட்டம்",
        "sim-chart-note": "இந்த வரைபடம் கூட்டு திட்ட மதிப்பீட்டை காட்டுகிறது.",
        "shield-badge": "சைபர் பாதுகாப்பு",
        "shield-title": "ஸ்கீம்ஷீல்ட் சைபர் ஸ்கேன்",
        "shield-desc": "இணையதள லிங்க்குகள் அல்லது மெசேஜ்களை போட்டு அதன் உண்மைத்தன்மையை ஆராயுங்கள்.",
        "shield-panel-title": "மோசடி பகுப்பாய்வு",
        "shield-panel-desc": "சந்தேகத்திற்குரிய லிங்க்குகள் அல்லது மெசேஜ்களை உள்ளிடவும்",
        "shield-tab-url": "இணையதள முகவரி (URL)",
        "shield-tab-upload": "ஸ்கிரீன்ஷாட் பதிவேற்று",
        "shield-tab-message": "எஸ்எம்எஸ் / வாட்ஸ்அப்",
        "shield-upload-drag": "இங்கு கோப்புகளை இழுத்து போடவும்",
        "shield-upload-limit": "PNG, JPG, PDF ஐ ஆதரிக்கிறது (அதிகபட்சம் 5MB)",
        "shield-btn-scan": "பாதுகாப்பு ஸ்கேன் இயக்கு",
        "shield-idle-title": "பாதுகாப்பான நிலை",
        "shield-idle-desc": "விவரங்களை பதிவிட்டு 'பாதுகாப்பு ஸ்கேன் இயக்கு' என்பதை அழுத்தவும்.",
        "shield-scanning-title": "சரிபார்க்கப்படுகிறது...",
        "shield-scanning-desc": "பாதுகாப்பு அச்சுறுத்தல்கள் மற்றும் போலி வடிவங்கள் பகுப்பாய்வு செய்யப்படுகின்றன...",
        "assistant-badge": "AI துணைவர்",
        "assistant-title": "கிராம்சதி AI-உடன் பேசுங்கள்",
        "assistant-desc": "கேள்விகள் உள்ளதா? எங்களது பன்மொழி உதவியாளருடன் உங்கள் சொந்த மொழியிலேயே உரையாடுங்கள்.",
        "assistant-info-title": "பன்மொழி உரையாடல்",
        "assistant-info-desc": "உரையாடலைத் தொடங்க உங்கள் மொழியைத் தேர்வு செய்யவும்",
        "chat-name": "கிராம்சதி துணைவர்",
        "chat-online": "நேரலையில் (Online)",
        "chat-voice-enabled": "குரல் வசதி இயக்கப்பட்டது",
        "chat-bot-default": "வணக்கம்! நான் உங்கள் கிராம்சதி AI உதவியாளர். திட்டங்கள் அல்லது சைபர் பாதுகாப்பு குறித்து எதையும் கேளுங்கள்.",
        "db-badge": "பிராந்திய பகுப்பாய்வு",
        "db-title": "கிராம நுண்ணறிவு தகவல் பலகை",
        "db-desc": "கோரப்படாத திட்ட நிதி, சைபர் மோசடிகள் மற்றும் பிராந்திய நிதி நிலவரம் குறித்த புள்ளிவிவரங்கள்.",
        "db-card1-title": "கோரப்படாத அரசு மானியங்கள்",
        "db-card1-trend": "கடந்த காலாண்டை விட 14% சரிவு",
        "db-card2-title": "சைபர் அச்சுறுத்தல் எச்சரிக்கைகள்",
        "db-card2-trend": "3 மோசடி இணையதளங்கள் கண்டறியப்பட்டன",
        "db-card3-title": "டிஜிட்டல் நிதி சேர்க்கை விகிதம்",
        "db-card3-trend": "வங்கி கணக்குகள் 5% அதிகரிப்பு",
        "db-wide-title": "கோரப்படாத மானியங்களின் விவரம்",
        "db-wide-badge": "கிராம அளவிலான பகுப்பாய்வு",
        "map-title": "ஊடாடும் மாவட்ட பாதிப்பு மற்றும் வாய்ப்பு வரைபடம்",
        "map-desc": "தரவுகளை சரிபார்க்க ஒரு மாவட்டத்தை தேர்வு செய்யவும்.",
        "stories-badge": "கிராம மாற்றங்கள்",
        "stories-title": "பயனாளர்களின் வெற்றிக் கதைகள்",
        "stories-desc": "எங்கள் போர்ட்டல் மூலம் பயனடைந்த மற்றும் மோசடியில் இருந்து தப்பிய மக்களின் கதைகள்.",
        "story1-quote": '"எனக்கு வாட்ஸ்அப்பில் 90% சோலார் மானியம் தருவதாக லிங்க் வந்தது. முன்பணமாக ₹1,500 கட்ட கேட்டார்கள். ஸ்கீம்ஷீல்டில் செக் செய்தபோது அது போலி தளம் என தெரிந்தது. என் பணம் தப்பியது!"',
        "story1-author-job": "விவசாயி, நாசிக் மாவட்டம்",
        "story2-quote": '"ஸ்காலர்ஷிப் பெற அலைந்து திரிந்த காலம் போய், கிராம்சதி எனது சுயவிவரத்தை ஆராய்ந்து சரியான திட்டத்தை காட்டியது. தற்போது உதவித்தொகை பெறுகிறேன்."',
        "story2-author-job": "கல்லூரி மாணவி, புனே",
        "story3-quote": '"தையல் கடை வைக்க பணம் தேவைப்பட்ட போது ஸ்டாண்ட்-அப் இந்தியா திட்டம் பற்றி தெரியவந்தது. எவ்வித பிணையும் இன்றி முத்ரா கடன் பெற்றேன்."',
        "story3-author-job": "பெண் தொழில்முனைவோர், ஜுன்னார்",
        "vision-badge": "தேசிய தொலைநோக்கு",
        "vision-title": "25 கோடி கிராமப்புற குடும்பங்களை மேம்படுத்துதல்",
        "vision-desc": "கிராம்சதி AI-யை இந்திய கிராமங்கள் தோறும் கொண்டு சேர்த்து, ஊழலற்ற மற்றும் பாதுகாப்பான டிஜிட்டல் அமைப்பை உருவாக்குவதே எங்களது இலக்கு.",
        "vision-stat1-lbl": "மோசடி கண்டறிதல் விகிதம்",
        "vision-stat2-lbl": "உள்ளூர் மொழிகள் ஆதரவு",
        "vision-stat3-lbl": "பாதுகாப்பான நேரடி பலன் இலக்கு",
        "vision-btn-discover": "மானிய தகுதியை சரிபார்க்க",
        "vision-btn-report": "மோசடியை புகாரளிக்க",
        "footer-logo-text": "கிராம்சதி AI",
        "footer-desc": "AI-ஆல் இயக்கப்படும் திட்ட கண்டறிதல் மற்றும் சைபர் பாதுகாப்பு தளம். கிராம மக்களின் முன்னேற்றத்திற்காக உருவாக்கப்பட்ட தொழில்நுட்பம்.",
        "footer-col-discovery": "திட்டங்கள்",
        "footer-link-farmers": "விவசாய மானியங்கள்",
        "footer-link-scholars": "கல்வி உதவித்தொகை",
        "footer-link-health": "சுகாதார திட்டங்கள்",
        "footer-link-skills": "திறன் மேம்பாட்டு பயிற்சிகள்",
        "footer-col-safety": "சைபர் பாதுகாப்பு",
        "footer-link-verify": "இணைப்பு சரிபார்ப்பு",
        "footer-link-report": "போலி வெப்சைட் புகார்",
        "footer-link-feeds": "மோசடி எச்சரிக்கைகள்",
        "footer-link-assistant": "டிஜிட்டல் அறிவு உதவி",
        "footer-col-news": "பாதுகாப்பு செய்திகள்",
        "footer-news-desc": "புதிய மோசடிகள் மற்றும் அரசு திட்டங்கள் குறித்த வாராந்திர செய்திகளை பெற இணைந்திடுங்கள்.",
        "footer-news-btn": "இணையுங்கள்",
        "footer-bottom-copy": "&copy; 2026 கிராம்சதி AI. தேசிய டிஜிட்டல் ஆளுமை ஹேக்கத்தான் கீழ் உருவாக்கப்பட்டது.",
        "footer-policy-privacy": "தனியுரிமைக் கொள்கை",
        "footer-policy-terms": "பயன்பாட்டு விதிகள்",
        "footer-policy-api": "புகார் அளிக்கும் API",
        "modal-title": "கிராம்சதி AI போர்டல்",
        "modal-subtitle": "தேசிய நலத்திட்ட சரிபார்ப்பு சான்றிதழ்",
        "modal-desc": "இந்த சான்றிதழ் உங்களது தகுதிகளை உறுதிப்படுத்துகிறது.",
        "modal-name-lbl": "விண்ணப்பதாரர் பெயர்:",
        "modal-age-lbl": "வயது / பாலினம்:",
        "modal-occupation-lbl": "தொழில்:",
        "modal-region-lbl": "மாநிலம் / மாவட்டம்:",
        "modal-score-lbl": "தகுதி மதிப்பெண்:",
        "modal-income-lbl": "மாத வருமானம்:",
        "modal-target-title": "தகுதிபெற்ற திட்டம்",
        "modal-qr-lbl": "பாதுகாப்பான கேஒய்சி ஸ்கேன்",
        "modal-gov-lbl": "இந்திய அரசு",
        "modal-agency-lbl": "நலத்திட்ட சரிபார்ப்பு துறை",
        "modal-status-lbl": "நிலை: செயல்பாட்டில் உள்ளது / சரிபார்க்கப்பட்டது",
        "modal-btn-print": "அச்சிடுக / PDF சேமி",
        "modal-btn-close": "மூடுக",
        "profile-name-placeholder": "எ.கா. ரமேஷ் குமார்",
        "profile-age-placeholder": "எ.கா. 42",
        "profile-income-placeholder": "எ.கா. 12000",
        "shield-url-placeholder": "எ.கா. http://pmkisan-subsidy-free.in",
        "shield-text-placeholder": "மெசேஜை இங்கு நகலெடுக்கவும்...",
        "chat-input-placeholder": "உங்கள் கேள்வியை கேட்க...",
        "footer-news-placeholder": "மின்னஞ்சல் முகவரியை உள்ளிடவும்"
    },
    te: {
        "nav-home": "హోమ్",
        "nav-problem": "సమస్య",
        "nav-opportunities": "అవకాశాలు",
        "nav-simulator": "సిమ్యులేటర్",
        "nav-schemeshield": "స్కీమ్‌షీల్డ్",
        "nav-assistant": "AI అసిస్టెంట్",
        "nav-village-dashboard": "గ్రామ సమాచారం",
        "nav-btn-eligibility": "అర్హత తనిఖీ",
        "ticker-1": '<i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; margin-right: 0.5rem;"></i> <strong>సైబర్ హెచ్చరిక:</strong> నకిలీ పీఎం కిసాన్ వెబ్‌సైట్ల పట్ల అప్రమత్తంగా ఉండండి.',
        "ticker-2": '<i class="fa-solid fa-bullhorn" style="color: var(--primary-light); margin-right: 0.5rem;"></i> <strong>కొత్త పథకం:</strong> పీఎం సూర్య ఘర్ సోలార్ పథకం ప్రారంభమైంది.',
        "ticker-3": '<i class="fa-solid fa-shield-halved" style="color: #3B82F6; margin-right: 0.5rem;"></i> <strong>గ్రామ రక్షణ:</strong> ఈ వారం 3 నకిలీ లింకులు నిలిపివేయబడ్డాయి.',
        "hero-badge": "AI ద్వారా నడిచే జాతీయ డిజిటల్ మిషన్",
        "hero-title": "అవకాశాలను అన్వేషించండి.<br>సురక్షితంగా ఉండండి.<br>గ్రామీణ వికాసం సాధించండి.",
        "hero-desc": "గ్రామ్‌సథి AI భారతీయ పౌరుల కోసం ఒక డిజిటల్ తోడు. ప్రభుత్వ పథకాలను అన్వేషించండి మరియు ఆన్‌లైన్ మోసాల నుండి మిమ్మల్ని రక్షించుకోండి.",
        "hero-cta-discover": "అవకాశాలను కనుగొనండి",
        "hero-cta-scan": "స్కీమ్‌షీల్డ్ స్కాన్ చేయండి",
        "hero-stat-schemes-lbl": "ధృవీకరించబడిన పథకాలు",
        "hero-stat-scams-lbl": "అరికట్టిన మోసాలు",
        "hero-stat-villages-lbl": "నమోదైన గ్రామాలు",
        "hero-radar-title": "గ్రామ్‌సథి ఇంజన్",
        "hero-radar-live": "లైవ్ రేడార్",
        "hero-radar-score": "అర్హత స్కోరు",
        "hero-radar-found": "పథకాలు కనుగొనబడ్డాయి",
        "hero-radar-val": "అంచనా విలువ/సంవత్సరం",
        "problem-badge": "ముఖ్యమైన భద్రతా హెచ్చరిక",
        "problem-title": "గ్రామీణ డిజిటల్ ఇండియాలో రెండంచుల సంక్షోభం",
        "problem-desc": "ఒకవైపు సమాచారం లేకపోవడం వల్ల ప్రభుత్వ లబ్ధి పొందలేకపోతున్నారు, మరోవైపు డిజిటల్ అక్షరాస్యత లేకపోవడం వల్ల ఆన్‌లైన్ మోసాలకు గురవుతున్నారు.",
        "problem-alert-title": "సమాచార లోపం వర్సెస్ సైబర్ మోసాలు",
        "problem-alert-desc": "సమాచారం అందకపోవడం వల్ల సంక్షేమ పథకాలు వృధా అవుతున్నాయి; అదే సమయంలో నకిలీ వార్తలతో ప్రజలు నష్టపోతున్నారు.",
        "problem-card1-title": "వికీర్ణమైన పోర్టల్స్",
        "problem-card1-desc": "పథకాలు వందలాది ప్రభుత్వ వెబ్‌సైట్లలో వికీర్ణమై ఉండటం వల్ల ప్రజలు గందరగోళానికి గురవుతున్నారు.",
        "problem-card2-title": "నకిలీ వెబ్‌సైట్లు",
        "problem-card2-desc": "పీఎం కిసాన్ పేరుతో ఫీజులు వసూలు చేసే నకిలీ వెబ్‌సైట్లు సృష్టించబడుతున్నాయి.",
        "problem-card3-title": "వాట్సాప్ మోసపూరిత సందేశాలు",
        "problem-card3-desc": "ఉచిత సోలార్ పంపులు లేదా సులభమైన రుణాల పేరుతో వచ్చే నకిలీ లింకులు.",
        "gap-badge": "నష్ట పరిమాణం",
        "gap-title": "ప్రతిరోజూ మనం కోల్పోతున్న సామాజిక-ఆర్థిక అవకాశాలు",
        "gap-desc": "అవగాహన లేకపోవడం వల్ల లబ్ధి పొందని పథకాలు మరియు మోసాల గణాంకాలు.",
        "gap-card1-lbl": "దావా చేయని సంక్షేమ నిధులు (సంవత్సరానికి)",
        "gap-card2-lbl": "పథకాల గురించి తెలియని గ్రామీణ ప్రజలు",
        "gap-card3-lbl": "గ్రామీణ సైబర్ మోసాల పెరుగుదల",
        "gap-card4-lbl": "భాషా సమస్య వల్ల నష్టపోతున్న ప్రజలు",
        "works-badge": "ఇది ఎలా పనిచేస్తుంది?",
        "works-title": "సురక్షితమైన మార్గంలో పథకాల లబ్ధి పొందండి",
        "works-desc": "గ్రామ్‌సథి AI మూడు సులభమైన దశలలో పథకాలను కనుగొని రక్షణ కల్పిస్తుంది.",
        "works-step1-title": "డిజిటల్ ప్రొఫైల్",
        "works-step1-desc": "మీ వయస్సు, వృత్తి, ఆదాయ వివరాలు నమోదు చేయండి. మీ సమాచారం భద్రంగా ఉంటుంది.",
        "works-step2-title": "అవకాశ రేడార్ రన్ చేయండి",
        "works-step2-desc": "మీ వివరాల ఆధారంగా తగిన పథకాలను మా ఇంజన్ తక్షణమే చూపిస్తుంది.",
        "works-step3-title": "స్కీమ్‌షీల్డ్ తనిఖీ",
        "works-step3-desc": "ఏదైనా లింక్ క్లిక్ చేసే ముందు లేదా డబ్బులు చెల్లించే ముందు దాని నిజాయితీని ధృవీకరించుకోండి.",
        "discovery-badge": "డిస్కవరీ ఇంజన్",
        "discovery-title": "పథకాల మ్యాచ్ సిమ్యులేటర్",
        "discovery-desc": "మీ అర్హతను లెక్కించడానికి మీ వివరాలను పూరించండి.",
        "profile-card-title": "జనసంఖ్య ప్రొఫైల్",
        "profile-card-desc": "అర్హతలను లెక్కించడానికి వివరాలు నమోదు చేయండి",
        "profile-name-lbl": "పూర్తి పేరు",
        "profile-age-lbl": "వయస్సు",
        "profile-occupation-lbl": "వృత్తి",
        "profile-occ-default": "వృత్తిని ఎంచుకోండి",
        "profile-occ-farmer": "రైతు / వ్యవసాయం",
        "profile-occ-student": "విద్యార్థి / అకడమిక్",
        "profile-occ-seeker": "ఉద్యోగ అన్వేషకుడు / నిరుద్యోగి",
        "profile-occ-ent": "చిన్న వ్యాపారం / వ్యవస్థాపకుడు",
        "profile-occ-artisan": "చేతివృత్తిదారుడు / చేనేత",
        "profile-occ-retired": "సీనియర్ సిటిజన్ / రిటైర్డ్",
        "profile-state-lbl": "రాష్ట్రం",
        "profile-state-default": "రాష్ట్రాన్ని ఎంచుకోండి",
        "profile-edu-lbl": "విద్యార్హత",
        "profile-edu-default": "విద్యను ఎంచుకోండి",
        "profile-edu-none": "చదువుకోని వారు / ప్రాథమిక విద్య",
        "profile-edu-sec": "హై స్కూల్ (10వ/12వ తరగతి)",
        "profile-edu-grad": "గ్రాడ్యుయేట్ / డిగ్రీ హోల్డర్",
        "profile-edu-voc": "డిప్లొమా / వృత్తి శిక్షణ",
        "profile-income-lbl": "నెలవారీ కుటుంబ ఆదాయం (₹)",
        "profile-land-lbl": "భూమి యాజమాన్యం",
        "profile-land-no": "భూమి లేదు",
        "profile-land-small": "చిన్నకారు రైతు (< 2 హెక్టార్లు)",
        "profile-land-large": "పెద్దకారు రైతు (> 2 హెక్టార్లు)",
        "profile-btn-calc": "అర్హత స్కోరును లెక్కించు",
        "radar-title": "అవకాశ రేడార్",
        "radar-desc": "సిఫార్సు చేసిన పథకాలు చూడటానికి విభాగాన్ని క్లిక్ చేయండి",
        "radar-cat-agri": "వ్యవసాయం",
        "radar-cat-edu": "విద్య",
        "radar-cat-health": "ఆరోగ్యం",
        "radar-cat-emp": "ఉద్యోగ అవకాశాలు",
        "radar-cat-ent": "వ్యాపార అభివృద్ధి",
        "radar-cat-fin": "ఆర్థిక సహాయం",
        "results-headline-default": "వివరాలను పూరించండి",
        "results-subheading-default": "అర్హత గల పథకాలను చూడటానికి ప్రొఫైల్ సమర్పించండి.",
        "results-placeholder": "ప్రొఫైల్ ఇంకా లెక్కించబడలేదు. దయచేసి ఫారమ్ నింపండి.",
        "sim-badge": "ఆదాయ సిమ్యులేటర్",
        "sim-title": "ఆదాయ అభివృద్ధి అంచనా",
        "sim-desc": "ప్రభుత్వ పథకాల ద్వారా మీ కుటుంబ ఆదాయం ఎలా పెరుగుతుందో అంచనా వేయండి.",
        "sim-params-title": "ఆదాయ పారామితులు",
        "sim-params-desc": "ఆదాయాన్ని మార్చి పథకాలను ఎంచుకుని చూడండి",
        "sim-base-income-lbl": "ప్రాథమిక నెలవారీ ఆదాయం",
        "sim-select-schemes": "పథకాలను ఎంచుకోండి",
        "sim-scheme1-name": "పీఎం కిసాన్ సమ్మాన్ నిధి",
        "sim-scheme1-amt": "+₹500 / నెలకు (సంవత్సరానికి ₹6,000)",
        "sim-scheme2-name": "విద్యార్థి పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్",
        "sim-scheme2-amt": "+₹1,500 / నెలకు (సంవత్సరానికి ₹18,000)",
        "sim-scheme3-name": "పీఎం స్కిల్ డెవలప్‌మెంట్ శిక్షణ",
        "sim-scheme3-amt": "+₹3,500 / నెలకు (సరాసరి పెరుగుదల)",
        "sim-scheme4-name": "పీఎం సూర్య ఘర్ సోలార్ పథకం (పొదుపు)",
        "sim-scheme4-amt": "+₹2,500 / నెలకు (తగ్గిన కరెంట్ బిల్లు)",
        "sim-baseline-lbl": "ప్రస్తుత ఆదాయం",
        "sim-projected-lbl": "ఆశించే ఆదాయం",
        "sim-chart-x-base": "ప్రస్తుత",
        "sim-chart-x-kisan": "పీఎం కిసాన్",
        "sim-chart-x-skill": "నైపుణ్య శిక్షణ",
        "sim-chart-x-solar": "సోలార్ పథకం",
        "sim-chart-note": "ఈ గ్రాఫ్ సంచిత ఆదాయ అంచనాను సూచిస్తుంది.",
        "shield-badge": "సైబర్ రక్షణ",
        "shield-title": "స్కీమ్‌షీల్డ్ సైబర్ స్కాన్",
        "shield-desc": "వెబ్‌సైట్ లింకులు లేదా మెసేజ్లను తనిఖీ చేసి నిజాయితీని ధృవీకరించుకోండి.",
        "shield-panel-title": "మోసాల విశ్లేషణ",
        "shield-panel-desc": "సందేహాస్పద లింకులు లేదా మెసేజ్లను నమోదు చేయండి",
        "shield-tab-url": "వెబ్‌సైట్ లింక్ (URL)",
        "shield-tab-upload": "స్క్రీన్‌షాట్ అప్‌లోడ్",
        "shield-tab-message": "SMS / వాట్సాప్",
        "shield-upload-drag": "ఫైల్స్ ఇక్కడ లాగండి",
        "shield-upload-limit": "PNG, JPG, PDF కి సపోర్ట్ చేస్తుంది (గరిష్టంగా 5MB)",
        "shield-btn-scan": "రక్షణ స్కాన్ చేయండి",
        "shield-idle-title": "సురక్షిత స్థితి",
        "shield-idle-desc": "వివరాలను నమోదు చేసి 'రక్షణ స్కాన్ చేయండి' బటన్ నొక్కండి.",
        "shield-scanning-title": "ధృవీకరించబడుతోంది...",
        "shield-scanning-desc": "భద్రతా ముప్పులు మరియు నకిలీ నమూనాలు విశ్లేషించబడుతున్నాయి...",
        "assistant-badge": "AI తోడు",
        "assistant-title": "గ్రామ్‌సథి AI తో మాట్లాడండి",
        "assistant-desc": "ప్రశ్నలు ఉన్నాయా? మా బహుభాషా అసిస్టెంట్‌తో మీ స్వంత భాషలోనే మాట్లాడండి.",
        "assistant-info-title": "బహుభాషా సంభాషణ",
        "assistant-info-desc": "సంభాషణను ప్రారంభించడానికి మీ భాషను ఎంచుకోండి",
        "chat-name": "గ్రామ్‌సథి సహాయకుడు",
        "chat-online": "లైవ్ లో ఉంది (Online)",
        "chat-voice-enabled": "వాయిస్ సదుపాయం ఆన్ లో ఉంది",
        "chat-bot-default": "నమస్కారం! నేను మీ గ్రామ్‌సథి AI అసిస్టెంట్‌ను. పథకాలు లేదా సైబర్ రక్షణ గురించి ఏమైనా అడగండి.",
        "db-badge": "ప్రాంతీయ విశ్లేషణ",
        "db-title": "గ్రామ సమాచార పట్టిక",
        "db-desc": "దావా చేయని ప్రభుత్వ నిధులు, సైబర్ మోసాలు మరియు ఆర్థిక సేవల స్థితిగతులు.",
        "db-card1-title": "దావా చేయని ప్రభుత్వ నిధులు",
        "db-card1-trend": "గత త్రైమాసికం కంటే 14% క్షీణత",
        "db-card2-title": "సైబర్ ముప్పు హెచ్చరికలు",
        "db-card2-trend": "3 నకిలీ వెబ్‌సైట్లు కనుగొనబడ్డాయి",
        "db-card3-title": "డిజిటల్ బ్యాంకింగ్ స్కోరు",
        "db-card3-trend": "బ్యాంకు ఖాతాలు 5% పెరిగాయి",
        "db-wide-title": "లభించని నిధుల వివరాలు",
        "db-wide-badge": "గ్రామ స్థాయి విశ్లేషణ",
        "map-title": "ఇంటరాక్టివ్ జిల్లా నష్ట మరియు అవకాశాల పటం",
        "map-desc": "సమాచారాన్ని చూడటానికి పటంలో జిల్లాను ఎంచుకోండి.",
        "stories-badge": "గ్రామ వికాసం",
        "stories-title": "వినియోగదారుల విజయగాథలు",
        "stories-desc": "మా వెబ్‌సైట్ ద్వారా లబ్ధి పొందిన మరియు మోసాల నుండి తప్పించుకున్న ప్రజల గాథలు.",
        "story1-quote": '"నాకు వాట్సాప్‌లో 90% సోలార్ సబ్సిడీ ఇస్తామంటూ లింక్ వచ్చింది. ₹1,500 ఫీజు కట్టమన్నారు. స్కీమ్‌షీల్డ్ లో చెక్ చేస్తే అది నకిలీ అని తెలిసింది. నా డబ్బులు దక్కాయి!"',
        "story1-author-job": "రైతు, నాసిక్ జిల్లా",
        "story2-quote": '"స్కాలర్‌షిప్స్ కోసం మునుపటి లాగా తిరగకుండా, గ్రామ్‌సథి ద్వారా తగిన పథకాన్ని తెలుసుకుని సులభంగా అప్లై చేశాను. ఇప్పుడు స్కాలర్‌షిప్ వస్తోంది."',
        "story2-author-job": "డిగ్రీ విద్యార్థిని, పూణే",
        "story3-quote": '"కుట్టు మిషన్ వ్యాపారం ప్రారంభించడానికి డబ్బులు అవసరమైనప్పుడు స్టాండప్ ఇండియా గురించి తెలిసింది. ఎటువంటి హామీ లేకుండా ముద్ర లోన్ పొందాను."',
        "story3-author-job": "మహిళా వ్యవస్థాపకురాలు, జున్నార్",
        "vision-badge": "జాతీయ దృక్పథం",
        "vision-title": "25 కోట్ల గ్రామీణ కుటుంబాల సముద్ధరణ",
        "vision-desc": "గ్రామ్‌సథి AI ని భారతదేశంలో ప్రతి గ్రామానికి చేర్చి, అవినీతి రహిత మరియు సురక్షిత డిజిటల్ వ్యవస్థను నిర్మించడమే మా ధ్యేయం.",
        "vision-stat1-lbl": "మోసాలను గుర్తించే రేటు",
        "vision-stat2-lbl": "స్థానిక భాషల మద్దతు",
        "vision-stat3-lbl": "సురక్షిత ప్రత్యక్ష లబ్ధి లక్ష్యం",
        "vision-btn-discover": "సబ్సిడీ అర్హతను తనిఖీ చేయడానికి",
        "vision-btn-report": "మోసాన్ని నివేదించడానికి",
        "footer-logo-text": "గ్రామ్‌సథి AI",
        "footer-desc": "AI ద్వారా నడిచే పథకాల అన్వేషణ మరియు సైబర్ భద్రతా వేదిక. గ్రామీణ ప్రజల అభివృద్ధి కోసం సృష్టించబడిన సాంకేతికత.",
        "footer-col-discovery": "పథకాలు",
        "footer-link-farmers": "రైతుల సబ్సిడీలు",
        "footer-link-scholars": "స్కాలర్‌షిప్స్ శోధన",
        "footer-link-health": "ఆరోగ్య పథకాలు",
        "footer-link-skills": "నైపుణ్యాభివృద్ధి శిక్షణ",
        "footer-col-safety": "సైబర్ రక్షణ",
        "footer-link-verify": "లింక్ ధృవీకరణ",
        "footer-link-report": "నకిలీ వెబ్‌సైట్ రిపోర్ట్",
        "footer-link-feeds": "మోసాల అలర్ట్స్",
        "footer-link-assistant": "డిజిటల్ పరిజ్ఞాన సహాయం",
        "footer-col-news": "భద్రతా సమాచారం",
        "footer-news-desc": "కొత్త మోసాలు మరియు ప్రభుత్వ పథకాల గురించిన సమాచారం పొందడానికి సబ్స్క్రైబ్ చేయండి.",
        "footer-news-btn": "చేరండి",
        "footer-bottom-copy": "&copy; 2026 గ్రామ్‌సథి AI. జాతీయ డిజిటల్ గవర్నెన్స్ హ్యాకథాన్ కింద రూపొందించబడింది.",
        "footer-policy-privacy": "గోపनीयత విధానం",
        "footer-policy-terms": "నిబంధనలు & షరతులు",
        "footer-policy-api": "రిపోర్ట్ థ్రెట్ API",
        "modal-title": "గ్రామ్‌సథి AI పోర్టల్",
        "modal-subtitle": "జాతీయ సంక్షేమ ధృవీకరణ పత్రం",
        "modal-desc": "ఈ పత్రం మీ అర్హతలను ధృవీకరిస్తుంది.",
        "modal-name-lbl": "అప్లికెంట్ పేరు:",
        "modal-age-lbl": "వయస్సు / లింగం:",
        "modal-occupation-lbl": "వృత్తి:",
        "modal-region-lbl": "రాష్ట్రం / జిల్లా:",
        "modal-score-lbl": "అర్హత స్కోరు:",
        "modal-income-lbl": "నెలవారీ ఆదాయం:",
        "modal-target-title": "అర్హత సాధించిన పథకం",
        "modal-qr-lbl": "సురక్షిత కేవైసీ స్కాన్",
        "modal-gov-lbl": "భారత ప్రభుత్వం",
        "modal-agency-lbl": "సంక్షేమ పథకాల విభాగం",
        "modal-status-lbl": "స్థితి: యాక్టివ్ / ధృవీకరించబడింది",
        "modal-btn-print": "ప్రింట్ / PDF సేవ్ చేయి",
        "modal-btn-close": "మూసివేయి",
        "profile-name-placeholder": "ఉదా. రమేష్ కుమార్",
        "profile-age-placeholder": "ఉదా. 42",
        "profile-income-placeholder": "ఉదా. 12000",
        "shield-url-placeholder": "ఉదా. http://pmkisan-subsidy-free.in",
        "shield-text-placeholder": "సందేశాన్ని ఇక్కడ కాపీ చేయండి...",
        "chat-input-placeholder": "మీ ప్రశ్న అడగండి...",
        "footer-news-placeholder": "ఈమెయిల్ చిరునామా నమోదు చేయండి"
    },
    kn: {
        "nav-home": "ಮುಖಪುಟ",
        "nav-problem": "ಸಮಸ್ಯೆ",
        "nav-opportunities": "ಅವಕಾಶಗಳು",
        "nav-simulator": "ಸಿಮ್ಯುಲೇಟರ್",
        "nav-schemeshield": "ಸ್ಕೀಮ್‌ಶೀಲ್ಡ್",
        "nav-assistant": "AI ಸಹಾಯಕಿ",
        "nav-village-dashboard": "ಗ್ರಾಮ ಮಾಹಿತಿ",
        "nav-btn-eligibility": "ಅರ್ಹತೆ ಪರಿಶೀಲನೆ",
        "ticker-1": '<i class="fa-solid fa-triangle-exclamation" style="color: #EF4444; margin-right: 0.5rem;"></i> <strong>ಸೈಬರ್ ಎಚ್ಚರಿಕೆ:</strong> ನಕಲಿ ಪಿಎಂ ಕಿಸಾನ್ ವೆಬ್‌ಸೈಟ್‌ಗಳ ಬಗ್ಗೆ ಎಚ್ಚರದಿಂದಿರಿ.',
        "ticker-2": '<i class="fa-solid fa-bullhorn" style="color: var(--primary-light); margin-right: 0.5rem;"></i> <strong>ಹೊಸ ಯೋಜನೆ:</strong> ಪಿಎಂ ಸೂರ್ಯ ಘರ್ ಸೋಲಾರ್ ಯೋಜನೆ ಜಾರಿಯಲ್ಲಿದೆ.',
        "ticker-3": '<i class="fa-solid fa-shield-halved" style="color: #3B82F6; margin-right: 0.5rem;"></i> <strong>ಗ್ರಾಮ ರಕ್ಷಣೆ:</strong> ಈ ವಾರ 3 ನಕಲಿ ಲಿಂಕ್‌ಗಳನ್ನು ತಡೆಯಲಾಗಿದೆ.',
        "hero-badge": "AI ಚಾಲಿತ ರಾಷ್ಟ್ರೀಯ ಡಿಜಿಟಲ್ ಮಿಷನ್",
        "hero-title": "ಅವಕಾಶಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.<br>ಸುರಕ್ಷಿತವಾಗಿರಿ.<br>ಗ್ರಾಮೀಣ ಸಬಲೀಕರಣ ಸಾಧಿಸಿ.",
        "hero-desc": "ಗ್ರಾಮಸಾಥಿ AI ಭಾರತೀಯ ನಾಗರಿಕರಿಗಾಗಿ ಡಿಜಿಟಲ್ ಒಡನಾಡಿ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ ಮತ್ತು ಆನ್‌ಲೈನ್ ವಂಚನೆಗಳಿಂದ ನಿಮ್ಮನ್ನು ರಕ್ಷಿಸಿಕೊಳ್ಳಿ.",
        "hero-cta-discover": "ಅವಕಾಶಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
        "hero-cta-scan": "ಸ್ಕೀಮ್‌ಶೀಲ್ಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
        "hero-stat-schemes-lbl": "ಪರಿಶೀಲಿಸಿದ ಯೋಜನೆಗಳು",
        "hero-stat-scams-lbl": "ತಡೆದ ವಂಚನೆಗಳು",
        "hero-stat-villages-lbl": "ನೋಂದಾಯಿತ ಗ್ರಾಮಗಳು",
        "hero-radar-title": "ಗ್ರಾಮಸಾಥಿ ಎಂಜಿನ್",
        "hero-radar-live": "ಲೈವ್ ರೇಡಾರ್",
        "hero-radar-score": "ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್",
        "hero-radar-found": "ಯೋಜನೆಗಳು ಪತ್ತೆಯಾಗಿವೆ",
        "hero-radar-val": "ಅಂದಾಜು ಮೌಲ್ಯ/ವರ್ಷ",
        "problem-badge": "ಪ್ರಮುಖ ಭದ್ರತಾ ಎಚ್ಚರಿಕೆ",
        "problem-title": "ಗ್ರಾಮೀಣ ಡಿಜಿಟಲ್ ಭಾರತದಲ್ಲಿ ಇಮ್ಮಡಿ ಸಂಕಷ್ಟ",
        "problem-desc": "ಮಾಹಿತಿ ಕೊರತೆಯಿಂದ ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ ಸಿಗುತ್ತಿಲ್ಲ, ಇನ್ನೊಂದೆಡೆ ಡಿಜಿಟಲ್ ಅನಕ್ಷರತೆಯಿಂದ ಆನ್‌ಲೈನ್ ವಂಚನೆಗೆ ಬಲಿಯಾಗುತ್ತಿದ್ದಾರೆ.",
        "problem-alert-title": "ಮಾಹಿತಿಯ ಕೊರತೆ ವರ್ಸಸ್ ಸೈಬರ್ ವಂಚನೆ",
        "problem-alert-desc": "ಮಾಹಿತಿ ಇಲ್ಲದೆ ಯೋಜನೆಗಳು ವ್ಯರ್ಥವಾಗುತ್ತಿವೆ; ಅದೇ ಸಮಯದಲ್ಲಿ ನಕಲಿ ಸುದ್ದಿಯಿಂದ ಜನ ಹಣ ಕಳೆದುಕೊಳ್ಳುತ್ತಿದ್ದಾರೆ.",
        "problem-card1-title": "ಹರಡಿರುವ ಮಾಹಿತಿ",
        "problem-card1-desc": "ಯೋಜನೆಗಳು ನೂರಾರು ವೆಬ್‌ಸೈಟ್‌ಗಳಲ್ಲಿ ಹರಡಿಕೊಂಡಿರುವುದರಿಂದ ಜನರಿಗೆ ಗೊಂದಲವಾಗುತ್ತದೆ.",
        "problem-card2-title": "ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು",
        "problem-card2-desc": "ಪಿಎಂ ಕಿಸಾನ್ ಹೆಸರಿನಲ್ಲಿ ಹಣ ವಸೂಲಿ ಮಾಡುವ ನಕಲಿ ಜಾಲಗಳು ಸೃಷ್ಟಿಯಾಗುತ್ತಿವೆ.",
        "problem-card3-title": "ವಾಟ್ಸಾಪ್ ವಂಚನೆಯ ಸಂದೇಶಗಳು",
        "problem-card3-desc": "ಉಚಿತ ಸೋಲಾರ್ ಪಂಪ್ ಅಥವಾ ಸುಲಭ ಸಾಲದ ಹೆಸರಿನಲ್ಲಿ ಬರುವ ನಕಲಿ ಲಿಂಕ್‌ಗಳು.",
        "gap-badge": "ನಷ್ಟದ ಪ್ರಮಾಣ",
        "gap-title": "ಪ್ರತಿದಿನ ನಾವು ಕಳೆದುಕೊಳ್ಳುತ್ತಿರುವ ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಅವಕಾಶಗಳು",
        "gap-desc": "ಅರಿವಿಲ್ಲದೆ ಪಡೆಯದ ಯೋಜನೆಗಳು ಮತ್ತು ವಂಚನೆಯ ಅಂಕಿ-ಅಂಶಗಳು.",
        "gap-card1-lbl": "ಪಡೆಯದ ಕಲ್ಯಾಣ ಅನುದಾನ (ವಾರ್ಷಿಕ)",
        "gap-card2-lbl": "ಯೋಜನೆಗಳ ಬಗ್ಗೆ ತಿಳಿಯದ ಗ್ರಾಮೀಣ ಜನ",
        "gap-card3-lbl": "ಗ್ರಾಮೀಣ ಸೈಬರ್ ವಂಚನೆಯಲ್ಲಿ ಏರಿಕೆ",
        "gap-card4-lbl": "ಭಾಷೆಯ ತೊಡಕಿನಿಂದ ನಷ್ಟಪಡುತ್ತಿರುವ ಜನ",
        "works-badge": "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?",
        "works-title": "ಸುರಕ್ಷಿತವಾಗಿ ಯೋಜನೆಗಳ ಲಾಭ ಪಡೆಯಿರಿ",
        "works-desc": "ಗ್ರಾಮಸಾಥಿ AI ಮೂರು ಸುಲಭ ಹಂತಗಳಲ್ಲಿ ಯೋಜನೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ.",
        "works-step1-title": "ಡಿಜಿಟಲ್ ಪ್ರೊಫೈಲ್",
        "works-step1-desc": "ನಿಮ್ಮ ವಯಸ್ಸು, ಉದ್ಯೋಗ, ಆದಾಯ ವಿವರ ನಮೂದಿಸಿ. ನಿಮ್ಮ ಮಾಹಿತಿ ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.",
        "works-step2-title": "ಅವಕಾಶ ರೇಡಾರ್ ರನ್ ಮಾಡಿ",
        "works-step2-desc": "ನಿಮ್ಮ ವಿವರಕ್ಕೆ ತಕ್ಕ ಯೋಜನೆಗಳನ್ನು ನಮ್ಮ ಎಂಜಿನ್ ತಕ್ಷಣ ತೋರಿಸುತ್ತದೆ.",
        "works-step3-title": "ಸ್ಕೀಮ್‌ಶೀಲ್ಡ್ ತಪಾಸಣೆ",
        "works-step3-desc": "ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡುವ ಮುನ್ನ ಅಥವಾ ಹಣ ಪಾವತಿಸುವ ಮುನ್ನ ಸತ್ಯಾಸತ್ಯತೆ ಪರಿಶೀಲಿಸಿ.",
        "discovery-badge": "ಡಿಸ್ಕವರಿ ಎಂಜಿನ್",
        "discovery-title": "ಯೋಜನೆ ಮ್ಯಾಚಿಂಗ್ ಸಿಮ್ಯುಲೇಟರ್",
        "discovery-desc": "ನಿಮ್ಮ ಅರ್ಹತೆ ಲೆಕ್ಕ ಹಾಕಲು ಪ್ರೊಫೈಲ್ ಭರ್ತಿ ಮಾಡಿ.",
        "profile-card-title": "ಜನಸಂಖ್ಯಾ ವಿವರ",
        "profile-card-desc": "ಅರ್ಹತೆ ಲೆಕ್ಕಹಾಕಲು ಮಾಹಿತಿ ನಮೂದಿಸಿ",
        "profile-name-lbl": "ಪೂರ್ಣ ಹೆಸರು",
        "profile-age-lbl": "ವಯಸ್ಸು",
        "profile-occupation-lbl": "ಉದ್ಯೋಗ",
        "profile-occ-default": "ಉದ್ಯೋಗ ಆಯ್ಕೆ ಮಾಡಿ",
        "profile-occ-farmer": "ರೈತ / ಕೃಷಿ",
        "profile-occ-student": "ವಿದ್ಯಾರ್ಥಿ / ಶೈಕ್ಷಣಿಕ",
        "profile-occ-seeker": "ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿ / ನಿರುದ್ಯೋಗಿ",
        "profile-occ-ent": "ಸಣ್ಣ ಉದ್ಯಮ / ಉದ್ಯಮಿ",
        "profile-occ-artisan": "ಕುಶಲಕರ್ಮಿ / ನೇಕಾರ",
        "profile-occ-retired": "ಹಿರಿಯ ನಾಗರಿಕ / ನಿವೃತ್ತ",
        "profile-state-lbl": "ರಾಜ್ಯ",
        "profile-state-default": "ರಾಜ್ಯ ಆಯ್ಕೆ ಮಾಡಿ",
        "profile-edu-lbl": "ವಿದ್ಯಾಹರ್ತೆ",
        "profile-edu-default": "ಶಿಕ್ಷಣ ಆಯ್ಕೆ ಮಾಡಿ",
        "profile-edu-none": "ಅನಕ್ಷರಸ್ಥ / ಪ್ರಾಥಮಿಕ ಶಿಕ್ಷಣ",
        "profile-edu-sec": "ಹೈ ಸ್ಕೂಲ್ (10ನೇ/12ನೇ ತರಗತಿ)",
        "profile-edu-grad": "ಪದವೀಧರ",
        "profile-edu-voc": "ಡಿಪ್ಲೊಮಾ / ವೃತ್ತಿಪರ ತರಬೇತಿ",
        "profile-income-lbl": "ಮಾಸಿಕ ಕುಟುಂಬ ಆದಾಯ (₹)",
        "profile-land-lbl": "ಭೂಮಿ ಮಾಲೀಕತ್ವ",
        "profile-land-no": "ಭೂಮಿ ಇಲ್ಲ",
        "profile-land-small": "ಸಣ್ಣ ಹಿಡುವಳಿದಾರ ರೈತ (< 2 ಹೆಕ್ಟೇರ್)",
        "profile-land-large": "ದೊಡ್ಡ ಹಿಡುವಳಿದಾರ ರೈತ (> 2 ಹೆಕ್ಟೇರ್)",
        "profile-btn-calc": "ಅರ್ಹತೆ ಸ್ಕೋರ್ ಲೆಕ್ಕಹಾಕಿ",
        "radar-title": "ಅವಕಾಶ ರೇಡಾರ್",
        "radar-desc": "ಶಿಫಾರಸು ಮಾಡಿದ ಯೋಜನೆ ನೋಡಲು ವಿಭಾಗದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ",
        "radar-cat-agri": "ಕೃಷಿ",
        "radar-cat-edu": "ಶಿಕ್ಷಣ",
        "radar-cat-health": "ಆರೋಗ್ಯ",
        "radar-cat-emp": "ಉದ್ಯೋಗ ಅವಕಾಶಗಳು",
        "radar-cat-ent": "ಉದ್ಯಮಶೀಲತೆ",
        "radar-cat-fin": "ಹಣಕಾಸು ನೆರವು",
        "results-headline-default": "ಮಾಹಿತಿ ಪೂರ್ಣಗೊಳಿಸಿ",
        "results-subheading-default": "ಅರ್ಹ ಯೋಜನೆ ನೋಡಲು ಪ್ರೊಫೈಲ್ ಸಲ್ಲಿಕೆ ಮಾಡಿ.",
        "results-placeholder": "ಪ್ರೊಫೈಲ್ ಇನ್ನೂ ಲೆಕ್ಕಹಾಕಿಲ್ಲ. ಫಾರಂ ತುಂಬಿ.",
        "sim-badge": "ಆದಾಯ ಸಿಮ್ಯುಲೇಟರ್",
        "sim-title": "ಆದಾಯ ಬೆಳವಣಿಗೆ ಅಂದಾಜು",
        "sim-desc": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮೂಲಕ ನಿಮ್ಮ ಕುಟುಂಬದ ಆದಾಯ ಹೇಗೆ ಹೆಚ್ಚುತ್ತದೆ ಎಂದು ಅಂದಾಜಿಸಿ.",
        "sim-params-title": "ಆದಾಯದ ನಿಯತಾಂಕಗಳು",
        "sim-params-desc": "ಆದಾಯ ಬದಲಾಯಿಸಿ ಯೋಜನೆಗಳನ್ನು ಆರಿಸಿ ನೋಡಿ",
        "sim-base-income-lbl": "ಮೂಲ ಮಾಸಿಕ ಆದಾಯ",
        "sim-select-schemes": "ಯೋಜನೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
        "sim-scheme1-name": "ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
        "sim-scheme1-amt": "+₹500 / ತಿಂಗಳಿಗೆ (ವರ್ಷಕ್ಕೆ ₹6,000)",
        "sim-scheme2-name": "ವಿದ್ಯಾರ್ಥಿ ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ ಸ್ಕಾಲರ್‌ಶಿಪ್",
        "sim-scheme2-amt": "+₹1,500 / ತಿಂಗಳಿಗೆ (ವರ್ಷಕ್ಕೆ ₹18,000)",
        "sim-scheme3-name": "ಪಿಎಂ ಕೌಶಲ್ಯ ವಿಕಾಸ ತರಬೇತಿ",
        "sim-scheme3-amt": "+₹3,500 / ತಿಂಗಳಿಗೆ (ಸರಾಸರಿ ಏರಿಕೆ)",
        "sim-scheme4-name": "ಪಿಎಂ ಸೂರ್ಯ ಘರ್ ಸೋಲಾರ್ ಯೋಜನೆ (ಉಳಿತಾಯ)",
        "sim-scheme4-amt": "+₹2,500 / ತಿಂಗಳಿಗೆ (ಕಡಿಮೆಯಾದ ಕರೆಂಟ್ ಬಿಲ್)",
        "sim-baseline-lbl": "ಪ್ರಸ್ತುತ ಆದಾಯ",
        "sim-projected-lbl": "ನಿರೀಕ್ಷಿತ ಆದಾಯ",
        "sim-chart-x-base": "ಪ್ರಸ್ತುತ",
        "sim-chart-x-kisan": "ಪಿಎಂ ಕಿಸಾನ್",
        "sim-chart-x-skill": "ಕೌಶಲ್ಯ ತರಬೇತಿ",
        "sim-chart-x-solar": "ಸೋಲಾರ್ ಯೋಜನೆ",
        "sim-chart-note": "ಈ ಗ್ರಾಫ್ ಸಂಚಿತ ಆದಾಯದ ಅಂದಾಜನ್ನು ತೋರಿಸುತ್ತದೆ.",
        "shield-badge": "ಸೈಬರ್ ರಕ್ಷಣೆ",
        "shield-title": "ಸ್ಕೀಮ್‌ಶೀಲ್ಡ್ ಸೈಬರ್ ಸ್ಕ್ಯಾನ್",
        "shield-desc": "ವೆಬ್‌ಸೈಟ್ ಲಿಂಕ್ ಅಥವಾ ಮೆಸೇಜ್ ಪರಿಶೀಲಿಸಿ ಸತ್ಯಾಸತ್ಯತೆ ತಿಳಿದುಕೊಳ್ಳಿ.",
        "shield-panel-title": "ವಂಚನೆ ವಿಶ್ಲೇಷಣೆ",
        "shield-panel-desc": "ಸಂದೇಹಾಸ್ಪದ ಲಿಂಕ್ ಅಥವಾ ಮೆಸೇಜ್ ನಮೂದಿಸಿ",
        "shield-tab-url": "ವೆಬ್‌ಸೈಟ್ ಲಿಂಕ್ (URL)",
        "shield-tab-upload": "ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್",
        "shield-tab-message": "SMS / ವಾಟ್ಸಾಪ್",
        "shield-upload-drag": "ಫೈಲ್‌ಗಳನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ",
        "shield-upload-limit": "PNG, JPG, PDF ಬೆಂಬಲಿಸುತ್ತದೆ (ಗರಿಷ್ಠ 5MB)",
        "shield-btn-scan": "ರಕ್ಷಣೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
        "shield-idle-title": "ಸುರಕ್ಷಿತ ಸ್ಥಿತಿ",
        "shield-idle-desc": "ವಿವರ ನಮೂದಿಸಿ 'ರಕ್ಷಣೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ' ಬಟನ್ ಒತ್ತಿ.",
        "shield-scanning-title": "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
        "shield-scanning-desc": "ಭದ್ರತಾ ಬೆದರಿಕೆಗಳು ಮತ್ತು ನಕಲಿ ಮಾದರಿಗಳ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...",
        "assistant-badge": "AI ಒಡನಾಡಿ",
        "assistant-title": "ಗ್ರಾಮಸಾಥಿ AI ಜೊತೆ ಮಾತನಾಡಿ",
        "assistant-desc": "ಪ್ರಶ್ನೆಗಳಿವೆಯೇ? ನಮ್ಮ ಬಹುಭಾಷಾ ಸಹಾಯಕಿ ಜೊತೆ ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ.",
        "assistant-info-title": "ಬಹುಭಾಷಾ ಸಂಭಾಷಣೆ",
        "assistant-info-desc": "ಸಂಭಾಷಣೆ ಪ್ರಾರಂಭಿಸಲು ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
        "chat-name": "ಗ್ರಾಮಸಾಥಿ ಸಹಾಯಕಿ",
        "chat-online": "ಲೈವ್ ನಲ್ಲಿದೆ (Online)",
        "chat-voice-enabled": "ವಾಯ್ಸ್ ಸೌಲಭ್ಯ ಆನ್ ಆಗಿದೆ",
        "chat-bot-default": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಗ್ರಾಮಸಾಥಿ AI ಸಹಾಯಕಿ. ಯೋಜನೆಗಳು ಅಥವಾ ಸೈಬರ್ ರಕ್ಷಣೆ ಬಗ್ಗೆ ಏನು ಬೇಕಿದ್ದರೂ ಕೇಳಿ.",
        "db-badge": "ಪ್ರಾದೇಶಿಕ ವಿಶ್ಲೇಷಣೆ",
        "db-title": "ಗ್ರಾಮ ಮಾಹಿತಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
        "db-desc": "ಪಡೆಯದ ಕಲ್ಯಾಣ ನಿಧಿ, ಸೈಬರ್ ವಂಚನೆ ಮತ್ತು ಆರ್ಥಿಕ ಸೇರ್ಪಡೆ ವಿವರಗಳು.",
        "db-card1-title": "ಪಡೆಯದ ಕಲ್ಯಾಣ ನಿಧಿ",
        "db-card1-trend": "ಹಿಂದಿನ ತ್ರೈಮಾಸಿಕಕ್ಕಿಂತ ಶೇ.14 ಇಳಿಕೆ",
        "db-card2-title": "ಸೈಬರ್ ಎಚ್ಚರಿಕೆಗಳು",
        "db-card2-trend": "3 ನಕಲಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು ಪತ್ತೆಯಾಗಿವೆ",
        "db-card3-title": "ಡಿಜಿಟಲ್ ಬ್ಯಾಂಕಿಂಗ್ ಸ್ಕೋರ್",
        "db-card3-trend": "ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಲ್ಲಿ ಶೇ.5 ಹೆಚ್ಚಳ",
        "db-wide-title": "ಪಡೆಯದ ನಿಧಿಗಳ ವಿವರ",
        "db-wide-badge": "ಗ್ರಾಮ ಮಟ್ಟದ ವಿಶ್ಲೇಷಣೆ",
        "map-title": "ಪ್ರಾದೇಶಿಕ ಸೈಬರ್ ರಕ್ಷಣೆ ಮತ್ತು ಅವಕಾಶ ನಕ್ಷೆ",
        "map-desc": "ಮಾಹಿತಿ ನೋಡಲು ನಕ್ಷೆಯಲ್ಲಿ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
        "stories-badge": "ಗ್ರಾಮ ವಿಕಾಸ",
        "stories-title": "ನಾಗರಿಕರ ಯಶೋಗಾಥೆಗಳು",
        "stories-desc": "ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಮೂಲಕ ಲಾಭ ಪಡೆದ ಮತ್ತು ವಂಚನೆಯಿಂದ ಪಾರಾದ ನಾಗರಿಕರ ಕಥೆಗಳು.",
        "story1-quote": '"ನನಗೆ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಶೇ.90 ರಷ್ಟು ಸೋಲಾರ್ ಸಬ್ಸಿಡಿ ನೀಡುವ ಲಿಂಕ್ ಬಂದಿತ್ತು. ₹1,500 ಹಣ ಕೇಳಿದ್ದರು. ಸ್ಕೀಮ್‌ಶೀಲ್ಡ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಿದಾಗ ನಕಲಿ ಎಂದು ತಿಳಿದು ನನ್ನ ಹಣ ಉಳಿಯಿತು!"',
        "story1-author-job": "ರೈತ, ನಾಸಿಕ್ ಜಿಲ್ಲೆ",
        "story2-quote": '"ಸ್ಕಾಲರ್‌ಶಿಪ್ ಪಡೆಯಲು ಮೊದಲೆಲ್ಲಾ ಅಲೆಯಬೇಕಿತ್ತು, ಗ್ರಾಮಸಾಥಿ ಸಹಾಯದಿಂದ ಸೂಕ್ತ ಯೋಜನೆ ತಿಳಿದು ಸುಲಭವಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದೆ. ಈಗ ಸ್ಕಾಲರ್‌ಶಿಪ್ ಹಣ ಬರುತ್ತಿದೆ."',
        "story2-author-job": "ಪದವಿ ವಿದ್ಯಾರ್ಥಿನಿ, ಪುಣೆ",
        "story3-quote": '"ಹೊಲಿಗೆ ಉದ್ಯಮ ಆರಂಭಿಸಲು ಹಣದ ಅಗತ್ಯವಿದ್ದಾಗ ಸ್ಟ್ಯಾಂಡಪ್ ಇಂಡಿಯಾ ತಿಳಿಯಿತು. ಯಾವುದೇ ಭದ್ರತೆ ಇಲ್ಲದೆ ಮುದ್ರಾ ಸಾಲ ಪಡೆದೆ."',
        "story3-author-job": "ಮಹಿಳಾ ಉದ್ಯಮಿ, ಜುನ್ನಾರ್",
        "vision-badge": "ರಾಷ್ಟ್ರೀಯ ದೃಷ್ಟಿಕೋನ",
        "vision-title": "25 ಕೋಟಿ ಗ್ರಾಮೀಣ ಕುಟುಂಬಗಳ ಸಬಲೀಕರಣ",
        "vision-desc": "ಭಾರತದ ಪ್ರತಿ ಹಳ್ಳಿಗೂ ಗ್ರಾಮಸಾಥಿ AI ತಲುಪಿಸಿ, ಭ್ರಷ್ಟಾಚಾರ ರಹಿತ ಮತ್ತು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ವ್ಯವಸ್ಥೆ ನಿರ್ಮಿಸುವುದು ನಮ್ಮ ಗುರಿ.",
        "vision-stat1-lbl": "ವಂಚನೆ ಪತ್ತೆಹಚ್ಚುವ ದರ",
        "vision-stat2-lbl": "ಸ್ಥಾನಿಕ ಭಾಷೆಗಳ ಬೆಂಬಲ",
        "vision-stat3-lbl": "ಸುರಕ್ಷಿತ ನೇರ ಲಾಭ ಗುರಿ",
        "vision-btn-discover": "ಸಬ್ಸಿಡಿ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು",
        "vision-btn-report": "ವಂಚನೆ ವರದಿ ಮಾಡಲು",
        "footer-logo-text": "ಗ್ರಾಮಸಾಥಿ AI",
        "footer-desc": "AI ಚಾಲಿತ ಯೋಜನೆಗಳ ಅನ್ವೇಷಣೆ ಮತ್ತು ಸೈಬರ್ ಭದ್ರತಾ ವೇದಿಕೆ. ಗ್ರಾಮೀಣ ಜನರ ಪ್ರಗತಿಗಾಗಿ ರೂಪಿಸಿದ ತಂತ್ರಜ್ಞಾನ.",
        "footer-col-discovery": "ಯೋಜನೆಗಳು",
        "footer-link-farmers": "ರೈತರ ಸಬ್ಸಿಡಿಗಳು",
        "footer-link-scholars": "ಸ್ಕಾಲರ್‌ಶಿಪ್ ಶೋಧಕ",
        "footer-link-health": "ಆರೋಗ್ಯ ಯೋಜನೆಗಳು",
        "footer-link-skills": "ತರಬೇತಿ ಕಾರ್ಯಕ್ರಮಗಳು",
        "footer-col-safety": "ಸೈಬರ್ ರಕ್ಷಣೆ",
        "footer-link-verify": "ಲಿಂಕ್ ಪರಿಶೀಲನೆ",
        "footer-link-report": "ನಕಲಿ ವೆಬ್‌ಸೈಟ್ ರಿಪೋರ್ಟ್",
        "footer-link-feeds": "ವಂಚನೆ ಅಲರ್ಟ್ಸ್",
        "footer-link-assistant": "ಡಿಜಿಟಲ್ ಜ್ಞಾನ ನೆರವು",
        "footer-col-news": "ಭದ್ರತಾ ಸುದ್ದಿ",
        "footer-news-desc": "ಹೊಸ ವಂಚನೆಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಬ್‌ಸ್ಕ್ರೈಬ್ ಮಾಡಿ.",
        "footer-news-btn": "ಸೇರಿಕೊಳ್ಳಿ",
        "footer-bottom-copy": "&copy; 2026 ಗ್ರಾಮಸಾಥಿ AI. ರಾಷ್ಟ್ರೀಯ ಡಿಜಿಟಲ್ ಆಡಳಿತ ಹ್ಯಾಕಥಾನ್ ಅಡಿಯಲ್ಲಿ ರಚಿಸಲಾಗಿದೆ.",
        "footer-policy-privacy": "ಗೌಪ್ಯತಾ ನೀತಿ",
        "footer-policy-terms": "ನಿಯಮಗಳು ಮತ್ತು ನಿಬಂಧನೆಗಳು",
        "footer-policy-api": "ರಿಪೋರ್ಟ್ ಥ್ರೆಟ್ API",
        "modal-title": "ಗ್ರಾಮಸಾಥಿ AI ಪೋರ್ಟಲ್",
        "modal-subtitle": "ರಾಷ್ಟ್ರೀಯ ಕಲ್ಯಾಣ ಪರಿಶೀಲನಾ ಪ್ರಮಾಣಪತ್ರ",
        "modal-desc": "ಈ ಪತ್ರವು ನಿಮ್ಮ ಅರ್ಹತೆಗಳನ್ನು ಧೃವೀಕರಿಸುತ್ತದೆ.",
        "modal-name-lbl": "ಅರ್ಜಿದಾರರ ಹೆಸರು:",
        "modal-age-lbl": "ವಯಸ್ಸು / ಲಿಂಗ:",
        "modal-occupation-lbl": "ಉದ್ಯೋಗ:",
        "modal-region-lbl": "ರಾಜ್ಯ / ಜಿಲ್ಲೆ:",
        "modal-score-lbl": "ಅರ್ಹತೆ ಸ್ಕೋರ್:",
        "modal-income-lbl": "ಮಾಸಿಕ ಆದಾಯ:",
        "modal-target-title": "ಅರ್ಹತೆ ಪಡೆದ ಯೋಜನೆ",
        "modal-qr-lbl": "ಸುರಕ್ಷಿತ ಕೆವೈಸಿ ಸ್ಕ್ಯಾನ್",
        "modal-gov-lbl": "ಭಾರತ ಸರ್ಕಾರ",
        "modal-agency-lbl": "ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ ವಿಭಾಗ",
        "modal-status-lbl": "ಸ್ಥಿತಿ: ಸಕ್ರಿಯ / ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
        "modal-btn-print": "ಪ್ರಿಂಟ್ / PDF ಉಳಿಸಿ",
        "modal-btn-close": "ಮುಚ್ಚಿ",
        "profile-name-placeholder": "ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್",
        "profile-age-placeholder": "ಉದಾ. 42",
        "profile-income-placeholder": "ಉದಾ. 12000",
        "shield-url-placeholder": "ಉದಾ. http://pmkisan-subsidy-free.in",
        "shield-text-placeholder": "ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ನಕಲಿಸಿ...",
        "chat-input-placeholder": "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
        "footer-news-placeholder": "ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ"
    }
};
