var controller = require('../controllers/controller');


module.exports = function(app) {

            app.get('/',controller.indexFile);
            app.post('/signup', controller.signup);
            app.get('/api/checkUnique/:email',controller.emailAvaliable)
           
            // app.put('/password/:id',controller.updatePass);
            // app.post('/login',controller.login);
            // app.post('/forgotPass',controller.forgotPass);
            // app.get('/logout',controller.logout);
            // app.get('/getDataById/:id',controller.getDataById);
            // app.get('/getAddress',controller.getAddress);
            // app.get('/getBike',controller.getBike);
  };

//   app.post('/api/therapist-login',passport.authenticate('local2'),function(req,res){
//      res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('okay');
// });