var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mongoose  = require('mongoose');
var cors = require('cors');
var multer = require('multer')
var fs = require('fs');
var passport = require('passport');
var morgan = require('morgan');
var jwt = require('jwt-simple');
var config = require('./app/config/database');
console.log(config);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());

var port = process.env.PORT || 3000;

var router = express.Router(); 

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './app/uploads/');
    },
    filename: function (request, file, callback) {
        callback(null, file.originalname);
    }
	
});

var upload = multer({ storage: storage, fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb('Only image files are allowed!');
    }
    cb(null, true);
  }});

mongoose.connect(config.database);
require('./app/config/passport')(passport);


var File = require('./app/models/file');
var User = require('./app/models/user');

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

router.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});


router.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});


router.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};



app.use('/api', router);


app.listen(port);
console.log('Server listing to port ' + port);
