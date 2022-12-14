const { Recipe, Diet } = require('../db');
const axios = require('axios');
const { API_KEY } = process.env;


//Función que se conecta a la API
const getApiInfo = async () => {
    //const apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}"&addRecipeInformation=true&number=100`);
    //const apiUrl = await axios.get(`https://spoonacular.com/food-api/docs#Authentication?apiKey=${API_KEY}"&addRecipeInformation=true&number=100`);
    const apiUrl = await axios.get('https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5');
    const apiInfo = await apiUrl.data.results.map(recipe => {
        return {
            id: recipe.id,                                                                              //id
            name: recipe.title,                                                                         //nombre
            summary: recipe.summary.split("<b>").join(" ").split("</b>").join(" ").split("<a href=").join("\n").split("</a>").join("\n").split(">").join("\n"),//resumen
            instructions: recipe.analyzedInstructions[0] ? 
            recipe.analyzedInstructions[0].steps.map((recipe, i) => `${i + 1}: ${recipe.step}`) : 
            ["No existen instrucciones para esta receta."],
            health_Score: recipe.healthScore,                                                           //puntaje de salud
            image: recipe.image,                                                                        //imagen
            diets: recipe.diets,                                                                         //dietas
            cuisines: recipe.cuisines                                                                         //dietas
        };
    });
    return apiInfo;
};
    

//Función que une las tablas 'Recipe' y 'Diet' de la DB
const getDbInfo = async () => {
    return await Recipe.findAll({
        include: {
            model: Diet,
            attributes: ['name'],
            through: {
                attributes: [],
            }
        }
    });
};


//Funcío que une la respuesta de la API con la unión de tablas de la DB
const getAllRecipes = async () => {
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const infoTotal = apiInfo.concat(dbInfo);
    return infoTotal;
};
//console.log(getAllRecipes());       //Genera una Promise


module.exports = {
    getAllRecipes
};