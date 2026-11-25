import { User } from '../models/User.js';
import { HttpError } from '../utils/http-error.js';

// Put this in front of a route that needs a logged-in user.
// No session: 401. Otherwise the user goes in req.user for the controller.
export async function requireAuth(req, res, next) {
  // TODO STEP 4a: who is asking?
  // express-session found the session from the cookie and put it in req.session.
  // The session only holds the id. If the account was deleted since, treat it as logged out.
  // Replace the throw line below with:
  //
  //   const userId = req.session.userId;
  //   if (!userId) {
  //     throw new HttpError(401, 'Log in to do this');
  //   }
  //   const user = await User.findById(userId);
  //   if (!user) {
  //     throw new HttpError(401, 'Log in to do this');
  //   }
  //   req.user = user;
  //   next();
  //
  // Check: nothing yet. Step 4b is the first route that uses it.
  throw new HttpError(401, 'Log in to do this (TODO STEP 4a)');
}

// The same check for the EJS admin pages. They are HTML, so a visitor who isn't logged in
// goes to the login form instead of getting JSON. res.locals.user is available in every template.
export async function requireAdminLogin(req, res, next) {
  let user = null;
  if (req.session.userId) {
    user = await User.findById(req.session.userId);
  }
  if (!user) {
    return res.redirect('/admin/login');
  }

  req.user = user;
  res.locals.user = user;
  next();
}

// 401 means "log in first". 403 means "you are logged in, and this isn't yours".
export function checkOrganizer(event, user) {
  // TODO STEP 6c: 403 unless you organize this event
  // organizer is an ObjectId, not a string, so compare with equals() instead of ===.
  // Events saved before Week 11 have no organizer, so nobody owns them. Type under this comment:
  //
  //   if (!event.organizer || !event.organizer.equals(user._id)) {
  //     throw new HttpError(403, 'Only the organizer of this event can do this');
  //   }
  //
  // Check: nothing yet. Step 6d calls it.
}
