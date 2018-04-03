module.exports = function () {
  const functions = require('firebase-functions')
  const admin = require('firebase-admin')
  const config = functions.config()

  admin.initializeApp(config.firebase)

  return {
    app: admin,
    db: admin.database()
  }
}()
