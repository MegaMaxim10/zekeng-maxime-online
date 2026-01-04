(function () {
  const root = document.documentElement;

  // Theme
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;

  root.dataset.theme = saved || (prefersDark ? "dark" : "light");

  toggle?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  });

  // Mobile nav
  document.querySelector(".nav-toggle")?.addEventListener("click", () => {
    document.querySelector(".site-nav")?.classList.toggle("open");
  });
})();
