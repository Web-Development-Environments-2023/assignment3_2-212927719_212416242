const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id) {
    await DButils.execQuery(`insert into favoriterecipes(user_id, recipe_id) values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id) {
    const recipes_id = await DButils.execQuery(`select recipe_id from favoriterecipes where user_id='${user_id}' order by date desc`);
    return recipes_id;
}

async function markAsWatched(user_id, recipe_id) {
    await DButils.execQuery(`insert into watchedrecipes(user_id, recipe_id) values ('${user_id}',${recipe_id})`);
}

async function getWatchedRecipes(user_id, limit) {
    return await DButils.execQuery(`select recipe_id from watchedrecipes where user_id='${user_id}' order by date desc limit ${limit}`);
}

async function getUserRecipes(user_id){
    return await DButils.execQuery(`select * from recipes where user_id='${user_id}'`);
}

module.exports = {getUserRecipes, markAsFavorite, getFavoriteRecipes, markAsWatched, getWatchedRecipes};