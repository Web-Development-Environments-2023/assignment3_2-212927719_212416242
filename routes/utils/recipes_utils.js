const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";


async function getRecipeDetails(recipe_id) {
    let recipe_info = await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return formatrecipe(recipe_info.data)
}

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

async function getRecipeInstrctions(recipe_id) {
    let recipe =  await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            apiKey: process.env.spooncular_apiKey,
        }
    });
    return recipe.data;
}

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