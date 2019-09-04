export default class Likes {

    /** */
    constructor() {
        this.likes = [];
    }

    /** each liked item, appearing in the Likes list, contains
     * id, title, author, img as the information required
     * to construct a like.
    */
    addLike(id, title, author, img) {
        //construct object out of given parameters
        const like = { id, title, author, img };
        //push it into the likes array
        this.likes.push(like);

        return like;
    }

    /** works exact same as deleteItem in List.js */
    deleteLike(id) {
        const index = this.likes.findIndex(element => element.id === id);

        this.likes.splice(index, 1); //remove the element with the id we intend on deleting
    }

    /** when we load a recipe, we need to know which items have a 
     * 'like' marker, so then we'd need to style that recipe differently from the rest
     */
    isLiked(id) {
        /** see if there is an object in likes array, 
         * whose id matches the one currently going to be displayed 
         * on the web page; if there is, we style the item 
         * on webpage as a 'liked' object; 
         * if we aren't able to find the current recipe on web page 
         * in the likes array, then that means we style it normally.
         */
        return this.likes.findIndex(element => element.id === id) !== -1;
    }

    /** return the number of liked items */
    getNumLikes() {
        return this.likes.length;
    }
}