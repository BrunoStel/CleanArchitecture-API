export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api' || 'mongodb+srv://brunostel:784539126@cluster0.d0no9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  port: process.env.PORT || 5050,
  jwtSecret: process.env.JWT_SECRET || 'tj670==5h'
}
