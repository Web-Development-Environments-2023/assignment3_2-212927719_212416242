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
    if (await user_utils.isFavorite(user_id, recipe_id)) {
      res.status(400).send("The Recipe already in favorite");
      return;
    }
    await user_utils.markAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");

  } catch (error) {
    next(error);
  }
});

router.post('/removeFavorite', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    if (!await user_utils.isFavorite(user_id, recipe_id)) {
      res.status(400).send("The Recipe is not in favorite");
      return;
    }
    await user_utils.unMarkAsFavorite(user_id, recipe_id);
    res.status(200).send("The Recipe successfully removed from favorite");
  } catch (error) {
    next(error);
  }
})


router.get('/favorites', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    api_recipes = [];
    DB_recipes = [];
    recipes_id.map((element) => {
      let id_recipe = element.recipe_id
      if (id_recipe.includes("_")) {
        DB_recipes.push(id_recipe)
      }
      else {
        api_recipes.push(id_recipe)
      }
    }); //extracting the recipe ids into array
    formatedDBRecipes = [];
    for (const recipe of DB_recipes) {
      recipe_id=recipe.split("_")[1];
      recipe_user_id=recipe.split("_")[0];
      DBRecipe = await user_utils.getUserRecipe(recipe_user_id,recipe_id);
      z=recipe_utils.formatDBrecipe(DBRecipe[0], recipe_user_id);
      formatedDBRecipes.push(z);
    }
    const api_results = await recipe_utils.getlistRecipesDetails(api_recipes);
    const all_recipes=formatedDBRecipes.concat(api_results.recipes)
    const return_json={
      amount:(api_results.amount+formatedDBRecipes.length),
      recipes: all_recipes
    };
    res.status(200).send(return_json);
  } catch (error) {
    next(error);
  }
});

router.post('/addToMeal', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    try {
      await user_utils.addToMeal(user_id, recipe_id);
      res.status(200).send("The Recipe successfully saved to meal");
    } catch (error) {
      res.status(200).send("The Recipe already in meal");
    }
  } catch (error) {
    next(error);
  }
})

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


router.post('/addWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    if (user_utils.isWatched(user_id, recipe_id)) {
      res.status(200).send("The Recipe already in watched");
    }
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
    const mainImage = req.body.mainImage;
    const time = req.body.time;
    const popularity = req.body.popularity;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const glutenFree = req.body.glutenFree;
    const numberOfPortions = req.body.numberOfPortions;
    const summary = req.body.summary;
    const instructions = JSON.stringify(req.body.instructions);
    const ingredients = JSON.stringify(req.body.ingredients);

    let x = await DButils.execQuery(
      `INSERT INTO recipes(name, image, time, popularity, vegan, vegetarian, glutenFree, numberOfPortions,\
         user_id, instructions, ingredients, summary) VALUES ('${name}', '${mainImage}', '${time}','${popularity}',\
          '${vegan}', '${vegetarian}', '${glutenFree}', '${numberOfPortions}', '${req.session.user_id}',\
           '${instructions}', '${ingredients}', '${summary}')`
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
    for (const recipe of recipes) {
      formatedRecipes.push(recipe_utils.formatDBrecipe(recipe, req.session.user_id));
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

router.get("/singlerecipe", async (req, res, next) => {
  try {
    const recipe_id = req.query.recipeid.split("_")[1];
    const user_id = req.query.recipeid.split("_")[0];
    const recipe = await user_utils.getUserRecipe(user_id, recipe_id);

    res.status(200).send(recipe_utils.formatDBrecipe(recipe[0], user_id));
  } catch (error) {
    next(error);
  }
});


router.get('/isWatched', async (req, res, next) => {
  try {
    const isWatched = await user_utils.isWatched(req.session.user_id, req.query.recipe_id)
    res.status(200).send(isWatched);
  } catch (error) {
    next(error);
  }
});

router.get('/isFavorite', async (req, res, next) => {
  try {
    const isFavorite = await user_utils.isFavorite(req.session.user_id, req.query.recipe_id)
    res.status(200).send(isFavorite);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
