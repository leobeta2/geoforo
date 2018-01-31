const LocalEstrategy = require('passport-local').Strategy;

const User = require('../app/models/user');

module.exports = function (passport) {
    
    //forma de ver los datos del login y no los pide a cada rato
    passport.serializeUser(function (user, done) {
        //done, es un callback
        done(null, user.id);
    })

    passport.deserializeUser(function(id, done){
        //buscamos en la base de datos, y solo podemos obtener o un erro o el usuario
        User.findById(id, function (err, user) {
            done(err, user);
            
        })
    });

    //vamos a registrarlo localmente
    //signup
    passport.use('local-signup', new LocalEstrategy({
        usernameField: 'email',
        passportField: 'password',
        passReqToCallback: true
    },
    function (req, email, password,done) {
        User.findOne({'local.email': email}, function(err, user){
            if(err) {return done(err);}
            if(user) {
                return done(null, false, req.flash('signupMessage', 'The email is already taken.') );
            } else {
                var newUser = new User();
                newUser.local.email = email;
                //debemos cifrar lo que nmos envia el usuario invocando generateHash que habiamos definido anteriormente
                newUser.local.password = newUser.generateHash(password);
                //guardamos en la base de datos
                //cuando guardamos puedes obtener un error
                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    }
                    //si no hay error, retornamos el callback
                    return done(null, newUser);
                });

            }
        });
        
    }

    ));

    passport.use('local-login', new LocalEstrategy({
        usernameField: 'email',
        passportField: 'password',
        passReqToCallback: true
    },
    function (req, email, password,done) {
        User.findOne({'local.email': email}, function(err, user){
            if(err) {return done(err);}
            if(!user) {
                return done(null, false, req.flash('loginMessage', 'No User found!!.') );
            } 

            if (!user.validatePassword(password)) {
                return done(null,false,require.flash('loginMessage', 'Wrong password'));                
            }
            return done(null, user);
        });
        
    }

    ));
}