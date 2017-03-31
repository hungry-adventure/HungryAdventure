import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


app.use(express.static(path.join(__dirname + '/../build')));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname +  '/../build', 'index.html'));
});
require('./config/routes.js')(app, express);
console.log('HI');
// app.use(webpackDevMiddleware(compiler, {
//   hot: true,
//   filename: 'bundle.js',
//   publicPath: '/',
//   stats: {
//     colors: true,
//   },
//   historyApiFallback: true,
// }));


const server = app.listen(8888, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
