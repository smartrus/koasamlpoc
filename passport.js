'use strict';

const   Saml    = require('passport-saml').Strategy,
        passport= require('koa-passport'),
	fs	= require('fs');

let conf = {
    path: '/login/callback',
    entryPoint: 'https://login.microsoftonline.com/e5dbf331-8e01-4865-af58-3b73eeb5b8fe/saml2',
    issuer: 'smala',
    cert: fs.readFileSync('Smala.cer').toString(),
};

function onSerialize(user, done) {
    done(null, user);
}

function onDeserialize(user, done) {
    done(null, user);
}

function onProfile(profile, done) {
    return done(null,
        {
            id: profile.uid,
            email: profile.email,
            displayName: profile.cn,
            firstName: profile.givenName,
            lastName: profile.sn
        });
}

let saml = new Saml(conf, onProfile);

passport.serializeUser(onSerialize);

passport.deserializeUser(onDeserialize);

passport.use(saml);

module.exports = passport;
