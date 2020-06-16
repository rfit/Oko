const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../config');

const verifyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET,
	issuer: 'Oko App API',
	audience: 'oko.roskilde-festival.dk',
	algorithms: ['HS256']
};

passport.use(
	new JwtStrategy(verifyOptions, (payload, done) => {
		console.log('Woot', payload)
		done(null, { test: true })
	})
);

exports.authenticate = (req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate('jwt', (err, payload) => {
			if (err) reject(err);
			resolve(payload);
		})(req, res);
	});

exports.login = function (userId) {
	return jwt.sign({ uid: userId }, JWT_SECRET, {
		algorithm: 'HS256',
		issuer: verifyOptions.issuer,
		audience: verifyOptions.audience,
		expiresIn: '30 days'
	});
}
