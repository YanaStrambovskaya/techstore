import "./style.css";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";

document.addEventListener("DOMContentLoaded", function () {
  toggleMobileMenu(".header__inner", "[data-toggle]");
  closeMenuOutside();
  initSwiper();
});
function initSwiper() {
  const swiperContainer = document.querySelector(".swiper");
  if (!swiperContainer) {
    console.warn("Swiper container is missing");
    return;
  }
  const swiper = new Swiper(swiperContainer, {
    modules: [Pagination, Navigation],
    slidesPerView: 1.2, // 👈 key part (shows next slide partially)
    spaceBetween: 16,
    loop: true,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
    },
  });
}

function closeMenuOutside() {
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (!target) return;

    const openMenus = document.querySelectorAll(".main-menu__submenu.open");
    if (openMenus.length === 0) return;

    const isClickInsideMenu = target.closest(".main-menu");
    if (!isClickInsideMenu) {
      openMenus.forEach((menu) => {
        menu.classList.remove("open");
        const toggleId = menu.getAttribute("id");
        if (toggleId) {
          const toggle = document.querySelector(
            `[aria-controls="${toggleId}"]`
          );
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
          }
        }
      });
    }
  });
}
function toggleMobileMenu(clickHandlerSelector, toggleSelector) {
  const container = document.querySelector(clickHandlerSelector);
  if (!container) {
    console.warn("Mobile menu container is missing");
    return;
  }
  container.addEventListener("click", function (e) {
    const target = e.target;
    if (!target) return;

    const toggle = target.closest(toggleSelector);
    if (!toggle) return;

    const menuId = toggle.getAttribute("aria-controls") || null;
    if (!menuId) return;

    const menu = document.getElementById(menuId);
    if (!menu) return;

    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    const type = toggle.dataset.toggle;

    toggleCurrentMenu(menu, toggle, isOpen);

    if (type === "menu" && !isOpen === false) {
      closeAllSubmenus(container);
    }

    if (type === "submenu" && !isOpen) {
      closeOtherSubmenus(container, menuId);
    }
  });
}

function toggleCurrentMenu(menu, toggle, isOpen) {
  const nextState = !isOpen;
  menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(nextState));
}

function closeOtherSubmenus(container, currentMenuId) {
  const submenus = container.querySelectorAll(".main-menu__submenu.open");
  const submenuToggles = container.querySelectorAll("[data-toggle='submenu']");
  if (submenus.length) {
    submenus.forEach((menu) => {
      if (menu.id !== currentMenuId) {
        menu.classList.remove("open");
      }
    });
  }
  if (submenuToggles.length) {
    submenuToggles.forEach((toggle) => {
      if (toggle.getAttribute("aria-controls") !== currentMenuId)
        toggle.setAttribute("aria-expanded", "false");
    });
  }
}

function closeAllSubmenus(container) {
  const submenus = container.querySelectorAll(".main-menu__submenu.open");
  const submenuToggles = container.querySelectorAll("[data-toggle='submenu']");
  if (submenus.length) {
    submenus.forEach((menu) => {
      menu.classList.remove("open");
    });
  }
  if (submenuToggles.length) {
    submenuToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });
  }
}
