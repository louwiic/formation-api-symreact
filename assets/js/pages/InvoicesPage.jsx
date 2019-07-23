import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import InvoicesAPI from "../services/invoicesAPI";
import {Link} from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger"
};

const STATS_LABELS = {
  PAID: "payé",
  SENT: "envoyé",
  CANCELLED: "Annulée"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 10; //Elément affiché par page
  const [loading, setLoading] = useState(true);

  //Gestion du format de date 
  const formatDate = str => {
    return moment(str).format("DD/MM/YYYY");
  }

  //Récupération des invoics
  const fetchInvoices = async () => {
    try {
      const data = await InvoicesAPI.findAll(); 
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Erreurs lors du chargement des factures");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  //Gestion du changement de page
  const handlePageChange = page => {
    setCurrentPage(page);
  };

  //Gestion de la recherche
   const filteredInvoices = invoices.filter(
      i =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().startsWith(search.toLocaleLowerCase()) ||
      STATS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()) 
  );

  //Gestion de la recherche & raméne à la page une pour le resultat
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  //Gestion de la suppression
  const handleDelete = async (id) => {
      const originalInvoices = [...invoices];
      setInvoices(invoices.filter(invoice => invoice.id !== id)); 
      try {
        await InvoicesAPI.delete(id)
        toast.success("La facture a bien été supprimée !");
          
      } catch (error) {
          console.log(error)
          setInvoices(originalInvoices);
          toast.error("Une erreur est survenue !");
      }
  }

  //pagination des données
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );
  
  
  return (
    <>
  
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link to="/invoices/new" className="btn btn-primary">
          Créer une facture
        </Link>
      </div>
      <input
        type="text"
        onChange={handleSearch}
        value={search}
        className="form-control"
        placeholder="Rechercher ..."
      />
      {!loading && (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                {invoice.customer.lastName} {invoice.customer.firstName}
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span
                  className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                >
                  {STATS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} €
              </td>
              <td>
                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                <button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>)}
      {loading && (<TableLoader />)}

      <Pagination
        currentPage={currentPage}
        length={filteredInvoices.length}
        itemsPerPage={itemsPerPage}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default InvoicesPage;
