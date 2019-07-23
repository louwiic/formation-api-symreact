import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params; //récupére le params dans l'url grâce à la props match

  const [invoice, setInvoice] = useState({
    amount: "",
    status: "SENT",
    customer: ""
  });
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  //récupération des clients
  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      console.log(error);
      toast.error("Impossible de charger les clients")
    }
  };
  //récupération des factures
  const fetchInvoice = async id => {
    try {
      const data = await InvoicesAPI.find(id);
      const { amount, customer, status } = data;
      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      console.log(error);
      history.replace("/invoices");
      toast.error("Impossible de charger les clients");
    }
  };
  // récupération de la liste des clients à chaque chargement des clients
  useEffect(() => {
    fetchCustomers();
  }, []);

  //récupération de la bonne facture quand l'iditenfiant change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  //récupére les valerus des inputs & met à jour le state
  const handleChange = ({ currentTarget }) => {
    const name = currentTarget.name;
    const value = currentTarget.value;

    setInvoice({ ...invoice, [name]: value });
    console.log(invoice);
  };

  /**
   * Gestion de la soumission du formulaire
   * @param {} event
   */
  const handleSubmit = async event => {
    event.preventDefault();

    //Copie du state pour ne modifier que le customer
    const Invoice = {
      ...invoice,
      customer: `/api/clients/${invoice.customer}`
    };

    if (editing) {
      const response = await InvoicesAPI.update(id, Invoice);
      toast.success("La facture a bien été modifiée")
      console.log(response);
    } else {
      try {
        const data = await InvoicesAPI.post(Invoice);
        toast.success("La facture a bien été crée")
        history.replace("/invoices");
      } catch (error) {
        //console.log(error.response);
        if (error.response.data.violations) {
          const apiErrors = {};
          error.response.data.violations.forEach(violation => {
            apiErrors[violation.propertyPath] = violation.message;
          });
          setErrors(apiErrors);
          toast.error("Des erreurs dans votre formulaires")

         }
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification d'un facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          <option defaultValue="440">Lucas Durand</option>
          <option value="441">Richard Jean</option>
          <option value="442">Michelle Galet</option>
        </Select>

        <Select
          name="status"
          label="Status"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyé</option>
          <option value="PAID">Payé</option>
          <option value="CANCELLED">Annulé</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
