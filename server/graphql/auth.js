const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require('../config');
const { User } = require('./data/schema')

const verifyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: JWT_SECRET,
	issuer: 'Oko App API',
	audience: 'oko.roskilde-festival.dk',
	algorithms: ['HS256']
};

passport.use(
	new JwtStrategy(verifyOptions, (payload, done) => done(null, payload))
);

exports.authenticate = (req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate('jwt', (err, payload) => {
			if (err) reject(err);
			resolve(payload);
		})(req, res);
	});

exports.login = function (email, password) {
	return new Promise((resolve, reject) => {
		User.findOne({ email }, function(err, user) {
			if (err || !user) return reject(err);

			user.comparePassword(password, function(err, isMatch) {
				if (err || !isMatch) return reject(err);

				return resolve(jwt.sign({ email: user.email }, JWT_SECRET, {
					algorithm: 'HS256',
					issuer: verifyOptions.issuer,
					audience: verifyOptions.audience,
					expiresIn: '30 days'
				}));
			});
		});
	})
}
