/**
 * SAVE THE DATE - CONVITE INTERATIVO PREMIUM
 * Logic & Scene Sequencer Engine
 */

// Global standalone download functions (Available immediately for inline onclick)
window.downloadCalendar = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const icsContent = 
"BEGIN:VCALENDAR\r\n" +
"VERSION:2.0\r\n" +
"PRODID:-//Alleane & Rafael//Casamento//PT-BR\r\n" +
"BEGIN:VEVENT\r\n" +
"UID:casamento-alleane-rafael-2026-" + Date.now() + "@wedding.com\r\n" +
"DTSTAMP:20260724T000000Z\r\n" +
"DTSTART:20261121T170000\r\n" +
"DTEND:20261121T230000\r\n" +
"SUMMARY:Casamento Alleane & Rafael\r\n" +
"DESCRIPTION:Celebração do Casamento de Alleane e Rafael. Cerimônia às 17:00h na Igreja N.S. de Fátima e Recepção às 19:00h no Villa Condotti.\r\n" +
"LOCATION:Igreja N.S. de Fátima / Villa Condotti\r\n" +
"STATUS:CONFIRMED\r\n" +
"BEGIN:VALARM\r\n" +
"TRIGGER:-P1D\r\n" +
"ACTION:DISPLAY\r\n" +
"DESCRIPTION:Lembrete: amanhã é o Casamento de Alleane & Rafael às 17:00h!\r\n" +
"END:VALARM\r\n" +
"BEGIN:VALARM\r\n" +
"TRIGGER:-PT1H\r\n" +
"ACTION:DISPLAY\r\n" +
"DESCRIPTION:Lembrete: o Casamento de Alleane & Rafael começa em 1 hora (17:00h)!\r\n" +
"END:VALARM\r\n" +
"END:VEVENT\r\n" +
"END:VCALENDAR";

    try {
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', 'Casamento_Alleane_e_Rafael.ics');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(function() {
            if (link.parentNode) link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 500);
    } catch(err) {
        console.error("Calendar download error:", err);
    }
};

