
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Phase = mongoose.model('PhaseType')
  , Form = mongoose.model('Form')



/**
 * Index
 */

exports.insert = function(req, res) {  


  // Form.list(function(err, techniques) {
  //   if (err) return res.render('500', {error : err.errors || err})
  //   Phase.create([{
  //     name: "Vision",
  //     comments: "la vision",
  //     techniques: [techniques[0]]
  //   },
  //   {
  //     name: "Analyse",
  //     techniques: [techniques[0], techniques[1]]
  //   },
  //   {
  //     name: "Conception",
  //     techniques: [techniques[0], techniques[2]]
  //   },
  //   {
  //     name: "Validation",
  //     techniques: [techniques[1], techniques[2]]
  //   }], function (err, vision, analyse, conception, validation) {

  //       console.log("err")
  //       console.log(err)

  //       console.log("analyse")
  //       console.log(analyse)

  //       console.log(conception)
  //       console.log("conception")

  //       console.log(validation)
  //       console.log("validation")

  //   })
  // })
  
  res.render('admin/index', {
    msg : "inserted phases"
  })
}