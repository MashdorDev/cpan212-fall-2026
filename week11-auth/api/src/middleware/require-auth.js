import { User } from '../models/User.js';
import { HttpError } from '../utils/http-error.js';

// Put this before any route that needs a logged-in user. It answers 401 when there is no session,
// and otherwise loads the user into req.user for the controller.
export async function requireAuth(req, res, next) {
  const { userId } = req.session;
  if (!userId) {
    throw new HttpError(401, 'Log in to do this');
  }

  // The session only holds an id. Loading the user each time means a deleted account stops working
  // right away, instead of when its session expires.
  const user = await User.findById(userId);
  if (!user) {
    throw new HttpError(401, 'Log in to do this');
  }

  req.user = user;
  next();
}

// The admin pages are HTML, so a visitor who isn't logged in is sent to the login form instead of getting
// a JSON 401. res.locals.user is available in every template, so the header can show who is logged in.
export async function requireAdminLogin(req, res, next) {
  const user = req.session.userId ? await User.findById(req.session.userId) : null;
  if (!user) {
    return res.redirect('/admin/login');
  }
  req.user = user;
  res.locals.user = user;
  next();
}

// Ownership check for anything with an organizer. Logged in (401) and allowed (403) are different questions:
// 403 means "we know who you are, and this isn't yours".
export function assertOrganizer(event, user) {
  if (!event.organizer.equals(user._id)) {
    throw new HttpError(403, 'Only the organizer of this event can do this');
  }
}
