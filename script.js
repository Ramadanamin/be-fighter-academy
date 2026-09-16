const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));
}

document.querySelectorAll('.faq-q').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const sign = button.querySelector('span');
    const isOpen = answer.classList.toggle('open');
    if (sign) sign.textContent = isOpen ? '−' : '+';
  });
});

const leadForm = document.getElementById('leadForm');

if (leadForm) {
  leadForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(leadForm);
    const message = [
      'السلام عليكم، مهتم بتدريب Be Fighter Academy.',
      `الاسم: ${data.get('name') || ''}`,
      `الموبايل: ${data.get('phone') || ''}`,
      `المتدرّب: ${data.get('trainee') || ''}`,
      `نوع التدريب: ${data.get('program') || ''}`,
      `المنطقة: ${data.get('area') || ''}`,
      `الهدف: ${data.get('goal') || ''}`
    ].join('\n');

    const url = `https://wa.me/201001110897?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}
