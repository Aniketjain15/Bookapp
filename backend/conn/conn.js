const mongo = require('mongoose');

const conn = async () => {
try {
await mongo.connect(process.env.URI);
console.log("connceted to database");
  }
    catch (error) {
    console.error(error);
}
};
conn();
