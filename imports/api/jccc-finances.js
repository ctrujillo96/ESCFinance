import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const JCCCFinances = new Mongo.Collection('jccc-finances');
JCCCFinances.schema = new SimpleSchema({
    "applicationID": {
        type: String,
        label: "JCCC Application ID"
    },
    "totalTransaction": {
        type: Number,
        decimal: true,
        label: "Total Transaction Amount"
    },
    "ccTransaction": {
        type: Number,
        decimal: true,
        label: "CC Transaction Amount"
    },
    "seasTransaction": {
        type: Number,
        decimal: true,
        label: "SEAS Transaction Amount"
    },
    "gsTransaction": {
        type: Number,
        decimal: true,
        label: "GS Transaction Amount"
    },
    "bcTransaction": {
        type: Number,
        decimal: true,
        label: "BC Transaction Amount"
    },
    "receiptAmount": {
        type: Number,
        decimal: true,
        label: "Post-Receipt Total"
    }
});

JCCCFinances.attachSchema(JCCCFinances.schema);

export { JCCCFinances };

Meteor.methods({
    'jccc-finances.insert'(formData) {
        JCCCFinances.schema.validate(formData);
        JCCCFinances.insert(formData);
    },
    'jccc-finances.updateByID'(transactionId, formData) {
        JCCCFinances.update({ _id: transactionId }, { $set: formData });
    },
    'jccc-finances.updateByAppID'(requestId, formData) {
        JCCCFinances.update({ applicationID: requestId }, { $set: formData });
    }
});

