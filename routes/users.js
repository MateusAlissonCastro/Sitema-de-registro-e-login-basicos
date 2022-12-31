const express = require('express');
const router = express.Router();
const models = require('./../models');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = models.User;
dotenv.config();

/* GET users listing. */
router.get('/login', async function (req, res, next) {
  res.send('Tela de login')
});

router.post('/cadastro', async (req, res, next) => {
  const salt = await bcrypt.genSalt(10)
  const usr = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt)
  }

  created_user = await User.create(usr)
  res.status(201).json(created_user)
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } })
  if (user) {
    const password_valid = await bcrypt.compare(req.body.password, user.password)
    if (password_valid) {
      const token = jwt.sign({ "id": user.id, "email": user.email, "first_name": user.first_name }, process.env.SECRET)
      res.status(200).json({ token: token })
    }
    else {
      res.status(400).json({ error: "Senha incorreta" })
    }
  } else {
    res.status(404).json({ error: "Usuário não existe" })
  }
})

router.get('/me',
  async (req, res, next) => {
    try {
      let token = req.headers['authorization'].split(" ")[1]
      let decoded = jwt.verify(token, process.env.SECRET)
      req.user = decoded
      next()
    } catch (err) {
      res.status(401).json({ "msg": "Não foi possível autenticar" })
    }
  },
  async (req, res, next) => {
    let user = await User.findOne({ where: { id: req.user.id }, attributes: { exclude: ["password"] } })
    if (user === null) {
      res.status(404).json({ "msg": "Usuário não encontrado" })
    }
    res.status(200).json(user)
  })

module.exports = router;