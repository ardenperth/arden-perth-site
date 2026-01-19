// Basic interactions: reveal outtakes, signup form handling (local fallback), back-to-top
document.addEventListener('DOMContentLoaded', () => {
  // Anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');

      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Optional: update URL without forcing reflow
      history.replaceState(null, '', id);
    });
  });
  // Reveal buttons
  // document.querySelectorAll('.reveal-btn').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     const content = btn.previousElementSibling;
  //     if (!content) return;

  //     const isOpen = content.classList.contains('is-open');

  //     if (isOpen) {
  //       content.style.maxHeight = content.scrollHeight + 'px';
  //       requestAnimationFrame(() => {
  //         content.style.maxHeight = '0px';
  //       });
  //       content.classList.remove('is-open');
  //       btn.textContent = 'Read more';
  //       btn.setAttribute('aria-expanded', 'false');
  //     } else {
  //       content.classList.add('is-open');
  //       content.style.maxHeight = content.scrollHeight + 'px';
  //       btn.textContent = 'Collapse';
  //       btn.setAttribute('aria-expanded', 'true');

  //       content.addEventListener(
  //         'transitionend',
  //         () => {
  //           if (content.classList.contains('is-open')) {
  //             content.style.maxHeight = 'none';
  //           }
  //         },
  //         { once: true }
  //       );
  //     }
  //   });
  // });

  // Back to top
  const topBtn = document.getElementById('backToTop');

  topBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      topBtn.classList.add('is-visible');
    } else {
      topBtn.classList.remove('is-visible');
    }
  });

  // Signup: local fallback + optional remote post
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('formMessage');

  // Attempt to send to configured endpoint if present (configure below)
  const remoteEndpoint = '' // <-- optionally set to your mail provider form action (e.g., Formspree endpoint)

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!email || !validateEmail(email)) {
      showMessage('Please enter a valid email.', true);
      return;
    }
    if (remoteEndpoint) {
      try {
        const res = await fetch(remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        if (res.ok) showMessage('Thanks — you are subscribed!', false);
        else showMessage('Remote signup failed. Saved locally as backup.', true);
      } catch (err) {
        console.error(err);
        showMessage('Network error. Saved locally as backup.', true);
      }
    } else {
      // fallback: save locally
      saveLocal({name, email, date: new Date().toISOString()});
      showMessage('Saved locally — configure a remote endpoint.', false);
    }
  });

  function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function showMessage(text, isError=false) {
    msg.textContent = text;
    msg.style.color = isError ? '#e64438' : 'var(--accent)';
    setTimeout(()=> { msg.textContent=''; }, 6000);
  }

});