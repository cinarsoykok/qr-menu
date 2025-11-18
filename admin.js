let menuData = null;
let currentCategoryId = null;

async function loadMenuForAdmin() {
  try {
    const res = await fetch("menu-data.json");
    if (!res.ok) throw new Error("Menü yüklenemedi");
    menuData = await res.json();

    initCategorySelect();
    renderTable();
  } catch (err) {
    console.error(err);
    alert("Menü yüklenirken hata oluştu. Konsolu kontrol et.");
  }
}

function initCategorySelect() {
  const selectEl = document.getElementById("admin-category-select");
  selectEl.innerHTML = "";

  (menuData.categories || []).forEach((cat, i) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    if (i === 0) currentCategoryId = cat.id;
    selectEl.appendChild(opt);
  });

  selectEl.value = currentCategoryId;
  selectEl.addEventListener("change", () => {
    currentCategoryId = selectEl.value;
    renderTable();
  });
}

function renderTable() {
  const tbody = document.getElementById("admin-table-body");
  tbody.innerHTML = "";

  const category = menuData.categories.find((c) => c.id === currentCategoryId);
  if (!category) return;

  (category.items || []).forEach((item) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = item.id;

    const tdName = document.createElement("td");
    tdName.textContent = item.name;

    const tdDesc = document.createElement("td");
    tdDesc.textContent = item.description || "";

    const tdPrice = document.createElement("td");
    tdPrice.textContent = item.price;

    const tdActions = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.textContent = "Sil";
    delBtn.className = "btn-danger";
    delBtn.addEventListener("click", () => {
      deleteItem(item.id);
    });
    tdActions.appendChild(delBtn);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdDesc);
    tr.appendChild(tdPrice);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  });
}

function deleteItem(itemId) {
  const category = menuData.categories.find((c) => c.id === currentCategoryId);
  if (!category) return;
  category.items = category.items.filter((it) => it.id !== itemId);
  renderTable();
}

function initForm() {
  const form = document.getElementById("admin-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("item-name").value.trim();
    const desc = document.getElementById("item-desc").value.trim();
    const price = Number(document.getElementById("item-price").value);
    const idInput = document.getElementById("item-id").value.trim();

    if (!name || !price) {
      alert("Ad ve fiyat zorunludur.");
      return;
    }

    const category = menuData.categories.find((c) => c.id === currentCategoryId);
    if (!category) return;

    let newId;
    if (idInput) {
      newId = Number(idInput);
    } else {
      const maxId = category.items.reduce((max, it) => Math.max(max, it.id || 0), 0);
      newId = maxId + 1;
    }

    category.items.push({
      id: newId,
      name,
      description: desc || "",
      price
    });

    form.reset();
    renderTable();
  });
}

function initExport() {
  const btn = document.getElementById("export-json-btn");
  const output = document.getElementById("export-json-output");

  btn.addEventListener("click", () => {
    output.textContent = JSON.stringify(menuData, null, 2);
  });
}

loadMenuForAdmin();
initForm();
initExport();
