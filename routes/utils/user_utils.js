const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id) {
    await DButils.execQuery(`insert into favoriterecipes(user_id, recipe_id) values ('${user_id}','${recipe_id}')`);
}

async function unMarkAsFavorite(user_id, recipe_id) {
    await DButils.execQuery(`delete from favoriterecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
}

async function getFavoriteRecipes(user_id) {
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}' order by date desc`);
    return recipes_id;
}


async function markAsWatched(user_id, recipe_id) {
    await DButils.execQuery(`insert into watchedrecipes(user_id, recipe_id) values ('${user_id}','${recipe_id}')`);
}

async function getWatchedRecipes(user_id, limit) {
    return await DButils.execQuery(`select recipe_id from watchedrecipes where user_id='${user_id}' order by date desc limit ${limit}`);
}

async function getUserRecipes(user_id) {
    return await DButils.execQuery(`select * from recipes where user_id='${user_id}'`);
}

async function getUserRecipe(user_id, recipe_id) {
    return await DButils.execQuery(`select * from recipes where user_id='${user_id}' and id='${recipe_id}'`);
}

async function addToMeal(user_id, recipe_id) {
    await DButils.execQuery(`insert into meals(user_id, recipe_id) values ('${user_id}','${recipe_id}')`);
}

async function getMealRecipes(user_id) {
    return await DButils.execQuery(`select recipe_id from meals where user_id='${user_id}'`);
}

async function isWatched(user_id, recipe_id) {
    let watched = await DButils.execQuery(`select * from watchedrecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    return watched.length > 0;
}

async function isFavorite(user_id, recipe_id) {
    let favorite = await DButils.execQuery(`select * from favoriterecipes where user_id='${user_id}' and recipe_id='${recipe_id}'`);
    return favorite.length > 0;
}

module.exports = { getUserRecipes, markAsFavorite, unMarkAsFavorite, getFavoriteRecipes, markAsWatched, getWatchedRecipes, addToMeal, getMealRecipes, isWatched, isFavorite, getUserRecipe };