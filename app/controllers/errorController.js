module.exports = {
    __404(req,res){
        res.status(404).send(`404 la route demandé n'existe pas.`);
    },
}