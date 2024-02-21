module.exports = (req,res,next)=>{
    if(req.eventUserId == req.user.id){
        return next();
    }
    console.log(req.eventUserId);
    res.redirect('/users/profile')
}