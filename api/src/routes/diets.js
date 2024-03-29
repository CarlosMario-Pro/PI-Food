const { Router } = require("express");
const { Diet } = require("../db.js");

const router = Router();


//Guardo en un array los tipos de dietas de la página 'spoonacular'
const typesDiets = [
  "gluten free",
  "ketogenic",
  "vegetarian",
  "lacto ovo vegetarian",
  "vegan",
  "pescatarian",
  "paleo",
  "primal",
  "low fodmap",
  "whole30",
];


router.get("/", async (req, res) => {
    try {
        typesDiets.map((type) => {                  //Mapeo 'typesDiets', donde 'type' representa cada dieta del array
            Diet.findOrCreate({                     //En 'Diet' busca o crea
                where: { name: type }               //Donde a la propiedad 'name' se le asigna el 'type' de dieta del array
            });
        });
        const diets = await Diet.findAll();         //Esto trae toda la información
        res.status(200).send(diets);                //Responde con todo lo que se trae de la tabla 'Diet' de la DB

    } catch (error) {
        //res.status(404).send('No se logró traer tu dieta solicitada.');
        throw new Error('No se logró traer tu dieta solicitada.' + error.message);
    }
});


module.exports = router;