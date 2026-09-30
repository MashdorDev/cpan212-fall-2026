import http from 'node:http';

// A tiny copy of how Express works inside: a list of functions ("layers") that run one after another.
// This is the codealong file: steps 1 to 4 fill it in. server.js is done and doesn't change.
export function miniExpress() {
  // app.use, app.get and app.post each add one layer. They run in the order they were added.
  const layers = [];

  // The app itself is just the (req, res) function that node:http calls for every request.
  function app(req, res) {
    // Express adds helpers like these to every request and response.
    req.path = new URL(req.url, 'http://localhost').pathname;
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };
    res.json = (data) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
    };

    // TODO (you): STEP 1 - run the layers one after another with a next() function.
    // TODO (you): STEP 2 - skip routes whose method or path doesn't match the request.
    // TODO (you): STEP 3 - catch thrown errors and send them to the error handler.
    // TODO (you): STEP 4 - catch errors from async handlers too.
    res.end('Mini Express is not written yet\n');
  }

  // TODO (you): STEP 1 - app.use, app.get and app.post each push one layer onto the list.
  app.use = (handler) => {};
  app.get = (path, handler) => {};
  app.post = (path, handler) => {};
  app.listen = (port, callback) => http.createServer(app).listen(port, callback);

  return app;
}
