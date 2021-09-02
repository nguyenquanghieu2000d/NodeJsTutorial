// /api/theloais

const axiosClient = require('./axiosClient');
const GiangVienApi = {
    post: (info) => {
        const url = '/api/giangvien';
        return axiosClient.post(url, info)
    },
    put: (info) => {
        const url = '/api/giangvien/' + info.id;
        return axiosClient.put(url, info)
    },
    delete:(id) => {
        const url = '/api/giangvien/' + id;
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

module.exports = GiangVienApi;