window.downloadPDF = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();

    const targetBtn = document.getElementById('btn-download-pdf');
    const btnSpan = targetBtn ? targetBtn.querySelector('span') : null;
    const origText = btnSpan ? btnSpan.innerText : "Salvar Convite em PDF";

    if (btnSpan) btnSpan.innerText = "Gerando PDF...";

    const pdfTemplate = document.getElementById('pdf-printable-template');

    if (typeof html2canvas === 'function' && pdfTemplate) {
        const origStyle = pdfTemplate.getAttribute('style') || '';
        pdfTemplate.style.cssText = 'position: fixed; top: 0; left: 0; width: 700px; z-index: 9999999; opacity: 1; visibility: visible; background: #f9f5eb; pointer-events: none;';

        html2canvas(pdfTemplate, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#f9f5eb',
            logging: false
        }).then(function(canvas) {
            pdfTemplate.style.cssText = origStyle;
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

            if (jsPDFClass) {
                const pdf = new jsPDFClass('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Convite_Casamento_Alleane_e_Rafael.pdf');
            } else {
                const a = document.createElement('a');
                a.href = imgData;
                a.download = 'Convite_Casamento_Alleane_e_Rafael.jpg';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                setTimeout(function(){ if (a.parentNode) a.parentNode.removeChild(a); }, 500);
            }
            if (btnSpan) btnSpan.innerText = origText;
        }).catch(function(err) {
            console.error("Canvas error:", err);
            pdfTemplate.style.cssText = origStyle;
            if (btnSpan) btnSpan.innerText = origText;
        });
    } else {
        if (btnSpan) btnSpan.innerText = origText;
    }
};

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. DOM ELEMENTS & STATE MANAGEMENT
       -------------------------------------------------------------------------- */
    const body = document.body;
    const waxSeal = document.getElementById('wax-seal');
    const envelope = document.getElementById('envelope');
    const letterSlide = document.getElementById('letter-slide');
    const letter = document.getElementById('letter');
    const signatureText = document.getElementById('signature-handwriting');
    const goldenFeather = document.getElementById('golden-feather');
    const scrollLeft = document.getElementById('scroll-left');
    const scrollRight = document.getElementById('scroll-right');
    const menusContainer = document.getElementById('menus-container');
    const goldRibbon = document.getElementById('gold-ribbon');
    const actionToolbar = document.getElementById('action-toolbar');
    
    // Audio Toggle
    const audioBtn = document.getElementById('audio-toggle');
    const soundOnIcon = document.getElementById('sound-on-icon');
    const soundOffIcon = document.getElementById('sound-off-icon');

    // Modals & Buttons
    const btnGifts = document.getElementById('btn-gifts');
    const btnStory = document.getElementById('btn-story');
    const modalGifts = document.getElementById('modal-gifts');
    const modalStory = document.getElementById('modal-story');
    const btnCopyPix = document.getElementById('btn-copy-pix');
    const pixInput = document.getElementById('pix-key-input');
    const copyToast = document.getElementById('copy-toast');
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    const btnAddCalendar = document.getElementById('btn-add-calendar');

    let currentScene = 1;
    let audioContext = null;
    let isAudioPlaying = false;
    let bgOscillators = [];

    /* --------------------------------------------------------------------------
       2. PARTICLE CANVAS ENGINE (GOLD DUST & CANDLE EMBERS)
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height * 0.2;
            this.radius = Math.random() * 2 + 0.8;
            this.alpha = Math.random() * 0.5 + 0.2;
            this.speedY = -(Math.random() * 0.5 + 0.2);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.hue = Math.random() < 0.8 ? 42 : 28; // Delicate gold & champagne motes
            this.pulse = Math.random() * 0.02 + 0.01;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.alpha += Math.sin(Date.now() * 0.003) * 0.01;

            if (this.y < -10 || this.alpha <= 0) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 45%, ${Math.max(0, this.alpha * 0.65)})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = `hsl(${this.hue}, 75%, 40%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* --------------------------------------------------------------------------
       2B. GYROSCOPE / DEVICE ORIENTATION & FIXED LIGHT REFLECTION ENGINE
       -------------------------------------------------------------------------- */
    let targetTiltX = 0; // rotateX
    let targetTiltY = 0; // rotateY
    let currentTiltX = 0;
    let currentTiltY = 0;
    let hasGyroscope = false;

    // Mobile Gyroscope Listener (DeviceOrientation)
    function handleDeviceOrientation(e) {
        if (e.beta !== null && e.gamma !== null && e.beta !== undefined) {
            hasGyroscope = true;
            const betaNorm = e.beta - 40; // Resting holding angle ~40deg
            targetTiltX = Math.max(-20, Math.min(20, -betaNorm * 0.45));
            targetTiltY = Math.max(-24, Math.min(24, e.gamma * 0.5));
        }
    }

    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            const requestGyro = function() {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                        }
                    })
                    .catch(console.error);
            };
            document.addEventListener('touchstart', requestGyro, { once: true });
            document.addEventListener('click', requestGyro, { once: true });
        } else {
            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        }
    }

    // Mobile Touch Drag & Tilt Fallback (Works 100% on HTTP and all Mobile Browsers)
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (touch.clientX - cx) / cx;
            const dy = (touch.clientY - cy) / cy;

            targetTiltX = -dy * 18;
            targetTiltY = dx * 20;
        }
    }, { passive: true });

    // Desktop Mouse Movement Parallax Fallback
    window.addEventListener('mousemove', (e) => {
        if (hasGyroscope) return;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        targetTiltX = -dy * 16;
        targetTiltY = dx * 18;
    });

    // 60FPS LERP Animation Loop for 3D Envelope Motion & Fixed Light Reflection
    function updateEnvelope3DMotion() {
        currentTiltX += (targetTiltX - currentTiltX) * 0.08;
        currentTiltY += (targetTiltY - currentTiltY) * 0.08;

        if (envelope && (currentScene === 1 || currentScene === 2)) {
            if (!envelope.classList.contains('opened')) {
                envelope.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translateZ(10px)`;
            }

            // Fixed Light Point in 3D Space (Top-Left ~24% x 18%)
            const spotlightX = 24 - currentTiltY * 1.35;
            const spotlightY = 18 - currentTiltX * 1.35;

            envelope.style.setProperty('--spotlight-x', `${spotlightX.toFixed(1)}%`);
            envelope.style.setProperty('--spotlight-y', `${spotlightY.toFixed(1)}%`);
        }

        requestAnimationFrame(updateEnvelope3DMotion);
    }

    updateEnvelope3DMotion();

    /* --------------------------------------------------------------------------
       3. BACKGROUND MUSIC & AUDIO ENGINE (SOFT AMBIENT VOLUME & LIFECYCLE)
       -------------------------------------------------------------------------- */
    const bgMusic = document.getElementById('bg-music');
    let wasPlayingBeforeHidden = false;
    let userRedirectedOut = false;

    if (bgMusic) {
        bgMusic.volume = 0.35; // Soft ambient volume level (35%)
    }

    function playMusic() {
        if (!bgMusic) return;
        bgMusic.volume = 0.35;
        bgMusic.play().then(() => {
            isAudioPlaying = true;
            if (soundOnIcon) soundOnIcon.classList.remove('hidden');
            if (soundOffIcon) soundOffIcon.classList.add('hidden');
        }).catch(err => {
            console.log("Audio play error:", err);
        });
    }

    function pauseMusic() {
        if (!bgMusic) return;
        bgMusic.pause();
        isAudioPlaying = false;
        if (soundOnIcon) soundOnIcon.classList.add('hidden');
        if (soundOffIcon) soundOffIcon.classList.remove('hidden');
    }

    function toggleBackgroundMusic() {
        if (!bgMusic) return;
        if (isAudioPlaying) {
            userRedirectedOut = false;
            pauseMusic();
        } else {
            userRedirectedOut = false;
            playMusic();
        }
    }

    if (audioBtn) {
        audioBtn.addEventListener('click', toggleBackgroundMusic);
    }

    // Auto-start ambient music on first user touch/click anywhere
    const startAudioOnUserGesture = () => {
        if (bgMusic && !isAudioPlaying && !userRedirectedOut) {
            playMusic();
        }
        document.removeEventListener('click', startAudioOnUserGesture);
        document.removeEventListener('touchstart', startAudioOnUserGesture);
    };
    document.addEventListener('click', startAudioOnUserGesture, { once: true });
    document.addEventListener('touchstart', startAudioOnUserGesture, { once: true });

    /* --- Lifecycle Events: Stop Audio when user leaves screen/tab/app or closes browser --- */
    
    // 1. Tab visibility changes (tab switch, minimizing browser, screen lock, background app on mobile)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isAudioPlaying) {
                wasPlayingBeforeHidden = true;
                pauseMusic();
            }
        } else {
            // Auto-resume ONLY if audio was active before AND user didn't leave via site redirect link
            if (wasPlayingBeforeHidden && !userRedirectedOut) {
                playMusic();
            }
            wasPlayingBeforeHidden = false;
        }
    });

    // 2. Page unload / navigate away / mobile app close events
    window.addEventListener('pagehide', () => {
        pauseMusic();
    });

    window.addEventListener('beforeunload', () => {
        pauseMusic();
    });

    if ('freeze' in document) {
        document.addEventListener('freeze', () => {
            pauseMusic();
        });
    }

    // 3. Immediately stop music when user clicks/taps ANY link redirecting to the external site
    const stopAudioOnRedirect = () => {
        userRedirectedOut = true;
        wasPlayingBeforeHidden = false;
        pauseMusic();
    };

    // Attach listener to all links opening external site or target="_blank"
    document.querySelectorAll('a[href], .gift-site-btn').forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('//') || link.getAttribute('target') === '_blank')) {
            link.addEventListener('click', stopAudioOnRedirect);
            link.addEventListener('touchend', stopAudioOnRedirect, { passive: true });
        }
    });

    /* --------------------------------------------------------------------------
       4. SCENE SEQUENCER (CENAS 1 A 6)
       -------------------------------------------------------------------------- */

    // Scene 1: Initial view showing ONLY the envelope (Scroll LOCKED)
    document.documentElement.classList.add('lock-scroll');
    body.className = 'state-scene1 lock-scroll';

    let sealOpened = false;

    const openInvitationSequence = (e) => {
        if (e && e.cancelable) {
            e.preventDefault();
        }
        if (currentScene > 1) return;
        currentScene = 2;

        // Unlock page scrolling as soon as seal is clicked
        document.documentElement.classList.remove('lock-scroll');
        body.classList.remove('lock-scroll');

        // Play background music on seal tap
        if (bgMusic && !isAudioPlaying && !userRedirectedOut) {
            playMusic();
        }

        // 1. Wax Shatter & Ribbon Drop
        body.className = 'state-scene2';
        waxSeal.classList.add('depressed');

        setTimeout(() => {
            waxSeal.classList.add('cracked');
            if (goldRibbon) {
                goldRibbon.classList.add('ribbon-dropped');
            }
        }, 100);

        // 2. STEP A: Flap Opens & Sheet Slides ALL THE WAY UP TO TOP OF SCREEN (250ms)
        setTimeout(() => {
            currentScene = 3;
            body.className = 'state-scene3';
            envelope.classList.add('opened');

            // Letter slides UP to top of screen first
            letterSlide.classList.add('center-display');
            letter.classList.remove('folded');
            letter.classList.add('unfolded');

            // 3. STEP B: Slower Handwriting Signature Begins ONLY AFTER sheet lands at top (1400ms)
            setTimeout(() => {
                currentScene = 4;
                body.className = 'state-scene4';

                // Start Feather Handwriting if elements are present
                if (goldenFeather) goldenFeather.classList.remove('hidden');
                if (signatureText) signatureText.classList.add('writing');

                // 4. STEP C: Menus Reveal
                setTimeout(() => {
                    if (goldenFeather) goldenFeather.classList.add('stroke-end');

                    // Reveal Menu Papiros below the signed letter
                    currentScene = 5;
                    body.className = 'state-scene5';

                    if (menusContainer) {
                        menusContainer.classList.remove('hidden-menus');
                        // Smoothly scroll to bring menus into full view
                        setTimeout(() => {
                            menusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 200);
                    }
                    
                    // Reveal Floating Action Toolbar
                    setTimeout(() => {
                        currentScene = 6;
                        body.className = 'state-scene6';
                        if (actionToolbar) actionToolbar.classList.remove('hidden-toolbar');
                    }, 600);

                }, 400);

            }, 1400); // Waits for letter slide to reach top

        }, 250);
    };

    // Attach both click and touchend to wax seal for 100% mobile compatibility
    if (waxSeal) {
        ['click', 'touchend'].forEach(evtType => {
            waxSeal.addEventListener(evtType, (e) => {
                if (sealOpened) return;
                sealOpened = true;
                openInvitationSequence(e);
            }, { passive: false });
        });
    }

    /* --------------------------------------------------------------------------
       5. MODAL & INTERACTIVE CONTROLS
       -------------------------------------------------------------------------- */
    
    // Open Modals
    btnGifts.addEventListener('click', () => {
        modalGifts.classList.remove('hidden');
        modalGifts.setAttribute('aria-hidden', 'false');
    });

    btnStory.addEventListener('click', () => {
        modalStory.classList.remove('hidden');
        modalStory.setAttribute('aria-hidden', 'false');
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === el || e.target.classList.contains('modal-close')) {
                modalGifts.classList.add('hidden');
                modalGifts.setAttribute('aria-hidden', 'true');
                modalStory.classList.add('hidden');
                modalStory.setAttribute('aria-hidden', 'true');
            }
        });
    });

    // Copy Pix Key
    btnCopyPix.addEventListener('click', () => {
        pixInput.select();
        navigator.clipboard.writeText(pixInput.value).then(() => {
            copyToast.classList.remove('hidden');
            setTimeout(() => copyToast.classList.add('hidden'), 3000);
        });
    });

    // Gift Selection Buttons
    document.querySelectorAll('.gift-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = e.target.getAttribute('data-value');
            alert(`Obrigado pelo carinho! Você selecionou a contribuição de R$ ${val},00. Utilize a chave Pix para concluir.`);
        });
    });

    /* --------------------------------------------------------------------------
       6. ADD TO CALENDAR (GOOGLE CALENDAR + ICAL FILE FOR 100% COMPATIBILITY)
       -------------------------------------------------------------------------- */
    window.downloadCalendar = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();

        // 1. Google Calendar Link
        const gCalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE"
            + "&text=" + encodeURIComponent("Casamento Alleane & Rafael")
            + "&dates=20261121T170000Z/20261121T230000Z"
            + "&details=" + encodeURIComponent("Celebração do Casamento de Alleane e Rafael. Cerimônia às 17h na Igreja N.S. de Fátima e Recepção às 19h no Villa Condotti.")
            + "&location=" + encodeURIComponent("Igreja N.S. de Fátima / Villa Condotti");
            
        try {
            window.open(gCalUrl, '_blank');
        } catch(err) {}

        // 2. Download .ics for iCal / Outlook
        const icsData = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Alleane & Rafael//Casamento//PT-BR",
            "BEGIN:VEVENT",
            "UID:casamento-alleane-rafael-2026@" + Date.now(),
            "DTSTAMP:20260723T000000Z",
            "DTSTART:20261121T170000Z",
            "DTEND:20261121T230000Z",
            "SUMMARY:Casamento Alleane & Rafael",
            "DESCRIPTION:Celebração do Casamento de Alleane e Rafael. Cerimônia às 17h na Igreja N.S. de Fátima e Recepção às 19h no Villa Condotti.",
            "LOCATION:Igreja N.S. de Fátima / Villa Condotti",
            "STATUS:CONFIRMED",
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        try {
            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'Casamento_Alleane_e_Rafael.ics');
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 300);
        } catch(err) {}
    };

    if (btnAddCalendar) {
        ['click', 'touchend'].forEach(evt => {
            btnAddCalendar.addEventListener(evt, window.downloadCalendar, { passive: true });
        });
    }

    /* --------------------------------------------------------------------------
       7. BULLETPROOF PDF GENERATION (JSPDF + HTML2CANVAS + PRINT FALLBACK)
       -------------------------------------------------------------------------- */
    
    // Generate QR Code dynamically for PDF
    const pdfQrContainer = document.getElementById('pdf-qrcode');
    if (typeof QRCode !== 'undefined' && pdfQrContainer) {
        pdfQrContainer.innerHTML = "";
        new QRCode(pdfQrContainer, {
            text: window.location.href || "https://convite-interativo-beige.vercel.app/",
            width: 90,
            height: 90,
            colorDark : "#0a3326",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    window.downloadPDF = async function(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();

        const pdfTemplate = document.getElementById('pdf-printable-template');
        const targetBtn = document.getElementById('btn-download-pdf');
        const btnSpan = targetBtn ? targetBtn.querySelector('span') : null;
        const origText = btnSpan ? btnSpan.innerText : "Salvar Convite em PDF";
        
        if (btnSpan) btnSpan.innerText = "Gerando PDF...";
        if (targetBtn) targetBtn.disabled = true;

        if (!pdfTemplate) {
            window.print();
            if (targetBtn) targetBtn.disabled = false;
            if (btnSpan) btnSpan.innerText = origText;
            return;
        }

        const originalStyle = pdfTemplate.getAttribute('style') || '';
        pdfTemplate.style.cssText = 'position: fixed; top: 0; left: 0; width: 700px; z-index: 999999; opacity: 1; visibility: visible; background: #f9f5eb; pointer-events: none;';

        try {
            if (typeof html2canvas === 'function') {
                const canvasRender = await html2canvas(pdfTemplate, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#f9f5eb',
                    logging: false
                });

                pdfTemplate.style.cssText = originalStyle;
                const imgData = canvasRender.toDataURL('image/jpeg', 0.95);
                const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

                if (jsPDFClass) {
                    const pdf = new jsPDFClass('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvasRender.height * pdfWidth) / canvasRender.width;
                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save('Convite_Casamento_Alleane_e_Rafael.pdf');
                } else {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = imgData;
                    downloadLink.download = 'Convite_Casamento_Alleane_e_Rafael.jpg';
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    setTimeout(() => document.body.removeChild(downloadLink), 300);
                }
            } else {
                pdfTemplate.style.cssText = originalStyle;
                window.print();
            }
        } catch (error) {
            console.error("PDF generation error:", error);
            pdfTemplate.style.cssText = originalStyle;
            window.print();
        } finally {
            if (targetBtn) targetBtn.disabled = false;
            if (btnSpan) btnSpan.innerText = origText;
        }
    };

    if (btnDownloadPdf) {
        ['click', 'touchend'].forEach(evt => {
            btnDownloadPdf.addEventListener(evt, window.downloadPDF, { passive: true });
        });
    }

});
