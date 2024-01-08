const converter=async (req,res,next)=>{
    try{
        req.body.genre=JSON.parse(req.body.genre);
        next();
    }catch(error){
        next(error);
    }
}      

module.exports=converter;