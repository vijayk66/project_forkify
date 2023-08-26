"use strict";

//top bar
const searchForm = document.querySelector(".search-recipe");
const searchInput = document.querySelector(".search-input");
const addRecipeBtn = document.querySelector(".add-recipe-btn");

// Search Results
const searchResults = document.querySelector(".search-results");
const searhHeading = document.querySelector(".search-heading");
const emptyText = document.querySelector(".empty-search");

// Recipe-container
const recipeViewContainer = document.querySelector(".recipe-view-container");
const emptyRecipeText = document.querySelector(".empty-recipe-text");

// Bookmarks
const bookmark = document.querySelector(".bookmark");
const bookmarksContainer = document.querySelector(".bookmarks-container");
const closeBookMark = document.querySelector(".close-bookmark");
const deleteBookMark = document.querySelector(".delete-bookmark");
const bookmarkedItems = document.querySelector(".bookmarked-items");
let spinnerUpload = document.querySelector(".spinner-upload");

// modal
const modalContainer = document.querySelector(".modal-recipe");
const overlay = document.querySelector(".overlay");
const modalForm = document.querySelector(".modal-form");
const successMsgContainer = document.querySelector(".success-msg");
const successMsg = document.querySelector(".success-msg p");
const inputs = document.querySelectorAll("input");

// spinner
let spinnerSearch = document.querySelector(".spinner-search");

// Rendring Recipes
export function searchEventHandler(handler) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!searchInput.value) return;
    bookmarksContainer.classList.remove("show");
    handler(searchInput.value);
  });
}

export function renderRecipes(recipes) {
  recipesHelper(recipes);
  recipes.forEach((recipe) => {
    const html = `
        <li class="search-item" data-id=${recipe.id}>
          <img class="search-item-img" src="${
            recipe.imgURL
          }" alt="recipe img" />
          <div class="search-content">
            <h2 class="search-item-name">
              <span>${recipe.title}</span>
              ${
                recipe.key
                  ? `<i class="fa-regular fa-circle-user"></i>`
                  : `<i class="fa-solid fa-utensils"></i>`
              }
              
            </h2>
            <p class="search-item-publisher">${recipe.publisher}</p>
          </div>
        </li>
        `;
    searchResults.insertAdjacentHTML("beforeend", html);
  });
}

function recipesHelper(recipes) {
  spinnerSearch.style.display = "none";
  searchResults.innerHTML = "";

  if (recipes.length == 0) {
    searchResults.style.display = "none";
    emptyText.style.display = "block";
    emptyText.textContent = "☹️ No recipes found for your search";
    searhHeading.textContent = `Search something like "pizza"`;
    emptyRecipeText.textContent =
      "🤤 Start searching your favourite recipe over 100,000+ recipes.";
    return;
  }

  emptyText.style.display = "none";
  searchResults.style.display = "grid";
  searhHeading.textContent = `Awesome ${recipes.length} recipes found`;
  emptyRecipeText.textContent = "👈 Click some recipe to know more";
}

// Rendring Recipe
export function recipeClickEventHandler(handler) {
  searchResults.addEventListener("click", function (e) {
    const id = e.target.closest(".search-item").dataset.id;
    bookmarksContainer.classList.remove("show");
    handler(id);
  });
}

export function renderRecipe(recipe, bookmarks) {
  recipeViewContainer.innerHTML = "";
  const isbookmarked = bookmarks.some((rec) => rec.id === recipe.id);
  const haveKey = recipe.key ? true : false;
  const recipeName = recipe.title.slice(0, 30) + "...";

  const html = `
  <div class="recipe-img-container" data-id=${recipe.id}>
    <img src="${recipe.imgURL}" alt="recipe img" />
    <p class="recipe-name">${recipeName}</p>
    <div class="servings">
      <p>
        <i class="fa-regular fa-clock"></i>
        <span>${recipe.cookingTime} Minutes</span>
      </p>
      <p>
        <i class="fa-solid fa-user-group"></i>
        <span> ${recipe.servings} Servings </span>
      </p>
      <button class="bookmark-btn">
        <span class="bookmark">Bookmark</span>
        <i class="${
          isbookmarked
            ? "bookmarked fa-solid fa-bookmark bookmark"
            : "fa-solid fa-bookmark bookmark"
        }">
        </i>
      </button>
      <p class="${haveKey ? "show-user" : "hide-user"}">
        <span>Own Recipe</span>
        <i class="fa-solid fa-user"></i>&nbsp;
      </p>
    </div>

  </div>

  <div class="recipe-ingredients">
    <div class="ingredients">
      <p>
       Recipe Ingredients
       <i class="fa-solid fa-bowl-food" style="color: #ffffff;"></i>
      </p>

      <ul class="ingredients-list">
        ${recipe.ingredients
          .map((ing) => {
            return `
              <li>
                <i class="fa-solid fa-check" style="color:#f7a55e"></i>
                <p>${ing.quantity ? ing.quantity : ""} ${ing.unit} ${
              ing.description
            }</p>
              </li>
          `;
          })
          .join("")}.
      </ul>
    </div>
    <div class="direction">
      <p>How To Cook It</p>
      <p class="direction-text">
        This recipe was carefully designed and tested by
        <span class="recipe-publisher" style="color:#f5a651">${
          recipe.publisher
        }.</span> Please
        check out directions at their website.
      </p>
      <a href="${recipe.sourceURL}" class="recipe-link" target="_blank">
        Direction
        <i class="fa-solid fa-arrow-right-long"></i>
      </a>
    </div>
  </div>
  `;

  recipeViewContainer.insertAdjacentHTML("beforeend", html);
}

