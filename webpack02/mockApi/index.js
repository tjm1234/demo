function API(app) {
    app.get('/api/haha',function(req,res){
        res.json({custom:'response'});
    })
    app.post('/api/haha',function(req,res){
        res.json({custom:'response'});
    })
}

module.exports={
    API
}