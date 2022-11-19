const db = require('./db')

function getAll(callback) {
    const sql = "SELECT id,name,email,phone FROM cab";
    db.executeQuery(sql, [], callback);
}

function addOne(name, email, phone, callback) {
    const sql = "INSERT INTO cab (name,email,phone) VALUES (?, ?, ?)";
    db.executeQuery(sql, [name, email, phone], callback);
}

module.exports.getAll = getAll;
module.exports.addOne = addOne;
