// Sayfa yüklendiğinde ortak HTML dosyalarını dahil et
document.addEventListener("DOMContentLoaded", () => {
    includeHTML();
    startTypeAnimation();
    setupMenuToggle();
    setupFormValidation();
    setupScrollToTopButton();
    setupScrollAnimations();
  });
  
  // Ortak header/footer gibi parçaları yükleyen fonksiyon
  async function includeHTML() {
    const elements = document.querySelectorAll("[data-include]");
    for (const el of elements) {
      const file = el.getAttribute("data-include");
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Dosya yüklenemedi: ${file}`);
        const html = await res.text();
        el.innerHTML = html;
      } catch (err) {
        el.innerHTML = "<p>Yükleme hatası</p>";
        console.error(err);
      }
    }
    setupThemeToggle();

  }
  
  // Yazı animasyonu
  const texts = ["bir backend geliştiriciyim..", "bir frontend geliştiriciyim...", "bir mobil geliştiriciyim..."];
  let textIndex = 0, charIndex = 0, isDeleting = false;
  const animatedText = () => document.getElementById("animated-text");
  
  function startTypeAnimation() {
    function type() {
      const element = animatedText();
      if (!element) return; // element yoksa dur
  
      const currentText = texts[textIndex];
      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      } else {
        element.textContent = currentText.substring(0, charIndex++);
        if (charIndex > currentText.length) {
          setTimeout(() => {
            isDeleting = true;
            type();
          }, 1000);
          return;
        }
      }
      setTimeout(type, isDeleting ? 25 : 50);
    }
    type();
  }
  
  // Menü açma/kapatma
  function setupMenuToggle() {
    document.body.addEventListener('click', (e) => {
      const menuIcon = document.getElementById('menu-icon');
      const navbar = document.querySelector('.navbar');
      if (!menuIcon || !navbar) return;
  
      if (e.target === menuIcon || menuIcon.contains(e.target)) {
        navbar.classList.toggle('active');
      } else if (!navbar.contains(e.target)) {
        navbar.classList.remove('active');
      }
    });
  }
  
  // Form doğrulama
  function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
  
    form.addEventListener('submit', function(event) {
      const name = document.getElementById('name');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');
  
      if (!name.value.trim()) {
        name.setCustomValidity('Lütfen adınızı giriniz.');
      } else {
        name.setCustomValidity('');
      }
  
      if (!phone.value.trim()) {
        phone.setCustomValidity('Lütfen telefon numaranızı giriniz.');
      } else {
        phone.setCustomValidity('');
      }
  
      if (!message.value.trim()) {
        message.setCustomValidity('Lütfen mesajınızı giriniz.');
      } else {
        message.setCustomValidity('');
      }
  
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
      }
    });
  }
  
  // Yukarı kaydır butonu
  function setupScrollToTopButton() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.textContent = '↑';
    scrollToTopBtn.className = 'btn scroll-to-top';
    Object.assign(scrollToTopBtn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      display: 'none',
      zIndex: 9999,
    });
    document.body.appendChild(scrollToTopBtn);
  
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
  
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Scroll ile animasyon (IntersectionObserver)
  function setupScrollAnimations() {
    const animatedSections = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
  
    animatedSections.forEach(section => observer.observe(section));
  }
  
  // Tema değiştirme (gece/gündüz modu)
  function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    if (!themeToggle) return;
  
    themeToggle.addEventListener('click', () => {
      const currentBgColor = getComputedStyle(root).getPropertyValue('--bg-color').trim();
      if (currentBgColor === '#222831') {
        // Gündüz modu
        root.style.setProperty('--bg-color', '#4DA8DA');
        root.style.setProperty('--second-bg-color', '#7FD9FF');
        root.style.setProperty('--text-color', '#F5F5F5');
        root.style.setProperty('--primary-color', '#EFC65B');
        themeToggle.innerHTML = "<i class='bx bx-moon'></i>";
      } else {
        // Gece modu
        root.style.setProperty('--bg-color', '#222831');
        root.style.setProperty('--second-bg-color', '#393E46');
        root.style.setProperty('--text-color', '#EEEEEE');
        root.style.setProperty('--primary-color', '#00ADB5');
        themeToggle.innerHTML = "<i class='bx bx-sun'></i>";
      }
    });
  }
  

  fetch("https://api.github.com/users/yesilkaya/repos")
  .then(res => {
    if (!res.ok) throw new Error("Veri alınamadı");
    return res.json();
  })
  .then(data => {
    const container = document.querySelector(".services-container-github");

    data.forEach(service => {
      const link = document.createElement("a");
      link.href = service.html_url;
       link.target = "_blank";
      link.classList.add("services-box");
      link.setAttribute("data-modal", service.modalId);

      const formattedName = service.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      link.innerHTML = `
        <div class="services-info">
          <h4>${formattedName}</h4>
          <p>${service.description}</p>
        </div>
      `;

      container.appendChild(link);
    });
  })
  .catch(err => {
    console.error("Hizmetler yüklenemedi:", err);
  });


  const customAlert = document.getElementById('customAlert');
  const closeAlertBtn = document.getElementById('closeAlert');

  closeAlertBtn.addEventListener('click', () => {
    customAlert.style.display = 'none';
  });

  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'İletişim Formu';
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !message) {
      // klasik alert yerine modal göster
      customAlert.style.display = 'flex';
      return;
    }

    const mailtoLink = `mailto:seninmailin@ornek.com?subject=${encodeURIComponent(subject)}&body=Ad:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0ATelefon:%20${encodeURIComponent(phone)}%0AMesaj:%20${encodeURIComponent(message)}`;

    window.open(mailtoLink, '_blank');
  });