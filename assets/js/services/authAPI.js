import axios from "axios";
import JWTdecode from "jwt-decode";

let token;
/**
 * Deconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requete http d'authentification et stockage du token dans localstorage et axios
 * @param {obj} credentials 
 */
function authenticate(credentials) {
    return axios.post("http://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {

            //Stock le token dans le localstorage
            window.localStorage.setItem("authToken", token);
            //On previent Axios qu'on a maintenant un header sur toute nos futurs requetes http
            setAxiosToken(token);

            return true;
            console.log(token)
        })
}

/**
 * Position le token JWT sur axios
 * @param {*} token 
 */
function setAxiosToken(token){
     //On previent Axios qu'on a maintenant un header sur toute nos futurs requetes http
    return  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */ 
function verifAccess() {
    //récupére le token en cours..
    const token = window.localStorage.getItem("authToken");
    if (token) {
        //vérifie si le token existe et vlide 
        const jwtdata = JWTdecode(token);
        if (jwtdata.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas 
 */
function isAuthenticated(){
       //récupére le token en cours..
       const token = window.localStorage.getItem("authToken");
       if (token) {
           //vérifie si le token existe et vlide 
           const jwtdata = JWTdecode(token);
           if (jwtdata.exp * 1000 > new Date().getTime()) {
               setAxiosToken(token);
               return true
           }else{
               return false;
           }
       }

       return false;

}


export default {
    authenticate,
    logout,
    verifAccess,
    isAuthenticated
}