const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  console.log("Here reached: ");
  const authenticateUser = async (email, password, done) => {
    // const user = await getUserByEmail(email);
    const user = await getUserByEmail(email);
    console.log("User reached: " + JSON.stringify(user));
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(
    new LocalStrategy({ usernameField: "email" }, authenticateUser)

    //new LocalStrategy({ usernameField: "agent_email" }, authenticateUser)
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id);
    return done(null, user);
  });
}

module.exports = initialize;
