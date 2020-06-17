exports.createDefaultUsers = function (User) {
	User.findOne({
		email: 'elias.jorgensen@roskilde-festival.dk'
	}, function(err, doc) {
		if (!doc) {
			new User({
				email: 'elias.jorgensen@roskilde-festival.dk',
				password: 'ejoj',
				role: 'SUPERADMIN'
			}).save()
		}
	});
}
