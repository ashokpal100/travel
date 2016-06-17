// var controller = require('../controllers/controller');
var bodyParser = require('body-parser');
var multer     = require('multer');
var fs         = require('fs');
var crypto     = require('crypto');
var bcrypt     = require('bcrypt-nodejs');

var pool       = require('../../config/db').pool;
//var email      = require('../email/email');


module.exports = function(app,session,sessionInfo) 
{
            var upload  = multer({ dest: './views/uploads' });
            app.get('/',function(req,res){
                res.sendfile('./public/index.html'); 
            });
            //app.post('/signup', controller.signup);
            app.get('/api/checkUnique/:email',function(req,res){
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

            });
            app.post('/login', function(req,res){

                        sessionInfo=req.session;
                        //console.log(req.body);
                        var email=req.body.email;

                        // if(sessionInfo.uid){
                        //       res.redirect('/home#?id='+sessionInfo.uid);
                        //  }else{
                        //    res.render("login");    
                        //  }
                        
                        pool.getConnection(function(err,connection){
                             connection.query('select * from login Where email = ?',[email],function (err, result) 
                            {
                            
                               if (err) throw err;
                               if (!result.length) {
                                    res.send("1");
                                  }
                                  else {
                                        if(bcrypt.compareSync(req.body.password, result[0].password)){
                                        
                                          //sessionInfo.uid = result[0].id;
                                          //console.log(sessionInfo.uid)
                                          res.send(result[0]);
                                        }
                                              
                                        else{
                                          res.send("2");
                                        }
                                              
                                  }
                               
                            });
                        connection.release();
                   });
            });
            app.put('/emailVerified/:hash',function(req,res){
                         console.log("i am verify",req.params.hash);
                         var hash = req.params.hash;
                         var status = 1;
                         pool.getConnection(function(err,connection){
                             connection.query('update login SET emailverify=? Where hash = ?',[status,hash],function (err, result) 
                            {
                               if (err) throw err;
                                res.send("success");
                            });
                        connection.release();
                   });
            });
            // app.post('/login',controller.login);
            // app.post('/forgotPass',controller.forgotPass);
            // app.get('/logout',controller.logout);
            app.get('/getDataById/:id',function(req,res){
              var id=req.params.id;
                    pool.getConnection(function(err,connection)
                    {
                                        connection.query('select * from login Where id = ?',[id],function (err, result) 
                                            {
                                               if (err) throw err;
                                               res.send(result[0]);
                                            });
                                        connection.release();
                    });
            });
            // app.get('/getAddress',controller.getAddress);
            // app.get('/getBike',controller.getBike);
            app.post('/signup', upload.single('file'), function(req, res, next)
            {
                        /*
                            Multer file upload starts
                        */
                        var name = crypto.randomBytes(5).toString('hex');
                        var file_path = './public/uploads/' + name +req.file.originalname;
                        var file_name = 'uploads/' +name+req.file.originalname;
                        var temp_path = req.file.path;

                        var src = fs.createReadStream(temp_path);
                        var dest = fs.createWriteStream(file_path);     
                        src.pipe(dest);
                        /*
                            Multer file upload ends
                        */
                pool.getConnection(function(err,connection) 
                {
                  var data = req.body;
                  console.log(req.body);
                  
                  var hash= crypto.randomBytes(20).toString('hex');
                  var mobileWithCountaryCode ="+91"+data.mobileNumber;
                  var code="54321";
                  var pass =bcrypt.hashSync(data.password, bcrypt.genSaltSync(8), null);
                  var insert_data = {
                    fname:data.fname,
                    lname:data.lname,
                    email:data.email, 
                    mobile:mobileWithCountaryCode,
                    password:pass,
                    mobilecode:code,
                    hash:hash,
                    dob:data.dob,
                    pic:file_name
                  };
                connection.query('INSERT INTO login SET ?',insert_data,function (err, result) 
                {
                   if (err) throw err;
                   //storing session ID
                  //sessionInfo.uid = result.insertId;
                  if(result) {

                    result_send={
                        is_regisred:true,
                        id:result.insertId,
                        hash:hash,
                        msg:"OK"
                      };
                  }else{
                    result_send={
                        is_regisred:false,
                        id:null,
                        msg:"BAD"
                      };
                  }
                  res.write(JSON.stringify(result_send));
                  require('../email/email')(insert_data);
                  res.end();
                        //notifications(userSignup.email);
                });

                  connection.release(); 
               });

            });
};
var notifications=function(data){
          console.log(" i am inside notifications");

                       //  connection.query('select * from login Where email = ?',[email],function (err, result) 
                       //  {
                       //      if (err) throw err;
                       //      var smsUser="Thank You for registration with Palcompany. Dear "+ result[0].fname+" your account verification link sent  to your gmail account ";
                       //      client.sendMessage({to:result[0].mobile,
                       //              from: '+12014398412',
                       //              body: smsUser

                       //          }, function(err, responseData) { 

                       //              if (!err) { 
                       //              }
                       //          });
                       // fs.readFile('D01.jade', 'utf8', function (err, data) {
                       //          if (err) throw err;
                       //          var fn = jade.compile(data);
                       //          var html = fn({fname:result[0].fname,id:result[0].id});
                       //          var message = {
                       //      from: 'admin',
                       //      to: result[0].email,
                       //      subject:"Welcome to Pal Company", 
                       //      html: html
                       //         };
                       //    transport.sendMail(message, function(error, response){
                       //       if(error){
                       //              console.log(error);
                       //              res.end("error");
                       //       }else{
                                 
                       //           }
                       //      });
                       //  });
                       // });
        }
//   app.post('/api/therapist-login',passport.authenticate('local2'),function(req,res){
//      res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('okay');
// });