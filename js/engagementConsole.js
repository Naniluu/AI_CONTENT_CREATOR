// ==========================================================================
// CREOVATE - ENGAGEMENT & PRODUCTION WORKSPACE (PROTOTYPE DEMONSTRATION)
// Escrow Milestones, Visual Annotation Canvas, AI Prompt Resolvers & Delivery Vault
// ==========================================================================

const EngagementConsole = {
  data: CREOVATE_DATA.activeEngagement,
  selectedPinId: null,

  init() {
    this.render();
    this.bindCanvasInteraction();
  },

  render() {
    const container = document.getElementById('engagementWorkspaceContainer');
    if (!container) return;

    const eng = this.data;

    container.innerHTML = `
      <div class="engagement-console">
        <!-- Engagement Header -->
        <div class="engagement-header">
          <div class="engagement-title-area">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <span class="badge badge-match">Sample Production Workspace</span>
              <span class="badge badge-amber">Demo Project (Simulated Escrow)</span>
              <span class="badge badge-verified">ID: #${eng.id}</span>
            </div>
            <h3>${eng.briefTitle}</h3>
            <div class="engagement-parties">
              <div class="party-badge">
                <img src="${eng.brandAvatar}" style="width:20px; height:20px; border-radius:50%;" />
                <span>Brand: <strong>${eng.brand}</strong></span>
              </div>
              <span style="color:var(--text-muted)">⇄</span>
              <div class="party-badge">
                <img src="${eng.creatorAvatar}" style="width:20px; height:20px; border-radius:50%;" />
                <span>Creator: <strong>${eng.creator}</strong></span>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:16px; align-items:center;">
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Sample Contract Amount</div>
              <div style="font-size:1.6rem; font-weight:800; font-family:var(--font-heading); color:var(--accent-emerald);">${eng.totalContractValue}</div>
              <div style="font-size:0.75rem; color:#94A3B8;">Released: ${eng.escrowReleased} • Locked: ${eng.escrowLocked}</div>
            </div>
          </div>
        </div>

        <!-- Milestones Stepper -->
        <div class="milestones-stepper">
          ${eng.milestones.map((m, idx) => `
            <div class="milestone-card ${m.released ? 'completed' : (idx === eng.currentMilestoneIndex ? 'active' : '')}">
              <div class="milestone-step-num">MILESTONE 0${m.step}</div>
              <div class="milestone-title">${m.title}</div>
              <div class="milestone-status">
                <span style="font-family:var(--font-mono); font-weight:700; color:var(--text-primary);">${m.amount}</span>
                <span style="font-size:0.75rem; font-weight:600; color:${m.released ? 'var(--accent-emerald)' : (idx === eng.currentMilestoneIndex ? 'var(--accent-cyan)' : 'var(--text-muted)')};">
                  ${m.status}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Annotation Stage: Interactive Asset Canvas & AI Feedback Thread -->
        <div style="margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="font-size:1.15rem; font-weight:700;">Sample Deliverable Review Canvas</h4>
            <p style="font-size:0.85rem; color:var(--text-secondary);">Click the sample image to add a local feedback pin and an illustrative workflow suggestion.</p>
          </div>
          <div style="display:flex; gap:8px;">
            <span class="badge badge-tool">Seed #90214</span>
            <span class="badge badge-tool">Flux.1 Pro + Nike LoRA v3 (Sample)</span>
          </div>
        </div>

        <div class="annotation-stage">
          <!-- Canvas Viewport -->
          <div class="canvas-viewport-wrap" id="annotationCanvasViewport">
            <img class="canvas-render-img" src="${eng.currentDeliverableImage}" alt="Sample deliverable image for prototype review" id="canvasImage" />

            <!-- Rendered Pin Elements -->
            ${eng.annotationPins.map((pin, i) => `
              <div class="annotation-pin ${pin.status === 'resolved' ? 'resolved' : ''}" 
                   style="left: ${pin.x}%; top: ${pin.y}%;" 
                   data-pin-id="${pin.id}"
                   onclick="EngagementConsole.selectPin('${pin.id}')"
                   title="${App.escapeHTML(pin.comment)}">
                ${i + 1}
              </div>
            `).join('')}
          </div>

          <!-- Pins Feedback Thread -->
          <div class="annotation-feed-panel">
            <div class="feed-title">
              <span>Pinpoint Feedback (${eng.annotationPins.length})</span>
              <button class="btn btn-ghost btn-sm" onclick="EngagementConsole.clearSelection()">Reset View</button>
            </div>

            <div class="pins-list" id="pinsListContainer">
              ${eng.annotationPins.map((pin, i) => `
                <div class="pin-item ${this.selectedPinId === pin.id ? 'active' : ''}" id="pin-card-${pin.id}" onclick="EngagementConsole.selectPin('${pin.id}')">
                  <div class="pin-item-header">
                    <span class="pin-author">#${i + 1} ${App.escapeHTML(pin.author)}</span>
                    <span style="font-size:0.72rem; color:var(--text-muted);">${pin.time}</span>
                  </div>
                  <div class="pin-text">${App.escapeHTML(pin.comment)}</div>
                  <div class="ai-prompt-suggestion">
                    <strong style="color:var(--accent-purple); display:block; margin-bottom:2px;">Sample Workflow Suggestion (Rule-Based):</strong>
                    ${App.escapeHTML(pin.aiPromptRecommendation)}
                  </div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; color:var(--text-muted);">Tip: Click canvas to add feedback pin</span>
              <button class="btn btn-secondary btn-sm" onclick="EngagementConsole.addMockPin()">
                + Add Feedback Pin
              </button>
            </div>
          </div>
        </div>

        <!-- Escrow Actions & Approval Controls -->
        <div style="background:var(--bg-tertiary); border:1px solid var(--border-glow); border-radius:var(--radius-lg); padding:var(--space-5); margin-bottom:var(--space-6); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="font-size:0.8rem; font-family:var(--font-mono); color:var(--accent-cyan); text-transform:uppercase;">Milestone 02 Approval Pending (Demo)</div>
            <strong style="font-size:1.1rem; color:var(--text-primary); display:block; margin-top:2px;">4K Keyframes & Motion Review (₹18,000 INR)</strong>
            <span style="font-size:0.85rem; color:var(--text-secondary);">Simulates releasing milestone funds in the prototype. No actual money moves.</span>
          </div>

          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="App.showToast('Simulated: Revision request logged with annotated pins.', 'info')">
              Simulate Revision Request (Demo)
            </button>
            <button class="btn btn-emerald" id="approveMilestoneBtn" onclick="EngagementConsole.approveMilestone()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Simulate Approval — No funds move (₹18,000 demo)
            </button>
          </div>
        </div>

        <!-- Delivery Vault & Production Manifest -->
        <div>
          <h4 style="font-size:1rem; font-weight:700; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Delivery Vault & Sample Manifests (Demo Prototype)
          </h4>

          <div class="delivery-vault-bar">
            <div class="vault-files">
              ${eng.deliveryVault.map(f => `
                <div class="vault-file-item" onclick="EngagementConsole.downloadManifestFile('${f.name}')" style="cursor:pointer;" title="Simulate download">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span>${App.escapeHTML(f.name)}</span>
                  <span style="color:var(--accent-cyan); font-size:0.75rem;">(${App.escapeHTML(f.size)})</span>
                </div>
              `).join('')}
            </div>

            <button class="btn btn-primary btn-sm" onclick="EngagementConsole.downloadCertificate()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              View Sample IP Certificate (Demo)
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindCanvasInteraction() {
    setTimeout(() => {
      const viewport = document.getElementById('annotationCanvasViewport');
      if (!viewport) return;

      viewport.addEventListener('click', (e) => {
        // Avoid clicking directly on existing pin
        if (e.target.closest('.annotation-pin')) return;

        const rect = viewport.getBoundingClientRect();
        const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);

        this.promptNewPin(xPercent, yPercent);
      });
    }, 100);
  },

  promptNewPin(x, y) {
    const comment = prompt("Add a sample feedback note for this frame:", "Increase contrast on neon rim reflection and sharpen sole texture");
    if (!comment || !comment.trim()) return;

    const newPinId = `pin-${Date.now()}`;
    const newPin = {
      id: newPinId,
      x: x,
      y: y,
      author: "Nike Reviewer (Demo)",
      time: "Just now",
      comment: comment.trim(),
      status: "active",
      aiPromptRecommendation: `Workflow Adjustment: Pinpoint at (${x}%, ${y}%). Added inpainting mask with ControlNet Canny; prompt token weight boosted: '(neon rim reflection:1.2)'`
    };

    this.data.annotationPins.push(newPin);
    this.selectedPinId = newPinId;
    this.render();
    this.bindCanvasInteraction();

    App.showToast('Sample feedback pin added. An illustrative workflow suggestion was created locally.', 'success');
  },

  addMockPin() {
    this.promptNewPin(50, 45);
  },

  selectPin(pinId) {
    this.selectedPinId = pinId;
    const items = document.querySelectorAll('.pin-item');
    items.forEach(el => el.classList.remove('active'));

    const activeEl = document.getElementById(`pin-card-${pinId}`);
    if (activeEl) {
      activeEl.classList.add('active');
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  clearSelection() {
    this.selectedPinId = null;
    document.querySelectorAll('.pin-item').forEach(el => el.classList.remove('active'));
  },

  approveMilestone() {
    const eng = this.data;
    if (eng.currentMilestoneIndex === 1) {
      eng.milestones[1].status = "Completed (Simulated)";
      eng.milestones[1].released = true;
      eng.escrowReleased = "₹31,500 INR (Simulated)";
      eng.escrowLocked = "₹13,500 INR (Simulated)";
      eng.currentMilestoneIndex = 2;
      eng.milestones[2].status = "Active In Production (Demo)";

      this.render();
      this.bindCanvasInteraction();

      // Show celebratory demo modal
      this.showReleaseCelebration();
    } else {
      App.showToast("All demo milestones successfully approved in prototype!", "success");
    }
  },

  showReleaseCelebration() {
    const modal = document.getElementById('briefDetailModal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content" style="max-width:540px; text-align:center; padding:var(--space-8);" onclick="event.stopPropagation()">
        <div style="width:72px; height:72px; border-radius:50%; background:rgba(16,185,129,0.15); border:2px solid var(--accent-emerald); display:flex; align-items:center; justify-content:center; margin:0 auto var(--space-4); color:var(--accent-emerald); box-shadow:0 0 30px rgba(16,185,129,0.3);">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

        <div style="font-size:0.75rem; text-transform:uppercase; font-family:var(--font-mono); color:var(--accent-emerald); margin-bottom:4px;">
          Prototype Demo Simulation
        </div>
        <h2 style="font-size:1.6rem; margin-bottom:8px;">Milestone Approved (Simulated)</h2>
        <div style="font-size:1.8rem; font-weight:800; font-family:var(--font-heading); color:var(--accent-emerald); margin-bottom:12px;">
          ₹18,000 INR (Demo Balance)
        </div>
        <p style="color:var(--text-secondary); font-size:0.92rem; line-height:1.5; margin-bottom:var(--space-6);">
          This is a prototype demonstration: in a live enterprise deployment, this action would trigger escrow disbursement. <strong>No real funds or on-chain assets moved.</strong>
        </p>

        <div style="background:var(--bg-tertiary); padding:12px; border-radius:var(--radius-md); font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan); margin-bottom:var(--space-6); text-align:left;">
          <div>Mock Escrow Reference: DEMO-ESCROW-0x8F92</div>
          <div>Milestone Phase: 02 (Keyframes & Motion Cuts)</div>
          <div>Status: Demo Approval Logged (No currency moved)</div>
        </div>

        <button class="btn btn-primary btn-lg" style="width:100%;" onclick="document.getElementById('briefDetailModal').classList.remove('active')">
          Return to Project Workspace
        </button>
      </div>
    `;

    modal.classList.add('active');
  },

  downloadManifestFile(filename) {
    App.showToast(`Simulated download: Sample manifest log for '${filename}' (demo prototype).`, 'info');
  },

  downloadCertificate() {
    App.openIPAgreementModal();
  }
};
