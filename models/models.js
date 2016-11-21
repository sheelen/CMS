var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new mongoose.Schema({
    email: String,
    password: String, //hash created from password
    firstName: String,
    lastName: String,
    comment:{userComment:String,adminComment:String},
    postalAddress: String,
    city: String,
    state: String,
    country: String,
    institution: String,
    verifiedStatus:String,
    privilege: {type: String, enum:['normal','chair','admin']},
    status: {type:String, enum: ['granted','removed','pending']},
    myConference:[{type:Schema.Types.ObjectId,ref:'Conference'}],
    mySubmission:[{type:Schema.Types.ObjectId,ref:'Submission'}]
});

var conferenceSchema = new mongoose.Schema({
    conferenceTitle: {type:String},
    conferenceDescription: String,
    conferenceStartDate:{type:Date, default: Date.now},
    submissionEndDate:{type:Date},
    reviewEndDate:{type:Date},
    conferenceMembers:[{type:Schema.Types.ObjectId,ref:'User'}],
    conferenceSubmissions:[{type:Schema.Types.ObjectId,ref:'Submission'}],
    createdBy:{type:Schema.Types.ObjectId,ref:'User'},
    //chairMembers:[{type:Schema.Types.ObjectId,ref:'User'}],
    department:String
});

var submissionSchema = new mongoose.Schema({
    submissionTitle: String,
    coAuthors:[{type:Schema.Types.ObjectId,ref:'User'}],
    abstract:String,
    keywords:{type:String},
    uploadStatus: {type:String, enum: ['complete','incomplete']},
    submittedBy:{type:Schema.Types.ObjectId,ref:'User'},
    confID:{type:Schema.Types.ObjectId,ref:'Conference'},
    submissionStatus:{type:String},
    reviewID:{type:Schema.Types.ObjectId,ref:'Review'}
});

var reviewSchema = new mongoose.Schema({
    reviewerExpertise: String,
    overallEvaluation:{type:String, enum: ['Strong Accept','Weak Accept','Borderline','Weak Reject','Strong Reject','NotEvaluated']},
    summary: String,
    strongPoints: String,
    weakPoints: String,
    comments: String,
    reviewStatus:{type:String,enum: ['complete','incomplete']},
    submissionID:{type:Schema.Types.ObjectId,ref:'Submission'},
    reviewerID: {type:Schema.Types.ObjectId,ref:'User'},
    conferenceID:{type:Schema.Types.ObjectId,ref:'Conference'}
});

mongoose.model('User', userSchema);
mongoose.model('Conference',conferenceSchema);
mongoose.model('Submission',submissionSchema);
mongoose.model('Review', reviewSchema);