(function(){
  'use strict';
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
  document.addEventListener('DOMContentLoaded', setActiveNav);
})();
