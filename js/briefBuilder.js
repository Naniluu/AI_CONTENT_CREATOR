// ==========================================================================
// CREOVATE - CREATIVE BRIEF STUDIO & AI BRIEFSYNTH
// Publish Briefs, Dynamic Concept Reflection, Strict Milestones & Demo Labeling
// ==========================================================================

const BriefStudio = {
  presets: [
    {
      label: "👟 Cyber-Footwear Reveal",
      title: "HYPERCRAFT RUNNER: 30s Kinetic Reveal Spec",
      concept: "Kinetic commercial for aerodynamic futuristic trail runner. Liquid biomechanics, glowing bioluminescent outsole, shot in heavy rain on volcanic black rocks.",
      category: "Cinematic Commercials",
      contentType: "Video",
      style: "Kinetic footwear reveal with futuristic organic textures",
      aspectRatio: "16:9 + 9:16",
      deliveryFormat: "4K ProRes MOV + H.264 MP4 + PNG stills",
      commercialUse: "Paid ads + organic social · 12 months · India",
      budget: 45000
    },
    {
      label: "💎 Luxury Perfume Caustics",
      title: "CRYSTAL FLACON: Luxury Caustics Product Spot",
      concept: "Macro commercial 3D render of an architectural crystal perfume flacon exploding into suspended liquid gold ribbons and deep velvet orchid petals.",
      category: "3D Product VFX",
      contentType: "Images",
      style: "Luxury editorial with crystalline surfaces and liquid gold",
      aspectRatio: "4:5 + 1:1",
      deliveryFormat: "8K PNG/JPG stills + H.264 MP4 loop",
      commercialUse: "Paid ads + organic social · 12 months · Worldwide",
      budget: 40000
    },
    {
      label: "👗 Virtual Haute Couture Reel",
      title: "NEO-COUTURE 2026: Runway Lookbook Series",
      concept: "Haute couture runway capsule featuring liquid chrome metallic fabrics, zero character face-drift across 8 distinct camera angles, and brutalist architecture backdrop.",
      category: "High Fashion & Lookbooks",
      contentType: "Mixed",
      style: "Neo-gothic couture editorial with liquid chrome accents",
      aspectRatio: "4:5 + 9:16",
      deliveryFormat: "PNG stills + H.264 MP4",
      commercialUse: "Paid ads + organic social · 12 months · Worldwide",
      budget: 55000
    },
    {
      label: "🤖 Virtual Human Ambassador",
      title: "KIRA AMBASSADOR: Metahuman Brand Launch",
      concept: "Zero-drift photorealistic digital human female influencer portrait and 15s lip-sync video promoting sustainable synthetic fashion.",
      category: "Virtual Avatars",
      contentType: "Video",
      style: "Photoreal virtual ambassador with natural expressions",
      aspectRatio: "9:16 + 1:1",
      deliveryFormat: "H.264 MP4 + PNG portraits",
      commercialUse: "Paid ads + organic social · 12 months · India",
      budget: 30000
    }
  ],

  synthesisRunId: 0,

  init() {
    this.renderPresets();
    this.renderBriefsFeed();
  },

  renderPresets() {
    const container = document.getElementById('briefPresetsContainer');
    if (!container) return;

    container.innerHTML = this.presets.map((p, idx) => `
      <button class="vibe-pill" onclick="BriefStudio.loadPreset(${idx})">
        ${p.label}
      </button>
    `).join('');
  },

  loadPreset(index) {
    const p = this.presets[index];
    if (!p) return;

    const titleInput = document.getElementById('briefTitleInput');
    const conceptInput = document.getElementById('briefConceptInput');
    const categorySelect = document.getElementById('briefCategorySelect');
    const budgetInput = document.getElementById('briefBudgetInput');
    const contentTypeSelect = document.getElementById('briefContentTypeSelect');
    const styleInput = document.getElementById('briefStyleInput');
    const aspectRatioInput = document.getElementById('briefAspectRatioInput');
    const deliveryFormatInput = document.getElementById('briefDeliveryFormatInput');
    const commercialUseSelect = document.getElementById('briefCommercialUseSelect');

    if (titleInput) titleInput.value = p.title;
    if (conceptInput) conceptInput.value = p.concept;
    if (categorySelect) categorySelect.value = p.category;
    if (budgetInput) budgetInput.value = p.budget;
    if (contentTypeSelect) contentTypeSelect.value = p.contentType;
    if (styleInput) styleInput.value = p.style;
    if (aspectRatioInput) aspectRatioInput.value = p.aspectRatio;
    if (deliveryFormatInput) deliveryFormatInput.value = p.deliveryFormat;
    if (commercialUseSelect) commercialUseSelect.value = p.commercialUse;

    // Trigger dynamic synthesis
    this.synthesizeBrief();
  },

  synthesizeBrief() {
    const title = document.getElementById('briefTitleInput')?.value.trim() || "AERO KINETIC: Spec Campaign";
    const concept = App.escapeHTML(document.getElementById('briefConceptInput')?.value.trim() || "High impact commercial campaign");
    const category = document.getElementById('briefCategorySelect')?.value || "Cinematic Commercials";
    const contentType = document.getElementById('briefContentTypeSelect')?.value || "Video";
    const style = App.escapeHTML(document.getElementById('briefStyleInput')?.value.trim() || "Style to be confirmed");
    const aspectRatio = App.escapeHTML(document.getElementById('briefAspectRatioInput')?.value.trim() || "To be confirmed");
    const deliveryFormat = App.escapeHTML(document.getElementById('briefDeliveryFormatInput')?.value.trim() || "To be confirmed");
    const commercialUse = document.getElementById('briefCommercialUseSelect')?.value || "Commercial use to be agreed";
    const budgetRaw = parseFloat(document.getElementById('briefBudgetInput')?.value);
    const budget = isNaN(budgetRaw) || budgetRaw <= 0 ? 38000 : Math.round(budgetRaw);

    const synthOutput = document.getElementById('briefSynthOutput');
    const publishBtn = document.getElementById('publishBriefBtn');
    if (!synthOutput) return;
    const runId = ++this.synthesisRunId;

    synthOutput.innerHTML = `
      <div style="text-align:center; padding:24px 10px;">
        <div style="font-size:1.8rem; animation:spin 1s infinite linear; display:inline-block; margin-bottom:10px;">⚡</div>
        <p style="color:var(--accent-cyan); font-weight:600;">Building a local sample preview...</p>
        <span style="font-size:0.78rem; color:var(--text-muted);">Applying simple category rules to suggest camera, lighting, and tools</span>
      </div>
    `;

    setTimeout(() => {
      if (runId !== this.synthesisRunId) return;

      // Calculate milestones strictly totaling the entered budget
      const m1 = Math.round(budget * 0.30);
      const m2 = Math.round(budget * 0.40);
      const m3 = budget - m1 - m2; // Guarantees m1 + m2 + m3 === budget

      // Derive dynamic style directives based on concept & category
      let cameraDirective = "Anamorphic 35mm lens, 2.39:1 aspect ratio, 60fps cinematic cadence";
      let lightingDirective = "Chiaroscuro studio rim lighting with subtle volumetric fog";
      let recommendedTools = ["Flux.1 Pro", "Runway Gen-3 Alpha", "ComfyUI Node Graph"];
      let deliverableTypes = ["1x 4K ProRes 422 HQ Master", "Prompt & Seed Manifest Log", "Commercial IP Buyout (Sample)"];

      const conceptLower = concept.toLowerCase();
      const safeTitle = App.escapeHTML(title);

      if (category === "3D Product VFX" || conceptLower.includes("product") || conceptLower.includes("perfume") || conceptLower.includes("footwear") || conceptLower.includes("shoe")) {
        cameraDirective = "Hasselblad 100mm macro lens, extreme depth of field, 360-degree rotation";
        lightingDirective = "Caustics raytracing, specular metallic highlights, dark velvet backdrops";
        recommendedTools = ["Flux.1 Pro", "ControlNet Depth", "Magnific 8K", "Blender/ComfyUI"];
        deliverableTypes = ["1x Hero 30s 4K Cut", "6x 8K Marketing Stills", "Raw Seed & LoRA Checkpoints"];
      } else if (category === "Virtual Avatars" || conceptLower.includes("avatar") || conceptLower.includes("influencer") || conceptLower.includes("human")) {
        cameraDirective = "85mm f/1.4 portrait prime, softbox diffuse illumination, natural depth of field";
        lightingDirective = "Subtle skin subsurface scattering, micro-pore texture focus, natural eye catchlights";
        recommendedTools = ["SD 3.5 Large", "ElevenLabs Voice API", "LivePortrait", "Reactor FaceDetailer"];
        deliverableTypes = ["Sample multi-frame consistency sheet", "15s Vertical Reel (9:16)", "Multilingual Voice Track"];
      } else if (category === "High Fashion & Lookbooks" || conceptLower.includes("fashion") || conceptLower.includes("couture") || conceptLower.includes("fabric")) {
        cameraDirective = "Medium format 85mm editorial lens, fluid fabric tracking, runway catwalk framing";
        lightingDirective = "High-contrast editorial strobe lighting, holographic chromatic reflections";
        recommendedTools = ["Flux.1 Pro", "Runway Gen-3", "Magnific 8K", "SUPIR Upscale"];
        deliverableTypes = ["8x 8K Lookbook Stills", "1x 45s Ambience Loop", "Fabric Physics LoRA Weights"];
      } else if (conceptLower.includes("car") || conceptLower.includes("hypercar") || conceptLower.includes("automotive")) {
        cameraDirective = "Ground-level 35mm tracking shots, high-speed camera rig motion blur, anamorphic flares";
        lightingDirective = "Wet asphalt reflections, twilight aurora caustics, neon rim illumination";
        recommendedTools = ["Flux.1 Dev", "Luma Dream Machine", "CameraCtrl", "Kling AI 1.5"];
        deliverableTypes = ["1x 45s DCI 4K Cinema Master", "5x Keyframe Posters", "Vehicle LoRA Config"];
      }

      synthOutput.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:var(--accent-emerald)">✓</span>
              <strong style="color:var(--text-primary); font-size:0.95rem;">Concept DNA Calibrated</strong>
            </div>
            <span class="badge badge-amber">Local Rule-Based Preview</span>
          </div>

          <div style="font-size:0.75rem; color:var(--text-muted); line-height:1.4;">
            *Simulated BriefSynth preview for prototype demonstration — locally synthesized based on your inputs.
          </div>

          <!-- Reflected Concept & Category -->
          <div style="background:rgba(0,0,0,0.3); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Target Campaign & Category</div>
            <div style="font-weight:600; color:#38BDF8; font-size:0.9rem; margin-top:2px;">${safeTitle}</div>
            <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px;">
              <strong>Category:</strong> ${category} • <strong>Brief DNA:</strong> "${concept}"
            </div>
          </div>

          <div style="background:var(--bg-tertiary); padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-size:0.8rem; color:var(--text-secondary); line-height:1.6;">
            <div><strong>Content type:</strong> ${App.escapeHTML(contentType)}</div>
            <div><strong>Style:</strong> ${style}</div>
            <div><strong>Delivery:</strong> ${deliveryFormat}; ${aspectRatio}</div>
            <div><strong>Commercial use requested:</strong> ${App.escapeHTML(commercialUse)}</div>
            <div class="form-hint">Usage rights are a request only; final terms require a separate agreement.</div>
          </div>

          <!-- Dynamic Style Directives -->
          <div>
            <label style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Visual Directives (Derived from Concept)</label>
            <div style="background:var(--bg-tertiary); padding:10px 12px; border-radius:var(--radius-sm); font-size:0.82rem; color:#E2E8F0; margin-top:4px; line-height:1.5;">
              <div>• <strong>Camera:</strong> ${cameraDirective}</div>
              <div>• <strong>Lighting:</strong> ${lightingDirective}</div>
            </div>
          </div>

          <!-- Tooling Constraints -->
          <div>
            <label style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Recommended AI Toolstack</label>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
              ${recommendedTools.map(t => `<span class="badge badge-tool">${t}</span>`).join('')}
            </div>
          </div>

          <!-- Milestone Escrow Breakdown (Strictly sums to budget) -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Demo Milestone Allocation</label>
              <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--accent-emerald);">Total: ${App.formatINR(m1 + m2 + m3)} (100%)</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:4px;">
              <div style="background:var(--bg-tertiary); padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                <div style="font-size:0.68rem; color:var(--text-muted);">M1 (30%): Style & Seeds</div>
                <div style="font-weight:700; color:var(--text-primary); font-family:var(--font-mono); font-size:0.85rem;">${App.formatINR(m1)}</div>
              </div>
              <div style="background:var(--bg-tertiary); padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                <div style="font-size:0.68rem; color:var(--text-muted);">M2 (40%): Render Cuts</div>
                <div style="font-weight:700; color:var(--text-primary); font-family:var(--font-mono); font-size:0.85rem;">${App.formatINR(m2)}</div>
              </div>
              <div style="background:var(--bg-tertiary); padding:8px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                <div style="font-size:0.68rem; color:var(--text-muted);">M3 (30%): Master & IP</div>
                <div style="font-weight:700; color:var(--text-primary); font-family:var(--font-mono); font-size:0.85rem;">${App.formatINR(m3)}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.style.opacity = '1';
      }
    }, 400);
  },

  publishBrief() {
    const titleInput = document.getElementById('briefTitleInput');
    const conceptInput = document.getElementById('briefConceptInput');
    const categorySelect = document.getElementById('briefCategorySelect');
    const budgetInput = document.getElementById('briefBudgetInput');
    const deadlineInput = document.getElementById('briefDeadlineInput');
    const contentTypeSelect = document.getElementById('briefContentTypeSelect');
    const styleInput = document.getElementById('briefStyleInput');
    const aspectRatioInput = document.getElementById('briefAspectRatioInput');
    const deliveryFormatInput = document.getElementById('briefDeliveryFormatInput');
    const commercialUseSelect = document.getElementById('briefCommercialUseSelect');

    const title = titleInput?.value.trim() || '';
    const desc = conceptInput?.value.trim() || '';
    const category = categorySelect?.value || "Cinematic Commercials";
    const contentType = contentTypeSelect?.value || "Video";
    const style = styleInput?.value.trim() || '';
    const aspectRatio = aspectRatioInput?.value.trim() || '';
    const deliveryFormat = deliveryFormatInput?.value.trim() || '';
    const commercialUseScope = commercialUseSelect?.value || "Commercial use to be agreed";
    const budgetRaw = parseFloat(budgetInput?.value);
    if (!title || !desc) {
      App.showToast('Add a campaign title and concept before publishing to the demo feed.', 'info');
      (title ? conceptInput : titleInput)?.focus();
      return;
    }
    if (!Number.isFinite(budgetRaw) || budgetRaw <= 0) {
      App.showToast('Enter a demo budget greater than zero.', 'info');
      budgetInput?.focus();
      return;
    }
    const budget = Math.round(budgetRaw);
    const deadline = deadlineInput?.value || "7 Days Delivery";

    const m1 = Math.round(budget * 0.30);
    const m2 = Math.round(budget * 0.40);
    const m3 = budget - m1 - m2;

    const newBrief = {
      id: `brief-${Date.now()}`,
      brandName: "NIKE INNOVATION LAB (Sample Demo)",
      brandLogo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80",
      title: title,
      budget: `${App.formatINR(budget)} (Demo Escrow)`,
      timeline: deadline,
      proposalsCount: 0,
      category: category,
      contentType: contentType,
      style: style,
      aspectRatio: aspectRatio,
      deliveryFormat: deliveryFormat,
      commercialUse: { scope: commercialUseScope, status: "Requested; final terms need agreement" },
      toolRequirement: "Flux.1 Pro, Runway Gen-3, ComfyUI Pipeline",
      description: desc,
      deliverables: [deliveryFormat, `Aspect ratios: ${aspectRatio}`, "Seed & Prompt Manifest (if applicable)", `Requested commercial use: ${commercialUseScope}`],
      milestones: [
        { step: 1, name: "Style Exploration & Seed Blueprints", amount: App.formatINR(m1), status: "pending" },
        { step: 2, name: "First Cut Renders & Inpaint Revisions", amount: App.formatINR(m2), status: "pending" },
        { step: 3, name: "Final 4K Master Handover & IP Release", amount: App.formatINR(m3), status: "pending" }
      ],
      tags: [category, contentType, "Demo Escrow", "Sample Preview"]
    };

    CREOVATE_DATA.briefs.unshift(newBrief);
    this.renderBriefsFeed();

    App.showToast(`Simulated: Brief published to demo feed with ${App.formatINR(budget)} in simulated escrow.`, 'success');

    // Scroll to feed
    document.getElementById('briefsFeedSection')?.scrollIntoView({ behavior: 'smooth' });
  },

  renderBriefsFeed() {
    const feedContainer = document.getElementById('briefsFeedContainer');
    if (!feedContainer) return;

    feedContainer.innerHTML = CREOVATE_DATA.briefs.map(b => `
      <div class="brief-card" onclick="BriefStudio.openBriefDetails('${b.id}')">
        <div class="brief-brand-row">
          <div style="display:flex; align-items:center; gap:8px;">
          <img src="${App.escapeHTML(b.brandLogo)}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;" alt="${App.escapeHTML(b.brandName)}" />
            <span class="brief-brand">${App.escapeHTML(b.brandName)}</span>
          </div>
          <span class="brief-budget">${App.escapeHTML(b.budget)}</span>
        </div>

        <h3 class="brief-title">${App.escapeHTML(b.title)}</h3>
        <p class="brief-desc">${App.escapeHTML(b.description)}</p>
        <div class="brief-requirement-summary">
          <span>${App.escapeHTML(b.contentType || 'Content type not specified')}</span>
          <span>${App.escapeHTML(b.aspectRatio || 'Aspect ratio not specified')}</span>
          <span>${App.escapeHTML(b.deliveryFormat || 'Delivery format not specified')}</span>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
          ${(b.tags || []).map(t => `<span class="badge badge-tool">${App.escapeHTML(t)}</span>`).join('')}
        </div>

        <div class="brief-meta-row">
          <span style="display:flex; align-items:center; gap:4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${App.escapeHTML(b.timeline)}
          </span>
          <span style="display:flex; align-items:center; gap:4px; color:var(--accent-purple);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            ${b.proposalsCount} Demo Pitches
          </span>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); BriefStudio.openSubmitPitchModal('${b.id}')">
            Submit Pitch (Demo)
          </button>
        </div>
      </div>
    `).join('');
  },

  openBriefDetails(briefId) {
    const brief = CREOVATE_DATA.briefs.find(b => b.id === briefId);
    if (!brief) return;

    const modal = document.getElementById('briefDetailModal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="document.getElementById('briefDetailModal').classList.remove('active')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style="padding:var(--space-6); border-bottom:1px solid var(--border-medium);">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span class="badge badge-tool">${App.escapeHTML(brief.category)}</span>
            <span class="badge badge-amber">Sample Brief (Demo Data)</span>
          </div>
          <h2 style="font-size:1.6rem; margin-bottom:6px;">${App.escapeHTML(brief.title)}</h2>
          <div style="display:flex; align-items:center; gap:14px; font-size:0.9rem; color:var(--text-secondary); flex-wrap:wrap;">
            <span>Brand: <strong style="color:var(--text-primary)">${App.escapeHTML(brief.brandName)}</strong></span>
            <span>•</span>
            <span style="color:var(--accent-emerald); font-weight:700;">${App.escapeHTML(brief.budget)}</span>
            <span>•</span>
            <span>${App.escapeHTML(brief.timeline)}</span>
          </div>
        </div>

        <div style="padding:var(--space-6); display:flex; flex-direction:column; gap:20px;">
          <div>
            <h4 style="font-size:1rem; margin-bottom:8px;">Creative Vision & Context</h4>
            <p style="color:var(--text-secondary); line-height:1.6;">${App.escapeHTML(brief.description)}</p>
          </div>

          <div class="brief-requirements-detail">
            <h4 style="font-size:1rem; margin-bottom:8px;">Production Requirements</h4>
            <div><strong>Content type:</strong> ${App.escapeHTML(brief.contentType || 'Not specified')}</div>
            <div><strong>Style direction:</strong> ${App.escapeHTML(brief.style || 'Not specified')}</div>
            <div><strong>Format / aspect ratio:</strong> ${App.escapeHTML(brief.deliveryFormat || 'Not specified')} / ${App.escapeHTML(brief.aspectRatio || 'Not specified')}</div>
            <div><strong>Commercial use requested:</strong> ${App.escapeHTML(brief.commercialUse?.scope || 'Not specified')}</div>
            <div class="form-hint">${App.escapeHTML(brief.commercialUse?.status || 'Usage rights are not confirmed by this demo.')}</div>
          </div>

          <div>
            <h4 style="font-size:1rem; margin-bottom:8px;">Deliverables Checklist (Sample)</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
              ${(brief.deliverables || []).map(d => `
                <li style="display:flex; align-items:center; gap:8px; color:var(--text-primary); font-size:0.9rem;">
                  <span style="color:var(--accent-cyan); font-weight:bold;">✓</span> ${d}
                </li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 style="font-size:1rem; margin-bottom:8px;">Milestone Schedule (Demo Escrow)</h4>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px;">
              ${(brief.milestones || []).map(m => `
                <div style="background:var(--bg-tertiary); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                  <div style="font-size:0.75rem; color:var(--text-muted);">Step ${m.step}</div>
                  <div style="font-size:0.9rem; font-weight:700; margin:4px 0;">${App.escapeHTML(m.name)}</div>
                  <div style="color:var(--accent-emerald); font-weight:700; font-family:var(--font-mono);">${App.escapeHTML(m.amount)}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; padding-top:16px; border-top:1px solid var(--border-subtle);">
            <button class="btn btn-secondary" onclick="document.getElementById('briefDetailModal').classList.remove('active')">Close</button>
            <button class="btn btn-primary" onclick="document.getElementById('briefDetailModal').classList.remove('active'); BriefStudio.openSubmitPitchModal('${brief.id}')">
              Submit Demo Pitch (Local Only)
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  openSubmitPitchModal(briefId) {
    const brief = CREOVATE_DATA.briefs.find(b => b.id === briefId);
    if (!brief) return;

    const modal = document.getElementById('briefDetailModal');
    if (!modal) return;

    modal.innerHTML = `
      <div class="modal-content" onclick="event.stopPropagation()">
        <button class="modal-close-btn" onclick="document.getElementById('briefDetailModal').classList.remove('active')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div style="padding:var(--space-6); border-bottom:1px solid var(--border-medium);">
          <div style="font-size:0.8rem; font-family:var(--font-mono); color:var(--accent-cyan); text-transform:uppercase; margin-bottom:4px;">Demo Proposal Studio</div>
          <h2 style="font-size:1.45rem;">Submit Demo Pitch for "${App.escapeHTML(brief.title)}"</h2>
          <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:2px;">
            Target Brand: ${brief.brandName} • Budget: <strong style="color:var(--accent-emerald)">${brief.budget}</strong>
          </div>
        </div>

        <div style="padding:var(--space-6); display:flex; flex-direction:column; gap:16px;">
          <div>
            <label class="form-label">Creative Treatment & Approach (Demo)</label>
            <textarea id="pitchApproach" class="form-textarea" placeholder="Detail your pipeline, ComfyUI LoRAs, and motion generation strategy...">Utilizing custom ComfyUI multi-LoRA rendering with Flux.1 Pro and SUPIR 8K upscaling.</textarea>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div>
              <label class="form-label">Proposed Seed / Style Checkpoint</label>
              <input id="pitchSeed" class="form-input" value="Seed #8492049184 (Demo Checkpoint)" />
            </div>
            <div>
              <label class="form-label">Estimated Delivery Turnaround</label>
              <input id="pitchTurnaround" class="form-input" value="48-72 hours (Demo)" />
            </div>
          </div>

          <div style="background:rgba(245, 158, 11, 0.08); border:1px dashed rgba(245, 158, 11, 0.4); border-radius:var(--radius-md); padding:12px 14px;">
            <div style="font-size:0.8rem; color:#FBBF24; font-weight:600;">Prototype Demo Notice</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Submitting will simulate recording an incoming pitch in the mock feed. No external notifications are dispatched.</div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:8px;">
            <button class="btn btn-secondary" onclick="document.getElementById('briefDetailModal').classList.remove('active')">Cancel</button>
            <button class="btn btn-primary" onclick="BriefStudio.submitPitchConfirm('${brief.id}')">
              Simulate Proposal Submission
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  submitPitchConfirm(briefId) {
    const brief = CREOVATE_DATA.briefs.find(b => b.id === briefId);
    if (brief) {
      brief.proposalsCount = (brief.proposalsCount || 0) + 1;
      this.renderBriefsFeed();
    }

    document.getElementById('briefDetailModal')?.classList.remove('active');
    App.showToast(`Simulated: Demo proposal logged for ${brief?.brandName || 'the brand'}.`, 'success');
  },

  forkFromCreator(creatorId) {
    const creator = CREOVATE_DATA.creators.find(c => c.id === creatorId);
    if (!creator) return;

    const conceptInput = document.getElementById('briefConceptInput');
    const titleInput = document.getElementById('briefTitleInput');
    const categorySelect = document.getElementById('briefCategorySelect');
    const contentTypeSelect = document.getElementById('briefContentTypeSelect');
    const styleInput = document.getElementById('briefStyleInput');
    const aspectRatioInput = document.getElementById('briefAspectRatioInput');
    const deliveryFormatInput = document.getElementById('briefDeliveryFormatInput');

    if (titleInput) titleInput.value = `New Campaign in the style of ${creator.name}`;
    if (conceptInput) conceptInput.value = `Commissioning bespoke visual campaign modeled on ${creator.featuredWork.title}: "${creator.featuredWork.prompt}"`;
    if (categorySelect) categorySelect.value = creator.featuredWork.category;
    if (contentTypeSelect) contentTypeSelect.value = creator.contentTypes?.[0] || "Video";
    if (styleInput) styleInput.value = creator.featuredWork.title;
    if (aspectRatioInput) aspectRatioInput.value = creator.featuredWork.aspectRatio || "16:9";
    if (deliveryFormatInput) deliveryFormatInput.value = (creator.formats || []).join(" + ");

    // Scroll to brief builder
    document.getElementById('briefStudioSection')?.scrollIntoView({ behavior: 'smooth' });
    this.synthesizeBrief();
    App.showToast(`Loaded style parameters from ${creator.name} into BriefSynth!`, 'info');
  }
};
