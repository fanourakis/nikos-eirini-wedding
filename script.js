/**
 * Save The Date — Νίκος & Ειρήνη
 * Ημερομηνία: 15 Οκτωβρίου 2027
 */

document.addEventListener('DOMContentLoaded', () => {
  // Ημερομηνία Γάμου: 15 Οκτωβρίου 2027 (00:00 ώρα Ελλάδας, UTC+3)
  const WEDDING_DATE = new Date('2027-10-15T00:00:00+03:00').getTime();

  /* ==========================================================================
     0. 4-Way Origami Envelope Reveal (Αποκάλυψη ιστοσελίδας)
     ========================================================================== */
  const envelopeScreen = document.getElementById('envelopeScreen');
  const envelopeBox = document.getElementById('envelopeBox');
  const waxSealBtn = document.getElementById('waxSealBtn');

  let isEnvelopeOpening = false;

  function revealSiteFromEnvelope() {
    if (isEnvelopeOpening || !envelopeScreen) return;
    isEnvelopeOpening = true;

    // 1. Έναρξη 3D ξεδιπλώματος των 4 πτερυγίων & λάμψης σφραγίδας
    envelopeScreen.classList.add('is-opening');

    // 2. Μετά από 550ms: καθώς τα 4 flaps έχουν ανοίξει, η ιστοσελίδα εμφανίζεται άμεσα σε πλήρη εστίαση
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      document.body.classList.remove('envelope-active');
      document.body.classList.add('envelope-opened');
    }, 550);

    // 3. Μετά από 1050ms: πλήρης αφαίρεση του overlay και ενεργοποίηση της σελίδας
    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.height = '';

      // Ενεργοποίηση των στοιχείων του header
      const header = document.querySelector('.save-header');
      if (header) {
        header.classList.add('visible');
      }

      // Επανυπολογισμός scroll progress
      updateScrollProgress();
    }, 1050);
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      revealSiteFromEnvelope();
    });
  }

  if (envelopeBox) {
    envelopeBox.addEventListener('click', (e) => {
      e.stopPropagation();
      revealSiteFromEnvelope();
    });
    envelopeBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        revealSiteFromEnvelope();
      }
    });
  }

  // Ασφάλεια: αν ο χρήστης πατήσει οπουδήποτε στην οθόνη του φακέλου, ανοίγει
  if (envelopeScreen) {
    envelopeScreen.addEventListener('click', () => {
      revealSiteFromEnvelope();
    });
  }

  /* ==========================================================================
     1. Scroll Progress Bar
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ==========================================================================
     2. Αντίστροφη Μέτρηση (Live Countdown)
     ========================================================================== */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE - now;

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     3. Intersection Observer (Scroll-triggered cascading animations)
     ========================================================================== */
  const fadeElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));

  /* ==========================================================================
     4. Προσθήκη στο Ημερολόγιο (Direct Calendar Export)
     ========================================================================== */
  const addToGoogleCalBtn = document.getElementById('addToGoogleCal');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');

  const eventDetails = {
    title: "Γάμος Νίκου & Ειρήνης",
    description: "Save the Date! Ο Νίκος και η Ειρήνη παντρεύονται. Σημειώστε την ημερομηνία! Περισσότερες λεπτομέρειες και το επίσημο προσκλητήριο θα ακολουθήσουν.",
    location: "Ηράκλειο, Κρήτης, Ελλάδα",
    // Ολοήμερο γεγονός: 15 Οκτωβρίου 2027 (Google Cal: YYYYMMDD/YYYYMMDD)
    allDayStart: "20271015",
    allDayEnd: "20271016"
  };

  // Device & In-App Browser detection (Messenger, Instagram, etc.)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isInAppBrowser = /(FBAN|FBAV|FB_IAB|Messenger|Instagram|FBIOS|FBSS|Line|Twitter|Snapchat)/i.test(navigator.userAgent);

  // Αυτόματο άνοιγμα στον κανονικό browser (Chrome) όταν ο σύνδεσμος ανοίγει από το Messenger σε Android
  try {
    if (isAndroid && isInAppBrowser && window.location.protocol.startsWith('http') && !sessionStorage.getItem('inapp_breakout')) {
      sessionStorage.setItem('inapp_breakout', '1');
      const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.android.chrome;end`;
    }
  } catch (err) {
    // Graceful fallback
  }

  // Auto-prioritize the matching calendar button on mobile devices
  const calButtonsRow = document.querySelector('.calendar-buttons-row');
  if (calButtonsRow) {
    if (isIOS && downloadIcsBtn) {
      calButtonsRow.prepend(downloadIcsBtn);
      downloadIcsBtn.classList.add('btn-recommended');
    } else if (isAndroid && addToGoogleCalBtn) {
      calButtonsRow.prepend(addToGoogleCalBtn);
      addToGoogleCalBtn.classList.add('btn-recommended');
    }
  }

  function getGoogleCalUrl() {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.allDayStart}/${eventDetails.allDayEnd}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
  }

  // Google Calendar Button: Natural link opens Google Calendar app on Android / Web
  if (addToGoogleCalBtn) {
    addToGoogleCalBtn.addEventListener('click', (e) => {
      if (isAndroid) {
        const startMillis = 1823558400000;
        const endMillis = 1823644800000;
        const androidIntent = `intent://#Intent;action=android.intent.action.INSERT;type=vnd.android.cursor.item/event;title=${encodeURIComponent(eventDetails.title)};eventLocation=${encodeURIComponent(eventDetails.location)};description=${encodeURIComponent(eventDetails.description)};beginTime=${startMillis};endTime=${endMillis};allDay=true;end`;
        window.location.href = androidIntent;
        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = getGoogleCalUrl();
          }
        }, 500);
        e.preventDefault();
      }
    });
  }

  // Apple Calendar Button: Native iOS event opening (No file download popup)
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', (e) => {
      // Σε Android, ανακατεύθυνση στο Google Calendar χωρίς λήψη αρχείου
      if (isAndroid) {
        e.preventDefault();
        window.location.href = getGoogleCalUrl();
        return;
      }

      // Σε iPhone (iOS) ή υπολογιστή μέσω web server (HTTP/HTTPS):
      // Ο σύνδεσμος στο save-the-date.ics ανοίγει άμεσα την εφαρμογή Ημερολογίου
      if (window.location.protocol.startsWith('http')) {
        return;
      }

      // Fallback για τοπικό άνοιγμα (file://)
      e.preventDefault();
      const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Nikos and Eirini Wedding//Save The Date//EL',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:nikos-eirini-wedding-20271015@savethedate',
        `DTSTAMP:${now}`,
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description.replace(/\n/g, '\\n')}`,
        `LOCATION:${eventDetails.location.replace(/,/g, '\\,')}`,
        `DTSTART;VALUE=DATE:${eventDetails.allDayStart}`,
        `DTEND;VALUE=DATE:${eventDetails.allDayEnd}`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'X-MICROSOFT-CDO-ALLDAYEVENT:TRUE',
        'X-MICROSOFT-MSNCALENDAR-ALLDAYEVENT:TRUE',
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Υπενθύμιση: Γάμος Νίκου & Ειρήνης αύριο!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      if (isIOS) {
        window.location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsData);
      } else {
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'save-the-date.ics');
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(link.href);
        }, 300);
      }
    });
  }

  /* ==========================================================================
     5. Απαλά πέταλα & χρυσόσκονη με αεράκι κατά το scroll (Canvas Animation)
     ========================================================================== */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = Math.min(28, Math.floor(window.innerWidth / 35));

    // Φυσικό αεράκι που επηρεάζεται από την ταχύτητα του scroll
    let lastScrollY = window.scrollY;
    let scrollWind = 0;
    let scrollWindDecay = null;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Απαλό ρεύμα ανέμου ανάλογα με την ταχύτητα scroll
      scrollWind = Math.max(-5, Math.min(5, delta * 0.16));

      if (scrollWindDecay) cancelAnimationFrame(scrollWindDecay);
      function decay() {
        scrollWind *= 0.92;
        if (Math.abs(scrollWind) > 0.05) {
          scrollWindDecay = requestAnimationFrame(decay);
        } else {
          scrollWind = 0;
        }
      }
      scrollWindDecay = requestAnimationFrame(decay);
    }, { passive: true });

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -20;
        this.size = Math.random() * 8 + 5;
        this.speedY = Math.random() * 0.7 + 0.3;
        this.speedX = Math.random() * 0.8 - 0.4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.35 + 0.15;
        const colors = [
          'rgba(212, 175, 55, ',   // Χρυσό
          'rgba(224, 185, 175, ',  // Απαλό ρουζ
          'rgba(235, 215, 195, ',  // Σαμπανιζέ
        ];
        this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY + Math.abs(scrollWind) * 0.45;
        this.x += Math.sin(this.y * 0.01) * 0.4 + this.speedX + scrollWind * 0.85;
        this.rotation += this.rotationSpeed + scrollWind * 0.015;

        if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `${this.colorPrefix}${this.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Petal());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }

  /* ==========================================================================
     6. Διαδραστικό Κολάζ Φωτογραφιών (Click/Tap φέρνει τη φωτογραφία μπροστά)
     ========================================================================== */
  const collageCards = document.querySelectorAll('.collage-card');
  let otherCardTopZ = 12;
  collageCards.forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('card-3') || card.classList.contains('card-center')) {
        card.style.zIndex = '35';
      } else {
        otherCardTopZ = (otherCardTopZ >= 22) ? 12 : otherCardTopZ + 1;
        card.style.zIndex = otherCardTopZ.toString();
      }
      card.classList.add('active');
      setTimeout(() => {
        card.classList.remove('active');
      }, 1000);
    });
  });
});
