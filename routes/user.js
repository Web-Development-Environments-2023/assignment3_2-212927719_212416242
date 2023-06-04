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
