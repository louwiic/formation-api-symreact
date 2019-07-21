import React, { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import CustomersAPI from "../services/customersAPI";

const CustomersPage = propos => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  /**
   * Au chargement du composant recupére les customers
   * Prend en paramétre une fonction à lancé lorsque quelque chose
   * se passe
   * 2éme param un tableau qui contient la variable qu'on surveille
   */
  useEffect(() => {
    fetchCustomers();
  }, []);

  //Gestion de la suppression d'un customer
  const handleDelete = async id => {
    //1- Fait une copie du tableau au cas ou si la suppresion echoue "error server"
    const originalCustomers = [...customers];

    //2- On soustrait l'élément du tableau immédiatement pour l'utilisateur, pour ça on enleve de l'array l'id supprimé
    setCustomers(customers.filter(customer => customer.id !== id));
    try {
      await CustomersAPI.delete(id);
    } catch (error) {
      setCustomers(originalCustomers);
      console.log(error.response);
    }
    //Deuxime façon de faire requete traitemetn de promise
    /*CustomersAPI.delete(id)
      .then(response => console.log("ok"))
      .catch(error => {
        setCustomers(originalCustomers); // On remet la copie en cas d'échec
        console.log(error.response);
      });*/
  };


  //Gestion du changement de page
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const itemsPerPage = 8; //Elément affiché par page
  //filtrage des customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    c =>
      c.firstName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );
  //pagination des données
  const paginatedCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des clients</h1>
      <input
        type="text"
        onChange={handleSearch}
        value={search}
        className="form-control"
        placeholder="Rechercher ..."
      />
      <table className="table">
        <thead>
          <tr>
            <th>L'identifiant</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th />
            <th>Factures</th>
            <th>Montant total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedCustomers.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}
                </a>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td>{customer.invoice}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} €
              </td>
              <td className="text-center">
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
