// /api/theloais

const axiosClient = require('./axiosClient');
const AdminApi = {
    post: (info) => {
        const url = '/api/admin';
        return axiosClient.post(url, info)
    },
    // getAllUsers: () => {
    //     const url = "/api/"
    //     return axiosClient.get(url)
    // },
    // logout: (username) => {
    //     const url = "/api/user/logout";
    //     return axiosClient.get(url, { params: username });
    // }
}

module.exports = AdminApi;