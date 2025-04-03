const db = require('../services/db');
const bcrypt = require('bcryptjs');

class User {
    id;
    email;

    constructor(email) {
        this.email = email;
    }

    async getIdFromEmail() {
        console.log("Executing getIdFromEmail with email:", this.email); // Debugging email retrieval
        const sql = "SELECT user_id FROM user WHERE email = ?";
        const result = await db.query(sql, [this.email]);
        console.log("Query Result in getIdFromEmail:", result); // Debugging query result
        if (result.length > 0) {
            this.id = result[0].user_id;
            return this.id;
        } else {
            return false;
        }
    }

    async setUserPassword(password) {
        const pw = await bcrypt.hash(password, 10);
        const sql = "UPDATE user SET password = ? WHERE user_id = ?";
        await db.query(sql, [pw, this.id]);
        return true;
    }

    async addUser(password) {
        const pw = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO user (email, password) VALUES (?, ?)";
        const result = await db.query(sql, [this.email, pw]);
        this.id = result.insertId;
        return true;
    }

    async authenticate(submitted) {
        const sql = "SELECT password FROM user WHERE user_id = ?";
        const result = await db.query(sql, [this.id]);
        return await bcrypt.compare(submitted, result[0].password);
    }
}

module.exports = { User };
