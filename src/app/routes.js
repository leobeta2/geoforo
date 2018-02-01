//vamos a recibir express y passport
module.exports = (app, passport) => {
	//,amejador de funcionq que recibe orden y respuestas
	app.get('/', (req, res) => {
		res.render('index');
	});

	app.get('/login', (req, res) => {
		res.render('login', {
			message: req.flash('loginMessage')
		});
	});

	//app.post('/login', passport.authenticate());
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup',{
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile',isLoggedIn ,(req, res) => {
		res.render('profile', {
			user: req.user
		})
	});

    app.get('/logout', (req, res)=> {
    	console.log('deslogueado')
        req.logout();
        res.redirect('/');
    });

    //midlewere
    function isLoggedIn(req, res, next) {
        //si esta autenticado, entonces que continue con la siguiente ruta
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');


    }
};