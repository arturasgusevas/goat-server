const sharp = require('sharp');

exports.resize = (req, res, next) => {
  sharp(req.file.path)
    .resize(200, 200)
    .toFile(`uploads/thumb_${req.file.filename}`, (err) => {
      res.locals.thumbPath = `thumb_${req.file.filename}`;
      if (err) {
        res.send(err);
      }
      next();
    });
};
