module.exports =  (err, req, res, next) => {
  console.error('印出錯誤: ', err);
  req.flash('error', err.errorMessage || '處理失敗!')
  res.redirect('back')

  next(err)
}