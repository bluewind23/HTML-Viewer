// HTML Preview Tool - Main JavaScript
class HTMLPreviewTool {
    constructor() {
        this.editors = {};
        this.currentTheme = 'vs';
        this.currentViewMode = 'desktop';
        this.currentActiveTab = 'html';
        this.autoSaveInterval = null;
        this.autoSaveEnabled = true;
        this.currentZoom = 1.0;

        this.analytics = JSON.parse(localStorage.getItem('htmlPreviewTool_analytics')) || {
            saves: 0, exports: 0, errors: 0, sessions: 0, templatesLoaded: 0, projectsCreated: 0
        };
        this.analytics.sessions++;

        this.errors = [];
        this.viewportPresets = {
            mobile: { width: 375, height: 667 }, 'iphone-se': { width: 375, height: 667 },
            tablet: { width: 768, height: 1024 }, 'ipad-pro': { width: 1024, height: 1366 },
            macbook: { width: 1440, height: 900 }, desktop: { width: '100%', height: '100%' },
            'galaxy-fold': { width: 280, height: 653 }
        };

        this.modals = {};
        this.init();
    }

    init() {
        try {
            this.initMonacoEditor();
            this.initEventListeners();
            this.initModals();
            this.loadFromLocalStorage();
            this.changeViewport('desktop', true);
            this.updateAutoSaveStatus();
            this.startAutoSave();
            this.saveAnalytics();
            console.log('HTMLPreviewTool initialization completed');
        } catch (error) { this.logError(error); }
    }

