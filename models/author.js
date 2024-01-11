
const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100},
    surname: { type: String, required: true, maxLength: 100},
    date_of_birth: { type: Date},
    date_of_death: {type: Date},
});

// Virtual for author's full name

AuthorSchema.virtual("name").get(function () {
    // To avoid errors in cases where an author does not have either a family name or first name
     // We want to make sure we handle the exception by returning an empty string for that case

     let fullname = "";

     if(this.first_name && this.surname) {
        fullname = `${this.surname}, ${this.first_name}`;
     }

     else if(this.first_name) {
        fullname = `${this.first_name}`;
     }

     else if(this.surname) {
        fullname = `${this.surname}`;
     }

     return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_format").get(function() {
   return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : "";
});

AuthorSchema.virtual("date_of_death_format").get(function() {
   return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : "Live";
});

AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function() {
   return DateTime.fromJSDate(this.date_of_birth).toISODate();
});

AuthorSchema.virtual("date_of_deadth_yyyy_mm_dd").get(function() {
   return DateTime.fromJSDate(this.date_of_death).toISODate();
})





// Export Model

module.exports = mongoose.model("Author", AuthorSchema);