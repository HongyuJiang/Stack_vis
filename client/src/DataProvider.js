import axios from 'axios';

export default class DataProvider {
    static getStackData() {

        return axios.get('/static/stack2.json');
    }

}