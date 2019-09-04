import { elements } from './base';

//return the input value of the search field
export const getInput = () => {
    return elements.searchInput.value; //get whatever we input into search field
}

/** this function clears the search bar by injecting empty string into search__field */
export const clearInput = () => {
    elements.searchInput.value = '';
};

/** removes everything inside searchResultList, i.e. class="results"
 * by setting the HTML code inside it to an empty string.
 * Subsequent calls to renderRecipes can inject new HTMl into the div.
 */
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

/** a selected recipe will get a gray background */
export const highlightSelected = id => {
    /** select all results on LHS menu, clear their gray background 
     * before adding the gray bg to the one that's currently selected
     */
    const resultsArray = Array.from(document.querySelectorAll('.results__link'));
    resultsArray.forEach(element => {
        element.classList.remove('results__link--active');
    })
    /** select element with the exact supplied id (from parsing URL) 
     * add a CSS class to that element, that styles it with gray background
    */
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};

/** Reduce length of title in LHS search results, so text amount isn't overwhelming
 * @param limit: number of characters that is acceptable as maximum length of title
 * set 17 as default parameter; if one'd like their custom, pass their arg in.
*/
const limitRecipeTitle = (title, limit = 17) => {
    let newTitle = [];
    /** Only if title length is longer than limit... we need to operate on it
     * 1.  we split title string into an array of separate words, separating by space
     * 2. .reduce(): in each iteration, we test if accumulator + current.length 
     * is still under display limit. If it is, then we'll push the word into the new titleArray.
     * 3. Accumulator gets updated with new length after each iteration
     * */
    if (title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if (accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);
        /** after we have our array of words of acceptable length, 
         * we merge back into a sentence with spaces separating each word.
        */
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

/** replace placeholders in html template with dynamic data from the API.
 * each element of the recipes array is an object; so we . access specific fields,
 * and put that field's info into this template html with ${} 
 * @param recipe refers to 'current element of array', which is a recipe object from
 * the forEach call in renderResults 
 */
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    /*  after we've replaced placeholders with real data, insert into html file
        so they'll be actually displayed on the website.
    */
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};


/** to write the HTML code for one button for going backwards or forwards
 * type: previous or next
 * 
 * How does controller know which page is being requested to display?
 * It knows via the html class _data-goto_: depending on current page number,
 * and whether a prev or next button is requested, data-goto will record the numerical value
 * associated with a button, so that when a button is clicked, controller knows 
 * what's the new page being requested.
 */
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>   
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        
    </button>
`;

/** rendering buttons for next page and previous page */
const renderButtons = (page, numResults, resultsPerPage) => {
    //we find how many pages there are in total; round up to have room for last results
    const pages = Math.ceil(numResults / resultsPerPage);

    let button;
    /** if we're on page 1, we want button for going to next page.  */
    if (page === 1 && pages > 1) {
       button = createButton(page, 'next');

    }
    
    /** if we're somewhere in between... we want buttons to go before and after */
    else if (page < pages) {
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    }

    /** if we're on the last page... we want button only to go to previous page */
    else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }

    //once we have the required HTML for buttons, we inject it into our HTML document
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
}

/** Receive array of recipes queried from API,
 * loop through these, 
 * inject dynamic data into html templates
 */
export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    /** we want to display 10 at a time, not all 30.
     * After determining which is the first and last recipes to show,
     * we can take just a portion of the recipes array
     */
    const start = (page-1) * resultsPerPage;
    const end = page * resultsPerPage;

    /** we extract the array elements from start to end,
     * then we use renderRecipe() on each element that remains to render it
     */
    recipes.slice(start, end).forEach(renderRecipe);

    /** render the pagination buttons
     * it needs current page number, total number of recipes, 
     * and number of results wanted per page
     * because we need to calculate total number of pages there are,
     * in order to know buttons up to which page number is needed
     */
    renderButtons(page, recipes.length, resultsPerPage);

};