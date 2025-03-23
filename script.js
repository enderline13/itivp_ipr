document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
  
    let allImages = [];
    let currentIndex = 0;
    const imagesToDisplay = 35;
    let searchQuery = '';

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      searchQuery = document.getElementById('search-input').value.trim().toLowerCase();
      gallery.innerHTML = '';
      currentIndex = 0;
      await loadImages(true); 
    });
    
    async function loadImages(reset = false) {
      try {
        showLoading();
        const response = await fetch('images.json');
        const data = await response.json();
        
        allImages = data.filter(img => 
          img.description?.toLowerCase().includes(searchQuery) || 
          img.tags?.some(tag => tag.includes(searchQuery))
        );
        
        if (reset) {
          gallery.innerHTML = '';
          currentIndex = 0;
        }
        
        displayNextImages();
        hideLoading();
      } catch (error) {
        console.error('Ошибка:', error);
        hideLoading();
      }
    }
  
    function displayNextImages() {
      const imagesToAppend = [];
  
      for (let i = 0; i < imagesToDisplay; i++) {
        const image = allImages[currentIndex % allImages.length];
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-container');
  
        const img = document.createElement('img');
        img.dataset.src = image.url; 
        img.alt = image.description || 'Изображение';
        img.style.opacity = '0'; 
  
        imgContainer.appendChild(img);
        imagesToAppend.push(img);
        gallery.appendChild(imgContainer);
  
        currentIndex++;
      }
  
      lazyLoadImages(imagesToAppend);
    }
  
    function lazyLoadImages(images) {
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => {
              img.style.opacity = '1'; 
            };
            img.onerror = () => {
              img.style.display = 'none'; 
            };
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '0px 0px 200px 0px' }); 
  
      images.forEach(img => observer.observe(img));
    }
  
    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300) {
        displayNextImages();
      }
    });
  
    function showLoading() {
      loading.style.display = 'block';
    }
  
    function hideLoading() {
      loading.style.display = 'none';
    }
  
    loadImages();
  });
