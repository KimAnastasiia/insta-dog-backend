const mysql = require('mysql');
const util = require('util');

let database = {
    configuration:{
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'dog',
        multipleStatements: true
    },
    mysqlConnection:null,
    query:null,
    connected: false,
    connect() {
        if ( this.connected == false){
            this.mysqlConnection = mysql.createConnection(this.configuration);

            this.mysqlConnection.connect();
            this.connected = true;
            this.query = util.promisify(this.mysqlConnection.query).bind(this.mysqlConnection);
        }

    },
    disConnect() {
        if ( this.connected){
            //this.mysqlConnection.end();
            ///this.connected = false;
        }
    }
}

module.exports=database