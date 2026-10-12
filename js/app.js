// ==========================================================================
// CREOVATE - MASTER APPLICATION COORDINATOR (PROTOTYPE DEMONSTRATION)
// State Management, Role Switching, Search & Multi-filtering, UI Bindings
// ==========================================================================

const App = {
  currentRole: 'brand', // 'brand' | 'creator'
  activeCategory: 'All',
  selectedTool: 'All',
  selectedContentType: 'All',
  searchQuery: '',
  sortBy: 'match', // 'match' | 'rating' | 'turnaround' | 'projects'

  escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  },

  formatINR(amount) {
    const value = Number(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number.isFinite(value) ? value : 0);
  },

  init() {
    this.renderRoleHeader();
    this.renderCreators();
    this.bindEvents();

    // Initialize sub-controllers
    PortfolioInspector.init();
    BriefStudio.init();
    EngagementConsole.init();
    PromptPlayground.init();

    // Welcome Toast with demo note
    setTimeout(() => {
      this.showToast('Welcome to CREOVATE (Prototype Demo) — Connecting AI Creators with Brands', 'info');
    }, 400);
  },

  setRole(role) {
    if (this.currentRole === role) return;
    this.currentRole = role;

    const brandBtn = document.getElementById('roleBrandBtn');
    const creatorBtn = document.getElementById('roleCreatorBtn');
    const creatorDashboardSec = document.getElementById('creatorDashboardSection');

    if (role === 'brand') {
      brandBtn?.classList.add('active');
      creatorBtn?.classList.remove('active');
      if (creatorDashboardSec) creatorDashboardSec.style.display = 'none';
      this.showToast('Switched to Brand / Agency Portal (Sample Demo View)', 'info');
    } else {
      creatorBtn?.classList.add('active');
      brandBtn?.classList.remove('active');
      if (creatorDashboardSec) {
        creatorDashboardSec.style.display = 'block';
        this.renderCreatorStudioDashboard();
      }
      this.showToast('Switched to AI Creator Studio (Sample Demo View)', 'info');
    }

    this.renderRoleHeader();
  },

  renderRoleHeader() {
    const profileWrap = document.getElementById('userProfileNavPill');
    if (!profileWrap) return;

    if (this.currentRole === 'brand') {
      const u = CREOVATE_DATA.currentUser.brand;
      profileWrap.innerHTML = `
        <img class="user-avatar" src="${u.avatar}" alt="${u.name}" />
        <div class="user-pill-text">
          <div class="user-name">Nike Lab (Demo)</div>
          <div class="user-sub">Demo balance: ${u.escrowBalance}</div>
        </div>
      `;
    } else {
      const u = CREOVATE_DATA.currentUser.creator;
      profileWrap.innerHTML = `
        <img class="user-avatar" src="${u.avatar}" alt="${u.name}" />
        <div class="user-pill-text">
          <div class="user-name">Elena Rostova</div>
          <div class="user-sub">${u.rating} ★ (142 sample jobs)</div>
        </div>
      `;
    }
  },

  renderCreatorStudioDashboard() {
    const container = document.getElementById('creatorDashboardContainer');
    if (!container) return;

    const u = CREOVATE_DATA.currentUser.creator;

    container.innerHTML = `
      <div class="glass-panel" style="padding:var(--space-8); border:1px solid var(--border-glow); box-shadow:var(--shadow-glow-purple); margin-bottom:var(--space-10); border-radius:var(--radius-xl);">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; margin-bottom:var(--space-6); border-bottom:1px solid var(--border-subtle); padding-bottom:var(--space-5);">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <span class="badge badge-amber">Sample Creator Workspace</span>
              <span class="badge badge-tool">${u.handle}</span>
              <span class="badge badge-match">${u.clusterStatus}</span>
            </div>
            <h2>Welcome back, ${u.creatorName}</h2>
            <p style="font-size:0.88rem; color:var(--text-secondary);">Explore a sample creator dashboard. Uploads, briefs, earnings, model storage, and milestone payouts are demonstrations only.</p>
          </div>

          <button class="btn btn-primary btn-sm" onclick="App.showToast('Simulated: LoRA checkpoint upload dialog opened (demo prototype).', 'action')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload LoRA Safetensors (Demo)
          </button>
        </div>

        <!-- Metric Counters Strip -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:var(--space-4); margin-bottom:var(--space-6);">
          <div style="background:var(--bg-tertiary); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Sample Earnings</div>
            <div style="font-size:1.6rem; font-weight:800; font-family:var(--font-heading); color:var(--accent-emerald);">${u.earnings}</div>
          </div>
          <div style="background:var(--bg-tertiary); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Sample Escrow Status</div>
            <div style="font-size:1.6rem; font-weight:800; font-family:var(--font-heading); color:var(--accent-cyan);">${u.pendingEscrow}</div>
          </div>
          <div style="background:var(--bg-tertiary); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Sample Rating</div>
            <div style="font-size:1.6rem; font-weight:800; font-family:var(--font-heading); color:#FBBF24;">${u.rating} / 5.0</div>
          </div>
          <div style="background:var(--bg-tertiary); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Sample Active Projects</div>
            <div style="font-size:1.6rem; font-weight:800; font-family:var(--font-heading); color:var(--accent-purple);">${u.activeJobsCount} Active</div>
          </div>
        </div>

        <!-- Private Model Repository -->
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <strong style="font-size:0.95rem; color:var(--text-primary);">Private LoRA & ComfyUI Vault (Demo Spec)</strong>
            <span style="font-size:0.75rem; color:var(--text-muted);">Illustrative file list only</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
            ${(u.privateModels || []).map(m => `
              <div style="background:rgba(8,9,14,0.6); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:space-between;">
                <div>
                  <div style="font-family:var(--font-mono); font-size:0.8rem; font-weight:600; color:#E2E8F0;">${m.name}</div>
                  <div style="font-size:0.7rem; color:var(--text-muted);">${m.base} • ${m.size}</div>
                </div>
                <span class="badge badge-amber">Sample file</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderCreators() {
    const grid = document.getElementById('creatorsGridContainer');
    if (!grid) return;

    let list = [...CREOVATE_DATA.creators];

    // Filter by category
    if (this.activeCategory !== 'All') {
      list = list.filter(c => c.specialties.includes(this.activeCategory));
    }

    // Filter by tool
    if (this.selectedTool !== 'All') {
      list = list.filter(c => c.toolstack.some(t => t.toLowerCase().includes(this.selectedTool.toLowerCase())));
    }

    // Filter by the kind of deliverable a creator produces.
    if (this.selectedContentType !== 'All') {
      list = list.filter(c => (c.contentTypes || []).includes(this.selectedContentType));
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        (c.role && c.role.toLowerCase().includes(q)) ||
        (c.bio || '').toLowerCase().includes(q) ||
        (c.toolstack || []).some(t => t.toLowerCase().includes(q)) ||
        (c.specialties || []).some(s => s.toLowerCase().includes(q)) ||
        (c.skills || []).some(s => s.toLowerCase().includes(q)) ||
        (c.contentTypes || []).some(type => type.toLowerCase().includes(q)) ||
        (c.formats || []).some(format => format.toLowerCase().includes(q)) ||
        (c.featuredWork?.title || '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.sortBy === 'match') {
      list.sort((a, b) => b.matchScore - a.matchScore);
    } else if (this.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'projects') {
      list.sort((a, b) => b.completedEngagements - a.completedEngagements);
    }

    const resultsCount = document.getElementById('creatorResultsCount');
    if (resultsCount) {
      resultsCount.textContent = `Showing ${list.length} of ${CREOVATE_DATA.creators.length} sample creators`;
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:60px 20px; background:var(--bg-card); border-radius:var(--radius-xl); border:1px solid var(--border-subtle);">
          <div style="font-size:2.5rem; margin-bottom:12px;">🔍</div>
          <h3 style="margin-bottom:8px;">No AI creators matched your filters</h3>
          <p style="color:var(--text-secondary); margin-bottom:16px;">Try clearing filters or search for another tool like 'Flux.1' or 'Runway'.</p>
          <button class="btn btn-secondary" onclick="App.resetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(c => {
      // Sensible fallback for role to NEVER show undefined
      const creatorRole = c.role || (c.specialties && c.specialties[0]) || "Generative AI Creator";
      const hasDemoMatch = MatchEngine.hasActiveMatch && !MatchEngine.noMatchFound;
      const contentTypes = (c.contentTypes || []).map(type => this.escapeHTML(type)).join(' · ') || 'Not listed';
      const skills = (c.skills || []).slice(0, 4).map(skill => this.escapeHTML(skill)).join(' · ') || 'Not listed';
      const formats = (c.formats || []).map(format => this.escapeHTML(format)).join(' · ') || 'Not listed';
      const signals = c.verificationSignals || {};

      return `
      <div class="creator-card" id="card-${c.id}">
        <!-- Card Header -->
        <div class="creator-card-header">
          <div class="creator-avatar-wrap">
            <img class="creator-avatar" src="${c.avatar}" alt="${c.name}" />
            <div class="creator-badge-indicator demo-profile-indicator" title="Illustrative sample profile">S</div>
          </div>
          <div class="creator-header-meta">
            <div class="creator-name-row">
              <span class="creator-name">${c.name}</span>
              <span class="match-percent">${hasDemoMatch ? `${c.matchScore}% Demo match` : 'Sample profile'}</span>
            </div>
            <div class="creator-handle">${c.handle} • ${c.location}</div>
            <p class="creator-role">${creatorRole}</p>
            ${hasDemoMatch && c.matchReason ? `
              <div class="match-reason-box" style="font-size:0.75rem; color:#38BDF8; background:rgba(6,182,212,0.08); padding:5px 8px; border-radius:var(--radius-xs); border:1px solid rgba(6,182,212,0.2); margin-top:6px; display:flex; align-items:flex-start; gap:6px; line-height:1.35;">
                <span style="flex-shrink:0;">💡</span>
                <span><strong>Why this demo match:</strong> ${this.escapeHTML(c.matchReason)}</span>
              </div>
            ` : ''}
            <div class="creator-profile-facts">
              <div><strong>Content:</strong> ${contentTypes}</div>
              <div><strong>Skills:</strong> ${skills}</div>
              <div><strong>Outputs:</strong> ${formats}</div>
            </div>
            <div class="creator-trust-signals" aria-label="Sample verification signals">
              <span class="creator-trust-signal" title="Tool claims are creator-reported sample data">Tools: ${this.escapeHTML(signals.tools || 'sample list')}</span>
              <span class="creator-trust-signal" title="Workflow details are illustrative and not independently checked">Workflow: ${this.escapeHTML(signals.workflow || 'sample record')}</span>
              <span class="creator-trust-signal" title="Portfolio examples are sample work">Past work: ${this.escapeHTML(signals.pastWork || 'sample work')}</span>
            </div>
          </div>
        </div>

        <!-- Portfolio Reel Viewport -->
        <div class="creator-portfolio-preview" onclick="PortfolioInspector.open('${c.id}')">
          <img class="creator-portfolio-img" src="${c.featuredWork.imageAfter}" alt="${c.featuredWork.title}" loading="lazy" />
          <div class="portfolio-overlay-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ${c.featuredWork.comfyNodesCount} Sample Nodes
          </div>
          <div class="inspect-trigger-overlay">
            <button class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Deep Inspect Portfolio & Nodes
            </button>
          </div>
        </div>

        <!-- Card Body -->
        <div class="creator-card-body">
          <div class="toolstack-tags">
            ${c.toolstack.map(t => `<span class="badge badge-tool">${t}</span>`).join('')}
          </div>

          <div class="creator-stats-row">
            <div class="stat-group">
              <span class="stat-group-val">★ ${c.rating}</span>
              <span class="stat-group-lbl">${c.reviewsCount} Reviews</span>
            </div>
            <div class="stat-group">
              <span class="stat-group-val">${c.completedEngagements}</span>
              <span class="stat-group-lbl">Completed</span>
            </div>
            <div class="stat-group">
              <span class="stat-group-val">${c.turnaround}</span>
              <span class="stat-group-lbl">Avg Turnaround</span>
            </div>
            <div class="stat-group">
              <span class="stat-group-val" style="color:var(--accent-emerald)">${c.startingBriefPrice}</span>
              <span class="stat-group-lbl">Starting Min</span>
            </div>
          </div>

          <div class="creator-card-footer">
            <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="PortfolioInspector.open('${c.id}')">
              Inspect Pipeline
            </button>
            <button class="btn btn-primary btn-sm" style="flex:1;" onclick="App.openInviteModal('${c.id}')">
              Invite to Brief (Demo)
            </button>
          </div>
        </div>
      </div>
    `;
    }).join('');
  },

  setCategory(category) {
    this.activeCategory = category;

    // Update active chip classes
    document.querySelectorAll('.filter-chip').forEach(chip => {
      if (chip.getAttribute('data-category') === category) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    this.renderCreators();
  },

  setToolFilter(tool) {
    this.selectedTool = tool;
    this.renderCreators();
  },

  setContentTypeFilter(contentType) {
    this.selectedContentType = contentType;
    this.renderCreators();
  },

  setSort(sort) {
    this.sortBy = sort;
    this.renderCreators();
  },

  resetFilters() {
    this.activeCategory = 'All';
    this.selectedTool = 'All';
    this.selectedContentType = 'All';
    this.searchQuery = '';
    this.sortBy = 'match';

    const searchInput = document.getElementById('creatorSearchInput');
    const toolSelect = document.getElementById('toolFilterSelect');
    const contentTypeSelect = document.getElementById('contentTypeFilterSelect');
    const sortSelect = document.getElementById('sortFilterSelect');

    if (searchInput) searchInput.value = '';
    if (toolSelect) toolSelect.value = 'All';
    if (contentTypeSelect) contentTypeSelect.value = 'All';
    if (sortSelect) sortSelect.value = 'match';

    MatchEngine.clearMatch();
    this.setCategory('All');
  },

  bindEvents() {
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const primaryNavLinks = document.getElementById('primaryNavLinks');
    const closeMobileNav = () => {
      mobileNavToggle?.setAttribute('aria-expanded', 'false');
      primaryNavLinks?.classList.remove('is-open');
    };

    mobileNavToggle?.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', String(!isExpanded));
      primaryNavLinks?.classList.toggle('is-open', !isExpanded);
    });

    primaryNavLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    // Search input
    const searchInput = document.getElementById('creatorSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderCreators();
      });
    }

    // Hero AI Matchmaker Bar
    const heroMatchInput = document.getElementById('heroMatchInput');
    const heroMatchBtn = document.getElementById('heroMatchBtn');

    if (heroMatchInput && heroMatchBtn) {
      heroMatchBtn.addEventListener('click', () => {
        MatchEngine.match(heroMatchInput.value);
      });

      heroMatchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          MatchEngine.match(heroMatchInput.value);
        }
      });
    }
  },

  runMatchQuery(query) {
    const input = document.getElementById('heroMatchInput');
    if (input) input.value = query;
    MatchEngine.match(query);
  },

  openInviteModal(creatorId) {
    const creator = CREOVATE_DATA.creators.find(c => c.id === creatorId);
    if (!creator) return;

    const modal = document.getElementById('briefDetailModal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="document.getElementById('briefDetailModal').classList.remove('active')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style="padding:var(--space-6); border-bottom:1px solid var(--border-medium);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
            <span class="badge badge-verified">Direct Commission (Demo)</span>
            <span class="badge badge-amber">No Real Funds Transferred</span>
          </div>
          <h2 style="font-size:1.5rem;">Commission ${creator.name}</h2>
          <div style="font-size:0.85rem; color:var(--text-secondary);">
            Turnaround: ${creator.turnaround} • Hourly: ${creator.hourlyRate}/hour • Starting: ${creator.startingBriefPrice}
          </div>
        </div>

        <div style="padding:var(--space-6); display:flex; flex-direction:column; gap:16px;">
          <div>
            <label class="form-label">Select Active Brand Brief to Commission</label>
            <select class="form-select" id="inviteBriefSelect">
              ${CREOVATE_DATA.briefs.map(b => `
                <option value="${b.id}">${b.title} (${b.budget})</option>
              `).join('')}
              <option value="custom">+ Create New Bespoke Direct Milestone</option>
            </select>
          </div>

          <div>
            <label class="form-label">Personalized Direct Note to Creator</label>
            <textarea class="form-textarea" placeholder="Detail your specific style target, required ComfyUI node deliverables, or commercial timeline..."></textarea>
          </div>

          <div style="background:var(--bg-tertiary); padding:14px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <strong style="color:var(--text-primary); font-size:0.9rem; display:block;">Simulated Escrow Deposit</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">Prototype demonstration: funds are tracked locally in mock state</span>
            </div>
            <span style="color:var(--accent-emerald); font-weight:800; font-family:var(--font-heading); font-size:1.2rem;">${creator.startingBriefPrice}</span>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
            <button class="btn btn-secondary" onclick="document.getElementById('briefDetailModal').classList.remove('active')">Cancel</button>
            <button class="btn btn-primary" onclick="App.confirmInvite('${creator.name}')">
              Simulate Sending Invite (No funds move)
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  confirmInvite(creatorName) {
    document.getElementById('briefDetailModal')?.classList.remove('active');
    this.showToast(`Simulated: Demo invitation & escrow commitment logged for ${creatorName}.`, 'success');
  },

  openIPAgreementModal() {
    const modal = document.getElementById('briefDetailModal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content" style="max-width:850px;" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="document.getElementById('briefDetailModal').classList.remove('active')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style="padding:var(--space-6); border-bottom:1px solid var(--border-medium);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
            <span class="badge badge-amber">Demo Legal Specification</span>
            <span class="badge badge-tool">Prototype Framework</span>
          </div>
          <h2 style="font-size:1.5rem;">Sample IP Transfer & Escrow Concepts</h2>
          <div style="font-size:0.85rem; color:var(--text-secondary);">
            Illustrative workflow only. This prototype provides no legal advice, warranty, contract, or rights transfer.
          </div>
        </div>

        <div style="padding:var(--space-6); display:flex; flex-direction:column; gap:16px; max-height:60vh; overflow-y:auto; font-size:0.9rem; line-height:1.6; color:var(--text-secondary);">
          <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); padding:10px 14px; border-radius:var(--radius-sm); font-size:0.82rem; color:#FBBF24;">
            *Prototype Notice: This sample demonstrates possible platform concepts only. It is not a legal document, has not been reviewed by counsel, and creates no rights or obligations.
          </div>

          <div>
            <h4 style="color:var(--text-primary); margin-bottom:4px;">1. Example Rights Transfer Step</h4>
            <p>A future service could document the agreed ownership and permitted uses of a deliverable. No rights are assigned by this prototype.</p>
          </div>

          <div>
            <h4 style="color:var(--text-primary); margin-bottom:4px;">2. Example Provenance Review</h4>
            <p>A production marketplace could collect creator disclosures and supporting records for review. The sample profiles and assets here have not been independently verified.</p>
          </div>

          <div>
            <h4 style="color:var(--text-primary); margin-bottom:4px;">3. Example Workflow Records</h4>
            <p>Prompt, seed, and node-graph records can help teams review a production process. Values shown in this prototype are illustrative and do not guarantee reproducibility.</p>
          </div>

          <div>
            <h4 style="color:var(--text-primary); margin-bottom:4px;">4. Simulated Digital Fingerprint</h4>
            <div style="background:var(--bg-tertiary); padding:10px; border-radius:var(--radius-sm); font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan);">
              Mock Certificate Hash: DEMO-SHA256-4e91b5c82a7f019d38c1bb72a4ff039918aa024b
            </div>
          </div>
        </div>

        <div style="padding:var(--space-5) var(--space-6); border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:12px; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="document.getElementById('briefDetailModal').classList.remove('active')">Close Agreement</button>
          <button class="btn btn-primary" onclick="App.showToast('Simulated: Sample commercial IP template reviewed.', 'success'); document.getElementById('briefDetailModal').classList.remove('active');">
            Simulate Agreement PDF Download (Demo)
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'action') {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>';
    } else {
      iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = iconSvg;
    const messageNode = document.createElement('div');
    messageNode.style.flex = '1';
    messageNode.textContent = message;
    toast.appendChild(messageNode);

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
