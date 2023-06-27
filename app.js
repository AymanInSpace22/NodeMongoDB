// const express = require("express");

// const app = express();

// const MongoClient = require('mongodb').MongoClient;

// //mongodb connection
// const url = "mongodb+srv://aymanboulad06:lgkXyPmLHVzdV3E6@worklinks.8mbisz5.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB connection URL
// const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

// // Connect to the MongoDB database
// client.connect((err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }
//   console.log('Connected to the database');

//   // Start your Express server after connecting to the database
//   app.listen(3000, () => {
//     console.log('Server started on port 3000');
//   });
// });

// app.get('/', (req, res) => {
//     const db = client.db('Links'); // Replace with your MongoDB database name

//     // Perform database operations using the 'db' object
//     db.collection('URLs')
//       .find({})
//       .toArray((err, links) => {
//         if (err) {
//           console.error('Error retrieving users from the database:', err);
//           res.status(500).json({ error: 'An error occurred' });
//           return;
//         }
//         res.json(links);
//       });
//   });

// const express = require('express');
// const MongoClient = require('mongodb').MongoClient;

// const app = express();
// app.use(express.json());

// const mongoUri = 'mongodb+srv://aymanboulad06:lgkXyPmLHVzdV3E6@worklinks.8mbisz5.mongodb.net/Links?retryWrites=true&w=majority'; // replace with your credentials

// let _db;

// const connectDB = async () => {
//     const client = await MongoClient.connect(mongoUri, { useUnifiedTopology: true });
//     _db = client.db();
// };

// const getDB = () => {
//     if (_db) {
//         return _db;
//     }
//     throw "No database found!";
// };

// app.get('/items', async (req, res) => {
//     try {
//         const items = await getDB().collection('URLs').find().toArray();
//         console.log(items.links)
//         res.json(items);
//     } catch (err) {
//         res.status(500).json({error: err.toString()});
//     }
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//     connectDB()
//         .then(() => console.log('Connected to MongoDB'))
//         .catch(err => console.error(`Error connecting to MongoDB: ${err}`));
// });

const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(express.json());

const mongoUri =
  "mongodb+srv://aymanboulad06:lgkXyPmLHVzdV3E6@worklinks.8mbisz5.mongodb.net/Links?retryWrites=true&w=majority"; // replace with your credentials

let _db;

const connectDB = async () => {
  const client = await MongoClient.connect(mongoUri, {
    useUnifiedTopology: true,
  });
  _db = client.db();
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

// Fetches the 'links' object from the database
const fetchLinks = async () => {
  try {
    const items = await getDB().collection("URLs").findOne({}, { Links: 1 });
    let body = {
      google: items.links.google,
      youtube: items.links.youtube,
      facebook: items.links.facebook,
    };
    return body;
  } catch (err) {
    throw err;
  }
};

const fetchGTE = async () => {
  try {
    const items = await getDB().collection("URLs").findOne({}, { GTE: 1 });
    return items.GTE;
  } catch (err) {
    throw err;
  }
};

app.get("/links", async (req, res) => {
  try {
    const links = await fetchGTE();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// app.post("/createLink", async (req, res) => {
//   const link = getDB().collection("URLs");
//   link.insertOne(data, (err, result) => {
//     if (err) {
//       console.error("Error inserting data:", err);
//       res.status(500).send("Error inserting data");
//       return;
//     }

//     console.log("Data inserted successfully:", result.insertedCount);
//     res.status(200).send("Data inserted successfully");
//   });
// });

app.post('/createLink', async (req, res) => {
    const link = req.body;
  
    try {
      const result = await getDB().collection('URLs').insertOne(link);
      console.log('Data inserted successfully:', result.insertedCount);
      res.status(200).send('Data inserted successfully');
    } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data');
    }
  });

  //
//   app.put('/updateLink/:linkId', async (req, res) => {
//     const link = req.body;
//     const linkId = req.params.linkId;
//     // const linkId = link._id; // Assuming the link object has an _id field
  
//     try {
//       const result = await getDB().collection('URLs').updateOne(
//         { _id: linkId },
//         // { $set: link }
//         { $set: { links: link } } // Update the "links" field with the provided link object
//       );
  
//       if (result.modifiedCount === 1) {
//         console.log('Data updated successfully');
//         res.status(200).send('Data updated successfully');
//       } else {
//         console.log('No document found to update');
//         res.status(404).send('No document found to update');
//       }
//     } catch (err) {
//       console.error('Error updating data:', err);
//       res.status(500).send('Error updating data');
//     }
//   });


  app.put('/updateLink/:linkId', async (req, res) => {
    const link = req.body;
    const linkId = req.params.linkId;
  
    try {
      const result = await getDB().collection('URLs').updateOne(
        { _id: linkId },
        { $set: { "links.google": link.google, "links.youtube": link.youtube, "links.facebook": link.facebook } }
      );
  
      if (result.modifiedCount === 1) {
        console.log('Data updated successfully');
        res.status(200).send('Data updated successfully');
      } else {
        console.log('No document found to update');
        res.status(404).send('No document found to update');
      }
    } catch (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Error updating data');
    }
  });
  
  //
  

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  connectDB()
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error(`Error connecting to MongoDB: ${err}`));
});
