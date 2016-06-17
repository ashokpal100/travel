var fs         = require('fs');
var jade       = require('jade');
var nodemailer     = require('nodemailer');
var client = require('twilio')('', '');
var transport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: "",
            pass: ""
        }
    });
module.exports = function(result)
{
        console.log(" i am email", result);
        var smsUser="Thank You for registration with Palcompany. Dear "+ result.fname+" your account verification link sent  to your mail account !";
        client.sendMessage({to:result.mobile,
                from: '+12014398412',
                body: smsUser
              }, function(err, responseData) { 
                console.log(responseData);
                    if (!err) { 
                              }
        });

        fs.readFile('./views/emails/D01.jade', 'utf8', function (err, data) {
            if (err) throw err;
            var fn = jade.compile(data);
            var html = fn({result});
            var message = {
                            from: 'admin',
                            to: result.email,
                            subject:"Welcome to Pal Company", 
                            html: html
                          };
        transport.sendMail(message, function(error, response){
              if(error){
                    console.log(error);
                    res.end("error");
                  }else{ console.log(response);}
                   });
        });
                
}