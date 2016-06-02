module.exports = function(mysql) {
		var pool      =    mysql.createPool({
		    connectionLimit : 100000, 
		    host     : 'localhost',
		    user     : 'root',
		    password : '2016',
		    database : 'mydatabase',
		    debug    :  false
		});
module.exports.pool=pool;
};