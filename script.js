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

  // Form
  const form = document.getElementById('signupForm');
  const msg = document.getElementById('formMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.reset();
      msg.textContent = 'Thanks — you are subscribed!';
    } else {
      msg.textContent = 'Something went wrong. Please try again.';
    }
  });

});