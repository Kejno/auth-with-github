const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const shortid = require('shortid')
const User = require('./model/User')
const Course = require('./model/Course')

const githubAuthRouter = require('./router/githubAuth.router')

const app = express();

//MongoDB
const connectDB = require('../config/bd')
connectDB()

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'text/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/authenticate', githubAuthRouter);

// app.use(bodyParser.json());
// app.use(bodyParser.json({ type: "text/*" }));
// app.use(bodyParser.urlencoded({ extended: false }));

// // Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

// app.post("/authenticate", async (req, res) => {
//   const { client_id, redirect_uri, client_secret, code } = req.body;

//   const data = new FormData();
//   data.append("client_id", client_id);
//   data.append("client_secret", client_secret);
//   data.append("code", code);
//   data.append("redirect_uri", redirect_uri);

//   // Request to exchange code for an access token
//   fetch(`https://github.com/login/oauth/access_token`, {
//     method: "POST",
//     body: data
//   })
//     .then(response => response.text())
//     .then(paramsString => {
//       let params = new URLSearchParams(paramsString);
//       const access_token = params.get("access_token");
//       const scope = params.get("scope");
//       const token_type = params.get("token_type");
//       console.log(access_token, scope, token_type)

//       // Request to return data of a user that has been authenticated
//       return fetch(
//         `https://api.github.com/user?access_token=${access_token}&scope=${scope}&token_type=${token_type}`
//       );
//     })
//     .then(response => response.json())
//     .then(async response => {
//       const data = await response
//       const { id, login } = data

//       const candidate = await User.findOne({ githubId: id })
//       if (!candidate) {
//         const user = new User({ githubId: id, login })
//         await user.save()
//       }

//       return res.status(200).json(data);
//     })

//     .catch(error => {
//       return res.status(400).json(error);
//     });
// });

app.post('/course', async (req, res) => {
  try {

    // const baseUrl = config.get('baseUrl')

    //наша ссылка
    const { name, startDate, endDate } = req.body

    const code = shortid.generate()

    // посмотреть , есть ли уже такая ссылка в базе
    const existing = await Course.findOne({ name })
    if (existing) {
      return res.json({ link: existing })
    }

    // const to = baseUrl + '/t/' + code

    const course = new Course({ name, startDate, endDate })

    //после создания ссылки, мы ее сохраняем
    await course.save()

    res.status(201).json({ course })

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

// get запрос для получения всех ссылок
app.get('/course', async (req, res) => {
  try {

    // жду пока модель Link найдем мне все ссылки, которые относятся к текущему пользователю
    const course = await Course.find()
    res.json(course)

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

//// get запрос для получения ссылки по id
app.get('/course/:id', async (req, res) => {
  try {
    // жду пока модель Link найдем мне все ссылки, которые относятся к текущему пользователю
    const course = await Course.findById(req.params.id) //??????
    res.json(course)

  } catch (e) {
    res.status(500).json({ message: "Что то пошло не так, попробуйте снова" })
  }
})

const PORT = process.env.SERVER_PORT || 5000;
console.log(process.env.SERVER_PORT)
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

