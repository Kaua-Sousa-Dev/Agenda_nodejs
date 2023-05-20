module.exports = {
    eAdmin: function(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }
        req.flash("error_msg", "Você precisa das permissões de administrador para acessar esta rota")
        res.redirect("/")
    }
}