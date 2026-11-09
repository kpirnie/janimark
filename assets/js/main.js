/**
 * Janimark, LLC
 * Main JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Mobile Navigation
   */
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation" : "Close navigation",
      );

      navigation.classList.toggle("is-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("is-open") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  /**
   * Testimonial Carousel
   */
  const carousel = document.querySelector(".testimonial-carousel");
  const carouselDots = document.querySelector(".carousel-dots");

  if (carousel && carouselDots) {
    const track = carousel.querySelector(".testimonial-track");
    const slides = Array.from(carousel.querySelectorAll(".testimonial-slide"));

    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");

    let currentIndex = 0;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;

        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      carouselDots.querySelectorAll(".carousel-dot").forEach((dot, index) => {
        const isActive = index === currentIndex;

        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", String(isActive));
      });
    };

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      updateCarousel();
    };

    if (slides.length > 1) {
      previousButton.disabled = false;
      nextButton.disabled = false;

      slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);

        dot.addEventListener("click", () => {
          goToSlide(index);
        });

        carouselDots.appendChild(dot);
      });

      previousButton.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
      });

      nextButton.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
      });

      carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          goToSlide(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
          goToSlide(currentIndex + 1);
        }
      });
    }

    updateCarousel();
  }

  /**
   * Contact Form
   *
   * Submissions are posted to the server-side handler.
   * A success message is only displayed when the server confirms delivery.
   */
  const quoteForm = document.getElementById("quote-form");
  const formStatus = document.getElementById("form-status");
  const formToken = document.getElementById("form-token");

  if (quoteForm && formStatus && formToken) {
    const submitButton = quoteForm.querySelector('button[type="submit"]');

    const showStatus = (isSuccess, message) => {
      formStatus.classList.toggle("is-success", isSuccess);
      formStatus.classList.toggle("is-error", !isSuccess);
      formStatus.textContent = message;
    };

    const postToHandler = async (body) => {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body,
      });

      return response.json();
    };

    const loadToken = async () => {
      try {
        const result = await postToHandler(
          new URLSearchParams({ action: "token" }),
        );

        formToken.value = result.token || "";
      } catch (error) {
        formToken.value = "";
      }
    };

    loadToken();

    quoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      submitButton.disabled = true;

      submitButton.classList.add("is-sending");

      formStatus.classList.remove("is-success", "is-error");
      formStatus.textContent = "Sending your request...";

      try {
        const result = await postToHandler(new FormData(quoteForm));

        showStatus(result.success === true, result.message);

        if (result.success === true) {
          quoteForm.reset();
        }
      } catch (error) {
        showStatus(
          false,
          "We could not send your request. Please contact us by phone or email.",
        );
      }

      submitButton.classList.remove("is-sending");
      submitButton.disabled = false;

      loadToken();
    });
  }

  /**
   * Back to Top
   */
  const backToTop = document.querySelector(".back-to-top");

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 150);
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    toggleBackToTop();
  }

  /**
   * Copyright Year
   */
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
});
