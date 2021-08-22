const mysql = require('mysql');
const dotenv = require("dotenv");
const e = require("express");
dotenv.config();

let instance = null;

const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,

    // port: process.env.DB_PORT
});

con.connect((err) => {
    if (err) throw err;
    else console.log("db " + con.state);
});


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService()
    }


    async insertNewData(username, password, hoten) {
        try {
            const dateAdded = new Date();
            const response = await new Promise(((resolve, reject) => {
                const query = "INSERT INTO user (username, password, hoten) VALUES (?,?, ?);";
                con.query(query, [username, password, hoten], (err, results) => {
                    if(err) reject(new Error(err.message));
                    else resolve(results);
                } )
            }));
        } catch (err) {
            console.log(err);
        }
    }

    async getAllData() {
        try {
            console.log(instance)
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM user";
                con.query(query, (err, results) => {
                    if (err) reject(new Error(err.message))
                    resolve(results);
                });
            });
            console.log(response);
            return response;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = DbService;