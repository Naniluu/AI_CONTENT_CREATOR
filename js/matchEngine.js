// ==========================================================================
// CREOVATE - LOCAL DETERMINISTIC AI MATCH ENGINE
// Natural Campaign Query Semantic Matching with Specific Explanations & Fallbacks
// ==========================================================================

const MatchEngine = {
  activeQuery: '',
  hasActiveMatch: false,
  noMatchFound: false,
  baselineScoresCaptured: false,

  // Concept & Semantic Affinity Matrix
  conceptMap: {
    footwear: {
      synonyms: ["shoe", "shoes", "sneaker", "sneakers", "kicks", "footwear", "runner", "cleats", "boots", "apparel"],
      weights: {
        "creator-aura": { pts: 45, reason: "Sample profile highlights footwear CGI, biomechanics, and product campaigns" },
        "creator-kaizen": { pts: 35, reason: "Sample profile highlights 3D product rendering and material styles" },
        "creator-spatial": { pts: 30, reason: "Sample profile highlights spatial 3D product visualizations" },
        "creator-chronos": { pts: 25, reason: "Sample profile highlights camera movement and kinetic commercial pacing" }
      }
    },
    fashion: {
      synonyms: ["fashion", "couture", "apparel", "textile", "clothing", "runway", "editorial", "lookbook", "vogue", "balenciaga"],
      weights: {
        "creator-aura": { pts: 50, reason: "Sample profile highlights haute couture, liquid textiles, and editorial visuals" },
        "creator-neox": { pts: 38, reason: "Sample profile includes virtual runway and digital-fashion concepts" },
        "creator-solaris": { pts: 30, reason: "Sample profile includes luxury editorial and cosmetics visuals" },
        "creator-mirage": { pts: 26, reason: "Sample profile includes fashion environments and editorial worldbuilding" }
      }
    },
    automotive: {
      synonyms: ["car", "cars", "automotive", "hypercar", "supercar", "vehicle", "electric vehicle", "ev", "drifting", "racing", "speed"],
      weights: {
        "creator-kaizen": { pts: 50, reason: "Sample profile highlights hypercar reveals, wet-road reflections, and motion" },
        "creator-chronos": { pts: 38, reason: "Sample profile includes tracking shots, motion blur, and drone views" },
        "creator-aura": { pts: 24, reason: "Sample profile includes commercial lighting and multi-camera concepts" }
      }
    },
    perfume: {
      synonyms: ["perfume", "fragrance", "cosmetics", "beauty", "flacon", "skincare", "lotion", "bottle", "luxury", "caustics"],
      weights: {
        "creator-solaris": { pts: 50, reason: "Sample profile highlights botanical visuals, fragrance, and liquid caustics" },
        "creator-aura": { pts: 35, reason: "Sample profile includes luxury editorial lighting and studio concepts" },
        "creator-spatial": { pts: 28, reason: "Sample profile includes exploded glass views and caustics" }
      }
    },
    avatar: {
      synonyms: ["avatar", "influencer", "human", "character", "face", "portrait", "lip-sync", "spokesperson", "ambassador", "digital double"],
      weights: {
        "creator-neox": { pts: 50, reason: "Sample profile highlights virtual humans, skin detail, and voice-sync concepts" },
        "creator-anima": { pts: 32, reason: "Sample profile includes stylized characters and animation concepts" },
        "creator-aura": { pts: 26, reason: "Sample profile includes studio portraits and editorial photography" }
      }
    },
    temporal: {
      synonyms: ["drone", "camera", "cinematic", "temporal", "trajectory", "fly-through", "tracking", "60fps", "trailer", "commercial"],
      weights: {
        "creator-chronos": { pts: 50, reason: "Sample profile highlights camera movement, tracking, and temporal video" },
        "creator-kaizen": { pts: 36, reason: "Sample profile includes vehicle tracking and high-speed camera movement" },
        "creator-aura": { pts: 32, reason: "Sample profile includes cinematic commercials and multi-shot concepts" }
      }
    },
    anime: {
      synonyms: ["anime", "manga", "cel", "stylized", "shinkai", "clouds", "japanese", "2d", "animation", "illustration"],
      weights: {
        "creator-anima": { pts: 55, reason: "Sample profile highlights cel-shaded anime and stylized 2D visuals" },
        "creator-neox": { pts: 22, reason: "Sample profile includes stylized social motion and character design" }
      }
    },
    spatial: {
      synonyms: ["spatial", "3d", "splat", "gaussian", "nerf", "watch", "hardware", "mechanical", "microscopic", "chip", "chipset", "exploded"],
      weights: {
        "creator-spatial": { pts: 50, reason: "Sample profile highlights Gaussian splatting and mechanical 3D visuals" },
        "creator-solaris": { pts: 38, reason: "Sample profile includes macro hardware and liquid circuit visuals" },
        "creator-kaizen": { pts: 30, reason: "Sample profile includes hard-surface modeling and product VFX" }
      }
    },
    audio: {
      synonyms: ["audio", "sound", "voice", "music", "sonic", "foley", "soundtrack", "suno", "elevenlabs", "song", "binaural"],
      weights: {
        "creator-synthvox": { pts: 50, reason: "Sample profile highlights multilingual voice, sonic branding, and audio concepts" },
        "creator-chroma": { pts: 46, reason: "Sample profile includes audio-reactive motion and generative audio concepts" },
        "creator-neox": { pts: 28, reason: "Sample profile includes voiceover for virtual ambassadors" }
      }
    },
    motion: {
      synonyms: ["motion", "reactive", "visualizer", "tiktok", "reels", "loop", "psychedelic", "fluid", "bass", "beat"],
      weights: {
        "creator-chroma": { pts: 50, reason: "Sample profile highlights sound-reactive visuals and motion design" },
        "creator-synthvox": { pts: 35, reason: "Sample profile includes rhythm synchronization and sound design" },
        "creator-chronos": { pts: 28, reason: "Sample profile includes temporal movement and motion concepts" }
      }
    },
    worldbuilding: {
      synonyms: ["architecture", "building", "environment", "interior", "villa", "pavilion", "landscape", "desert", "worldbuilding", "city"],
      weights: {
        "creator-mirage": { pts: 50, reason: "Sample profile highlights virtual architecture and pavilion environments" },
        "creator-chronos": { pts: 36, reason: "Sample profile includes environment fly-throughs and atmospheric visuals" },
        "creator-aura": { pts: 28, reason: "Sample profile includes worldbuilding for fashion campaigns" }
      }
    }
  },

  match(rawQuery) {
    if (!rawQuery || !rawQuery.trim()) {
      this.clearMatch();
      return;
    }

    const query = rawQuery.trim().toLowerCase();
    this.activeQuery = rawQuery.trim();
    this.hasActiveMatch = true;
    this.captureBaselineScores();

    // Tokenize query words
    const stopWords = new Set(["a", "an", "the", "in", "on", "at", "for", "with", "and", "or", "to", "of", "is", "by", "from", "that", "this"]);
    const rawTokens = query.split(/[^a-zA-Z0-9_-]+/).filter(t => t.length > 1 && !stopWords.has(t));

    if (rawTokens.length === 0) {
      this.noMatchFound = true;
      this.restoreBaselineScores();
      this.renderMatchResults(rawQuery, []);
      return;
    }

    const scores = {};
    const reasons = {};
    const semanticReasons = {};

    CREOVATE_DATA.creators.forEach(c => {
      scores[c.id] = 0;
      reasons[c.id] = [];
      semanticReasons[c.id] = [];
    });

    let highestKeywordHits = 0;

    // 1. Direct Field Search (Names, Roles, Bios, Specialties, Tools, Featured Work)
    CREOVATE_DATA.creators.forEach(c => {
      let creatorHits = 0;
      const searchableBio = (c.bio || "").toLowerCase();
      const searchableRole = (c.role || "").toLowerCase();
      const searchableName = (c.name || "").toLowerCase() + " " + (c.creatorName || "").toLowerCase();
      const searchableSpecialties = (c.specialties || []).map(s => s.toLowerCase()).join(" ");
      const searchableSkills = (c.skills || []).map(s => s.toLowerCase()).join(" ");
      const searchableContentTypes = (c.contentTypes || []).map(type => type.toLowerCase()).join(" ");
      const searchableFormats = (c.formats || []).map(format => format.toLowerCase()).join(" ");
      const searchableTools = (c.toolstack || []).map(t => t.toLowerCase()).join(" ");
      const fw = c.featuredWork || {};
      const searchableWork = [fw.title, fw.category, fw.client, fw.prompt, fw.model].filter(Boolean).join(" ").toLowerCase();

      rawTokens.forEach(token => {
        // Specialty match
        if (searchableSpecialties.includes(token)) {
          scores[c.id] += 24;
          creatorHits++;
          reasons[c.id].push(`Specializes in ${c.specialties.find(s => s.toLowerCase().includes(token)) || token}`);
        }
        if (searchableSkills.includes(token)) {
          scores[c.id] += 22;
          creatorHits++;
          reasons[c.id].push(`Skill match: ${c.skills.find(skill => skill.toLowerCase().includes(token)) || token}`);
        }
        if (searchableContentTypes.includes(token)) {
          scores[c.id] += 16;
          creatorHits++;
          reasons[c.id].push(`Creates ${c.contentTypes.find(type => type.toLowerCase().includes(token)) || token}`);
        }
        if (searchableFormats.includes(token)) {
          scores[c.id] += 10;
          creatorHits++;
          reasons[c.id].push(`Output format: ${c.formats.find(format => format.toLowerCase().includes(token)) || token}`);
        }
        // Role match
        if (searchableRole.includes(token)) {
          scores[c.id] += 20;
          creatorHits++;
          reasons[c.id].push(`Role: ${c.role}`);
        }
        // Toolstack match
        if (searchableTools.includes(token)) {
          scores[c.id] += 18;
          creatorHits++;
        reasons[c.id].push(`Listed tool: ${c.toolstack.find(t => t.toLowerCase().includes(token)) || token}`);
        }
        // Featured work & prompt match
        if (searchableWork.includes(token)) {
          scores[c.id] += 16;
          creatorHits++;
          reasons[c.id].push(`Portfolio work matching '${token}'`);
        }
        // Bio match
        if (searchableBio.includes(token)) {
          scores[c.id] += 12;
          creatorHits++;
          reasons[c.id].push(`Profile description includes '${token}'`);
        }
        // Name match
        if (searchableName.includes(token)) {
          scores[c.id] += 25;
          creatorHits++;
          reasons[c.id].push(`Creator name match`);
        }
      });

      highestKeywordHits = Math.max(highestKeywordHits, creatorHits);
    });

    // 2. Semantic Concept Affinity Matching
    for (const [conceptKey, conceptData] of Object.entries(this.conceptMap)) {
      const isConceptTriggered = conceptData.synonyms.some(syn => {
        if (query.includes(syn)) return true;
        return rawTokens.some(tok => tok === syn || (tok.length > 4 && syn.includes(tok)));
      });

      if (isConceptTriggered) {
        highestKeywordHits += 2;
        for (const [creatorId, weightData] of Object.entries(conceptData.weights)) {
          if (scores[creatorId] !== undefined) {
            scores[creatorId] += weightData.pts;
            semanticReasons[creatorId].push({ points: weightData.pts, reason: weightData.reason });
          }
        }
      }
    }

    // 3. Determine if query is too vague or produced no strong match
    const maxScore = Math.max(...Object.values(scores));
    
    // Threshold: if no creator scored above 15 points, it's too vague or unmatched
    if (maxScore < 15 || highestKeywordHits === 0) {
      this.noMatchFound = true;
      // Keep the normal directory ranking when the demo matcher has no signal.
      this.restoreBaselineScores();
      this.renderMatchResults(rawQuery, []);
      return;
    }

    this.noMatchFound = false;

    // 4. Calculate distinct, normalized percentage scores
    CREOVATE_DATA.creators.forEach(c => {
      const raw = scores[c.id];
      if (raw >= 15) {
        // Normalize between 70% and 99% for relevant creators
        const normalized = 70 + Math.round(((raw - 15) / Math.max(1, maxScore - 15)) * 29);
        c.matchScore = Math.min(99, Math.max(68, normalized));
      } else {
        // Less relevant creators drop to 40% - 60%
        c.matchScore = Math.max(35, Math.round((raw / 15) * 60));
      }

      // Consolidate specific reason
      const creatorReasons = reasons[c.id] || [];
      const strongestSemanticReason = (semanticReasons[c.id] || []).slice().sort((a, b) => b.points - a.points)[0]?.reason;
      if (strongestSemanticReason) {
        c.matchReason = strongestSemanticReason;
      } else if (creatorReasons.length > 0) {
        // Pick the top unique reason
        c.matchReason = creatorReasons[0];
      } else {
        delete c.matchReason;
      }
    });

    const rankedCreators = [...CREOVATE_DATA.creators].sort((a, b) => b.matchScore - a.matchScore);
    this.renderMatchResults(rawQuery, rankedCreators.slice(0, 3));
  },

  captureBaselineScores() {
    if (this.baselineScoresCaptured) return;
    CREOVATE_DATA.creators.forEach(c => {
      if (!Number.isFinite(c.defaultMatchScore)) {
        c.defaultMatchScore = Number.isFinite(c.matchScore) ? c.matchScore : 50;
      }
    });
    this.baselineScoresCaptured = true;
  },

  restoreBaselineScores() {
    this.captureBaselineScores();
    CREOVATE_DATA.creators.forEach(c => {
      c.matchScore = c.defaultMatchScore;
      delete c.matchReason;
    });
  },

  renderMatchResults(query, topCreators) {
    App.renderCreators();

    const bannerContainer = document.getElementById('matchFeedbackBanner');
    if (!bannerContainer) return;

    if (this.noMatchFound) {
      bannerContainer.style.display = 'block';
      bannerContainer.innerHTML = `
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; align-items: flex-start; gap: 14px; margin-bottom: 24px;">
          <div style="font-size: 1.4rem; color: #F59E0B; line-height: 1;">⚠️</div>
          <div style="flex: 1;">
            <div style="font-weight: 700; color: #FBBF24; font-size: 0.95rem; margin-bottom: 2px;">
              No Strong Demo Match for "${App.escapeHTML(query)}"
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.45;">
              This description is too vague or does not match any creator's specialties. Try a specific campaign direction like 
              <strong style="color:var(--text-primary)">"footwear commercial"</strong>, 
              <strong style="color:var(--text-primary)">"hypercar rain reveal"</strong>, 
              <strong style="color:var(--text-primary)">"luxury perfume caustics"</strong>, 
              <strong style="color:var(--text-primary)">"virtual avatar"</strong>, or 
              <strong style="color:var(--text-primary)">"anime trailer"</strong>.
            </p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="MatchEngine.clearMatch()">Clear Search</button>
        </div>
      `;
      App.showToast(`No strong matches for "${query}". Try a more specific keyword like 'footwear' or 'perfume'.`, 'info');
    } else {
      const top = topCreators[0];
      bannerContainer.style.display = 'block';
      bannerContainer.innerHTML = `
        <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.35); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="font-size: 1.4rem; color: var(--accent-cyan);">✨</div>
            <div>
              <div style="font-weight: 700; color: #38BDF8; font-size: 0.95rem;">
                Demo Match for "${App.escapeHTML(query)}": Top Pick is ${App.escapeHTML(top.name)} (${top.matchScore}% Match)
              </div>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">
                Reason: ${App.escapeHTML(top.matchReason)}
              </div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="MatchEngine.clearMatch()">Reset Matching</button>
        </div>
      `;
      App.showToast(`Calibrated matches for "${query}". Top match: ${top.name} (${top.matchScore}%)`, 'success');
    }

    document.getElementById('creatorsGridSection')?.scrollIntoView({ behavior: 'smooth' });
  },

  clearMatch() {
    this.activeQuery = '';
    this.hasActiveMatch = false;
    this.noMatchFound = false;

    this.restoreBaselineScores();

    const heroInput = document.getElementById('heroMatchInput');
    if (heroInput) heroInput.value = '';

    const bannerContainer = document.getElementById('matchFeedbackBanner');
    if (bannerContainer) bannerContainer.style.display = 'none';

    App.renderCreators();
    App.showToast('Demo match cleared.', 'info');
  }
};
