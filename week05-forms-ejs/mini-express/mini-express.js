import http from 'node:http';

// A tiny copy of how Express works inside: a list of functions ("layers") that run one after another.
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

    let index = 0;

    // next() runs the next layer that fits this request. next(error) skips ahead to the error handlers.
    function next(error) {
      const layer = layers[index];
      index += 1;

      // We ran out of layers and nobody answered, so answer like Express does.
      if (!layer) {
        res.statusCode = error ? 500 : 404;
        res.end(error ? 'Internal Server Error' : `Cannot ${req.method} ${req.path}`);
        return;
      }

      // A route only runs for its own method and path. Layers from app.use run for every request.
      if (layer.method && (layer.method !== req.method || layer.path !== req.path)) {
        return next(error);
      }

      // A function with four parameters (err, req, res, next) is an error handler. It only runs
      // after an error, and the normal layers are skipped once there is one.
      const isErrorHandler = layer.handler.length === 4;
      if (error && !isErrorHandler) {
        return next(error);
      }
      if (!error && isErrorHandler) {
        return next();
      }

      try {
        const result = error ? layer.handler(error, req, res, next) : layer.handler(req, res, next);
        // An async handler returns a promise. If it rejects, send the error to next(), like Express 5 does.
        Promise.resolve(result).catch(next);
      } catch (thrown) {
        next(thrown);
      }
    }

    next();
  }

  app.use = (handler) => layers.push({ handler });
  app.get = (path, handler) => layers.push({ method: 'GET', path, handler });
  app.post = (path, handler) => layers.push({ method: 'POST', path, handler });
  app.listen = (port, callback) => http.createServer(app).listen(port, callback);

  return app;
}
