var pool = require('../../config/db').pool;
var crypto = require('crypto');
var bcrypt   = require('bcrypt-nodejs');

module.exports.indexFile = function(req, res) 
{
    res.sendfile('./public/index.html'); 
};
module.exports.emailAvaliable = function(req, res) 
{
    var email=req.params.email;
    pool.getConnection(function(err,connection){
             connection.query('select * from login Where email = ?',[email],function (err, result) 
            {
               if (err) throw err;
               if (result.length) {
                        console.log("notAvailable",result[0].email);
                        res.send("notAvailable");
                  }
                  else {
                        console.log("available");
                        res.send("available");
                  }
               
            });
        connection.release();
   });
};
module.exports.signup = function(req, res)
{
    pool.getConnection(function(err,connection) {
                  var data = req.body;
                  var hash= crypto.randomBytes(20).toString('hex');
                  var mobileWithCountaryCode ="+91"+data.mobileNumber;
                  var code="54321";
                  var pass =bcrypt.hashSync(data.password, bcrypt.genSaltSync(8), null);
                  var userSignup= {fname:data.fName,lname:data.lName,email:data.email, mobile:mobileWithCountaryCode,password:pass,mobilecode:code,hash:hash,dob:data.dob};
                  connection.query('INSERT INTO login SET ?',userSignup,function (err, result) 
                 {
                   if (err) throw err;
                        //res.send("2");
                        //notifications(userSignup.email);
                });
                  connection.release(); 
     });
};