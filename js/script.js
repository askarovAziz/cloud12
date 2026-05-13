const whatsappNumber = "971526542905"
const telegramNumber = whatsappNumber

const telegramLinks = document.querySelectorAll("a.floating-telegram")
telegramLinks.forEach((link) => {
  link.setAttribute("href", `https://t.me/+${telegramNumber}`)
})

const floatingContacts = document.querySelectorAll(".floating-contact")
floatingContacts.forEach((contactWidget) => {
  const toggleButton = contactWidget.querySelector(".floating-toggle")
  if (!toggleButton) return

  toggleButton.addEventListener("click", () => {
    const isOpen = contactWidget.classList.toggle("open")
    toggleButton.setAttribute("aria-expanded", String(isOpen))
    const menu = contactWidget.querySelector(".floating-contact-menu")
    if (menu) {
      menu.setAttribute("aria-hidden", String(!isOpen))
    }
  })
})

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const navMenu = document.getElementById("navMenu")

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active")
  })
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll(".nav-menu a")
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
  })
})

// Therapists Slider (home page only)

const sliderWrapper = document.getElementById("therapistSlider")
const sliderPrevButton = document.getElementById("therapistPrev")
const sliderNextButton = document.getElementById("therapistNext")

if (sliderWrapper && sliderPrevButton && sliderNextButton) {
  let currentSlide = 0
  let slidesToShow = 1
  let totalSlides = 1
  let slideWidth = 0
  let slideGap = 0
  const sliderCards = sliderWrapper.querySelectorAll(".therapist-card")

  const getSlidesToShow = () => (window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 2)

  function goToSlide(index) {
    currentSlide = index
    updateSlider()
  }

  function updateSlider() {
    const hasMultipleSlides = totalSlides > 1
    sliderPrevButton.disabled = !hasMultipleSlides
    sliderNextButton.disabled = !hasMultipleSlides
    sliderWrapper.style.transform = `translateX(-${(slideWidth + slideGap) * currentSlide}px)`
  }

  const setSliderMetrics = () => {
    slidesToShow = getSlidesToShow()
    totalSlides = Math.ceil(sliderCards.length / slidesToShow)
    slideGap = parseFloat(getComputedStyle(sliderWrapper).gap) || 0
    const containerWidth = sliderWrapper.parentElement.clientWidth
    slideWidth = (containerWidth - slideGap * (slidesToShow - 1)) / slidesToShow

    sliderCards.forEach((card) => {
      card.style.flex = `0 0 ${slideWidth}px`
    })

    if (currentSlide >= totalSlides) {
      currentSlide = 0
    }
    updateSlider()
  }

  setSliderMetrics()
  window.addEventListener("resize", setSliderMetrics)

  sliderPrevButton.addEventListener("click", () => {
    if (totalSlides <= 1) {
      return
    }
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
    updateSlider()
  })

  sliderNextButton.addEventListener("click", () => {
    if (totalSlides <= 1) {
      return
    }
    currentSlide = (currentSlide + 1) % totalSlides
    updateSlider()
  })

  // Auto slide
  setInterval(() => {
    if (totalSlides <= 1) {
      return
    }
    currentSlide = (currentSlide + 1) % totalSlides
    updateSlider()
  }, 4000)
}

// Gallery Filter
const filterButtons = document.querySelectorAll(".filter-btn")
const galleryItems = document.querySelectorAll(".gallery-item")

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter items
      galleryItems.forEach((item) => {
        if (filter === "all" || item.dataset.category === filter) {
          item.style.display = "block"
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 10)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"
          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })
}

// Contact Form
const contactForm = document.getElementById("contactForm")

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData)
    const serviceSelect = contactForm.querySelector("#service")
    const selectedService = serviceSelect?.value
      ? serviceSelect.options[serviceSelect.selectedIndex].text
      : "Not specified"
    const messageLines = [
      `Name: ${data.name || "Not provided"}`,
      `Phone: ${data.phone || "Not provided"}`,
      `Service: ${selectedService}`,
      `Message: ${data.message || "Not provided"}`,
    ]
    const messageText = messageLines.join("\n")
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`

    window.open(whatsappUrl, "_blank", "noopener")
    contactForm.reset()
  })
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Count Up Animation
const statCounters = document.querySelectorAll(".stat-counter")

if (statCounters.length > 0) {
  const animateCounter = (element) => {
    const target = Number.parseFloat(element.dataset.count || "0")
    const suffix = element.dataset.suffix || ""
    const duration = 1600
    const startTime = performance.now()

    const update = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const value = Math.round(target * progress)
      element.textContent = value.toLocaleString() + suffix

      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }

    requestAnimationFrame(update)
  }

  const counterObserver = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          observerInstance.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 }
  )

  statCounters.forEach((counter) => {
    counter.textContent = "0"
    counterObserver.observe(counter)
  })
}

// Scroll Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in")
    }
  })
}, observerOptions)

// Observe elements
document.querySelectorAll(".massage-card, .service-card, .gallery-item, .value-card").forEach((el) => {
  observer.observe(el)
})

// Navbar scroll effect
let lastScroll = 0
const nav = document.querySelector(".nav")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    nav.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    nav.style.boxShadow = "none"
  }

  lastScroll = currentScroll
})


// Gallery hero video controls
const galleryHeroVideo = document.getElementById("galleryHeroVideo")
const galleryHeroPlayPause = document.getElementById("galleryHeroPlayPause")
const galleryHeroMute = document.getElementById("galleryHeroMute")

if (galleryHeroVideo && galleryHeroPlayPause && galleryHeroMute) {
  galleryHeroVideo.muted = true

  const syncVideoButtons = () => {
    galleryHeroPlayPause.textContent = galleryHeroVideo.paused ? "Play" : "Stop"
    galleryHeroPlayPause.setAttribute("aria-pressed", String(galleryHeroVideo.paused))
    galleryHeroMute.textContent = galleryHeroVideo.muted ? "Unmute" : "Mute"
    galleryHeroMute.setAttribute("aria-pressed", String(galleryHeroVideo.muted))
  }

  galleryHeroPlayPause.addEventListener("click", () => {
    if (galleryHeroVideo.paused) {
      galleryHeroVideo.play()
    } else {
      galleryHeroVideo.pause()
    }
    syncVideoButtons()
  })

  galleryHeroMute.addEventListener("click", () => {
    galleryHeroVideo.muted = !galleryHeroVideo.muted
    syncVideoButtons()
  })

  galleryHeroVideo.addEventListener("play", syncVideoButtons)
  galleryHeroVideo.addEventListener("pause", syncVideoButtons)
  syncVideoButtons()

  galleryHeroVideo
    .play()
    .then(syncVideoButtons)
    .catch(() => {
      syncVideoButtons()
    })
}
