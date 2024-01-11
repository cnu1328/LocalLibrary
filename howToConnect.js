const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const mongoDB = "mongodb://127.0.0.1/my_database";

//Wait for database to connect, logging an error if there is a problem

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

//Define a schema 

const schema = mongoose.schema;

const someSchemaModel = schema({
    a_string : String,
    a_date : Date,
});

//compile model from schema

const someModel = mongoose.model("someModel", someSchemaModel);


// Create an instance of model SomeModel
const ModelInstance = new someModel({name : "srinu"});

/// Save the new model instance asynchronously
await ModelInstance.save();

//also instance like

await someModel.create({name : "srinu"});


/// Access model field values using dot notation
// Change record by modifying the fields, then calling save().

ModelInstance.name = "Mahesh";
await ModelInstance.save();

//Searching for records

const Athlete = mongoose.model('Athlete', yourSchema);

// find all athletes who play tennis, returning the 'name' and 'age' fields

const tennisPlayers = Athlete.find(
    {sport : 'Tennis'},
    "name age",
).exec();

//Otherwise
// find all athletes that play tennis
const query = Athlete.find({sport : 'Tennis'});

// selecting the 'name' and 'age' fields
query.select("name age");

// limit our results to 5 items
query.limit(5);

//sort by age

query.sort({age : -1});

// execute the query at a later time

query.exec();

//It aslo same as

Athlete.find()
    .where('sport')
    .equals('Tennis')
    .where('age')
    .gt(17)
    .lt(50) //additional where query
    .limit(5)
    .sort({age: -1})
    .select("name age")
    .exec();



// Working with related documents — population

const Schema = mongoose.schema;

const authorSchema = new Schema({
    name : String,
    stories : [{type : Schema.Types.ObjectId, ref: "Story"}],
});

const storySchema = new Schema({
    author : {type: Schema.Type.ObjectId, ref : "Author"},
    title : String,
});

const Story = mongoose.model("Stroy", storySchema);
const Author = mongoose.model("Author", authorSchema);

const bob = new Author({name : "Bob Smith"});

await bob.save();

// Bob now exists, so lets create a story

const story = new Story({
    title : "Bob goes sledding",
    author : bob_id,  //// assign the _id from our author Bob. This ID is created by default!
});

await story.save();

Story.findOne({title : "Bob goes sledding"})
    .populate("author") //// Replace the author id with actual author information in results
    .exec();

    // One schema/model per file

// File: ./models/somemodel.js

// create a model schema 

/*
    const someSchemaModel = schema({
        a_string : String,
        a_date : Date,
    });
*/

module.exports = mongoose.model("someModel", SomeModelSchema);

//Other file

const SomeModel = require("..models/somemodel");

const ModelInstances = await SomeModel.find().exec();


// mongodb+srv://srinudarpally:<mongoDBCnu1328>@cluster0.7piqncz.mongodb.net/local_library?retryWrites=true&w=majority