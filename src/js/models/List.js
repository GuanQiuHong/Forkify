import uniqid from 'uniqid'; //to create unique IDs

export default class List {
    /** when we initialize a new list, we don't need to add anything */
    constructor() {
        //initialize an empty array, so new items (ingredient object) will be pushed into this.
        this.items = [];
    }

    /** a list of ingredients, so when we add item, we're adding an ingredient object 
     * so an item object here will just be an ingredient object
     * we need a unique ID to identify each item, when we want to delete them,
     * or update their count
    */
    addItem (count, unit, ingredient) {
        const item = {
            //create a unique identifer for each item
            id: uniqid(),
            count: count,
            unit: unit, 
            ingredient: ingredient
        }
        //add this new ingredient object into our items object-array
        this.items.push(item);
        return item;
    }

    /** delete an item from the shopping cart
     * based on the passed in id, we need to find the position
     * of the item that matches the id.
     */
    deleteItem (id) {
        /** iterate through items array, 
         * return the index of the current element whose id matches the one we want to delete
        */
        const index = this.items.findIndex(element => element.id === id);

        this.items.splice(index, 1); //remove the element with the id we intend on deleting
    }

    /** change quantity of stuff in the shopping cart
     * pass in ID of element we want to manipulate
     *  */
    updateCount(id, newCount) {
        /** find() gets the ingredient object whose id was clicked,
         * then we update its count with new count.
         */
        this.items.find(element => element.id === id).count = newCount;
    }
}