import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import registerAPI from "../services/registerAPI";
import { toast } from "react-toastify";

const Register = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  //récupére les valerus des inputs & met à jour le state
  const handleChange = ({ currentTarget }) => {
    const name = currentTarget.name;
    const value = currentTarget.value;

    setUser({ ...user, [name]: value });
    console.log(user);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = { };

    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
        setErrors(apiErrors); 
        toast.error("Des erreurs dans votre formulaires !");
        return;
    }

    try {
      const response = await registerAPI.create(user);
      //console.log(response);
      setErrors({});
      toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !");
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
      toast.error("Des erreurs dans votre formulaires !");
    }
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />

        <Field
          name="lastName"
          label="Nom"
          placeholder="Votre nom"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="L'email"
          type="email"
          placeholder="Votre email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Confirmer votre mot de passe"
          type="password"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je m'inscris
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default Register;
