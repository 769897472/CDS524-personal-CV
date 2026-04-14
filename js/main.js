document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const revealTargets = document.querySelectorAll('.reveal, .stagger, .stagger-children');
  const spotlightTargets = document.querySelectorAll('.spotlight-card, [data-tilt-stage]');
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  const setActiveLink = (targetId) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const matchesHash = href === `#${targetId}`;
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const matchesPage = !href.startsWith('#') && href === currentPage;
      link.classList.toggle('active', matchesHash || matchesPage);
    });
  };

  if (navbar) {
    const syncNavbar = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > 18);
    };

    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });
  }

  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActiveLink(visible.target.id);
      }
    }, { threshold: [0.35, 0.6], rootMargin: '-15% 0px -45% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    setActiveLink('');
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  revealTargets.forEach((target) => revealObserver.observe(target));

  spotlightTargets.forEach((target) => {
    const updatePointer = (event) => {
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      target.style.setProperty('--pointer-x', `${x}px`);
      target.style.setProperty('--pointer-y', `${y}px`);
    };

    target.addEventListener('mousemove', updatePointer);
    target.addEventListener('mouseleave', () => {
      target.style.setProperty('--pointer-x', '50%');
      target.style.setProperty('--pointer-y', '40%');
      if (target.hasAttribute('data-tilt-stage')) {
        target.style.transform = '';
      }
    });

    if (target.hasAttribute('data-tilt-stage')) {
      target.addEventListener('mousemove', (event) => {
        const rect = target.getBoundingClientRect();
        const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
        const yRatio = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateY = xRatio * 8;
        const rotateX = yRatio * -8;
        target.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    }
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (!submitButton) return;

      const originalText = submitButton.textContent;
      submitButton.textContent = '发送中...';
      submitButton.disabled = true;

      window.setTimeout(() => {
        submitButton.textContent = '已发送';
        submitButton.style.background = '#333d47';
        submitButton.style.color = '#ffffff';
        contactForm.reset();

        window.setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
          submitButton.style.background = '';
          submitButton.style.color = '';
        }, 2200);
      }, 1000);
    });
  }

});
