var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const { format } = require("morgan");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * Marks a recipe as a favorite for the current user.
 */
router.post('/addFavorite', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
  } catch (error) {
    next(error);
  }
})


/**
 * Async function that retrieves the favorite recipes of a user and sends the details of those recipes
 * in the response.
 */
router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getlistRecipesDetails(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * Async function that adds a recipe to a user's meal plan.
 */
router.post('/addToMeal', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.addToMeal(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved to meal");
  } catch (error) {
    next(error);
  }
})

/**
 * Async function that retrieves the meal recipes for the current user and sends the
 * recipe details as a response.
 */
router.get('/mealRecipes', async (req, res, next) => {
  try {
    const recipes_id = await user_utils.getMealRecipes(req.session.user_id);
    recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getlistRecipesDetails(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});


/**
 * Marks a recipe as watched for the current user.
 */
router.post('/addWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsWatched(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as watched");
  } catch (error) {
    next(error);
  }
})



/**
 * Async function that retrieves the watched recipes for the current user and returns
 * the details of those recipes.
 */
router.get('/lastWatchRecipes', async (req, res, next) => {
  try {
    const recipes_id = await user_utils.getWatchedRecipes(req.session.user_id, req.query.limit);
    recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getlistRecipesDetails(recipes_id_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});



/**
 * Handles a POST request to create a new recipe in the database.
 * @param {Object} req - The request object containing the recipe information in the body.
 * @param {string} req.body.name - The name of the recipe.
 * @param {string} req.body.mainImage.path - The path to the main image of the recipe.
 * @param {number} req.body.time - The time it takes to make the recipe.
 * @param {number} req.body.popularity - The popularity of the recipe.
 * @param {boolean} req.body.vegan - Whether or not the recipe is vegan.
 * @param {boolean} req.body.vegetarian - Whether or not the recipe is vegetarian.
 * @
 */
router.post("/singlerecipe", async (req, res, next) => {
  try {
    const name = req.body.name;
    const mainImage = req.body.mainImage.path;
    const time = req.body.time;
    const popularity = req.body.popularity;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const glutenFree = req.body.glutenFree;
    const numberOfPortions = req.body.numberOfPortions;
    const instructions = JSON.stringify(req.body.instructions);
    const ingredients = JSON.stringify(req.body.ingredients);
    
    let x = await DButils.execQuery(
      `INSERT INTO recipes(name, image, time, popularity, vegan, vegetarian, glutenFree, numberOfPortions,\
         userId, instructions, ingredients) VALUES ('${name}', '${mainImage}', '${time}','${popularity}',\
          '${vegan}', '${vegetarian}', '${glutenFree}', '${numberOfPortions}', '${req.session.user_id}',\
           '${instructions}', '${ingredients}')`
    );
    res.status(201).send({ message: "recipe created", success: true });
  } catch (error) {
    next(error);
  }
});

/**
 * GET request handler for retrieving all recipes associated with the current user.
  */
router.get('/myRecipes', async (req, res, next) => {
  try {
    const recipes = await user_utils.getUserRecipes(req.session.user_id);
    formatedRecipes = [];
    for (const recipe of recipes){
      formatedRecipes.push({
        id: recipe.id,
        recipe: {
            mainImage: recipe.image,
            name: recipe.name,
            time: recipe.time,
            popularity: recipe.popularity,
            vegan: recipe.vegan,
            vegetarian: recipe.vegetarian,
            glutenFree: recipe.glutenFree,
            numberOfPortions: recipe.numberOfPortions,
            ingredients: JSON.parse(recipe.ingredients),
            instructions: JSON.parse(recipe.instructions)
        }
      });
    }
    returnJson = {
      amount: recipes.length,
      recipes: formatedRecipes
    };
    res.status(200).send(returnJson);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
