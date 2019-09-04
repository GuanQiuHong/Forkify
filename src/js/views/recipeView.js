import { elements } from './base';
import { Fraction } from 'fractional'; //npm install fractional, converts 1.5 to 1 1/2
//clear previous recipes HTML before injecting new HTML
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
}

/** format a decimal into a nice fractional string */
const formatCount = count => {
    //confirm there's a count first...
    if (count) {
        // destructure '2.5' into ['2', '5'] strings, convert to [2, 5] integers, int = 2, dec = 5
        const [int, dec] = count.toString().split('.').map(element => parseInt(element, 10));

        if (!dec) return count; //if there's no decimal portion, just return the integer...

        /** Fraction() from Fractional library returns an object with numerator, denominator
         * if there's no integer portion, just return the decimal in fractional form
         * if there is integer, transform the decimal portion into fraction,
         * then append integer portion before fraction in template string
        */
        if (int === 0) {
            const fraction = new Fraction(count);
            return `${fraction.numerator}/${fraction.denominator}`;
        } else {
            const fraction = new Fraction(count - int); //find fraction by removing integer portion
            return `${int} ${fraction.numerator}/${fraction.denominator}`;
        }
    }
    return '?';
}

//dynamically insert ingredient info of one objectIng into template HTML of one ingredient
const createIngredient = ingredient => `
    <li class="recipe__item">

        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>

        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;

//insert dynamically generated HTML code, based on recipe, into HTML templates
//also, if recipe isLiked, we'll need to style it as a liked recipe
export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>

            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>

            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>

        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${ /** loop over each ingredient (that has count, unit, ingredient words)
                    and dynamically create the HTML corresponding to each separate ingredient object
                    it'll then be an array of strings, which we'll .join() to create one 
                    HTML string of multiple ingredients */
                    recipe.ingredients.map(element => createIngredient(element)).join('')
                }

            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
}

/** update UI when + or - is clicked, change the quantity of things
 * it takes the recipe array, 
*/
export const updateServingsIngredients = recipe => {
    //update servings in HTML
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    /** update ingredients: 
     * select all of the ingredient counts, then update one by one
     * first select all the ingredient counts in HTML, like the _3_ cups sugar
     * then, iterate through each of those elements and replace with new count 
     * from recipe.ingredients
    */
   const countElements = Array.from(document.querySelectorAll('.recipe__count'));
   countElements.forEach((element, index) => {
       element.textContent = formatCount(recipe.ingredients[index].count);
   })

}