    initMonacoEditor() {
        if (typeof require === 'undefined') { this.initFallbackEditors(); return; }
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            try {
                const commonOptions = { fontSize: 14, minimap: { enabled: false }, automaticLayout: true, wordWrap: 'on' };
                this.editors.html = monaco.editor.create(document.getElementById('htmlEditor'), { ...commonOptions, value: this.getDefaultHTML(), language: 'html', theme: this.currentTheme });
                this.editors.css = monaco.editor.create(document.getElementById('cssEditor'), { ...commonOptions, value: this.getDefaultCSS(), language: 'css', theme: this.currentTheme });
                this.editors.js = monaco.editor.create(document.getElementById('jsEditor'), { ...commonOptions, value: this.getDefaultJS(), language: 'javascript', theme: this.currentTheme });
                Object.values(this.editors).forEach(editor => editor.onDidChangeModelContent(() => this.updatePreview()));
                this.updatePreview();
            } catch (error) { this.logError(error, 'Monaco Init'); this.initFallbackEditors(); }
        });
    }

    initFallbackEditors() {
        console.warn('Initializing fallback textarea editors.');
        ['html', 'css', 'js'].forEach(lang => {
            const container = document.getElementById(`${lang}Editor`);
            if (container) {
                const textarea = document.createElement('textarea');
                textarea.style.cssText = `width:100%;height:100%;border:none;font-family:'Courier New',monospace;font-size:14px;padding:10px;resize:none;background:#1e1e1e;color:#d4d4d4;`;
                textarea.value = this[`getDefault${lang.toUpperCase()}`]();
                container.innerHTML = ''; container.appendChild(textarea);
                textarea.addEventListener('input', () => this.updatePreview());
                this.editors[lang] = {
                    getValue: () => textarea.value,
                    setValue: (v) => { textarea.value = v; },
                    getAction: () => ({ run: () => this.showMiniNotification('Formatting not available.') })
                };
            }
        });
        this.updatePreview();
    }

    getDefaultHTML() { return `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>My Awesome Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>Start coding to see magic happen.</p>\n    <button id="testBtn">Click Me</button>\n</body>\n</html>`; }
    getDefaultCSS() { return `body{font-family:sans-serif;padding:2rem;text-align:center;background:#f0f2f5;}\nh1{color:#333;}`; }
    getDefaultJS() { return `document.getElementById('testBtn')?.addEventListener('click',()=>alert('JS is working!'));`; }

    initEventListeners() {
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('runBtn')?.addEventListener('click', () => this.updatePreview());
        document.querySelectorAll('.tab-btn').forEach(btn => btn.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.lang)));
        document.getElementById('copyBtn')?.addEventListener('click', () => this.copyCurrentCode());
        document.getElementById('formatBtn')?.addEventListener('click', () => this.formatCode());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearCurrentEditor());
        document.getElementById('resetBtnEditor')?.addEventListener('click', () => this.resetToDefault());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetToDefault());
        document.getElementById('newWindowBtn')?.addEventListener('click', () => this.openInNewWindow());
        document.getElementById('fullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('exitFullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('downloadHtmlBtn')?.addEventListener('click', () => this.downloadHTML());
        document.getElementById('screenshotBtn')?.addEventListener('click', () => this.takeScreenshot());
        document.getElementById('exportPdfBtn')?.addEventListener('click', () => this.exportToPDF());
        document.getElementById('autoSaveStatus')?.addEventListener('click', () => this.toggleAutoSave());
        document.getElementById('installPWA')?.addEventListener('click', () => this.installPWA());
        document.getElementById('shareBtn')?.addEventListener('click', () => this.shareCode());
        document.querySelectorAll('#viewportMenu a').forEach(item => item.addEventListener('click', (e) => { e.preventDefault(); this.changeViewport(e.target.closest('a').dataset.viewport); }));
        document.getElementById('templateSelector')?.addEventListener('change', (e) => { if (e.target.value) { this.loadTemplate(e.target.value); e.target.value = ''; } });
        document.getElementById('templateSearchInput')?.addEventListener('input', (e) => this.showTemplatesModal(undefined, e.target.value));
        document.getElementById('saveProjectBtn')?.addEventListener('click', () => this.saveProject());
        document.getElementById('newProjectBtn')?.addEventListener('click', () => this.createNewProject());
        document.getElementById('submitFeedbackBtn')?.addEventListener('click', () => this.submitFeedback());
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.querySelector('.preview-panel.fullscreen-mode')) this.toggleFullscreen(); });
        document.getElementById('hideErrorPanel')?.addEventListener('click', () => document.getElementById('errorPanel').style.display = 'none');
        this.initZoomSlider();

        window.addEventListener('click', (e) => {
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                const toggle = document.querySelector(`[data-bs-toggle="dropdown"][aria-expanded="true"]`);
                if (toggle && !toggle.contains(e.target) && !menu.contains(e.target)) {
                    const bsDropdown = bootstrap.Dropdown.getInstance(toggle);
                    if (bsDropdown) bsDropdown.hide();
                }
            });
        });
    }

    initZoomSlider() {
        const slider = document.getElementById('zoomSlider');
        const thumb = document.getElementById('zoomThumb');
        if (!slider || !thumb) return;
        let isDragging = false;
        const updateZoomFromPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let percent = (clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            const newZoom = 0.2 * Math.pow(15, percent);
            this.setZoom(newZoom);
        };
        slider.addEventListener('mousedown', (e) => { isDragging = true; document.body.style.cursor = 'grabbing'; updateZoomFromPosition(e.clientX); });
        window.addEventListener('mousemove', (e) => { if (isDragging) updateZoomFromPosition(e.clientX); });
        window.addEventListener('mouseup', () => { isDragging = false; document.body.style.cursor = 'default'; });
    }

    initModals() {
        document.querySelectorAll('.modal').forEach(modalEl => {
            this.modals[modalEl.id] = new bootstrap.Modal(modalEl);
            modalEl.addEventListener('show.bs.modal', (e) => {
                const id = e.target.id;
                if (id === 'projectsModal') this.showProjectsModal();
                else if (id === 'templatesModal') this.showTemplatesModal(document.querySelector('.template-categories .btn.active').dataset.category);
                else if (id === 'analyticsModal') this.showAnalyticsModal();
            });
        });
    }

    updatePreview() {
        const srcDoc = `
            <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><style>${this.editors.css?.getValue() || ''}</style></head>
            <body>${this.editors.html?.getValue() || ''}<script>
                window.onerror=(m,s,l,c,e)=>{window.parent.postMessage({type:'iframeError',payload:{message:m,lineno:l,error:e?e.stack:''}},'*');return true;};
                try{${this.editors.js?.getValue() || ''}}catch(e){window.parent.postMessage({type:'iframeError',payload:{message:e.message,error:e.stack}},'*');}
            <\/script></body></html>`;
        document.getElementById('previewFrame').srcdoc = srcDoc;
    }

    setZoom(newZoom) {
        this.currentZoom = Math.max(0.2, Math.min(newZoom, 3.0));
        document.getElementById('previewFrame').style.transform = `scale(${this.currentZoom})`;
        document.getElementById('zoomValue').textContent = `${Math.round(this.currentZoom * 100)}%`;
        const percent = Math.log(this.currentZoom / 0.2) / Math.log(15);
        document.getElementById('zoomThumb').style.left = `calc(${percent * 100}% - 7px)`;
    }

    calculateAutoZoom(presetWidth, presetHeight) {
        const container = document.getElementById('previewContainer');
        const padding = 64;
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - padding;
        if (presetWidth <= 0 || presetHeight <= 0 || availableWidth <= 0 || availableHeight <= 0) return 1.0;
        const scaleX = availableWidth / presetWidth;
        const scaleY = availableHeight / presetHeight;
        return Math.min(scaleX, scaleY, 1.0);
    }

    changeViewport(viewport, isInitial = false) {
        const frame = document.getElementById('previewFrame');
        const container = document.getElementById('previewContainer');
        if (!frame || !container) return;
        container.style.justifyContent = 'center';
        frame.className = 'preview-frame';
        if (viewport !== 'desktop') frame.classList.add(viewport);
        const preset = this.viewportPresets[viewport];
        if (preset) {
            const name = viewport.charAt(0).toUpperCase() + viewport.slice(1).replace(/-/g, ' ');
            const icon = `fas fa-${viewport.includes('mobile') ? 'mobile-alt' : viewport.includes('tablet') ? 'tablet-alt' : 'desktop'}`;
            document.getElementById('viewportDropdown').innerHTML = `<i class="${icon}"></i><span class="d-none d-md-inline ms-1">${name}</span>`;
            setTimeout(() => {
                if (preset.width !== '100%') {
                    const autoZoom = this.calculateAutoZoom(preset.width, preset.height);
                    this.setZoom(autoZoom);
                } else { this.setZoom(1.0); }
            }, 50);
        }
        document.querySelectorAll('#viewportMenu a').forEach(a => a.classList.remove('active'));
        document.querySelector(`#viewportMenu a[data-viewport="${viewport}"]`)?.classList.add('active');
        this.currentViewMode = viewport;
        if (!isInitial) this.showMiniNotification(`Viewport: ${viewport}`);
    }

    async exportToPDF() {
        if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') return this.showMiniNotification('Required library not loaded.');
        this.showMiniNotification('Generating PDF...');
        try {
            const frame = document.getElementById('previewFrame');
            const { jsPDF } = window.jspdf;
            const isDesktop = this.currentViewMode === 'desktop';
            const container = document.getElementById('previewContainer');
            const targetWidth = isDesktop ? container.clientWidth : frame.clientWidth;
            const targetHeight = isDesktop ? container.clientHeight : frame.clientHeight;
            const canvas = await html2canvas(frame.contentWindow.document.body, {
                width: isDesktop ? targetWidth / this.currentZoom : frame.contentWindow.document.body.scrollWidth,
                height: isDesktop ? targetHeight / this.currentZoom : frame.contentWindow.document.body.scrollHeight,
                scale: 2, useCORS: true, allowTaint: true,
            });
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const pdf = new jsPDF({
                orientation: targetWidth > targetHeight ? 'l' : 'p',
                unit: 'px',
                format: [targetWidth, targetHeight]
            });
            pdf.addImage(imgData, 'JPEG', 0, 0, targetWidth, targetHeight);
            pdf.save('html-preview.pdf');
            this.analytics.exports++; this.saveAnalytics();
            this.showMiniNotification('PDF exported successfully!');
        } catch (e) { this.logError(e, 'Export PDF'); }
    }

    shareCode() {
        try {
            const data = { html: this.editors.html.getValue(), css: this.editors.css.getValue(), js: this.editors.js.getValue() };
            const jsonString = JSON.stringify(data);
            const encoded = btoa(jsonString);
            const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
            navigator.clipboard.writeText(url)
                .then(() => this.showMiniNotification('Share link copied to clipboard!'))
                .catch(() => this.showMiniNotification('Failed to copy link.'));
        } catch (error) {
            this.logError(error, 'Share Code');
        }
    }

    loadSharedCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedCode = urlParams.get('code');
        if (encodedCode) {
            try {
                const decoded = atob(encodedCode);
                const data = JSON.parse(decoded);
                this.editors.html?.setValue(data.html || '');
                this.editors.css?.setValue(data.css || '');
                this.editors.js?.setValue(data.js || '');
                this.updatePreview();
                this.showMiniNotification('Shared code loaded successfully!');
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) { this.logError(error, 'Load Shared Code'); }
        }
    }

    submitFeedback() {
        const type = document.getElementById('feedbackType').value;
        const message = document.getElementById('feedbackMessage').value;
        const email = document.getElementById('feedbackEmail').value;
        if (!message) { alert('Please enter a message.'); return; }
        const subject = `HTML Editor Feedback: ${type}`;
        let body = `Message:\n${message}`;
        if (email) { body += `\n\nFrom: ${email}`; }
        const mailtoLink = `mailto:quatermain12@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
        this.modals.feedbackModal.hide();
        this.showMiniNotification('Thank you for your feedback!');
    }

    showMiniNotification(message) {
        const container = document.getElementById('notification-container');
        if (!container) return;
        const notif = document.createElement('div');
        notif.className = 'mini-notification'; notif.textContent = message;
        container.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 400);
        }, 3500);
        if (container.children.length > 4) {
            const oldest = container.firstChild;
            oldest.classList.remove('show');
            setTimeout(() => oldest.remove(), 400);
        }
    }

    switchTab(lang) {
        this.currentActiveTab = lang;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
        document.querySelectorAll('.editor-container > div').forEach(el => el.style.display = el.id.startsWith(lang) ? 'block' : 'none');
        if (this.editors[lang]?.layout) this.editors[lang].layout();
    }

    toggleTheme() {
        const isDark = document.body.classList.toggle("dark-theme");
        this.currentTheme = isDark ? "vs-dark" : "vs";
        document.querySelector("#themeToggle i").className = isDark ? "fas fa-sun" : "fas fa-moon";
        Object.values(this.editors).forEach(e => e?.updateOptions?.({ theme: this.currentTheme }));
        localStorage.setItem("htmlPreviewTool_theme", this.currentTheme);
    }

    resetToDefault() {
        if (confirm("Reset all editors to default content?")) {
            this.editors.html?.setValue(this.getDefaultHTML());
            this.editors.css?.setValue(this.getDefaultCSS());
            this.editors.js?.setValue(this.getDefaultJS());
            this.updatePreview();
            this.showMiniNotification("Editors have been reset.");
        }
    }

    copyCurrentCode() {
        const code = this.editors[this.currentActiveTab]?.getValue();
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                this.showMiniNotification("Code copied to clipboard!");
                const btn = document.getElementById("copyBtn");
                btn.classList.add("copied");
                setTimeout(() => btn.classList.remove("copied"), 2000);
            }).catch(err => this.showMiniNotification("Failed to copy code."));
        }
    }

    clearCurrentEditor() {
        if (confirm(`Clear the ${this.currentActiveTab.toUpperCase()} editor?`)) {
            this.editors[this.currentActiveTab]?.setValue("");
        }
    }

    formatCode() {
        this.editors[this.currentActiveTab]?.getAction("editor.action.formatDocument")?.run();
        this.showMiniNotification("Code formatted.");
    }

    openInNewWindow() {
        const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes';
        const newWindow = window.open('', '_blank', windowFeatures);

        const content = {
            html: this.editors.html.getValue(),
            css: this.editors.css.getValue(),
            js: this.editors.js.getValue(),
        };
        sessionStorage.setItem('newWindowContent', JSON.stringify(content));

        const newWindowHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Preview</title>
                <style id="new-window-css"></style>
                <style>
                    body { margin: 0; font-family: sans-serif; }
                    #controls { position: fixed; top: 10px; right: 10px; z-index: 9999; background: rgba(255,255,255,0.8); padding: 5px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); backdrop-filter: blur(5px); }
                    #controls button { font-size: 10px; padding: 2px 5px; margin-left: 5px; border-radius: 3px; border: 1px solid #ccc; background: #fff; cursor: pointer; }
                    #controls button:hover { background: #f0f0f0; }
                </style>
            </head>
            <body>
                <div id="controls">
                    <button id="toggleCssBtn">Toggle CSS</button>
                    <button id="toggleJsBtn">Toggle JS</button>
                </div>
                <div id="new-window-html"></div>
                <script>
                    const content = JSON.parse(sessionStorage.getItem('newWindowContent'));
                    let jsEnabled = true;

                    function render() {
                        document.getElementById('new-window-html').innerHTML = content.html;
                        document.getElementById('new-window-css').textContent = content.css;
                        const oldScript = document.getElementById('new-window-js');
                        if(oldScript) oldScript.remove();
                        if(jsEnabled) {
                            const script = document.createElement('script');
                            script.id = 'new-window-js';
                            script.textContent = 'try {' + content.js + '} catch(e) { console.error(e) }';
                            document.body.appendChild(script);
                        }
                    }

                    document.getElementById('toggleCssBtn').addEventListener('click', () => {
                        const styleSheet = document.getElementById('new-window-css');
                        styleSheet.disabled = !styleSheet.disabled;
                    });

                    document.getElementById('toggleJsBtn').addEventListener('click', () => {
                        jsEnabled = !jsEnabled;
                        render();
                    });

                    render();
                </script>
            </body>
            </html>`;
        newWindow.document.write(newWindowHTML);
        newWindow.document.close();
    }

    toggleFullscreen() {
        const panel = document.querySelector(".preview-panel");
        const isFullscreen = panel.classList.toggle("fullscreen-mode");
        document.getElementById("fullscreenBtn").innerHTML = `<i class="fas fa-${isFullscreen ? "compress" : "expand"}"></i>`;
    }

    downloadHTML() {
        try {
            const html = this.editors.html?.getValue() || "";
            const css = this.editors.css?.getValue() || "";
            const js = this.editors.js?.getValue() || "";
            const fullHTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Exported Page</title><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
            const blob = new Blob([fullHTML], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "index.html";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            this.analytics.exports++;
            this.saveAnalytics();
            this.showMiniNotification("HTML file downloaded!");
        } catch (e) {
            this.logError(e, "Download HTML");
        }
    }

    async takeScreenshot() {
        if (typeof html2canvas === "undefined") return this.showMiniNotification("Screenshot library not loaded.");
        this.showMiniNotification("Capturing preview...");
        try {
            const frame = document.getElementById("previewFrame");
            const canvas = await html2canvas(frame.contentWindow.document.body, { useCORS: true, allowTaint: true });
            const link = document.createElement("a");
            link.download = "preview-screenshot.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            this.analytics.exports++;
            this.saveAnalytics();
            this.showMiniNotification("Screenshot saved!");
        } catch (e) {
            this.logError(e, "Screenshot");
        }
    }

    updateAutoSaveStatus() {
        const el = document.getElementById("autoSaveStatus");
        if (!el) return;
        el.classList.remove("saving", "saved", "error", "off");
        el.querySelector("i").classList.remove("fa-spin");
        if (this.autoSaveEnabled) {
            el.querySelector(".save-text").textContent = "Auto Save ON";
            el.title = "Auto-save is ON. Click to disable.";
        } else {
            el.querySelector(".save-text").textContent = "Auto Save OFF";
            el.classList.add("off");
            el.title = "Auto-save is OFF. Click to enable.";
        }
    }

    toggleAutoSave() {
        this.autoSaveEnabled = !this.autoSaveEnabled;
        this.showMiniNotification(`Auto-save ${this.autoSaveEnabled ? "enabled" : "disabled"}.`);
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        } else {
            this.stopAutoSave();
        }
        this.updateAutoSaveStatus();
        localStorage.setItem("htmlPreviewTool_autoSave", JSON.stringify(this.autoSaveEnabled));
    }

    startAutoSave() {
        if (!this.autoSaveEnabled || this.autoSaveInterval) return;
        this.autoSaveInterval = setInterval(() => this.performAutoSave(), 30000);
    }

    stopAutoSave() {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
    }

    performAutoSave() {
        if (!this.autoSaveEnabled) return;
        const el = document.getElementById("autoSaveStatus");
        if (!el) return;
        el.classList.add("saving");
        el.querySelector("i").classList.add("fa-spin");
        try {
            const currentContent = {
                html: this.editors.html.getValue(),
                css: this.editors.css.getValue(),
                js: this.editors.js.getValue(),
                timestamp: (new Date).toISOString()
            };
            this.saveToLocalStorage("htmlPreviewTool_current", currentContent);
            this.updateRecentSaves(currentContent);
            this.analytics.saves++;
            this.saveAnalytics();
            setTimeout(() => {
                el.classList.remove("saving");
                el.classList.add("saved");
                el.querySelector("i").classList.remove("fa-spin");
                setTimeout(() => this.updateAutoSaveStatus(), 2000);
            }, 1000);
        } catch (t) {
            this.logError(t, "Auto Save");
            el.classList.remove("saving");
            el.classList.add("error");
            el.querySelector("i").classList.remove("fa-spin");
        }
    }

    saveToLocalStorage(key, data) {
        const content = data || {
            html: this.editors.html?.getValue() || "",
            css: this.editors.css?.getValue() || "",
            js: this.editors.js?.getValue() || "",
            timestamp: (new Date).toISOString()
        };
        localStorage.setItem(key, JSON.stringify(content));
    }

    extractSaveName(htmlString) {
        if (!htmlString || !htmlString.trim()) return "Untitled";

        // 1. Try to extract content from <title> tag
        const titleMatch = htmlString.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        if (titleMatch && titleMatch[1] && titleMatch[1].trim()) {
            return titleMatch[1].trim();
        }

        // 2. Try to extract content from the first <h1> tag
        const h1Match = htmlString.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
        if (h1Match && h1Match[1]) {
            const h1Text = h1Match[1].replace(/<[^>]+>/g, '').trim();
            if (h1Text) {
                return h1Text;
            }
        }

        // 3. Fallback to the first non-empty text content
        const textContent = htmlString.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (textContent) {
            return textContent.substring(0, 30) + (textContent.length > 30 ? '...' : '');
        }

        return "Untitled";
    }

    escapeHTML(str) {
        if (!str) return "";
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    updateRecentSaves(currentContent) {
        let saves = JSON.parse(localStorage.getItem("htmlPreviewTool_recentSaves") || "[]");
        saves.unshift(currentContent);
        if (saves.length > 5) saves = saves.slice(0, 5); // Use slice for better performance
        localStorage.setItem("htmlPreviewTool_recentSaves", JSON.stringify(saves));
        this.populateRecentSaves();
    }

    populateRecentSaves() {
        const listEl = document.getElementById("recentSavesList");
        const saves = JSON.parse(localStorage.getItem("htmlPreviewTool_recentSaves") || "[]");
        if (!listEl) return;
        if (saves.length === 0) {
            listEl.innerHTML = '<li><span class="dropdown-item-text text-muted">No recent saves.</span></li>';
        } else {
            listEl.innerHTML = saves.map((save, index) => {
                const saveName = this.extractSaveName(save.html);
                const escapedName = this.escapeHTML(saveName);
                const timestamp = new Date(save.timestamp);
                const titleAttr = `${escapedName}\nSaved at ${timestamp.toLocaleString()}`;

                return `<li><a class="dropdown-item" href="#" data-index="${index}" title="${titleAttr}">${timestamp.toLocaleTimeString()}: ${escapedName}</a></li>`;
            }).join("");

            listEl.querySelectorAll("a").forEach(a => {
                a.addEventListener("click", e => {
                    e.preventDefault();
                    const bsDropdown = bootstrap.Dropdown.getInstance(document.getElementById('recentSavesDropdown').previousElementSibling);
                    if (bsDropdown) {
                        bsDropdown.hide();
                    }
                    this.loadRecentSave(a.dataset.index);
                });
            });
        }
    }

    loadRecentSave(index) {
        const saves = JSON.parse(localStorage.getItem("htmlPreviewTool_recentSaves") || "[]");
        if (saves[index] && confirm("Load this version? Unsaved changes will be lost.")) {
            const saveData = saves[index];
            this.editors.html.setValue(saveData.html || "");
            this.editors.css.setValue(saveData.css || "");
            this.editors.js.setValue(saveData.js || "");
            this.updatePreview();
            this.showMiniNotification(`Loaded save from ${new Date(saveData.timestamp).toLocaleTimeString()}`);
        }
    }

    loadFromLocalStorage() {
        const theme = localStorage.getItem("htmlPreviewTool_theme");
        if ("vs-dark" === theme && !document.body.classList.contains("dark-theme")) this.toggleTheme();
        const autoSave = localStorage.getItem("htmlPreviewTool_autoSave");
        if (null !== autoSave) this.autoSaveEnabled = JSON.parse(autoSave);
        const content = localStorage.getItem("htmlPreviewTool_current");
        if (content) try {
            const data = JSON.parse(content);
            this.editors.html?.setValue(data.html || "");
            this.editors.css?.setValue(data.css || "");
            this.editors.js?.setValue(data.js || "");
            this.updatePreview();
        } catch (e) {
            localStorage.removeItem("htmlPreviewTool_current");
        }
        this.populateTemplateSelector();
        this.populateRecentSaves();
        this.loadSharedCode();
    }

    populateTemplateSelector() {
        const selector = document.getElementById("templateSelector");
        if (selector && typeof templates !== "undefined") {
            selector.innerHTML = '<option value="">Load a Template...</option>';
            Object.keys(templates).forEach(t => selector.add(new Option(templates[t].name, t)));
        }
    }

    loadTemplate(key) {
        if (!templates[key]) return this.showMiniNotification("Template not found.");
        if (!confirm("Load template and overwrite current code?")) return;
        const t = templates[key];
        this.editors.html?.setValue(t.html);
        this.editors.css?.setValue(t.css);
        this.editors.js?.setValue(t.js);
        this.updatePreview();
        this.analytics.templatesLoaded++;
        this.saveAnalytics();
        this.showMiniNotification(`Template "${t.name}" loaded.`);
    }

    createNewProject() {
        if (confirm("Clear all editors for a new project?")) {
            this.resetToDefault();
            this.analytics.projectsCreated++;
            this.saveAnalytics();
            this.showMiniNotification("New blank project started.");
            this.modals.projectsModal.hide();
        }
    }

    saveProject() {
        const name = prompt("Enter project name:", "My Project " + (new Date).toLocaleDateString());
        if (!name) return;
        const projects = JSON.parse(localStorage.getItem("htmlPreviewTool_projects") || "[]");
        projects.unshift({
            id: "proj_" + Date.now(), name, html: this.editors.html.getValue(), css: this.editors.css.getValue(),
            js: this.editors.js.getValue(), createdAt: (new Date).toISOString()
        });
        localStorage.setItem("htmlPreviewTool_projects", JSON.stringify(projects));
        this.showMiniNotification(`Project "${name}" saved!`);
        this.analytics.projectsCreated++;
        this.saveAnalytics();
    }

    loadProject(id) {
        const projects = JSON.parse(localStorage.getItem("htmlPreviewTool_projects") || "[]");
        const p = projects.find(p => p.id === id);
        if (p && confirm(`Load project "${p.name}"?`)) {
            this.editors.html.setValue(p.html || "");
            this.editors.css.setValue(p.css || "");
            this.editors.js.setValue(p.js || "");
            this.updatePreview();
            this.showMiniNotification(`Project "${p.name}" loaded.`);
            this.modals.projectsModal.hide();
        }
    }

    deleteProject(id) {
        let projects = JSON.parse(localStorage.getItem("htmlPreviewTool_projects") || "[]");
        const p = projects.find(p => p.id === id);
        if (p && confirm(`Delete project "${p.name}"?`)) {
            projects = projects.filter(p => p.id !== id);
            localStorage.setItem("htmlPreviewTool_projects", JSON.stringify(projects));
            this.showMiniNotification("Project deleted.");
            this.showProjectsModal();
        }
    }

    showProjectsModal() {
        const listEl = document.getElementById("projectsList");
        const projects = JSON.parse(localStorage.getItem("htmlPreviewTool_projects") || "[]");
        if (0 === projects.length) return void (listEl.innerHTML = '<p class="text-center text-muted mt-3">No saved projects found.</p>');
        listEl.innerHTML = projects.map(p => `
            <div class="project-item"><div class="project-header">
                <h6 class="project-title">${p.name}</h6>
                <small class="project-date">${new Date(p.createdAt).toLocaleString()}</small></div>
                <div class="project-actions">
                    <button class="btn btn-sm btn-primary" data-id="${p.id}" data-action="load">Load</button>
                    <button class="btn btn-sm btn-outline-danger" data-id="${p.id}" data-action="delete">Delete</button>
                </div></div>`).join("");
        listEl.addEventListener("click", e => {
            if (e.target.dataset.id) {
                if ("load" === e.target.dataset.action) this.loadProject(e.target.dataset.id);
                if ("delete" === e.target.dataset.action) this.deleteProject(e.target.dataset.id);
            }
        });
    }

    showTemplatesModal(category, searchTerm = "") {
        const gallery = document.getElementById("templateGallery");
        if (void 0 === category) category = document.querySelector(".template-categories .btn.active").dataset.category;
        document.querySelectorAll(".template-categories .btn").forEach(b => b.classList.toggle("active", b.dataset.category === category));
        searchTerm = searchTerm.toLowerCase();
        const templatesToShow = Object.entries(templates).filter(([key, t]) => ("all" === category || t.category === category) && ("" === searchTerm || t.name.toLowerCase().includes(searchTerm) || t.description.toLowerCase().includes(searchTerm)));
        if (0 === templatesToShow.length) return void (gallery.innerHTML = '<p class="text-center text-muted col-12">No templates found.</p>');
        gallery.innerHTML = templatesToShow.map(([key, t]) => {
            const scaled = `<div style="transform: scale(0.4); transform-origin: top left; width: 250%; height: 250%; overflow: hidden;"><style>${t.css}</style>${t.html}</div>`;
            return `<div class="col"><div class="template-card" data-key="${key}"><div class="template-preview"><iframe srcdoc="${scaled.replace(/"/g, "&quot;")}" scrolling="no"></iframe></div><div class="template-info"><h5 class="template-title">${t.name}</h5><p class="template-description">${t.description}</p></div></div></div>`
        }).join("");
        gallery.querySelectorAll(".template-card").forEach(c => c.addEventListener("click", () => { this.loadTemplate(c.dataset.key); this.modals.templatesModal.hide() }));
        document.querySelectorAll(".template-categories .btn").forEach(b => b.onclick = () => this.showTemplatesModal(b.dataset.category, searchTerm));
    }

    showAnalyticsModal() {
        document.getElementById("analyticsContent").innerHTML = `<div class="analytics-grid">${Object.entries(this.analytics).map(([e, t]) => `<div class="analytics-card"><div class="analytics-number">${t}</div><div class="analytics-label">${e.charAt(0).toUpperCase() + e.slice(1).replace(/([A-Z])/g, " $1")}</div></div>`).join("")}</div><p class="text-center text-muted small mt-3">Stats are stored in your browser's local storage.</p>`;
    }

    saveAnalytics() {
        localStorage.setItem("htmlPreviewTool_analytics", JSON.stringify(this.analytics));
    }

    installPWA() {
        if (window.deferredPrompt) window.deferredPrompt.prompt();
        else this.showMiniNotification("App installation not available.");
    }

    logError(error, context = "General") {
        console.error(`[${context}]`, error);
        this.analytics.errors++;
        this.saveAnalytics();
        this.errors.push({
            message: error.message,
            context: context
        });
        this.displayErrors();
    }

    clearErrors() {
        this.errors = [];
        const panel = document.getElementById("errorPanel");
        if (panel) panel.style.display = "none";
    }

    displayErrors() {
        const panel = document.getElementById("errorPanel");
        const list = document.getElementById("errorList");
        if (!panel || !list || 0 === this.errors.length) return;
        list.innerHTML = this.errors.map(e => `<div class="error-item"><strong>${e.context}:</strong> ${e.message}</div>`).join("");
        panel.style.display = "block";
    }
}

document.addEventListener('DOMContentLoaded', () => window.htmlPreviewTool = new HTMLPreviewTool());
window.addEventListener('beforeunload', () => { if (window.htmlPreviewTool?.autoSaveEnabled) window.htmlPreviewTool.performAutoSave(); });