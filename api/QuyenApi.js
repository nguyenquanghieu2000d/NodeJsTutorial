// /api/theloais

const axiosClient = require('./axiosClient');
const QuyenApi = {
    post: (info) => {
        const url = '/api/quyen';
        return axiosClient.post(url, info)
    },
    get: (id) => {
        let url;
        if (id === undefined)
            url = "/api/quyen";
        else
            url = "/api/quyen/" + id;
        return axiosClient.get(url);
    },
    put: (info) => {
        const url = '/api/sinhvien/' + info.id;
        return axiosClient.put(url, info)
    },
    delete: (id) => {
            const url = '/api/sinhvien/' + id;
            return axiosClient.delete(url);
        }
        // getAllUsers: () => {
        //     const url = "/api/"
        //     return axiosClient.get(url)
        // },
        // logout: (username) => {
        //     const url = "/api/user/logout";
        //     return axiosClient.get(url, { params: username });
        // }
}

module.exports = QuyenApi;