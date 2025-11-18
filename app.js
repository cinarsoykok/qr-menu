async function loadMenu() {
  try {
    const res = await fetch("menu-data.json");
    if (!res.ok) throw new Error("Menü yüklenemedi");
    const data = await res.json();

    const restaurantNameEl = document.getElementById("restaurant-name");
    const categoryTabsEl = document.getElementById("category-tabs");
    const menuContainerEl = document.getElementById("menu-container");

    restaurantNameEl.textContent = data.restaurantName || "Menü";

    const categories = data.categories || [];
    const currency = data.currency || "₺";

    // Kategori butonları
    categoryTabsEl.innerHTML = "";
    categories.forEach((cat, index) => {
      const btn = document.createElement("button");
      btn.className = "category-tab" + (index === 0 ? " active" : "");
      btn.textContent = cat.name;
      btn.dataset.categoryId = cat.id;
      btn.addEventListener("click", () => {
        document
          .querySelectorAll(".category-tab")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderMenu(categories, menuContainerEl, currency, cat.id);
      });
      categoryTabsEl.appendChild(btn);
    });

    // Varsayılan olarak ilk kategoriyi göster
    if (categories.length > 0) {
      renderMenu(categories, menuContainerEl, currency, categories[0].id);
    }
  } catch (err) {
    console.error(err);
    const menuContainerEl = document.getElementById("menu-container");
    menuContainerEl.innerHTML =
      "<p>Menü yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>";
  }
}

function renderMenu(categories, container, currency, activeCategoryId) {
  container.innerHTML = "";

  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const catsToRender = activeCategory ? [activeCategory] : categories;

  catsToRender.forEach((category) => {
    const catDiv = document.createElement("section");
    catDiv.className = "menu-category";

    const title = document.createElement("h2");
    title.textContent = category.name;
    catDiv.appendChild(title);

    (category.items || []).forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "menu-item";

      const infoDiv = document.createElement("div");
      infoDiv.className = "menu-item-info";

      const nameEl = document.createElement("div");
      nameEl.className = "menu-item-name";
      nameEl.textContent = item.name;

      const descEl = document.createElement("div");
      descEl.className = "menu-item-desc";
      descEl.textContent = item.description || "";

      infoDiv.appendChild(nameEl);
      if (item.description) infoDiv.appendChild(descEl);

      const priceEl = document.createElement("div");
      priceEl.className = "menu-item-price";
      priceEl.textContent = `${item.price} ${currency}`;

      itemDiv.appendChild(infoDiv);
      itemDiv.appendChild(priceEl);

      catDiv.appendChild(itemDiv);
    });

    container.appendChild(catDiv);
  });
}

loadMenu();
