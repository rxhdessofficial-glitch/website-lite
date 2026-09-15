/* ==========================================================================
   NextLink - Interactive JavaScript Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // 2. Copy to Clipboard Functionality
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Tersalin: "${textToCopy}"`);
        
        // Visual button feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = `✓ Tersalin!`;
        btn.style.background = '#10b981';
        btn.style.color = '#ffffff';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(textToCopy);
      }
    });
  });

  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showToast(`Tersalin: "${text}"`);
    } catch (err) {
      showToast('Gagal menyalin teks.');
    }
    document.body.removeChild(textArea);
  }

  // 3. Toast Notification Helper
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 4. Image Lightbox Preview
  const imageWrappers = document.querySelectorAll('.step-image-wrapper');
  
  if (imageWrappers.length > 0) {
    // Create Modal HTML Structure
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'imageModal';
    modalOverlay.innerHTML = `
      <div class="modal-container">
        <button class="modal-close" id="modalClose">&times;</button>
        <img class="modal-img" id="modalImg" src="" alt="Router Screenshot Preview" />
      </div>
    `;
    document.body.appendChild(modalOverlay);

    const modalImg = document.getElementById('modalImg');
    const modalClose = document.getElementById('modalClose');

    imageWrappers.forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const img = wrapper.querySelector('img');
        if (img) {
          modalImg.src = img.src;
          modalOverlay.classList.add('active');
        }
      });
    });

    const closeModal = () => modalOverlay.classList.remove('active');

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }
});
