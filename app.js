/* ==========================================================================
   GramSathi AI - Application Script
   Interactive Features & Dashboard Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
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
        { name: "PM Kisan Samman Nidhi", cat: "Agriculture", val: "₹6,000/yr", desc: "Direct income support of ₹6,000 per year in three equal installments to small and marginal farmer families.", link: "#" },
        { name: "Pradhan Mantri Fasal Bima Yojana", cat: "Agriculture", val: "Premium Subsidy", desc: "Crop insurance scheme offering comprehensive risk cover against crop failure due to natural calamities.", link: "#" },
        { name: "PM Surya Ghar (Solar Agriculture Pump)", cat: "Agriculture", val: "90% Subsidy", desc: "Subsidies for solar-powered water pumps, eliminating electricity and diesel overheads.", link: "#" },
        { name: "Ayushman Bharat Jan Arogya Yojana", cat: "Healthcare", val: "₹5 Lakhs/yr", desc: "Provides free health insurance cover up to ₹5,00,000 per family per year for secondary/tertiary hospitalisation.", link: "#" },
        { name: "Kisan Credit Card (KCC) Low Interest Loan", cat: "Finance", val: "4% Interest rate", desc: "Access to institutional credit at highly subsidized interest rates for crop cultivation and farm upkeep.", link: "#" }
    ],
    Student: [
        { name: "Post-Matric Scholarship Scheme", cat: "Education", val: "Full Fee Waiver", desc: "Financial support for students belonging to low income groups for post-matriculation or post-secondary courses.", link: "#" },
        { name: "PM Skill Development (PMKVY) Training", cat: "Employment", val: "Free Placement", desc: "Skill certification scheme enabling youth to take up industry-relevant skill training with job placement support.", link: "#" },
        { name: "Pradhan Mantri Vidya Lakshmi Program", cat: "Education", val: "Easy Education Loans", desc: "Portal for education loan applications with low interest rates and flexible moratorium periods.", link: "#" },
        { name: "Free Student Digital Device Program", cat: "Education", val: "Free Tablet/Laptop", desc: "State-sponsored initiative providing free tablets or laptops to merit students from rural schools.", link: "#" }
    ],
    JobSeeker: [
        { name: "PM Skill Development (PMKVY) Training", cat: "Employment", val: "Free Course & Placement", desc: "Skill certification scheme enabling youth to take up industry-relevant skill training.", link: "#" },
        { name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana", cat: "Employment", val: "Residential Course", desc: "Placement-linked skill training program exclusively targeting rural poor youth.", link: "#" },
        { name: "Mudra Loan Scheme (Shishu Category)", cat: "Finance", val: "Up to ₹50,000 Loan", desc: "Collateral-free business setup loans for starting small service or manufacturing units.", link: "#" },
        { name: "Ayushman Bharat Health Card", cat: "Healthcare", val: "₹5 Lakhs Cover", desc: "Cashless secondary and tertiary healthcare coverage.", link: "#" }
    ],
    Entrepreneur: [
        { name: "Stand-Up India Scheme", cat: "Entrepreneurship", val: "₹10L - ₹1Cr Loan", desc: "Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch.", link: "#" },
        { name: "Prime Minister's Employment Generation Program (PMEGP)", cat: "Entrepreneurship", val: "35% Subsidy", desc: "Credit-linked subsidy program for setting up new micro-enterprises in rural areas.", link: "#" },
        { name: "Mudra Loan Scheme (Kishore & Tarun)", cat: "Finance", val: "₹50k - ₹10 Lakhs", desc: "Collateral-free loans for micro and small business expansion.", link: "#" },
        { name: "Udyam Assist Registration Portal", cat: "Entrepreneurship", val: "MSME Benefits", desc: "Instant certification enabling small businesses to access formal banking credit and subsidy schemes.", link: "#" }
    ],
    Artisan: [
        { name: "PM Vishwakarma Scheme", cat: "Entrepreneurship", val: "Toolkits + Loan", desc: "End-to-end support for traditional artisans including toolkit incentive of ₹15,000, training, and collateral-free credit.", link: "#" },
        { name: "Mudra Loan Scheme (Shishu)", cat: "Finance", val: "Up to ₹50,000", desc: "Collateral-free credit to scale small micro-units.", link: "#" },
        { name: "PM Garib Kalyan Anna Yojana", cat: "Healthcare", val: "Free Foodgrains", desc: "Welfare scheme providing 5 kg of free foodgrains per month to eligible families.", link: "#" }
    ],
    Retired: [
        { name: "Atal Pension Yojana", cat: "Finance", val: "₹1,000-₹5,000/mo", desc: "Guaranteed minimum monthly pension for citizens in the unorganized sector starting from age 60.", link: "#" },
        { name: "Indira Gandhi National Old Age Pension Scheme", cat: "Finance", val: "Pension Subvention", desc: "Monthly financial pension assistance for senior citizens belonging to below-poverty-line families.", link: "#" },
        { name: "Ayushman Bharat Senior Citizen Care", cat: "Healthcare", val: "₹5 Lakhs Cover", desc: "Special health cards ensuring cashless medical treatment at empanelled private/public hospitals.", link: "#" }
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
    alert(`Success! Opening official application routing portal for "${schemeName}". Complete KYC authentication inside.`);
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

    // Decide if safe or scam based on mock parameters
    let isSafe = false;
    let score = 12;
    let verdictTitle = "Potential Cybersecurity Scam Detected";
    let indicators = [];

    // Simple heuristic for demo
    if (target.includes('.gov.in') || target.includes('.nic.in') || target.includes('official') || target.includes('pmkisan.gov.in')) {
        isSafe = true;
        score = 98;
        verdictTitle = "Verified Government Scheme";
        indicators = [
            { icon: "fa-circle-check", class: "success", text: "Registered under official National Informatics Centre (gov.in)" },
            { icon: "fa-circle-check", class: "success", text: "Valid SSL certificate verified by government authority" },
            { icon: "fa-circle-check", class: "success", text: "No payment gateways requests for processing subsidies detected" }
        ];
    } else {
        isSafe = false;
        score = 14;
        verdictTitle = "Flagged Scam / Phishing Attack";
        indicators = [
            { icon: "fa-triangle-exclamation", class: "danger", text: "Suspicious domain name. Mimics official portal with different extension (.org / .in / .net)" },
            { icon: "fa-triangle-exclamation", class: "danger", text: "Suspicious payment requests found. Genuine schemes never ask for payment upfront" },
            { icon: "fa-triangle-exclamation", class: "danger", text: "Lacks authorized security credentials. Domain registered 4 days ago" }
        ];
    }

    reportCard.innerHTML = `
        <div class="report-badge-stamp ${isSafe ? 'safe' : 'scam'}"></div>
        <div class="report-header">
            <div class="report-title">
                <h4>${verdictTitle}</h4>
                <span>Target: ${target.substring(0, 32)}${target.length > 32 ? '...' : ''}</span>
            </div>
            <div class="report-score-box">
                <div class="report-score-num ${isSafe ? 'safe' : 'scam'}">${score}%</div>
                <div class="report-score-lbl">Trust Score</div>
            </div>
        </div>

        <div class="report-indicator-row ${isSafe ? 'safe' : 'scam'}">
            <i class="fa-solid ${isSafe ? 'fa-shield-halved' : 'fa-circle-exclamation'}"></i>
            <span>${isSafe ? 'Official Government Portal' : 'High Cyber Security Risk'}</span>
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
                ${isSafe ? 'Proceed to Official Portal' : 'Block & Report Scam'}
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
            langPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentLang = pill.getAttribute('data-lang');
            renderSuggestedQuestions();
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
