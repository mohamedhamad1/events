module.exports = (req, res, next) => {
    if(!req.user){
        return res.redirect('/users/login')
    }
    if(req.isAuthenticated() || req.user.role === 'ADMIN') {
        return next();
    }
    res.redirect('/events')
}