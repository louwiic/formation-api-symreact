
import React, { useState, useContext} from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from '../context/AuthContext'
const LoginPage = ({history}) => {

  const {isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
         username: "",
         password: ""
    });

    const [error, setError] = useState("");
    //GESTION des champs
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({ ...credentials, [name]: value})
    }

    //Gestion du submit
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true); 
            history.replace("/customers");
        } catch (error) {
            console.log(error.response);
            setError("Aucun compte ne possède cette adresse ou alors les informations ne sont pas bonnes");
        }
    }

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit} action="">
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            id="username"
            name="username"
            type="email"
            placeholder="Adresse email de connexion"
            className={"form-control" + (error && " is-invalid")}
          />
          {error && <p className="invalid-feedback">{error}</p>}
          
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handleChange}
            id="password"
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="form-control"
          />
        </div>
        
         <div className="form-group">
             <button type="submit " className="btn btn-success">Je me connecte</button>
         </div>
      </form>
    </>
  );
};

export default LoginPage;
