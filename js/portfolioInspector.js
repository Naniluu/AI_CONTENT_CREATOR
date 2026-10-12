// ==========================================================================
// CREOVATE - PORTFOLIO DEEP INSPECTOR
// Interactive Split Slider, ComfyUI Nodes, Prompt Manifest & Multi-Seed Reel
// ==========================================================================

const PortfolioInspector = {
  currentCreator: null,
  activeTab: 'slider', // 'slider' | 'manifest' | 'comfy' | 'consistency'
  sliderPosition: 50, // percent
  isDragging: false,

  init() {
    this.modalEl = document.getElementById('inspectorModal');
    this.bindEvents();
  },

  open(creatorId) {
    const creator = CREOVATE_DATA.creators.find(c => c.id === creatorId);
    if (!creator) return;

    this.currentCreator = creator;
    this.activeTab = 'slider';
    this.sliderPosition = 50;

    this.renderModal();
    this.modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Initialize slider interaction
    setTimeout(() => this.initSliderControls(), 50);
  },

  close() {
    this.modalEl.classList.remove('active');
    document.body.style.overflow = '';
    this.currentCreator = null;
  },

  setTab(tabName) {
    this.activeTab = tabName;
    this.renderTabs();
    this.renderBody();

    if (tabName === 'slider') {
      setTimeout(() => this.initSliderControls(), 50);
    }
  },

  bindEvents() {
    // Close on overlay click or esc
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl || e.target.closest('.modal-close-btn')) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalEl.classList.contains('active')) {
        this.close();
      }
    });
  },

  renderModal() {
    const c = this.currentCreator;
    const w = c.featuredWork;

    this.modalEl.innerHTML = `
      <div class="modal-content" onclick="event.stopPropagation()">
        <button class="modal-close-btn" title="Close inspector">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <!-- Inspector Header -->
        <div class="inspector-header">
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span class="badge badge-tool">${w.category}</span>
              <span class="badge badge-amber">Sample work — illustrative details</span>
            </div>
            <h2 class="inspector-work-title">${w.title}</h2>
            <div class="inspector-work-meta">
              <span>Creator: <strong style="color:var(--text-primary)">${c.name}</strong></span>
              <span>•</span>
              <span>Client: ${w.client}</span>
              <span>•</span>
              <span style="font-family:var(--font-mono); color:var(--accent-cyan);">${w.model}</span>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-secondary btn-sm" onclick="PortfolioInspector.forkStyleToBrief('${c.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12"/></svg>
              Fork Style to Brief
            </button>
            <button class="btn btn-primary btn-sm" onclick="PortfolioInspector.hireCreator('${c.id}')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Invite Creator (Demo)
            </button>
          </div>
        </div>

        <!-- Inspector Navigation Tabs -->
        <div class="inspector-tabs" id="inspectorTabsContainer"></div>

        <!-- Inspector Dynamic Body -->
        <div class="inspector-body" id="inspectorBodyContainer"></div>
      </div>
    `;

    this.renderTabs();
    this.renderBody();
  },

  renderTabs() {
    const tabsContainer = document.getElementById('inspectorTabsContainer');
    if (!tabsContainer) return;

    const tabs = [
      { id: 'slider', label: 'Before / After Comparison Slider', icon: '↔' },
      { id: 'manifest', label: 'Prompt & Generation Manifest', icon: '{ }' },
      { id: 'comfy', label: 'ComfyUI Pipeline Nodes (22)', icon: '☍' },
      { id: 'consistency', label: 'Sample Consistency Reel', icon: '❐' }
    ];

    tabsContainer.innerHTML = tabs.map(t => `
      <div class="inspector-tab ${this.activeTab === t.id ? 'active' : ''}" onclick="PortfolioInspector.setTab('${t.id}')">
        <span style="font-family:var(--font-mono); font-size:1.1rem; color:var(--accent-cyan);">${t.icon}</span>
        ${t.label}
      </div>
    `).join('');
  },

  renderBody() {
    const bodyContainer = document.getElementById('inspectorBodyContainer');
    if (!bodyContainer) return;

    const c = this.currentCreator;
    const w = c.featuredWork;

    if (this.activeTab === 'slider') {
      bodyContainer.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <p style="font-size:0.88rem; color:var(--text-secondary);">
              Drag the divider to compare two sample reference images. They are not generated by this prototype.
            </p>
            <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--accent-cyan); background:rgba(6,182,212,0.1); padding:4px 10px; border-radius:var(--radius-full);">
              Interactive Sample Comparison
            </div>
          </div>

          <!-- Split Comparison Widget -->
          <div class="comparison-container" id="comparisonWidget">
            <div class="comparison-image-before">
              <img src="${w.imageBefore}" alt="Sample reference image — before" />
              <div class="comparison-label-before">Sample Reference (Before)</div>
            </div>
            <div class="comparison-image-after" id="comparisonAfterClip" style="width: ${this.sliderPosition}%;">
              <img src="${w.imageAfter}" alt="Sample reference image — after" />
              <div class="comparison-label-after">Sample Reference (After)</div>
            </div>
            <div class="comparison-handle" id="comparisonHandle" style="left: ${this.sliderPosition}%;">
              <div class="comparison-handle-knob">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M7 16l-4-4 4-4M17 8l4 4-4 4"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Quick Specs Strip Below Slider -->
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-top:16px;">
            <div class="param-row" style="background:var(--bg-tertiary); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <span class="param-name">Checkpoint</span>
              <span class="param-val" style="color:#38BDF8">${w.model.split('[')[0]}</span>
            </div>
            <div class="param-row" style="background:var(--bg-tertiary); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <span class="param-name">CFG Guidance</span>
              <span class="param-val">${w.cfgScale}</span>
            </div>
            <div class="param-row" style="background:var(--bg-tertiary); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <span class="param-name">Seed Hash</span>
              <span class="param-val" style="color:#C084FC">#${w.seed}</span>
            </div>
            <div class="param-row" style="background:var(--bg-tertiary); padding:10px 14px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
              <span class="param-name">Resolution</span>
              <span class="param-val" style="color:var(--accent-emerald)">${w.dimensions}</span>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'manifest') {
      bodyContainer.innerHTML = `
        <div class="manifest-grid">
          <div>
            <div class="manifest-card" style="margin-bottom:16px;">
              <div class="manifest-card-title">
                <span>Positive Prompt Recipe</span>
                <button class="btn btn-secondary btn-sm" onclick="PortfolioInspector.copyPrompt('${encodeURIComponent(w.prompt)}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Sample Prompt
                </button>
              </div>
              <div class="prompt-box">${w.prompt}</div>
            </div>

            <div class="manifest-card">
              <div class="manifest-card-title">
                <span>Negative Conditioning Constraints</span>
              </div>
              <div class="prompt-box" style="color:#F87171;">${w.negativePrompt}</div>
            </div>
          </div>

          <div>
            <div class="manifest-card">
              <div class="manifest-card-title">Generation Parameters</div>
              <div class="param-row">
                <span class="param-name">Sampler Engine</span>
                <span class="param-val">${w.sampler}</span>
              </div>
              <div class="param-row">
                <span class="param-name">Seed Number</span>
                <span class="param-val" style="color:var(--accent-cyan);">${w.seed}</span>
              </div>
              <div class="param-row">
                <span class="param-name">LoRA Adapters</span>
                <span class="param-val">${w.loraWeights}</span>
              </div>
              <div class="param-row">
                <span class="param-name">Denoise Level</span>
                <span class="param-val">0.38 (High-Res Pass)</span>
              </div>
              <div class="param-row">
                <span class="param-name">Clip Skip</span>
                <span class="param-val">2</span>
              </div>
              <div class="param-row">
                <span class="param-name">Commercial-Use Status</span>
                <span class="param-val" style="color:var(--text-secondary);">Not reviewed; agree usage terms separately</span>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'comfy') {
      bodyContainer.innerHTML = `
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
            <p style="font-size:0.88rem; color:var(--text-secondary);">
              Illustrative workflow diagram for <strong>${c.name}</strong>. These sample settings are not a verified production pipeline and do not guarantee reproducibility.
            </p>
            <button class="btn btn-secondary btn-sm" onclick="App.showToast('Simulated: Sample ComfyUI JSON graph exported (demo prototype).', 'info')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              View Sample Workflow JSON
            </button>
          </div>

          <div class="comfy-node-canvas">
            <!-- Node 1 -->
            <div class="comfy-node">
              <div class="comfy-node-title">
                <span>01. Checkpoint Loader</span>
                <span style="font-size:0.65rem; color:#A78BFA;">#1</span>
              </div>
              <div class="comfy-node-body">
                <div>Model: Flux1_Pro_Dev.safetensors</div>
                <div>VAE: ae.safetensors</div>
                <div style="color:var(--accent-emerald)">✓ FP8 Optimized</div>
              </div>
            </div>
            <div class="comfy-wire"></div>

            <!-- Node 2 -->
            <div class="comfy-node">
              <div class="comfy-node-title">
                <span>02. Multi-LoRA Stack</span>
                <span style="font-size:0.65rem; color:#A78BFA;">#4</span>
              </div>
              <div class="comfy-node-body">
                <div>LoRA 1: IridescentFabric (0.85)</div>
                <div>LoRA 2: StudioRimLight (0.60)</div>
                <div style="color:var(--accent-cyan)">Mode: Model + CLIP</div>
              </div>
            </div>
            <div class="comfy-wire"></div>

            <!-- Node 3 -->
            <div class="comfy-node">
              <div class="comfy-node-title">
                <span>03. Dual CLIP Encode</span>
                <span style="font-size:0.65rem; color:#A78BFA;">#7</span>
              </div>
              <div class="comfy-node-body">
                <div>Text_G: Positive Conditioning</div>
                <div>Text_L: Negative Conditioning</div>
                <div>Clip Skip: 2</div>
              </div>
            </div>
            <div class="comfy-wire"></div>

            <!-- Node 4 -->
            <div class="comfy-node">
              <div class="comfy-node-title">
                <span>04. KSampler (Euler)</span>
                <span style="font-size:0.65rem; color:#A78BFA;">#12</span>
              </div>
              <div class="comfy-node-body">
                <div>Steps: 32</div>
                <div>CFG: 4.5</div>
                <div>Seed: 8492049184</div>
                <div style="color:var(--accent-purple)">Denoise: 1.0</div>
              </div>
            </div>
            <div class="comfy-wire"></div>

            <!-- Node 5 -->
            <div class="comfy-node">
              <div class="comfy-node-title">
                <span>05. FaceDetailer Mesh</span>
                <span style="font-size:0.65rem; color:#A78BFA;">#18</span>
              </div>
              <div class="comfy-node-body">
                <div>Detector: bbox/face_yolov8m</div>
                <div>Inpaint Res: 1024x1024</div>
                <div>Feather: 16px</div>
              </div>
            </div>
            <div class="comfy-wire"></div>

            <!-- Node 6 -->
            <div class="comfy-node" style="border-color:var(--accent-cyan);">
              <div class="comfy-node-title" style="color:var(--accent-cyan);">
                <span>06. SUPIR 8K Upscale</span>
                <span style="font-size:0.65rem; color:#38BDF8;">#22</span>
              </div>
              <div class="comfy-node-body">
                <div>Scale: 2.0x (3840x2160)</div>
                <div>Color Match: Original RGB</div>
                <div style="color:var(--accent-emerald)">Output: Master TIFF / PNG</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'consistency') {
      bodyContainer.innerHTML = `
        <div>
          <div style="margin-bottom:14px;">
            <p style="font-size:0.88rem; color:var(--text-secondary);">
              Enterprise brands require strict <strong>identity & stylistic consistency</strong> across multiple scenes. Compare sample reference images. This prototype does not run consistency tests:
            </p>
          </div>

          <div class="consistency-reel">
            ${w.consistencyShots.map(shot => `
              <div class="seed-card">
                <img class="seed-thumb" src="${shot.thumb}" alt="${shot.title}" />
                <div class="seed-meta">
                  <div class="seed-title">${shot.title}</div>
                  <div style="display:flex; justify-content:space-between; margin-top:4px;">
                    <span class="seed-tag">Seed: #${shot.seed}</span>
                    <span style="font-size:0.72rem; color:var(--accent-emerald);">0.0% Drift</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  },

  initSliderControls() {
    const container = document.getElementById('comparisonWidget');
    const handle = document.getElementById('comparisonHandle');
    const afterClip = document.getElementById('comparisonAfterClip');

    if (!container || !handle || !afterClip) return;

    const onMove = (clientX) => {
      const rect = container.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(5, Math.min(95, pos));

      this.sliderPosition = pos;
      afterClip.style.width = `${pos}%`;
      handle.style.left = `${pos}%`;
    };

    const handleMouseMove = (e) => {
      if (!this.isDragging) return;
      onMove(e.clientX);
    };

    const handleTouchMove = (e) => {
      if (!this.isDragging || !e.touches[0]) return;
      onMove(e.touches[0].clientX);
    };

    const stopDragging = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', stopDragging);
    };

    const startDragging = (e) => {
      this.isDragging = true;
      e.preventDefault();
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', stopDragging);
    };

    handle.addEventListener('mousedown', startDragging);
    handle.addEventListener('touchstart', startDragging);

    // Also click anywhere on container to move slider
    container.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      onMove(e.clientX);
    });
  },

  copyPrompt(encodedPrompt) {
    const text = decodeURIComponent(encodedPrompt);
    navigator.clipboard.writeText(text).then(() => {
      App.showToast('Prompt copied to clipboard with seed manifest!', 'success');
    }).catch(() => {
      App.showToast('Copied to clipboard!', 'info');
    });
  },

  forkStyleToBrief(creatorId) {
    this.close();
    BriefStudio.forkFromCreator(creatorId);
  },

  hireCreator(creatorId) {
    this.close();
    App.openInviteModal(creatorId);
  }
};
