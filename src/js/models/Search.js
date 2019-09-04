import axios from 'axios'; //used for AJAX calls, fetching information from APIs
import { key } from '../config';

/**
 * default export vs named exports: if name is not supplied, any name is used when imported in another file
 */

export default class Search {

    /**
     * @param query is what we need when we create an instance of Search
     * e.g. new Search('pizza') */
    constructor(query) {
        this.query = query;
    }

    /** method to get results for search query; 
     * an async function automatically returns a promise
     */

    async getResults() {

        try {
            /** axios:
             * fetching and converting with .json happens in one step rather than 2 separate like fetch
             * API call syntax: is on food2fork.com => browse => api, 
             * site name followed http request with documented search data syntax: /api/search?field= ...
             * axios will return a promise, so we need to await and save into a constant. */
            const result = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            //a limit of only 50 API calls a day, ran out so result isn't received properly
            console.log(result);
            //we want to save the recipes array inside the Search object, encapsulationnn
            this.result = result.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}
