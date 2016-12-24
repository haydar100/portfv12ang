var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose   = require('mongoose');
var cors = require('cors');
var multer = require('multer')
var fs = require('fs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var port = process.env.PORT || 3000;

var router = express.Router(); 

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './app/uploads/');
    },
    filename: function (request, file, callback) {
        console.log('haydar');
        callback(null, file.originalname);
    }
	
});

var upload = multer({ storage: storage, fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb('Only image files are allowed!');
    }
    cb(null, true);
  }});

mongoose.connect('mongodb://localhost/portfv12ang'); 

var File = require('./app/models/file');

router.use(function(req, res, next) {
    // do logging
    console.log('REST API called.');
    next(); 
});

router.get('/', function(req, res) {
    res.json({ message: 'api is alive !' });   
});

router.post('/uploads', upload.single('file'), function (req, res) {
	console.log(req.fileValidationError);
	if (req && req.file) {
	var file = new File({
		fieldname: req.file.fieldname,
	    originalname: req.file.originalname,
	    encoding: req.file.encoding,
	    mimetype: req.file.mimetype,
	    destination: req.file.destination,
	    filename: req.file.filename,
	    path: 'uploads/' + req.file.filename,
	    size: req.file.size
	})

	file.save(function(err) {
		if (err) {
			res.send(err);
		} else {
		    console.log(req); // form fields
		    console.log(req); // form files
		    res.json(file);
		}
	})
	}  else {
		res.status(400).end()
	}
});

router.delete('/uploads/:id/remove', function(req, res, next) {
  File.findById(req.params.id, function (err, file) {
    if(err) { return next(err); }
    if(!file) { return res.send(404); }
    file.remove(function(err) {
      if(err) { return handleError(res, err); }
            console.log(file);
      fs.unlink('app/uploads/' + file.filename);

      return res.send(204);
    });
  });
});

router.get('/files', function (req, res) {
	File.find(function(err, files) {
		if (err) {
			res.send(err);
		} else {
			res.json(files);
		}
	});
	
});

/*// IMAGE API
router.route('/images')

    // create a image (accessed at POST http://localhost:8080/api/images)
    .post(function(req, res) {
        
        var image = new Image();      // create a new instance of the image model
        
        image.base64 = req.body.base64;  // set the image base64 (comes from the request)
        image.description = req.body.description;

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


 	router.route('/images/:image_id')
      .delete(function(req, res) {
        Image.findOneAndRemove({
            _id: req.params.image_id
        }, function(err, images) {
            if (err)
                res.send(err);
            res.json({ message: 'deleted image with id ' + req.params.image_id });
        });
    });*/
  

app.use('/api', router);


app.listen(port);
console.log('Server listing to port ' + port);
