import {elements} from './base';

/** render item 
 * dynamically inject data about any specific item (ingredient object)
 * into the HTML for a shopping list item template
 * first give this HTML element the uniqid we injected into each object 
 * @step defines how much the quantity should increase by, each time + or - is clicked.
 * it should follow however much the initial quantity is;
 * if initially 1 1/2, + => 3. hence step = item.count
 * @shopping__ count-value is a class so we can select the input element, 
 * so we can read value=${item.count} to update it in model
*/
export const renderItem = item => {
    const markup = `
        <li class="shopping__item data-itemid=${item.id}">
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>

            <p class="shopping__description">${item.ingredient}</p>

            <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
            </button>

        </li>
    `;

    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

/** we select the element we want to delete based on the id,
 * we use the CSS selector here, looking for element with data-itemid=id class
 * which will be one HTML shopping list item, that we'll remove
*/
export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    //now remove the selected element
    item.parentElement.removeChild(item);
};