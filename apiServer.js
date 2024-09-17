const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://harshil:harshil@cluster0.ujgwg.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Global for general use
var userCollection;
var orderCollection;

client.connect(err => {
   userCollection = client.db("giftdelivery").collection("users");
   orderCollection = client.db("giftdelivery").collection("orders");
   
  // perform actions on the collection object
  console.log ('Database up!\n')
 
});


app.get('/', (req, res) => {
  res.send('<h3>Welcome to Gift Delivery server app!</h3>')
})

 
app.get('/getUserDataTest', (req, res) => {

	console.log("GET request received\n"); 

	userCollection.find({}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
			console.log("Some error.. " + err + "\n");
			res.send(err); 
		} else {
			console.log( JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>"); 
		}

	});

});


app.get('/getOrderDataTest', (req, res) => {

	console.log("GET request received\n"); 

	orderCollection.find({},{projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.send(err); 
		} else {
			console.log( JSON.stringify(docs) + " have been retrieved.\n");
			res.status(200).send("<h1>" + JSON.stringify(docs) + "</h1>"); 
		}

	});

});


app.post('/verifyUser', (req, res) => {

	console.log("POST request received : " + JSON.stringify(req.body) + "\n"); 

	loginData = req.body;

	userCollection.find({email:loginData.email, password:loginData.password}, {projection:{_id:0}}).toArray( function(err, docs) {
		if(err) {
		  	console.log("Some error.. " + err + "\n");
			res.send(err);
		} else {
		    console.log(JSON.stringify(docs) + " have been retrieved.\n");
		   	res.status(200).send(docs);
		}	   
		
	  });

});

app.post('/signup', (req, res) => {
    console.log("POST request received for signup: " + JSON.stringify(req.body) + "\n"); 
    const userData = req.body;

    userCollection.insertOne(userData, (err, result) => {
        if (err) {
            console.error("Error inserting user data: " + err + "\n");
            res.status(500).send(err);
        } else {
            console.log("User record inserted with ID " + result.insertedId + "\n");
            res.status(200).send(result);
        }
    });
});

app.post('/getUserOrders', (req, res) => {
    console.log("POST request received for user orders: " + JSON.stringify(req.body) + "\n"); 
    const { email } = req.body;

    orderCollection.find({ customerEmail: email }, { projection: { _id: 0 } }).toArray((err, docs) => {
        if (err) {
            console.error("Error retrieving orders: " + err + "\n");
            res.status(500).send(err);
        } else {
            console.log("Orders retrieved: " + JSON.stringify(docs) + "\n");
            res.status(200).send(docs);
        }
    });
});

app.post('/postOrderData', function (req, res) {
    
    console.log("POST request received : " + JSON.stringify(req.body) + "\n"); 
    
    orderCollection.insertOne(req.body, function(err, result) {
		if (err) {
			console.log("Some error.. " + err + "\n");
			res.send(err);
		}else {
			console.log("Order record with ID "+ result.insertedId + " have been inserted\n"); 
			res.status(200).send(result);
		}
		
	});
       
});

app.delete('/deleteOrders', (req, res) => {
    console.log("DELETE request received to delete orders: " + JSON.stringify(req.body) + "\n");
    const { orderIds } = req.body;

    orderCollection.deleteMany({ orderNo: { $in: orderIds } }, (err, result) => {
        if (err) {
            console.error("Error deleting orders: " + err + "\n");
            res.status(500).send(err);
        } else {
            console.log(result.deletedCount + " orders deleted.\n");
            res.status(200).send({ deletedCount: result.deletedCount });
        }
    });
});

  
app.listen(port, () => {
  console.log(`Gift Delivery server app listening at http://localhost:${port}`) 
});
