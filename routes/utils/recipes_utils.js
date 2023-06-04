const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


/**
 * Retrieves recipe details for a given recipe ID from the Spoonacular API.
 * @param {number} recipe_id - The ID of the recipe to retrieve details for.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the formatted recipe details.
 */
async function getRecipeDetails(recipe_id) {
    let recipe_info = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return formatrecipe(recipe_info.data)
}

/**
 * Retrieves details for a list of recipes from the Spoonacular API.
 * @param {Array} ids - An array of recipe IDs to retrieve details for.
 * @returns {Promise} A promise that resolves to a formatted list of recipe details.
 */
async function getlistRecipesDetails(ids) {
    let recipes_info = await axios.get(`${api_domain}/informationBulk`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,
            ids: ids.join()
        }
    });
    return formatListOfRecipes(recipes_info.data);
}

/**
 * Retrieves a specified amount of random recipe details from the Spoonacular API.
 * @param {number} amount - The number of recipe details to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of formatted recipe details.
 */
async function getRandomDetails(amount) {
    let recipes_info = await axios.get(`${api_domain}/random`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,
            number: amount
        }
    });
    return formatListOfRecipes(recipes_info.data.recipes);
}

/**
 * Retrieves the analyzed instructions for a given recipe ID from the Spoonacular API.
 * @param {number} recipe_id - The ID of the recipe to retrieve instructions for.
 * @returns {Promise} A promise that resolves with the analyzed instructions for the recipe.
 */
async function getRecipeInstrctions(recipe_id) {
    let recipe =  await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
        }
    });
    return recipe.data;
}

/**
 * Retrieves recipe details for a given search query, cuisine, diet, and intolerances.
 * @param {string} query - The search query for the recipe.
 * @param {number} limit - The maximum number of recipes to retrieve.
 * @param {string} cuisine - The cuisine type to filter the recipes by.
 * @param {string} diet - The diet type to filter the recipes by.
 * @param {string} intolerances - The intolerances to filter the recipes by.
 * @returns {Promise} A promise that resolves to an array of recipe details.
 */
async function getSearchedRecipesDetails(query, limit, cuisine, diet, intolerances) {
    let recipes_info = await axios.get(`${api_domain}/complexSearch`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey,
            number: limit,
            cuisine: cuisine,
            diet: diet,
            intolerances: intolerances,
            query: query
        }
    });
    ids = [];
    const x = recipes_info.data.results;
    x.map((element) => ids.push(element.id)); //extracting the recipe ids into array
    return getlistRecipesDetails(ids);
}

/**
 * Formats a list of recipes by calling the formatrecipe function on each recipe in the list.
 * @param {Array} listOfRecipes - the list of recipes to format
 * @returns An object containing the amount of recipes and the formatted recipes.
 */
function formatListOfRecipes(listOfRecipes) {
    formatedRecipes = []
    for (const recipe of listOfRecipes) {
        formatedRecipes.push(formatrecipe(recipe));
    }
    return {
        amount: listOfRecipes.length,
        recipes: formatedRecipes
    };
}

/**
 * Formats an array of ingredient objects into a new array of objects with the ingredient name and amount.
 * @param {Array} extendedIngredients - An array of ingredient objects.
 * @returns {Array} An array of objects with the ingredient name and amount.
 */
function formatIngredients(extendedIngredients) {
    let ingridients = []
    for (const ingredientObj of extendedIngredients) {
        let measure = ingredientObj.measures.metric;
        ingridients.push({
            ingridient: ingredientObj.name,
            amount: {
                amount: measure.amount,
                unit: measure.unitLong
            }
        })
    }
    return ingridients;
}

/**
 * Formats recipe data into a more readable format.
 * @param {Object} recipe_data - The recipe data to format.
 * @returns {Object} - An object containing the formatted recipe data.
 */
function formatrecipe(recipe_data) {
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, servings, instructions } = recipe_data;
    let listOfIngredients = formatIngredients(extendedIngredients);
    if (instructions != null)
        instructions = instructions.split(". ")
    return {
        id: id,
        recipe: {
            mainImage: image,
            name: title,
            time: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree,
            numberOfPortions: servings,
            instructions: instructions,
            ingredients: listOfIngredients
        }
    }
}

module.exports = { getRecipeDetails, getRandomDetails, getlistRecipesDetails, getSearchedRecipesDetails, getRecipeInstrctions };