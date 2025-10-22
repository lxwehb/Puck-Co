(function(){
  'use strict';
  /* setActiveNav: highlight current nav link using aria-current */
  function setActiveNav(){
    var navLinks = document.querySelectorAll('.nav a');
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var hash = window.location.hash || '';
    navLinks.forEach(function(link){
      var href = link.getAttribute('href') || '';
      var parts = href.split('#');
      var hrefFile = parts[0] || 'index.html';
      var hrefHash = parts[1] ? ('#' + parts[1]) : '';
      if(hrefFile === path){
        if(hrefHash){
          if(hrefHash === hash) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
        } else {
          link.setAttribute('aria-current','page');
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  /* Privacy modal: fetch or fallback to iframe */
  function setupPrivacyModal() {
    var privacyLink = document.getElementById('privacy-link');
    var privacyModal = document.getElementById('privacyModal');
    var privacyContent = document.getElementById('privacyContent');
    var closePrivacyModal = document.getElementById('closePrivacyModal');
    if(!privacyLink || !privacyModal || !privacyContent || !closePrivacyModal) return;

    function openPrivacy() {
      privacyContent.innerHTML = '<p>Loading privacy policy…</p>';
      fetch('privacy.policy.html')
        .then(function(res){ if(!res.ok) throw new Error('fetch failed'); return res.text(); })
        .then(function(html){
          var temp = document.createElement('div'); temp.innerHTML = html;
          var main = temp.querySelector('main') || temp.querySelector('body') || temp;
          privacyContent.innerHTML = main ? main.innerHTML : 'Errore caricamento privacy.';
          privacyModal.style.display = 'block';
        }).catch(function(){
          privacyContent.innerHTML = '';
          var iframe = document.createElement('iframe');
          iframe.src = 'privacy.policy.html'; iframe.style.width = '100%'; iframe.style.height = '60vh'; iframe.style.border = 'none';
          privacyContent.appendChild(iframe);
          privacyModal.style.display = 'block';
        });
    }

    privacyLink.addEventListener('click', function(e){ e.preventDefault(); openPrivacy(); });
    privacyLink.addEventListener('keypress', function(e){ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPrivacy(); } });
    closePrivacyModal.addEventListener('click', function(){ privacyModal.style.display = 'none'; });
    window.addEventListener('click', function(e){ if(e.target === privacyModal) privacyModal.style.display = 'none'; });
  }

  /* Email modal and copy button setup (shared) */
  function setupEmailModal() {
    var openBtn = document.getElementById('openEmailModal');
    var emailModal = document.getElementById('emailModal');
    var closeModal = document.getElementById('closeModal');
    var copyBtn = document.getElementById('copyEmail');
    if(openBtn && emailModal && closeModal) {
      openBtn.addEventListener('click', function(){ emailModal.style.display = 'block'; });
      closeModal.addEventListener('click', function(){ emailModal.style.display = 'none'; });
      window.addEventListener('click', function(e){ if(e.target === emailModal) emailModal.style.display = 'none'; });
    }

    if(copyBtn) {
      copyBtn.addEventListener('click', function(){
        const hexEmail = '\x6d\x79\x40\x70\x75\x63\x6b\x61\x6e\x64\x63\x6f\x2e\x63\x6f\x6d';
        const email = hexEmail.replace(/\\x([0-9A-Fa-f]{2})/g, (match, p1) => String.fromCharCode(parseInt(p1, 16)));
        navigator.clipboard.writeText(email).catch(function(){});
        // visual feedback
        var orig = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(function(){ copyBtn.textContent = orig; }, 1300);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function(){ setActiveNav(); setupPrivacyModal(); setupEmailModal(); });
})();
