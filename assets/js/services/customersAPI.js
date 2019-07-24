import axios from "axios";
import Cache from "../services/cache";
import {CUSTOMERS_API, CLIENTS_API} from "../config";

async function findAll() {

    const cachedCustomers = await Cache.get("customers");
    
    if (cachedCustomers) {
        return cachedCustomers;
    }
    return axios
        .get(CUSTOMERS_API)
        .then(response => {
            const customers = response.data["hydra:member"]
            Cache.set("customers", customers);
            return customers;
        });
}

function deleteCustomer(id) {
    return axios
        .delete(CUSTOMERS_API + "/" + id).then(async response => {

            const cachedCustomers = await Cache.get("customers");
            if (cachedCustomers) {
                Cache.set("customers", cachedCustomers.filter(i => i.id !== id));
            }
            return response;
        })
}

async function find(id) {
    const cachedCustomers = await Cache.get("customers." + id);
    if (cachedCustomers) {
        return cachedCustomers;
    }

    return axios
        .get(CLIENTS_API+ "/" + id)
        .then(response => {

            const customer = response.data;
            Cache.set("customers." + id, customer);

            return customer;
        });
}

function update(id, customer) {

    return axios.put(CUSTOMERS_API + "/"+ id, customer).then(async response => {
        const cachedCustomers = await Cache.get("customers");
        const cachedCustomer = await Cache.get("customers." +id);

        if(cachedCustomer){
            Cache.set("customers." + id, response.data);
            
        }
        if(cachedCustomers)  {
            const index = cachedCustomers.findIndex(c => c.id === +id);
            cachedCustomers[index] = response.data;
        }

        return response;

    });
}

function create(customer) {
    return axios.post(CUSTOMERS_API, customer).then(async response => {

        const cachedCustomers = await Cache.get("customers");
        const data = [...cachedCustomers, response.data];

        if (cachedCustomers) {
            Cache.set("customers", data);
        }

        return response;

    });
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteCustomer
};