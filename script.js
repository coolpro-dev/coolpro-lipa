// Progress Bar
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = document.getElementById('progress');
  if (progress) {
    progress.style.width = (window.scrollY / h * 100) + '%';
  }
});

function toggleMenu() {
  const menu = document.getElementById('mobile-menu') || document.querySelector('.mobile-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[data-inpage-scroll]');
  if (!link) return;
  const id = link.getAttribute('data-inpage-scroll');
  if (!id) return;
  const target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  document.querySelectorAll('.mobile-menu ul li a').forEach((link) => {
    link.addEventListener('click', () => {
      const menu = document.querySelector('.mobile-menu');
      if (menu) menu.classList.remove('open');
    });
  });

  if (!document.getElementById('toast')) {
    const toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});

function showToast(text) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.setAttribute('readonly', '');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      resolve();
    } catch (error) {
      document.body.removeChild(tempInput);
      reject(error);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-copy-target');
      const target = targetId && document.getElementById(targetId);
      if (!target) return;
      copyTextToClipboard(target.innerText.trim())
        .then(() => showToast('Inquiry format copied. Paste it into Messenger or WhatsApp.'))
        .catch(() => showToast('Could not copy automatically. Copy the message manually.'));
    });
  });
});
