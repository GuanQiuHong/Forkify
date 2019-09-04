            /***************************************************************** 
                                * GLOBAL CONTROLLER *
            ******************************************************************/

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
//import everything and let searchView contain them
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements } from './views/base';

/******************** STATE ********************
 * what is the state of our app in any given moment?
 * What's the current search query?
 * whats the current recipe?
 * How many recipes being calculated?
 * Whats currently in the shopping list? 
 * The data in the current state, all of this is called the _state_
 * we store state in one central object, in which we have
 * all the data that defines our app in a given moment. 
 * We can then access throughout, in our controller.
 * Example of state library: _Redux_
 * 
 * Global state of app:
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

/*************************** SEARCH CONTROLLER ******************************
 * Responsible for receiving and displaying info on View, storing data in Model
 */
const controlSearch = async () => {
    // get query from view
    const query = searchView.getInput();

    //if there is a valid query, 
    if (query) {
        // Instantiate a search object, add to global state object
        state.search = new Search(query);

        // Clear previous results, show a loading spinner, prep UI
        searchView.clearInput();
        searchView.clearResults();
        //renderLoader(elements.searchResult);

        try {
            // Search for recipes; we only want 5) to happen strictly after 4), so await it
            await state.search.getResults();
            
            // After promise returns from previous step, render results on UI
            searchView.renderResults(state.search.result);

        } catch (error) {
            alert('Something went wrong with the search :<');
        }
    }
}

/** add eventListener to the search class, so when someone enters a queryString
 * into search bar at top of page, functionality will be carried out accordingly
 */
elements.searchForm.addEventListener('submit', error => {
    //prevent page from refreshing
    error.preventDefault();
    //call the main search function
    controlSearch();
});

/** let prev and next buttons get an event listener, so when clicked, goto next or prev page */
elements.searchResultPages.addEventListener('click', event => {
    /** whatever is clicked on (like page 2 text, or -> triangle icon),
     * the class returned is the closest instance of a class that contains
     * the keywords btn-inline; the point of this is so that when the user 
     * clicks the button, even if they click on text (which isn't the button itself),
     * the click still registers as the button
     */
    const button = event.target.closest('.btn-inline');
    if (button) {
        //read out data from the data-goto member
        //when user clicks a next page or prev page button,
        //button.dataset.goto returns the page number requested.
        const goToPage = parseInt(button.dataset.goto, 10);

        //clear search results (remove html) so new html can be injected properly
        searchView.clearResults();

        //render new ones if next page, prev page is clicked
        searchView.renderResults(state.search.result, goToPage);
    }
})

/*********************** RECIPE CONTROLLER  *************************/

//takes URL, displays a recipe according to hash value
const controlRecipe = async () => {
    /** we need to first get the hash from url (#42591)
     * window.location is the entire url, .hash returns
     * content like #42591, .replace() to remove # because
     * we only need the ID number */
    const id = window.location.hash.replace('#', '');

    /** if we received a valid id via hashchange,
     * we can process the recipe information in model, 
     * and display in view
     */
    if (id) {
        //prepare UI for changes: clearing out previous recipes HTML before injecting new
        recipeView.clearRecipe();

        /** Highlight selected recipe item from LHS menu 
         * if a search object already exists, then we highlight it;
         * if it doesn't exist yet, then we don't.
        */
        if (state.search) searchView.highlightSelected(id);


        //put new instance of recipe in our global state object
        state.recipe = new Recipe(id);

        try {
            /** get recipe data asynchronously, since get API returns a promise
             * parse ingredients into our format: count, unit, ingredient words
             * _uncomment_ following line whenever I need to test
             * */
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //depending if liked or not, inject different html to render recipe
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        } catch (error) {
            alert('Error processing recipe');
        }

    }
};