// BookMark  feature
export function bookmarksEventHandler(handler) {
  bookmark.addEventListener("click", handler);
  closeBookMark.addEventListener("click", function (e) {
    e.preventDefault();
    handler();
  });
}

export function toggleBookmarks() {
  bookmarksContainer.classList.toggle("show");
}

export function bookmarkEventHandler(handler) {
  recipeViewContainer.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("bookmark") ||
      e.target.classList.contains("bookmark-btn")
    ) {
      const btnEl = e.target.closest(".bookmark-btn");
      handler(btnEl);
    }
  });
}

export function toggleBookMark(btnEl, addBoomark, removeBookmark) {
  btnEl.querySelector("i").classList.toggle("bookmarked");
  const recipeId = btnEl?.closest(".recipe-img-container").dataset.id;

  if (btnEl.querySelector("i").classList.contains("bookmarked")) {
    btnEl.querySelector("span").textContent = "Bookmarked";
    addBoomark(recipeId);
  } else {
    btnEl.querySelector("span").textContent = "Bookmark";
    removeBookmark(recipeId);
  }
}

export function renderBookmarks(bookmarks) {
  bookmarkedItems.innerHTML = "";
  if (bookmarks.length == 0) {
    deleteBookMark.style.display = "none";
    const html = `
     <p class="no-bookmark"> No Bookmarks ☹️</p>
    `;
    bookmarkedItems.insertAdjacentHTML("afterbegin", html);
    return;
  }

  deleteBookMark.style.display = "block";

  bookmarks.forEach((recipe) => {
    const html = `
      <li class="bookmark-item" data-id="${recipe.id}">
        <img class="bookmark-item-img" src="${recipe.imgURL}" alt="recipe img" />
        <div class="bookmark-content">
          <h2 class="bookmark-item-name">${recipe.title}</h2>
          <p class="bookmark-item-publisher">${recipe.publisher}</p>
          <i class="fa-solid fa-bookmark bookmarked"></i>        
        </div>
      </li>
    `;
    bookmarkedItems.insertAdjacentHTML("afterbegin", html);
  });
}

export function removeBookmarkedEventhandler(handler) {
  bookmarkedItems.addEventListener("click", function (e) {
    if (e.target.classList.contains("bookmarked")) {
      const recipeId = e.target.closest(".bookmark-item").dataset.id;
      const currentRecipeId = document.querySelector(".recipe-img-container")
        .dataset.id;
      if (recipeId === currentRecipeId) {
        document
          .querySelector(".servings .bookmarked")
          ?.classList.remove("bookmarked");
      }
      handler(recipeId);
    }
  });
}

export function deleteBookmarkEventHandler(handler) {
  deleteBookMark.addEventListener("click", function (e) {
    e.preventDefault();
    document
      .querySelector(".servings .bookmarked")
      ?.classList.remove("bookmarked");
    handler();
  });
}

export function renderBookmarkedEventhandler(handler) {
  bookmarkedItems.addEventListener("click", function (e) {
    if (e.target.classList.contains("bookmarked")) return;
    if (e.target.closest(".bookmark-item")) {
      const recipeId = e.target.closest(".bookmark-item").dataset.id;
      handler(recipeId);
    }
  });
}

// Uploading new recipe
export function uploadRecipeEventHandler(handler) {
  modalForm.addEventListener("submit", function (e) {
    e.preventDefault();
    bookmarksContainer.classList.remove("show");
    const formData = [...new FormData(modalForm)];
    const recipeData = Object.fromEntries(formData);

    let ing1 = document.querySelector(".test1");
    let ing2 = document.querySelector(".test2");
    let ing3 = document.querySelector(".test3");
    let ing4 = document.querySelector(".test4");
    let ing5 = document.querySelector(".test5");
    let ing6 = document.querySelector(".test6");

    let ingredients = [ing1, ing2, ing3, ing4, ing5, ing6];

    const isRightFormat = ingredients.every(
      (ing) => ing.value.split(",").length > 2 || ing.value === ""
    );

    if (!isRightFormat) {
      alert(
        `Please input in right Format \nFormat : 'Quantity,Unit,Description`
      );
      return;
    }

    handler(recipeData);
  });
}

export function showUploadSpinner() {
  successMsgContainer.classList.add("show-success");
}

export function showSuccessMsg() {
  inputs.forEach((el) => (el.value = ""));

  spinnerUpload.style.display = "none";
  successMsg.style.display = "block";

  setTimeout(function () {
    successMsgContainer.classList.remove("show-success");
    spinnerUpload.style.display = "block";
    successMsg.style.display = "none";
  }, 2000);
}

// Modal section
export function toggleModalEventHandler(openModal, closeModal) {
  addRecipeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    bookmarksContainer.classList.remove("show");
    openModal();
  });
  overlay.addEventListener("click", closeModal);
}

export function openModal() {
  modalContainer.classList.add("show-modal");
  overlay.classList.add("show-overlay");
}

export function closeModal() {
  modalContainer.classList.remove("show-modal");
  overlay.classList.remove("show-overlay");
}

// Spinners
export function showSearchSpinner() {
  spinnerSearch.style.display = "block";
  searchResults.innerHTML = "";
  emptyText.style.display = "none";
}

export function showRecipeSpinner() {
  recipeViewContainer.innerHTML = "";
  const html = `
     <span class="spinner spinner-recipe">
       <img src="https://cdn-icons-png.flaticon.com/128/7854/7854835.png" alt="loading-spinner" />
     </span>
  `;
  recipeViewContainer.insertAdjacentHTML("beforeend", html);
}
