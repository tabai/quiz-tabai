var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {  
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req, res) {

  var a_buscar =  req.query.search;   

  if (a_buscar === undefined) { 
    texto = "";   
    models.Quiz.findAll({order: "pregunta"}).then(function(quizes) { //Ordeno las preguntas
      res.render('quizes/index.ejs', { quizes: quizes});
    }).catch(function(error) {next(error);})
  } else { //Esta filtrando las preguntas
    texto = a_buscar;
    /* Preparo el string para la consulta SQL */
    a_buscar = "%" + a_buscar + "%";
    a_buscar = a_buscar.replace(/ /,"%");   

    models.Quiz.findAll({where: ["pregunta like ?", a_buscar] },{order: "pregunta"}).then(function(quizes) { //ordeno las preguntas y filtro
      res.render('quizes/index.ejs', { quizes: quizes, texto: texto});
    }).catch(function(error) {next(error);})
  }

  
  
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};


// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};