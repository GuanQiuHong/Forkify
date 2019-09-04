import {elements} from './base';

/** we decide whether a recipe item is stylized as liked or not liked, based on the isLiked variable */
export const toggleLikeBtn = isLiked => {

    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    /** we specify which attribute we want to change (href)
     * and what to set it to: here we wanna let href's info
     * be the image (icon) we want to display, either the liked heart (icon-heart)
     * or the disliked/neutral heart (icon-heart-outlined)
     */
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);

    //icons.svg#icon-heart-outlined
};

/** we only show the liked menu, if there is currently liked items */
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

/** inject the information about the like object into template html, then insert this into HTML file*/
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>

                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);

};

/** remove the cart item with specified id */
export const deleteLike = id => {
    //we select the likes with this particular id... so really, there's only 1 we're selecting
    const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (element) element.parentElement.removeChild(element);
}
