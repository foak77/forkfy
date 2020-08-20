import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

//global state of the app
// search obj
// current recipen obj
// shopping list obj
// linked obj

const state = {};

//search controller
const controlSearch = async () => {
  //1. get the query from the view
  const query = searchView.getInput();

  if (query) {
    //2 new search obj and add to state
    state.search = new Search(query);

    //3 prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      //4 search for recipes
      await state.search.getResults();

      //5 render result on UI
      // console.log(state.search.result);
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      alert("ERROR Something went wrong with the search");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

//recipe controller

const controlRecipe = async () => {
  //get id from url
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    //prepare the ui for changes
    //greate new recipe obj
    state.recipe = new Recipe(id);

    try {
      //get recipe data and parse INg
      await state.recipe.getRecipe();
      console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      //calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      //render recipe
      console.log(state.recipe);
    } catch (err) {
      alert("ERROR processing recipe");
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);