/** whenever a different recipe is being clicked,
 * hash updates (the _hashchange_ event);
 * we listen for that in global _window_
 * 
 * window.addEventListener('hashchange', controlRecipe);
 *
 * add event listener to the _load_ event,
 * which fires whenever the page is loaded
 * we call the same function for two different events
 * 
 * window.addEventListener('load', controlRecipe);
 */

 //condenses the above two event listeners into one line
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**************** LIST CONTROLLER ****************/

const controlList = () => {
    /** create a new list IF there is none yet */
    if(!state.List) state.list = new List();

    /** add each ingredient we want to add to shopping cart, to the list model
     * we loop over the array of ingredient objects, add them to our list
     */
    state.recipe.ingredients.forEach(element => {
        const item = state.list.addItem(element.count, element.unit, element.ingredient);
        //we inject item info into the template HTML for a shopping cart item here
        listView.renderItem(item);
    })
}

/** delete shopping cart item, and update quantity of ingredient in shopping cart item events */
elements.shopping.addEventListener('click', event => {
    /** read the ID of the element that we clicked on
     * wherever user clicked, find the nearest cart item (that contains shopping__item class)
     * then we get that item's itemid, which we specifically injected in listView, 
     * whenever a new cart item was created.
     */
    const id = event.target.closest('.shopping__item').dataset.itemid;

    /** if the clicked target matches the shopping_delete class, (the delete button)
     * we want to delete the item both from UI, and from our state object
      */
    if (event.target.matches('.shopping__delete, .shopping__delete *')) {
        //removes this item from the list's item array of ingredient objects 
        state.list.deleteItem(id);

        //remove HTML code for this particular cart item
        listView.deleteItem(id);
    } 
    
    /** read data from interface, then update in our state 
     * whenever a increase count or decrease count is clicked
     * for one item in the shopping cart
     * we first get the value from the box where user clicks up or down arrow to 
     * update count, then we update the list item of that specific ID with new count.
     */
    else if (event.target.matches('.shopping__count-value')) {
        const value = parseFloat(event.target.value, 10);
        state.list.updateCount(id, value);
    }     
});

/********************** LIKE CONTROLLER **************************/

//left global for now to test the Like functionality
state.likes = new Likes(); 
likesView.toggleLikeMenu(state.likes.getNumLikes());

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    /** the id we check, is the one currently being displayed
     * on the webpage, which is stored in state.recipe.id; 
     * that id updates everytime we hit another result from LHS
     */
    const currentID = state.recipe.id;

    /** if the current recipe isn't liked yet.. */
    if (!state.likes.isLiked(currentID)) {
        /** add like to the state, which was returned from after adding a new like */
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author,
            state.recipe.img);
        /** toggle the like button (like => unlike), (unlike => like) */
            likesView.toggleLikeBtn(true);
        /** add like to UI list */
            likesView.renderLike(newLike);

    } else {

        /** remove like from the state */
        state.likes.deleteLike(currentID);

        /** toggle the like button (like => unlike), (unlike => like) */
        likesView.toggleLikeBtn(false);

        /** remove like from UI list */
        likesView.deleteLike(currentID);

    }

    //we show the liked icon upper-right, only if there is at least 1 liked item already.
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


/** handling recipe button clicks
 * event deligation because at first, + or - buttons aren't there;
 * so let parent watch for events, and then find out which
 * element was clicked later
 * 
 * another event delegation for 'add to shopping cart' afterwards
 */
elements.recipe.addEventListener('click', event => {
    //if the target clicked .matches() (i.e. includes) '.btn-decrease' class, or any child of btn-decrease
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button is clicked, decrease further only if servings > 1
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');

            //now update UI given our new count information
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        //increase button is clicked
        state.recipe.updateServings('inc');

        //updte UI given our new count information
        recipeView.updateServingsIngredients(state.recipe);
    } 
    
    /** clicked button was, add ingredients for this recipe to shopping cart: */
    else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    }

    /** if the event picked up, is clicking the heart (liking a recipe), 
     * we run the like event
    */
    else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }

})

