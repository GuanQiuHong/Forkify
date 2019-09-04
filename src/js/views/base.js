/** an object that contains all of the elements that we select from our DOM */

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResult: document.querySelector('.results'), //parent of searchResultList
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

/** the spinny loading thing when we're querying API 
 * We're attaching loader as a child to the parent node
 * it rotates clockwise because in our .css file, 
 * loader has a _rotate_ animation that takes 2.5s per 1 circle
 * we inject the loader code into the results class, where the search results
 * would show up later.
*/
// export const renderLoader = parent => {
//     const loader = `
//         <div class="loader">
//             <svg>
//                 <use href="img/icons.svg#icon-cw"></use> 
//             </svg>
//         </div>
//     `;
//     parent.insertAdjacentHTML('afterbegin', loader);
// }

// export const clearLoader = () => {

// }