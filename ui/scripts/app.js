(async function initialize() {
  const navItems = document.querySelectorAll(".nav-item");
  const views = document.querySelectorAll(".view");

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((el) => el.classList.remove("active"));
      views.forEach((el) => el.classList.remove("active"));

      item.classList.add("active");
      document.getElementById(`view-${item.dataset.view}`).classList.add("active");
    });
  });

  await EffectsEditor.load();
  await Gallery.load();
  await MonitorSelector.load();
  await SettingsPage.load();
})();
