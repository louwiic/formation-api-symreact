import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from '../components/pagination';

const customersPageWithPagination = propos => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage =  8; //Elément affiché par page
  const paginatedCustomers = Pagination.getData(customers, currentPage,itemsPerPage)

  /**
   * Prend en paramétre une fonction à lancé lorsque quelque chose
   * se passe
   * 2éme param un tableau qui contient la variable qu'on surveille
   */
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
      .then(response => {
          setCustomers(response.data["hydra:member"]);
          setTotalItems(response.data["hydra:totalItems"]);
      })
      .catch(error => console.log(error.response));
  }, [currentPage]);

  const handleDelete = id => {
    //1- Fait une copie du tableau au cas ou si la suppresion echoue "error server"
    const originalCustomers = [...customers];

    //2- On soustrait l'élément du tableau immédiatement pour l'utilisateur, pour ça on enleve de l'array l'id supprimé
    setCustomers(customers.filter(customer => customer.id !== id));
    axios
      .delete("http://127.0.0.1:8000/api/customers/" + id)
      .then(response => console.log("ok"))
      .catch(error => {
        setCustomers(originalCustomers); // On remet la copie en cas d'échec
        console.log(error.response);
      });
  };

  const handlePageChange = (page) => {
      setCustomers([]);
      setCurrentPage(page);
  }
 
  return (
    <>
      <h1>Liste des clients (pagination)</h1>
      <table className="table">
        <thead>
          <tr>
            <th>L'identifiant</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th>Factures</th>
            <th>Montant total</th>
            <th />
          </tr>
        </thead>
        <tbody>
            {customers.length === 0 && (
                <tr>
                    <td>chargement ...</td>
                </tr>
            )}
          {customers.map(customer => (
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
      <Pagination currentPage={currentPage} itemsPerPage={ itemsPerPage } length={totalItems} onPageChanged={handlePageChange} />
     
    </>
  );
};

export default customersPageWithPagination;
