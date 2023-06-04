const DButils = require("./DButils");

/**
 * Marks a recipe as a favorite for a given user in the database.
 * @param {number} user_id - The ID of the user who is marking the recipe as a favorite.
 * @param {number} recipe_id - The ID of the recipe being marked as a favorite.
 * @returns None
 */
async function markAsFavorite(user_id, recipe_id) {
    await DButils.execQuery(`insert into favoriterecipes(user_id, recipe_id) values ('${user_id}',${recipe_id})`);
}

/**
 * Retrieves the IDs of the favorite recipes for the given user ID from the database.
 * @param {number} user_id - The ID of the user whose favorite recipes are being retrieved.
 * @returns {Promise<Array<number>>} - A promise that resolves to an array of recipe IDs.
 */
async function getFavoriteRecipes(user_id) {
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}' order by date desc`);
    return recipes_id;
}

/**
 * Marks a recipe as watched for a given user in the database.
 * @param {number} user_id - The ID of the user who watched the recipe.
 * @param {number} recipe_id - The ID of the recipe that was watched.
 */
async function markAsWatched(user_id, recipe_id) {
    await DButils.execQuery(`insert into watchedrecipes(user_id, recipe_id) values ('${user_id}',${recipe_id})`);
}

/**
 * Retrieves the most recently watched recipes for a given user.
 * @param {number} user_id - The ID of the user whose watched recipes are being retrieved.
 * @param {number} limit - The maximum number of watched recipes to retrieve.
 * @returns {Promise<Array>} - A promise that resolves to an array of recipe IDs.
 */
async function getWatchedRecipes(user_id, limit) {
    return await DButils.execQuery(`select recipe_id from watchedrecipes where user_id='${user_id}' order by date desc limit ${limit}`);
}

/**
 * Retrieves all recipes associated with the given user ID from the database.
 * @param {string} user_id - The ID of the user whose recipes are being retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of recipe objects.
 */
async function getUserRecipes(user_id){
    return await DButils.execQuery(`select * from recipes where user_id='${user_id}'`);
}

/**
 * Adds a recipe to the user's meal plan.
 * @param {number} user_id - The ID of the user.
 * @param {number} recipe_id - The ID of the recipe to add.
 */
async function addToMeal(user_id, recipe_id) {
    await DButils.execQuery(`insert into meals(user_id, recipe_id) values ('${user_id}',${recipe_id})`);
}

/**
 * Retrieves the recipe IDs of all meals associated with the given user ID from the database.
 * @param {number} user_id - The ID of the user whose meal recipes are being retrieved.
 * @returns {Promise<Array<number>>} - A promise that resolves to an array of recipe IDs.
 */
async function getMealRecipes(user_id) {
    return await DButils.execQuery(`select recipe_id from meals where user_id='${user_id}'`);
}


module.exports = {getUserRecipes, markAsFavorite, getFavoriteRecipes, markAsWatched, getWatchedRecipes, addToMeal, getMealRecipes};