db.createUser({
    user: 'mongo',
    pwd: 'mongo',
    roles: [{ role: 'readWrite', db: 'oko' }]
})

db.users.insert({
    name: 'mongo'
})