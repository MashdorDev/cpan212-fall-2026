export const SPECIES = ['dog', 'cat', 'bird', 'rabbit', 'other'];

// TODO (you): check the text fields from the form and return { value, errors }.
//   value:  the five fields (petName, species, lastSeen, dateLost,
//           contactEmail) with spaces trimmed from both ends.
//   errors: an object that maps each invalid field name to a message, for
//           example { petName: "Enter your pet's name (up to 40 characters)" }.
//           An empty object means every field is valid.
// The rules are in requirement 7 of the lab page. The photo is checked in the
// route, because it arrives in req.file, not in the body.
export function validateNotice(body) {
  return { value: {}, errors: {} };
}
