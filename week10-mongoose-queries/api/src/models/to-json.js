// Shared toJSON options for every model. res.json() calls toJSON() on each document, so the API
// sends "id" (a string) instead of "_id" (an ObjectId) and leaves out Mongoose's "__v" counter.
// Populated documents use their own model's options, so a populated event gets "id" too.
export const toJSONOptions = {
  versionKey: false,
  transform(doc, ret) {
    const { _id, ...fields } = ret;
    return { id: _id.toString(), ...fields };
  },
};
