import axios from 'axios';
import { key } from '../config';


export default class Recipe {
    /** each recipe is identified by an id
     * when we create a new recipe object, we pass in that ID
     * based on that ID, we can do the AJAX call for rest of data on that recipe
     */
    constructor(id) {
        this.id = id;
    }

    /** further constructs the Recipe object by adding recipe information as new members */
    async getRecipe() {
        try {
            /** the API call to get recipe information on one specific recipe */
            const result = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            /** in the result returned from food2fork, title is enclosed in
             * the recipe object, which is enclosed in the data object,
             * which in turn is enclosed in the result object returned from API
             */
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.img = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch {
            console.log(error);
        }
    }

    /** rough estimate of how long it takes to cook these recipes
     * _assume_ for every 3 ingredients, it'll take 15 minutes... lol
     */
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    /** assume the amount made is good for 4 people */
    calcServings() {
        this.servings = 4;
    }

    /** create a new array with modified ingredients, based on the old ones. */
    parseIngredients() {
        //1st array will have long units as they appear in old ingredients
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        //2nd array will convert them to the form we want them to be
        const unitsShort = ['tbsp', 'tbsp','oz', 'oz', 'tsp', 'tsp', 'cup', 'pound']
        //ES6 destructuring: ...unitsShort will append unitsShort elements to head of this array
        const units = [...unitsShort, 'kg', 'g'];

        /** loop over old ingredients, in each iteration we return a modified item
         * to new array
        */
        const newIngredients = this.ingredients.map(element => {

            /** Firstly, uniform units
             * we'll mutate _ingredient_ by replacing its instances of long units
             * with instances of short units
             */
            let ingredient = element.toLowerCase();
            unitsLong.forEach((currentUnit, i) => {
                //replace every instance of unitsLong with equivalent unitsShort name in the ingredient
                ingredient = ingredient.replace(currentUnit, unitsShort[i]);
            });

           /** Secondly, remove parentheses 
            * _try displaying without parentheses, does it mess up the formatting a lot?_
            * the regex expression replaces content inside brackets with empty string
           */
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            /** Thirdly, parse ingredients into count, unit, and ingredient 
             * test if theres a unit in the string; and if so, return index of unit in the array
             * 1) convert ingredient into an array of words via splitting ingredient by space
             * 2) _findIndex()_ operates on each element: it'll make a test using the callback fn
             * passed in;  what we're testing, is _includes()_ which returns true 
             * if element we pass in is in the unitsShort array, and returns false otherwise.
             * the _element_ that we pass in, is each of the words from the split ingredients array.
             * 3) findIndex() then 'catches' the position at which includes() returned true
            */
            const arrayIng = ingredient.split(' ');
            const unitIndex = arrayIng.findIndex(element2 => units.includes(element2));

            let objectIng;

            /** if we did find a unit in the array,
             * first we get everything before unit 
             * (which can be 4 1/2 cups, getting [4 1/2] into _arrayCount_)
             */
            if (unitIndex > -1) {

                const arrayCount = arrayIng.slice(0, unitIndex);
                let count;

                //if there's only one element before unit, we extract that quantity (count)
                if (arrayCount.length === 1) {
                    count = eval(arrayIng[0].replace('-', '+')); //.replace() is for rare edge cases of 1-1/3 cups
                } 

                //if there's more than one element, e.g. 4 1/2
                else {
                    //join 4 + 1/2, and _eval_ adds string's numerical values, e.g. 4.5
                    count = eval(arrayIng.slice(0, unitIndex).join('+'));
                }

                /** construct the new ingredient object, 
                 * _count_: quantity of this ingredient
                 * _unit_: which metric it's measured by (tablespoon, ounce, teaspoon, etc.)
                 * _ingredient_: the string of actual words that compose the ingredient
                */
                objectIng = {
                    count: count,
                    unit: arrayIng[unitIndex],
                    //ingredient words start after unit
                    ingredient: arrayIng.slice(unitIndex+1).join(' ')
                };

            } 

            /** if there's no unit, but first element is a number: e.g. 1 bread,
             * note number is always first index of ingredient
             * we extract the quantity as it is the first word in ingredient, 
             * no unit,
             * everything else is the text about ingredient, so extract all
             * excluding the first element (the numerical quantity)
             */
            else if (parseInt(arrayIng[0], 10)) {
                objectIng = {
                    count: parseInt(arrayIng[0], 10),
                    unit: '',
                    ingredient: arrayIng.slice(1).join(' ')
                }
            }

            /** if we did not find a unit in the array, nor a number at first element, */
            else if (unitIndex === -1) {
                objectIng = {
                    //since no number is specified, just provide a 1 by default...
                    count: 1,
                    unit: '',
                    //if no number nor unit, just get the entire ingredient
                    ingredient: ingredient
                }
            }
        
            return objectIng;
        });
        /** finally, we hold an array of newIngredients
         * where each ingredient is not a string but an objectIng,
         * where quantity (count), unit, and ingredient words are separated.
         */
        this.ingredients = newIngredients;
    }
    
    /** when + or - on the recipe is clicked, 
     * update the servings quantity and ingredients quantity
     * depending on if _type_ is the increase or decrease button
    */
    updateServings(type) {
        /** if type is decrease, -1; else + 1 */
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        /** update all the count numbers for ingredients:
         * multiply original servings by new servings, depending on if it increased or decreased
         */
        this.ingredients.forEach(ingredient => {
            ingredient.count = ingredient.count * (newServings / this.servings);
        });

        //update the servings property in recipe
        this.servings = newServings;
    }
}