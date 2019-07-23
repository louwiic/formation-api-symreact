import React, { useState, useContext } from "react";
import AuthAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";
import Field from '../components/forms/Field';

const LoginPage = ({ history }) => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  //GESTION des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

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
      setError(
        "Aucun compte ne possède cette adresse ou alors les informations ne sont pas bonnes"
      );
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit} action="">
          <Field
            label="Adresse email"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Adresse email de connexion"
            error={error}
          />

          <Field
            label="Mot de passe"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            type="password"
            placeholder="Mot de passe"
            error=""
          />  

        <div className="form-group">
          <button type="submit " className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
