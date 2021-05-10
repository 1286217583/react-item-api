
const jsonServer = require('json-server')

const routes = jsonServer.router('./da.json')
const middlewares = jsonServer.defaults()

const server = jsonServer.create()


// json-server 假数据
server.use(middlewares)
server.use(routes)

server.listen(9090)
