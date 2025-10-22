(function(){
  'use strict';
  // Page-specific books logic extracted from books.html
  const books = window.__BOOKS_DATA__ || (window.__BOOKS_DATA__ = [
    // If the page defines a global books array, use it; otherwise this will be set by server-side or page inline data.
  ]);

  // If the page provides a full books array inline, we will use it; otherwise these functions expect the data to be present.
  function renderBooks(container, bookList) {
    if(!container || !bookList) return;
    container.innerHTML = '';
    bookList.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';
      card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <h4>${book.title}</h4>
        <p class="book-description">${(book.description || '').substring(0,240)}</p>
        <button class="btn btn-secondary detail-btn" data-id="${book.id}">Detail</button>
      `;
      container.appendChild(card);
    });

    // Attach handlers
    container.querySelectorAll('.detail-btn').forEach(btn => {
      btn.addEventListener('click', function(){
        openBookDetail(this.dataset.id);
      });
    });
  }

  // Lightweight gallery state
  let currentImageIndex = 0;
  let currentGallery = [];

  function openBookDetail(bookId) {
    const book = (window.__BOOKS_DATA__ || books).find(b => b.id === bookId);
    if(!book) return;
    currentGallery = book.gallery || [book.cover];
    currentImageIndex = 0;
    updateMainImage();
    document.getElementById('modalTitle').textContent = book.title;
    document.getElementById('modalDescription').textContent = book.description;
    document.getElementById('modalDimensions').textContent = book.dimensions || '';
    document.getElementById('modalAmazonBtn').href = book.amazon || '#';
    createThumbnails(book);
    const showNavigation = currentGallery.length > 1;
    document.getElementById('prevImage').style.display = showNavigation ? 'flex' : 'none';
    document.getElementById('nextImage').style.display = showNavigation ? 'flex' : 'none';
    document.getElementById('imageCounter').style.display = showNavigation ? 'block' : 'none';
    document.getElementById('bookDetailModal').style.display = 'block';
  }

  function updateMainImage() {
    const mainImage = document.getElementById('modalMainImage');
    const counter = document.getElementById('imageCounter');
    if(!mainImage) return;
    mainImage.src = currentGallery[currentImageIndex];
    mainImage.alt = `Immagine ${currentImageIndex + 1}`;
    if(counter) counter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
      thumb.classList.toggle('active', index === currentImageIndex);
    });
  }

  function createThumbnails(book) {
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    if(!thumbnailsContainer) return;
    thumbnailsContainer.innerHTML = '';
    currentGallery.forEach((imageSrc, index) => {
      const thumbnail = document.createElement('img');
      thumbnail.src = imageSrc;
      thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumbnail.dataset.index = index;
      thumbnail.alt = `${book.title} - Image ${index + 1}`;
      thumbnail.addEventListener('click', () => { currentImageIndex = parseInt(thumbnail.dataset.index); updateMainImage(); });
      thumbnailsContainer.appendChild(thumbnail);
    });
  }

  function navigateGallery(direction) {
    if(direction === 'next') currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
    else currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
    updateMainImage();
  }

  function showFeaturedBook() {
    const rand = (window.__BOOKS_DATA__ || books);
    if(!rand || !rand.length) return;
    const randomBook = rand[Math.floor(Math.random() * rand.length)];
    const cover = document.querySelector('.featured-cover');
    const title = document.querySelector('.featured-title');
    const btn = document.querySelector('.featured-detail-btn');
    if(cover) cover.src = randomBook.cover;
    if(title) title.textContent = randomBook.title;
    if(btn && randomBook.id) btn.setAttribute('data-id', randomBook.id);
  }

  function closeSiblings(element, selector) {
    const siblings = element.parentElement.querySelectorAll(selector);
    siblings.forEach(sibling => {
      if (sibling !== element) {
        if (sibling.classList.contains('open')) sibling.classList.remove('open');
        const subSub = sibling.querySelector('.sub-subcategories'); if (subSub) subSub.classList.remove('open');
        const subSubSub = sibling.querySelector('.sub-sub-subcategories'); if (subSubSub) subSubSub.classList.remove('open');
        const subSubSubSub = sibling.querySelector('.sub-sub-sub-subcategories'); if (subSubSubSub) subSubSubSub.classList.remove('open');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    // If the page provides a books array in a global, fill internal store
    if(window.books && Array.isArray(window.books)) window.__BOOKS_DATA__ = window.books;
    showFeaturedBook();
    renderBooks(document.getElementById('main-books'), window.__BOOKS_DATA__);
    renderBooks(document.getElementById('slider-books'), (window.__BOOKS_DATA__ || []).slice(0,4));

    var featuredBtn = document.querySelector('.featured-detail-btn');
    if(featuredBtn) featuredBtn.addEventListener('click', function(){ const id = this.getAttribute('data-id'); if(id) openBookDetail(id); });

    document.querySelectorAll('.category-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const categoryItem = header.closest('.category-item');
        const isOpen = categoryItem.classList.contains('open');
        closeSiblings(categoryItem, '.category-item');
        categoryItem.classList.toggle('open', !isOpen);
      });
    });

    document.querySelectorAll('.subcategory-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const subcategoryItem = header.closest('li');
        const subSub = subcategoryItem.querySelector('.sub-subcategories');
        const isOpen = subSub && subSub.classList.contains('open');
        closeSiblings(subcategoryItem, 'li');
        if (subSub) { subSub.classList.toggle('open', !isOpen); header.querySelector('.submenu-toggle').style.transform = !isOpen ? 'rotate(90deg)' : 'rotate(0deg)'; }
      });
    });

    document.querySelectorAll('.sub-sub-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const subSubItem = header.closest('li');
        const subSubSub = subSubItem.querySelector('.sub-sub-subcategories');
        const isOpen = subSubSub && subSubSub.classList.contains('open');
        closeSiblings(subSubItem, 'li');
        if (subSubSub) { subSubSub.classList.toggle('open', !isOpen); header.querySelector('.submenu-toggle').style.transform = !isOpen ? 'rotate(90deg)' : 'rotate(0deg)'; }
      });
    });

    document.querySelectorAll('.sub-sub-subcategories .sub-sub-header').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const subSubSubItem = header.closest('li');
        const subSubSubSub = subSubSubItem.querySelector('.sub-sub-sub-subcategories');
        const wasOpen = subSubSubSub && subSubSubSub.classList.contains('open');
        closeSiblings(subSubSubItem, 'li');
        if (subSubSubSub) { subSubSubSub.classList.toggle('open', !wasOpen); header.querySelector('.submenu-toggle').style.transform = !wasOpen ? 'rotate(90deg)' : 'rotate(0deg)'; }
      });
    });

    document.querySelectorAll('.subcategory-link, .sub-sub-link, .sub-sub-sub-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('[class*="link"]').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // gallery nav
    var prev = document.getElementById('prevImage');
    var next = document.getElementById('nextImage');
    if(prev) prev.addEventListener('click', function(){ navigateGallery('prev'); });
    if(next) next.addEventListener('click', function(){ navigateGallery('next'); });

    document.addEventListener('keydown', function(e){
      var modal = document.getElementById('bookDetailModal');
      if(modal && modal.style.display === 'block'){
        if(e.key === 'ArrowLeft'){ e.preventDefault(); navigateGallery('prev'); }
        else if(e.key === 'ArrowRight'){ e.preventDefault(); navigateGallery('next'); }
        else if(e.key === 'Escape'){ e.preventDefault(); modal.style.display = 'none'; }
      }
    });

    var closeBookBtn = document.getElementById('closeBookModal');
    if(closeBookBtn) closeBookBtn.addEventListener('click', function(){ document.getElementById('bookDetailModal').style.display = 'none'; });
    window.addEventListener('click', function(e){ if(e.target === document.getElementById('bookDetailModal')) document.getElementById('bookDetailModal').style.display = 'none'; });

    // privacy modal handlers moved to assets/js/site.js (setupPrivacyModal)
  });
})();
