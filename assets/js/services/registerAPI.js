import React from 'react';
import axios from 'axios';
import { UTILISATEURS_API } from '../config';

function create(user) {
    return axios.post(
        UTILISATEURS_API,
        user
    );

}

export default {
    create
}