import axios from 'axios'

const rest_url = 'http://localhost:3001/persons';
const create0 = (newObj) => createCust(rest_url, newObj)
const read = () => readCust(rest_url)
const update = (newObj, id) => updateCust(rest_url, newObj, id)
const del = (id) => delCust(rest_url, id)


const createCust = (url ,newObj) => {
    const request = axios.post(url, newObj)   
    return request.then(response => response.data)
}

const readCust = (url) => {
    const request = axios.get(url) 
    return request.then(response => response.data)
}

const updateCust = (url, newObj, id) => {
    const request = axios.put(`${url}/${id}`, newObj) 
    return request.then(response => response.data)
}

const delCust = (url, id) => {
    const request = axios.delete(`${url}/${id}`)  
    return request.then(response => response.data)
}

export default { read, create0, update, del }