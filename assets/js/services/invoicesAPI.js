import axios from "axios";
import { INVOICES_API } from "../config";

function findAll() {
    return axios
      .get(INVOICES_API)
      .then(response => response.data["hydra:member"]);
}

function deleteInvoice(id) {
    return axios
    .delete(INVOICES_API + "/" + id);
}

function find(id){
   return axios
    .get(INVOICES_API + "/" + id)
    .then(response => response.data);
}

function post(invoice){
    return axios.post(
        INVOICES_API,
        invoice
      );

}
function update(id, invoice){
   return axios.put(INVOICES_API + "/" + id, invoice);
}

export default{
    findAll,
    find,
    update,
    post,
    delete: deleteInvoice
};