module.exports = {
    __404(req,res){
        res.status(404).send(`404 The road don't exist.`);
    },
}