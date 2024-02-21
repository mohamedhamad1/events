module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.redirect('/users/profile')
        }
        next()
    }
}