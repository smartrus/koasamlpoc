const   Koa     = require('koa'),
        body    = require('koa-bodyparser'),
        session = require('koa-generic-session'),
        passport= require('./passport'),
        mount   = require('koa-mount'),
        router  = require('./routes'),
	fs	= require('fs'),
	https	= require('https');

const app = Koa();

app.keys = ['abc'];

app.use(body({extendTypes: {json: ['json', '**/json']}}));
app.use(session({key: 'test.cookie'}));
app.use(passport.initialize());
app.use(passport.session());

router.get('/login',
    passport.authenticate('saml',
        {
            successRedirect: '/',
            failureRedirect: '/login'
        })
);

// using /login/callback for now
router.post('/login/callback',
    passport.authenticate('saml',
        {
            failureRedirect: '/',
            failureFlash: true
        }),
    function *consume() {
        this.redirect('/');
    }
);

app.use(mount(router.routes()));

// start server
const options = {
  key: fs.readFileSync("/Users/rustemabd/Documents/gitrepo/optimetriks/saml_certs/samlpoc/koasamlpoc/key.pem"),
  cert: fs.readFileSync("/Users/rustemabd/Documents/gitrepo/optimetriks/saml_certs/samlpoc/koasamlpoc/certificate.pem")
};

const port = process.env.PORT || 8081;
https.createServer(options, app.callback()).listen(port);
//app.listen(port, () => console.log('Server listening on', port));
