var glob = require('glob')
var fs = require('fs')

glob('./_book/docs/**/*.html', function (err, files) {
  if (err) {
    throw err
  }

  files.forEach(function (file) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        throw err
      }

      fs.writeFile(file, data.replace(/..\/..\/..\/_book\/docs/g, '../../docs'), function (err) {
        if (err) {
          throw err
        }

        console.log('path fixed ' + file) // eslint-disable-line no-console
      })
    })
  })
})
