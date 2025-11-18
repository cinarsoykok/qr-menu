let menuData = null;
let currentCategoryId = null;

/* Her kategori için görsel ve tema rengi tanımı
   NOT: Bu resimleri /assets klasörüne ekleyebilirsin
   Bulamazsa fallback stok görsel kullanır. */
const categoryVisuals = {
  kahvalti: {
    image: "assets/kahvalti.jpg",
    variant: "red"
  },
  baslangic: {
    image: "assets/baslangic.jpg",
    variant: "dark"
  },
  salata: {
    image: "assets/salata.jpg",
    variant: "red"
  },
  burger: {
    image: "assets/burger.jpg",
    variant: "dark"
  },
  makarna: {
    image: "assets/makarna.jpg",
    variant: "red"
  },
  pizza: {
    image: "assets/pizza.jpg",
    variant: "dark"
  },
  izgara: {
    image: "assets/izgara.jpg",
    variant: "red"
  },
  tatli: {
    image: "assets/tatli.jpg",
    variant: "dark"
  },
  "sicak-icecek": {
    image: "assets/sicak-icecek.jpg",
    variant: "red"
  },
  "soguk-icecek": {
    image: "assets/soguk-icecek.jpg",
    variant: "dark"
  }
};

// Fallback stok görseli (istersen kendi linkini koy)
const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800";

async function loadMenu() {
  try {
    const res = await fetch("menu-data.json");
    if (!res.ok) throw new Error("Menü yüklenemedi");
    menuData = await res.json();

    // Sayfa başlığı
    const restaurantNameEl = document.getElementById("restaurant-name");
    if (restaurantNameEl && menuData.restaurantName) {
      restaurantNameEl.textContent = "MENÜ";
      const heroTitle = document.querySelector(".hero-title");
      if (heroTitle) heroTitle.textContent = menuData.restaurantName;
    }

    renderCategoryGrid();
    // Varsayılan olarak ilk kategoriyi aç
    if (menuData.categories && menuData.categories.length > 0) {
      setActiveCategory(menuData.categories[0].id);
    }

    // Footer yılı
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("category-grid");
    if (grid) {
      grid.innerHTML =
        "<p>Menü yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>";
    }
  }
}

function renderCategoryGrid() {
  const grid = document.getElementById("category-grid");
  grid.innerHTML = "";

  (menuData.categories || []).forEach((cat, index) => {
    const visual = categoryVisuals[cat.id] || {};
    const card = document.createElement("div");
    card.className =
      "category-card " + (visual.variant === "dark" ? "dark" : "red");
    card.dataset.categoryId = cat.id;

    const inner = document.createElement("div");
    inner.className = "category-card-inner";

    const content = document.createElement("div");
    content.className = "category-card-content";

    const nameEl = document.createElement("div");
    nameEl.className = "category-name";
    nameEl.textContent = cat.name;

    const subEl = document.createElement("div");
    subEl.className = "category-sub";
    subEl.textContent = "Menüyü görüntülemek için tıklayın";

    const btn = document.createElement("div");
    btn.className = "category-button";
    btn.textContent = "MENÜ →";

    content.appendChild(nameEl);
    content.appendChild(subEl);
    content.appendChild(btn);

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "category-card-image";

    const img = document.createElement("img");
    img.src = visual.image || FALLBACK_IMAGE;
    img.alt = cat.name;
    imgWrapper.appendChild(img);

    inner.appendChild(content);
    inner.appendChild(imgWrapper);
    card.appendChild(inner);

    card.addEventListener("click", () => {
      setActiveCategory(cat.id);
      scrollToDetail();
    });

    grid.appendChild(card);
  });
}

function setActiveCategory(categoryId) {
  currentCategoryId = categoryId;
  // Kartlarda active görünümü istersen ayrıca class ekleyebilirsin
  renderMenuDetail();
}

function renderMenuDetail() {
  const detailContainer = document.getElementById("menu-detail");
  const detailTitleEl = document.getElementById("detail-title");

  const category = menuData.categories.find((c) => c.id === currentCategoryId);
  if (!category) {
    detailContainer.innerHTML = "<p>Bu kategori bulunamadı.</p>";
    if (detailTitleEl) detailTitleEl.textContent = "Kategori Detayı";
    return;
  }

  if (detailTitleEl) {
    detailTitleEl.textContent = category.name + " Menüsü";
  }

  const items = category.items || [];

  const headerDiv = document.createElement("div");
  headerDiv.className = "menu-detail-header";

  const titleSpan = document.createElement("div");
  titleSpan.className = "menu-detail-title";
  titleSpan.textContent = category.name;

  const countSpan = document.createElement("div");
  countSpan.className = "menu-detail-count";
  countSpan.textContent = `${items.length} ürün`;

  headerDiv.appendChild(titleSpan);
  headerDiv.appendChild(countSpan);

  const listFragment = document.createDocumentFragment();
  listFragment.appendChild(headerDiv);

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "menu-item-row";

    const info = document.createElement("div");
    info.className = "menu-item-info";

    const nameEl = document.createElement("div");
    nameEl.className = "menu-item-name";
    nameEl.textContent = item.name;

    const descEl = document.createElement("div");
    descEl.className = "menu-item-desc";
    descEl.textContent = item.description || "";

    info.appendChild(nameEl);
    if (item.description) info.appendChild(descEl);

    const priceEl = document.createElement("div");
    priceEl.className = "menu-item-price";
    const currency = menuData.currency || "₺";
    priceEl.textContent = `${item.price} ${currency}`;

    row.appendChild(info);
    row.appendChild(priceEl);

    listFragment.appendChild(row);
  });

  detailContainer.innerHTML = "";
  detailContainer.appendChild(listFragment);
}

function scrollToDetail() {
  const detailSection = document.querySelector(".menu-detail-section");
  if (!detailSection) return;
  const top = detailSection.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

loadMenu();
