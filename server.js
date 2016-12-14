var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose   = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3000;

var router = express.Router(); 

mongoose.connect('mongodb://localhost/portfv12ang'); 
var Image = require('./app/models/image');

router.use(function(req, res, next) {
    // do logging
    console.log('REST API called.');
    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'api is alive !' });   
});


// IMAGE API
router.route('/images')

    // create a image (accessed at POST http://localhost:8080/api/images)
    .post(function(req, res) {
        
        var image = new Image();      // create a new instance of the image model
        
        image.base64 = req.body.base64;  // set the image base64 (comes from the request)
        image.description = req.body.description;
        // save the bear and check for errors
        image.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Image saved!' });
        });
        
    })
      .get(function(req, res) {
        Image.find(function(err, images) {
            if (err)
                res.send(err);

            res.json(images);
        });
    });

 

app.use('/api', router);


app.listen(port);
console.log('Magic happens on port ' + port);
