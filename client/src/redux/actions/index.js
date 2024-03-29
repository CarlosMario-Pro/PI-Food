import axios from 'axios';


//Trae todas las recetas cuando se monta la 'Home'
export function getRecipes(){
    return async function (dispatch) {
        const json = await axios.get('/recipes');
        return dispatch({ type: 'GET_RECIPES', payload: json.data });
    };
};


//Trae las recetas cuando se buscan en la Searchbar
export function getNameRecipes(name) {                                                              //name es el payload
    return async function (dispatch) {
        try {
            let json = await axios.get('/recipes?name=' + name);               //Por payload llega el nombre, que es lo que es usuario escribe en la barra de búsqueda
            return dispatch ({type: 'GET_NAME_RECIPES', payload: json.data });
        } catch (error) {
            console.log(error);
        }
    };
};


//Se usa en la Searchbar para traer la receta con el 'id' pasado por params
export function getRecipesDetails(id){
    return async function (dispatch){
        try{
            const jsonRecipesDetails = await axios.get(`/recipes/${id}`);      //Si funciona, trae la info con el id
            return dispatch({ type: 'GET_RECIPES_DETAILS', payload: jsonRecipesDetails.data });
        } catch(error){
        console.log("Este es el error de getRecipesDetails" + error);
        }
    };
};


//Ordena alfabéticamente las recetas de forma ascendente o descendentemente 
export function orderByNames(order){ 
    return{ type: 'ORDER_BY_NAME', payload: order };
};


//Ordena las recetas por healt score
export function orderByHealthScore(order){
    return{ type: 'ORDER_BY_SCORE', payload: order };
};


//Ordena las recetas por puntaje de favoritos
export function orderByFavorites(order){
    return{ type: 'ORDER_BY_FAVORITES', payload: order };
};


//Ordena las recetas por tiempo
export function orderByTime(order){
    return{ type: 'ORDER_BY_TIME', payload: order };
};



//Filtra por cocina y dietas cuando se selecciona alguna
export const filterByDiet = (payload) =>{
    return { type: 'FILTER_BY_CUISINE_AND_DIET', payload: payload }
};


//Este esta filtrado para traer solo el name
export function getdiets(){                           
    return async function (dispatch) {
        const info = await axios.get('/diets');
        return dispatch({ type: 'GET_DIETS', payload: info.data });
    };
};


//Crea las recetas en la DB
export function postRecipes(payload){                                                               //Se pasa un payload que es el vr a crear en la DB
    return async function (dispatch) {
        const response = await axios.post('/recipes', payload);                //En la ruta queremos hacer el post de payload, por eso se pasa
        window.location.href = 'http://localhost:3000/home';
        dispatch({ type: 'RELOAD_RECIPES', payload: payload.id });                                  //Pedir la nueva receta porque en este momento, ya se tuve que crear en la DB con el post, el payload tiene todos los datos del estado que crea la receta, pero solo me quedo con el 'id' para buscarlo
        return response;                                                                            //No se usa el dispatch en las rutas tipo post
    };
};


//Elimina las recetas creadas
export function deleteRecipe(id) {
    return async function (dispatch) {
      const response = await axios.delete(`/recipes/${id}`);
      return dispatch({ type: 'DELETE_RECIPE', payload: response.data });
    };
};


//Modifica las recetas creadas
export const updateRecipe = (id, payload) => {
    return async (dispatch) => {
        const response = await axios.put(`/recipes/${id}`, payload);
        window.location.href = 'http://localhost:3000/home';
        return dispatch({ type: 'UPDATE_RECIPE', payload: response.data });
    };
};