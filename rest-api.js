var mongoClient = require("mongodb").MongoClient;
var express = require("express");
var cors = require("cors");
var app = express();
var conString = "mongodb://127.0.0.1:27017";

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// Resgister User
app.post('/register-user',(req,res)=>{
    var user = {
        UserId : req.body.UserId,
        UserName : req.body.UserName,
        Password : req.body.Password,
        Email : req.body.Email,
        Mobile : req.body.Mobile
    }
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Users").insertOne(user).then(()=>{
            console.log('User Register Successfully');
            res.end();
        })
    })
})
// Adding Appointments
app.post('/add-task',(req,res)=>{
    var Appointments = {
        AppointmentId : parseInt(req.body.AppointmentId),
        Title : req.body.Title,
        Description : req.body.Description,
        Date : new Date(req.body.Date),
        UserId : req.body.UserId
    }
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").insertOne(Appointments).then(()=>{
            console.log('Appointment Added Successfully');
            res.end();
        })
    })
})
// updating all tasks bases on userid
app.put('/update-tasks',(req,res)=>{
    var Userid = req.params.Userid;
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").find({}).toArray().then((collection)=>{
            res.send(collection)
            console.log(`User Data of ${Userid} fetched Successfully`);
            res.end();
        })
    })
})

 // updating existing appointments

 app.put('/update-task/:id',(req,res)=>{
    var id = parseInt(req.params.id);
    var UpdateTask = {
        AppointmentId : parseInt(req.body.AppointmentId),
        Title : req.body.Title,
        Description : req.body.Description,
        Date : new Date(req.body.Date),
        UserId : req.body.UserId
    }
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").updateOne({AppointmentId:id},{$set:UpdateTask}).then(()=>{
            console.log('Appointment Update Successfully');
            res.end();
        })
    })
})

// deleting query

 app.delete('/delete-task/:id',(req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").deleteOne({AppointmentId:id}).then(()=>{
            console.log('Appointment Deleted Successfully');
            res.end();
        })
    })
})

// get tasks of user

app.get('/get-tasks/:Userid',(req,res)=>{
    var Userid = req.params.Userid;
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").find({UserId:Userid}).toArray().then((collection)=>{
            res.send(collection)
            console.log(`User Data of ${Userid} fetched Successfully`);
            res.end();
        })
    })
})

//get users Based on AppointmentId
app.get('/get-appointments/:id',(req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").findOne({AppointmentId:id}).then((Data)=>{
            res.send(Data);
            console.log(`Data of Userid:${id} fetched Successfully`);
            res.end();
        })
    })
})

//get all users 
app.get('/get-users',(req,res)=>{
    mongoClient.connect(conString).then((clientObj)=>{
        var database = clientObj.db("to-do");
        database.collection("Users").find().toArray().then((Users)=>{
            res.send(Users);
            res.end();
            console.log(`Users Fetched Successfully`);
        })
    })
})

// get-task
app.get('/get-tasks',(req,res)=>{
    mongoClient.connect(conString).then(clientObj=>{
        var database = clientObj.db("to-do");
        database.collection("Appointments").find().toArray().then((Tasks)=>{
            res.send(Tasks);
            res.end();
        })
    })
})
app.listen(6600);
console.log(`Server Started : http://127.0.0.6600`);