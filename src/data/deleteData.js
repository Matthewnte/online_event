const Event = require('../models/eventModel');

// Connect mongo db
require('../db/mongoose');

// Delete all events
const deleteData = async () => {
  try {
    await Event.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// Call delete function
if (process.argv[2] === '--delete') {
  deleteData();
}
