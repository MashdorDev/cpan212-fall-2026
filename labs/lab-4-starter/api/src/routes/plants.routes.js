import { Router } from 'express';

// Paths here are relative to where the router is mounted (/api/plants in server.js).
export const plantsRouter = Router();

// TODO (you): step 4, the routes. Import mongoose and your Plant model at the top first.
//
//   plantsRouter.get('/', ...)         list, sorted by ?sort          (requirement 5)
//   plantsRouter.get('/:id', ...)      one plant                      (requirement 6)
//   plantsRouter.post('/', ...)        create                         (requirement 4)
//   plantsRouter.patch('/:id', ...)    update                         (requirement 7)
//   plantsRouter.delete('/:id', ...)   delete                         (requirement 8)
//
// Things to remember:
//   - Express 5 passes a rejected promise from an async handler to the error
//     handler, so you don't need try/catch in every route.
//   - Check an id with mongoose.isObjectIdOrHexString(req.params.id) before you
//     query. Send 404 when it's false.
//   - Copy only name, species, light, waterEveryDays and lastWatered from
//     req.body. Don't pass req.body straight to Mongoose.
//   - req.query.sort can be missing, a string, or an array (?sort=a&sort=b).
