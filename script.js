/**
 * SAVE THE DATE - CONVITE INTERATIVO PREMIUM
 * Logic & Scene Sequencer Engine
 */

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
            this.alpha = Math.random() * 0.7 + 0.3;
            this.speedY = -(Math.random() * 0.5 + 0.2);
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.hue = Math.random() < 0.8 ? 45 : 30; // Golden & warm amber
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
            ctx.fillStyle = `hsla(${this.hue}, 85%, 65%, ${Math.max(0, this.alpha)})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
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
       3. AUDIO ENGINE (SILENT BY DEFAULT / CLEAN TOGGLE)
       -------------------------------------------------------------------------- */
    function playSoundEffect(type) {
        // Audio effects disabled for clean, non-intrusive experience
    }

    function toggleBackgroundMusic() {
        if (isAudioPlaying) {
            isAudioPlaying = false;
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
        } else {
            isAudioPlaying = true;
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
        }
    }

    audioBtn.addEventListener('click', toggleBackgroundMusic);

    /* --------------------------------------------------------------------------
       4. SCENE SEQUENCER (CENAS 1 A 6)
       -------------------------------------------------------------------------- */

    // Scene 1: Initial camera zoom down onto dark table (Auto on load)
    body.className = 'state-scene1';

    // Click Seal Trigger -> Step-By-Step Sequence
    waxSeal.addEventListener('click', () => {
        if (currentScene > 1) return; // Prevent double trigger
        currentScene = 2;

        // 1. Wax Shatter & Ribbon Drop
        body.className = 'state-scene2';
        waxSeal.classList.add('depressed');
        playSoundEffect('wax-crack');

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
            playSoundEffect('paper-slide');

            // Letter slides UP to top of screen first
            letterSlide.classList.add('center-display');
            letter.classList.remove('folded');
            letter.classList.add('unfolded');

            // 3. STEP B: Slower Handwriting Signature Begins ONLY AFTER sheet lands at top (1400ms)
            setTimeout(() => {
                currentScene = 4;
                body.className = 'state-scene4';

                // Start Slow Feather Handwriting
                goldenFeather.classList.remove('hidden');
                signatureText.classList.add('writing');

                // 4. STEP C: Menus Reveal ONLY AFTER Signature Completes (at 5000ms)
                setTimeout(() => {
                    playSoundEffect('feather-flourish');
                    goldenFeather.classList.add('stroke-end');

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
                        actionToolbar.classList.remove('hidden-toolbar');
                    }, 1500);

                }, 3600); // 3.6s writing duration for elegant signature

            }, 1500); // Ensures sheet is 100% still and fixed at top of page before writing starts!

        }, 250);

    });

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
       6. ADD TO CALENDAR (.ICS GENERATION - MOBILE FRIENDLY)
       -------------------------------------------------------------------------- */
    const handleCalendarDownload = () => {
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
            "DESCRIPTION:Celebração do Casamento de Alleane e Rafael na Igreja N.S. de Fátima.",
            "LOCATION:Igreja N.S. de Fátima",
            "STATUS:CONFIRMED",
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'Casamento_Alleane_e_Rafael.ics');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 200);
    };

    if (btnAddCalendar) {
        let calendarTriggered = false;
        ['click', 'touchend'].forEach(evt => {
            btnAddCalendar.addEventListener(evt, (e) => {
                e.preventDefault();
                if (calendarTriggered) return;
                calendarTriggered = true;
                handleCalendarDownload();
                setTimeout(() => { calendarTriggered = false; }, 1000);
            }, { passive: false });
        });
    }

    /* --------------------------------------------------------------------------
       7. BULLETPROOF PDF GENERATION (JSPDF + HTML2CANVAS + FALLBACK)
       -------------------------------------------------------------------------- */
    
    // Generate QR Code dynamically for PDF
    const pdfQrContainer = document.getElementById('pdf-qrcode');
    if (typeof QRCode !== 'undefined' && pdfQrContainer) {
        pdfQrContainer.innerHTML = "";
        new QRCode(pdfQrContainer, {
            text: window.location.href || "https://alleaneerafael.com.br",
            width: 90,
            height: 90,
            colorDark : "#0a3326",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    const handlePdfDownload = async () => {
        const pdfTemplate = document.getElementById('pdf-printable-template');
        if (!pdfTemplate) return;
        
        btnDownloadPdf.disabled = true;
        const btnSpan = btnDownloadPdf.querySelector('span');
        const origText = btnSpan ? btnSpan.innerText : "Salvar Convite em PDF";
        if (btnSpan) btnSpan.innerText = "Gerando PDF...";

        // Temporarily bring template into viewable DOM position for html2canvas
        const originalStyle = pdfTemplate.getAttribute('style') || '';
        pdfTemplate.style.cssText = 'position: fixed; top: 0; left: 0; width: 700px; z-index: 999999; opacity: 1; visibility: visible; background: #f9f5eb; pointer-events: none;';

        try {
            if (typeof html2canvas === 'undefined') {
                throw new Error("html2canvas not loaded");
            }

            const canvasRender = await html2canvas(pdfTemplate, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#f9f5eb',
                logging: false
            });

            // Restore template original hidden style
            pdfTemplate.style.cssText = originalStyle;

            const imgData = canvasRender.toDataURL('image/jpeg', 0.95);
            
            // Get jsPDF constructor flexibly
            let jsPDFClass = null;
            if (window.jspdf && window.jspdf.jsPDF) {
                jsPDFClass = window.jspdf.jsPDF;
            } else if (window.jsPDF) {
                jsPDFClass = window.jsPDF;
            }

            if (jsPDFClass) {
                const pdf = new jsPDFClass('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvasRender.height * pdfWidth) / canvasRender.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Convite_Casamento_Alleane_e_Rafael.pdf');
            } else {
                // Fallback: Download image as JPG directly if jsPDF library is blocked
                const downloadLink = document.createElement('a');
                downloadLink.href = imgData;
                downloadLink.download = 'Convite_Casamento_Alleane_e_Rafael.jpg';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                setTimeout(() => document.body.removeChild(downloadLink), 200);
            }

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            pdfTemplate.style.cssText = originalStyle;

            // Secondary Fallback: Direct Print Window
            window.print();
        } finally {
            btnDownloadPdf.disabled = false;
            if (btnSpan) btnSpan.innerText = origText;
        }
    };

    if (btnDownloadPdf) {
        let pdfTriggered = false;
        ['click', 'touchend'].forEach(evt => {
            btnDownloadPdf.addEventListener(evt, (e) => {
                e.preventDefault();
                if (pdfTriggered) return;
                pdfTriggered = true;
                handlePdfDownload();
                setTimeout(() => { pdfTriggered = false; }, 2000);
            }, { passive: false });
        });
    }

});
