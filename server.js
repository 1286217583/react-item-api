const express = require('express')
const jsonServer = require('json-server')
const Axios = require('axios')
const bcryptjs = require('bcryptjs')
const routes = jsonServer.router('./da.json')
const middlewares = jsonServer.defaults()

Axios.defaults.baseURL = 'http://localhost:9090'
const server = express()

server.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*')
  next()
})

const timer = (time = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

server.use(async (req, res, next) => {
  await timer()
  next()
}) 

// req.body 处理
server.use(express.json())
server.use(express.urlencoded({ extended: true  }))

// 接口
server.post('/sign-up', async (req, res) => {
  // 1、获取前端床过来的 username、password、gander
  // 2、直接使用 Axios 来调用 json-server 的 users 这个接口来存进去
  const response = await Axios.get('/users', { params: { username: req.body.username } })
  if (response.data.length > 0) {
    // 用户名以及注册
    res.send({
      code: -1,
      msg: '用户名以及被注册'
    })

    return
  }

  const { data } = await Axios.post('/users', {
    ...req.body,
    password: await bcryptjs.hash(req.body.password, 10)
  })

  res.send({
    code: 0,
    msg: '注册成功',
    // data
  })
})

server.post('/sign-in', async (req, res) => {
  const { username, password } = req.body

  const {data} = await Axios.get('/users', {
    params: {
      username
    }
  })

  if (data.length <= 0) {
    res.send({
      code: -1,
      msg: '用户名或密码错误'
    })

    return
  }

  const user = data[0]
  const isOK = await bcryptjs.compare(password, user.password)

  if (isOK) {
    res.send({
      code: 0,
      msg: '登录成功'
    })
  } else {
    res.send({
      code: -1,
      msg: '用户名或密码错误'
    })
  }

})

// json-server 假数据
server.use(middlewares)
server.use(routes)

server.listen(9090)
