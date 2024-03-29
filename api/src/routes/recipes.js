const { Router } = require('express');
const { Recipe, Diet } = require('../db');
const { getAllRecipes } = require('../controllers/index.js');


const router = Router();


//Trae todas las recetas y las filtra por nombre
router.get('/', async (req, res) => {
    try {
        let recipesTotal = await getAllRecipes();
        const { name } = req.query;
        if (name) {
            let recipesName = await recipesTotal.filter(el => el.name.toLowerCase().includes(name.toLowerCase()));
            recipesName.length ?
            res.status(200).send(recipesName) :
            res.status(404).send('No está la receta.');
        }
        else {
            res.status(200).send(recipesTotal);
        }
    }
    catch (error) {
        //res.status(404).send('No se logró traer tu receta solicitada.');
        throw new Error('No se logró traer tu receta solicitada.' + error.message);
    }
});
//Hice un GET a http://localhost:3001/recipes para traer todas las recetas y filtra todas las que coincidan con el nombre




//Filtra las recetas por id pasado por params
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let recipesTotal = await getAllRecipes();
        if (id) {
            let recipesId = await recipesTotal.filter(el => el.id == id);
            recipesId.length ?
            res.status(200).json(recipesId) :
            res.status(404).send('No encontré ese personaje')
        }
    } catch (error) {
        //res.status(404).send('No se logró traer tu receta solicitada.');
        throw new Error('No se logró traer tu receta solicitada.' + error.message);
    }
});
//Hice un GET a http://localhost:3001/recipes/716426 para traer la receta por id



const findOrCreateDiets = async (diets) => {        //Función que permite guardar el array de diets que llega por req.body
    console.log(diets)
    try {
        let dietsCreate = await diets.map(async (e) => {
            return Diet.findOrCreate({
                where: {
                    name: e.toString()
                },
            });
        });
        let dietsDb = await Promise.all(dietsCreate); //[diet1,diet2]
        console.log(dietsDb)
        console.log('Se creo la dieta')
        return dietsDb;
    } catch (error) {
        throw new Error(error.message);
    }
};



//Crea una receta en la DB
router.post('/', async (req, res) => {
    try {
        const { name, health_Score, time, servings, image, diets, cuisines, ingredients, summary, instructions, createdInDb } = req.body;
        const newRecipe = await Recipe.create({
            name,
            health_Score, 
            time,
            servings,
            image,
            cuisines,
            ingredients,
            summary,
            instructions, 
            createdInDb
        });

        let dietsDb = await findOrCreateDiets(diets);
        dietsDb.forEach((e) => {
            newRecipe.addDiet(e[0]);
        });
        res.status(200).json("Receta creada");
    } catch (error) {
        throw new Error('No se logró crear tu receta.' + error.message);
    }
});
//Hice un GET a http://localhost:3001/recipes
//Luego un GET a http://localhost:3001/diets
//Hice un POST a http://localhost:3001/recipes con: { "name": "Carne asada", "summary": "Carne asada asada para la familia", "instructions": "1- Comprar la carne, 2- Cortar la carne, 3- Salar la carne, 4- Servir la carne, 5- Me da pereza lavar la loza", "health_Score":"20", "image":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.recepedia.com%2Fes-mx%2Freceta%2Fcarne%2F109068-carne-asada%2F&psig=AOvVaw15SXx71aMDiTMfAAck3lEX&ust=1670358666826000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMDW44mp4_sCFQAAAAAdAAAAABAE", "diets": "Primal" }



//Eliminar las recetas creadas en la DB
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRecipe = await Recipe.findByPk(id);
        await Recipe.destroy({
            where: { id: id },          //Donde el id de 'Recipe', sea igual al id pasado por params
        });
        res.status(200).json(deletedRecipe);
    } catch (error) {
        res.status(404).json("No se logró eliminar la receta indicada.", error);
    }
});
//Hice un DELETE a http://localhost:3001/recipes/e029bc97-9757-490a-b24c-c9889f73aa45 con: 
/*{ "name": "Carne asada deliciosa", "summary": "Carne asada para los familiares", "instructions": "1- Comprar la carne, 2- Cortar la carne, 3- Salar la carne, 4-Comer", "health_Score":"70", "image":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.recepedia.com%2Fes-mx%2Freceta%2Fcarne%2F109068-carne-asada%2F&psig=AOvVaw15SXx71aMDiTMfAAck3lEX&ust=1670358666826000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMDW44mp4_sCFQAAAAAdAAAAABAE", "diets": "Primal" }*/



//Modifica las recetas creadas en la DB
router.put('/:id', async function(req, res, next) {
    const receta = req.body;
    try {
      const result = await Recipe.update(
        {
            id: receta.id,
            name: receta.name,
            health_Score: receta.health_Score,
            time: receta.time,
            servings: receta.servings,
            image: receta.image,
            diets: receta.diets,
            cuisines: receta.cuisines,
            ingredients: receta.ingredients,
            summary: receta.summary,
            instructions: receta.instructions            
        },
        {where: {id: receta.id}}
      )
        return res.send(result);
    }
    catch (error) {
        next(error);
    };
});
//Hice un PUT a http://localhost:3001/recipes/e029bc97-9757-490a-b24c-c9889f73aa45 con: { "id": "7f27c7fd-aacf-40f4-9e64-b8acb93835ce", "name": "Carne asada deliciosa", "summary": "Carne asada para los familiares", "instructions": "1- Comprar la carne, 2- Cortar la carne, 3- Salar la carne, 4-Comer", "health_Score":"70", "image":"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.recepedia.com%2Fes-mx%2Freceta%2Fcarne%2F109068-carne-asada%2F&psig=AOvVaw15SXx71aMDiTMfAAck3lEX&ust=1670358666826000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCMDW44mp4_sCFQAAAAAdAAAAABAE", "diets": "Primal" }


module.exports = router;