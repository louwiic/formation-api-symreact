import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import axios from "axios";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({history, match}) => {
  const { id } = match.params;
  //Récupération du customer en finction de l'identifiant
  const fetchCustomer = async id => {
    try {
      const {firstName, lastName, email, company} = await CustomersAPI.find(id);
      setCustomer({firstName, lastName, email, company });

    } catch (error) {
      console.log(error.response);
      history.replace("/customers");
      //Notification flash d'une erreur
    }
  };

  const [customer, setCustomer] = useState({
    email: "",
    firstName: "Loïc",
    lastName: "Batonnet",
    company: ""
  });

  const [editing, setEditing] = useState(false);

  //Chargement du customer si besoin au chargement du composant ou au changement de l'identifiant 
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
     
    }
  }, [id]);
  //State qui gére les erreurs dans le formulaire
  const [error, setError] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: ""
  });

  //récupére les valerus des inputs & met à jour le state
  const handleChange = ({ currentTarget }) => {
    const name = currentTarget.name;
    const value = currentTarget.value;
    setCustomer({ ...customer, [name]: value });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
        if(editing){
            await CustomersAPI.update(id, customer);
            //TODO: Flash notification de succès
        }else{
            await CustomersAPI.create(customer);
            history.replace("/customers");
        }

      setError("");
    } catch (error) {
      if (error.response.data.violations) {
          const apiErrors = {};
          error.response.data.violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setError(apiErrors);
        //Notif des erreurs
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}
      <form action="post" onSubmit={handleSubmit}>
        <Field
          onChange={handleChange}
          name="lastName"
          label="Nom de famille"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          error={error.lastName}
        />
        <Field
          error={error.firstName}
          onChange={handleChange}
          value={customer.firstName}
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client"
        />
        <Field
          error={error.email}
          onChange={handleChange}
          value={customer.email}
          type="email"
          name="email"
          label="Email"
          placeholder="Adresse email du client"
        />
        <Field
          onChange={handleChange}
          value={customer.company}
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
