"use strict";
import "core-js/actual";
import "regenerator-runtime/runtime";

export const state = {
  results: [],
  recipe: {},
  bookmarks: [],
  newRecipe: {},
  KEY: "7bd659dc-40a1-44ef-a8b1-8612ad53e347",
  APIURL: "https://forkify-api.herokuapp.com/api/v2/recipes/",
};

export async function fetchRecipes(query) {
  try {
    if (!query) return;
    const res = await fetch(`${state.APIURL}?search=${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error("Something went wrong internally");
    state.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        imgURL: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
        key: recipe.key ? true : false,
      };
    });
  } catch (err) {
    alert(err);
  }
}

export async function fetchSingleRecipe(id) {
  try {
    if (!id) return;
    const res = await fetch(`${state.APIURL}${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error("Something went wrong internally");
    state.recipe = {
      id: data.data.recipe.id,
      title: data.data.recipe.title,
      cookingTime: data.data.recipe.cooking_time,
      ingredients: data.data.recipe.ingredients,
      servings: data.data.recipe.servings,
      imgURL: data.data.recipe.image_url,
      publisher: data.data.recipe.publisher,
      sourceURL: data.data.recipe.source_url,
    };
  } catch (err) {
    alert(err);
  }
}

export function addToBookmark(recipeId) {
  const recipe = state.results.find((recipe) => recipe.id == recipeId);
  state.bookmarks.push(recipe);
  setToLocal();
}

export function removeFromBookmark(recipeId) {
  state.bookmarks = state.bookmarks.filter((recipe) => recipe.id !== recipeId);
  setToLocal();
}

export function deleteAllBookmarks() {
  state.bookmarks = [];
  setToLocal();
}

function setToLocal() {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
}

export async function uploadRecipe(recipeData) {
  try {
    const ingredients = Object.entries(recipeData)
      .filter((el) => el[0].startsWith("ing") && el[1] !== "")
      .map((el) => {
        const ings = el[1].replaceAll(" ", "").split(",");
        if (ings.length < 3) {
          alert("Please input in right format");
          return;
        }
        const [quantity, unit, description] = ings;
        return { quantity: quantity ? quantity : "", unit, description };
      });

    state.newRecipe = {
      title: recipeData.title,
      cooking_time: recipeData.cookingTime,
      ingredients,
      servings: recipeData.servings,
      image_url: recipeData.imageURL,
      publisher: recipeData.publisher,
      source_url: recipeData.sourceUrl,
    };
    await uploadNewRecipe(state.newRecipe);
  } catch (error) {}
}

async function uploadNewRecipe(newRecipe) {
  const res = await fetch(`${state.APIURL}?key=${state.KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newRecipe),
  });

  const data = await res.json();

  if (!res.ok) throw new Error("Something went wrong internally");

  let recipe = data.data.recipe;

  state.recipe = {
    id: recipe.id,
    imgURL: recipe.image_url,
    title: recipe.title,
    publisher: recipe.publisher,
    key: true,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    sourceURL: recipe.source_url,
  };

  console.log(state.recipe);

  state.results.push(state.recipe);
  state.bookmarks.push(state.recipe);
  setToLocal();
}
