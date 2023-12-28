module.exports = {
  loggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    req.flash(
      "error_msg",
      "Você precisa estar conectado para acessar essa página!"
    );
    res.redirect("/auth/login");
  },
};
