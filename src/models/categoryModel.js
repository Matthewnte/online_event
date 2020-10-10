const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
  {
    name: { type: String, required: 'Category must have a name', unique: true },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    event: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
      },
    ],
    createdAt: { type: Date, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

module.exports = mongoose.model('Category', CategorySchema);
