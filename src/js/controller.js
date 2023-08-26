"use strict";
import * as modal from "./modal.js";
import * as view from "./view.js";
import "regenerator-runtime/runtime.js";

const controllSearch = async function (query) {
  view.showSearchSpinner();
  await modal.fetchRecipes(query);
  const recipes = modal.state.results;
  view.renderRecipes(recipes);
};

const controlRecipeClick = async function (id) {
  view.showRecipeSpinner();
  await modal.fetchSingleRecipe(id);
  const recipe = modal.state.recipe;
  const bookmarks = modal.state.bookmarks;
  view.renderRecipe(recipe, bookmarks);
};

function controlToggleBookMarks() {
  view.toggleBookmarks();
}

function controlBookMark(btnEl) {
  view.toggleBookMark(btnEl, controlRenderBookmarks, controlRemoveBookmarks);
}

function controlRenderBookmarks(recipeId) {
  modal.addToBookmark(recipeId);
  view.renderBookmarks(modal.state.bookmarks);
}

function controlRemoveBookmarks(recipeId) {
  modal.removeFromBookmark(recipeId);
  view.renderBookmarks(modal.state.bookmarks);
}

function controlBookmarked(recipeId) {
  modal.removeFromBookmark(recipeId);
  view.renderBookmarks(modal.state.bookmarks);
}

function controlDeleteBookmarked() {
  modal.deleteAllBookmarks();
  view.renderBookmarks(modal.state.bookmarks);
}

function controlRenderBookmarked(recipeId) {
  controlRecipeClick(recipeId);
}

function controlOpenModal() {
  view.openModal();
}

function controlCloseModal() {
  view.closeModal();
}

async function controlFormSubmit(recipeData) {
  view.showUploadSpinner();
  await modal.uploadRecipe(recipeData);
  const recipe = modal.state.recipe;
  const bookmarks = modal.state.bookmarks;
  view.renderBookmarks(bookmarks);
  view.renderRecipe(recipe, bookmarks);
  view.showSuccessMsg();
}

function initialRender() {
  view.searchEventHandler(controllSearch);
  view.recipeClickEventHandler(controlRecipeClick);
  view.bookmarksEventHandler(controlToggleBookMarks);
  view.bookmarkEventHandler(controlBookMark);
  view.removeBookmarkedEventhandler(controlBookmarked);
  view.deleteBookmarkEventHandler(controlDeleteBookmarked);
  view.renderBookmarkedEventhandler(controlRenderBookmarked);
  view.toggleModalEventHandler(controlOpenModal, controlCloseModal);
  view.uploadRecipeEventHandler(controlFormSubmit);
}

function getFromLocal() {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  view.renderBookmarks(bookmarks);
  modal.state.bookmarks = bookmarks;
}

initialRender();
getFromLocal();
