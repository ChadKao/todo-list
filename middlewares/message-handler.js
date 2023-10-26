module.exports =  (req, res, next) => {
  res.locals.message = req.flash('success');
  res.locals.error = req.flash('error');
  next()
}