import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { JCCCRequests } from '../../api/jccc-requests.js';
import { JCCCSettingsDB } from '../../api/jccc-settings.js';

import './JCCCApplyLayout.html';

const validationRules = {
    applicantEmail: {
        identifier: 'applicantEmail',
        rules: [{ type: 'email', prompt: "Please enter your email" }]
    },
    studentGroup: {
        identifier: 'studentGroup',
        rules: [{ type: 'empty', prompt: "Please enter the name of your student group" }]
    },
    clubEmail: {
        identifier: 'clubEmail',
        rules: [{ type: 'email', prompt: "Please enter your club's email address" }]
    },
    contactName: {
        identifier: 'contactName',
        rules: [{ type: 'empty', prompt: "Please enter the name of the club's point of contact" }]
    },
    contactEmail: {
        identifier: 'contactEmail',
        rules: [{ type: 'email', prompt: "Please enter the email of the club's point of contact" }]
    },
    contactNumber: {
        identifier: 'contactNumber',
        rules: [{ type: 'empty', prompt: "Please enter the phone number of the club's point of contact" }]
    },
    advisorName: {
        identifier: 'advisorName',
        rules: [{ type: 'empty', prompt: "Please enter your advisor's name" }]
    },
    advisorEmail: {
        identifier: 'advisorEmail',
        rules: [{ type: 'email', prompt: "Please enter your advisor's email" }]
    },
    gbRepName: {
        identifier: 'gbRepName',
        rules: [{ type: 'empty', prompt: "Please enter your governing board representative's name" }]
    },
    gbRepEmail: {
        identifier: 'gbRepEmail',
        rules: [{ type: 'email', prompt: "Please enter your governing board representative's email" }]
    },
    allocation: {
        identifier: 'allocation',
        rules: [{ type: 'empty', prompt: "Please report the current year's allocation for your club as a decimal"}]
    },
    ccPercentage: {
        identifier: 'ccPercentage',
        rules: [{ type: 'empty', prompt: "Please enter the % of club members in CC" }]
    },
    seasPercentage: {
        identifier: 'seasPercentage',
        rules: [{ type: 'empty', prompt: "Please enter the % of club members in SEAS" }]
    },
    gsPercentage: {
        identifier: 'gsPercentage',
        rules: [{ type: 'empty', prompt: "Please enter the % of club members in GS" }]
    },
    bcPercentage: {
        identifier: 'bcPercentage',
        rules: [{ type: 'empty', prompt: "Please enter the % of club members in BC" }]
    },
    sgaNumber: {
        identifier: 'sgaNumber',
        rules: [{ type: 'empty', prompt: "Please write N/A if not applicable" }]
    },
    columbiaNumber: {
        identifier: 'columbiaNumber',
        rules: [{ type: 'empty', prompt: "Please write N/A if not applicable" }]
    },
    departmentNumber: {
        identifier: 'departmentNumber',
        rules: [{ type: 'empty', prompt: "Please write N/A if not applicable" }]
    },
    projectNumber: {
        identifier: 'projectNumber',
        rules: [{ type: 'empty', prompt: "Please write N/A if not applicable" }]
    },
    requestType: {
        identifier: 'requestType',
        rules: [{ type: 'empty', prompt: "Please choose one of the 3 valid request types" }]
    },
    eventName: {
        identifier: 'eventName',
        rules: [{ type: 'empty', prompt: "Please enter the name of your event" }]
    },
    eventTime: {
        identifier: 'eventTime',
        rules: [{ type: 'empty', prompt: "Please enter your event's date and time" }]
    },
    eventLocation: {
        identifier: 'eventLocation',
        rules: [{ type: 'empty', prompt: "Please enter the location of your event" }]
    },
    estAttendance: {
        identifier: 'estAttendance',
        rules: [{ type: 'empty', prompt: "Please enter an estimate for your event's attendance" }]
    },
    eventDescription: {
        identifier: 'eventDescription',
        rules: [{ type: 'empty', prompt: "Please enter a description for your event" }]
    },
    audienceDescription: {
        identifier: 'audienceDescription',
        rules: [{ type: 'empty', prompt: "Please identify your event's target audience" }]
    },
    costBreakdown: {
        identifier: 'costBreakdown',
        rules: [{ type: 'empty', prompt: "Please explain the costs for your event" }]
    },
    requestedAmount: {
        identifier: 'requestedAmount',
        rules: [{ type: 'empty', prompt: "Please enter your requested amount" }]
    },
    alternateFunding: {
        identifier: 'alternateFunding',
        rules: [{ type: 'empty', prompt: "Please include any other attempt's your club has made for fundraising" }]
    }
};

var parseResponse = function(data) {
    const insertData = {
        "submitted": new Date(),
        "name": data.studentGroup,
        "clubEmail": data.clubEmail,
        "allocation": data.allocation,
        "ccPercentage": data.ccPercentage,
        "seasPercentage": data.seasPercentage,
        "gsPercentage": data.gsPercentage,
        "bcPercentage": data.bcPercentage,
        "governingBoard": data.govBoard,
        "requestType": data.requestType,
        "eventName": data.eventName,
        "eventTime": data.eventTime,
        "eventLocation": data.eventLocation,
        "requestedAmount": data.requestedAmount,
        "applicationStatus": "Pending",
        "decisionDetails": "N/A",
        //
        // Private
        //
        "pocName": data.contactName,
        "pocEmail": data.contactEmail,
        "pocNumber": data.contactNumber,
        "advisorName": data.advisorName,
        "advisorEmail": data.advisorEmail,
        "gbRepName": data.gbRepName,
        "gbRepEmail": data.gbRepEmail,
        "sgaNumber": data.sgaNumber,
        "columbiaNumber": data.columbiaNumber,
        "departmentNumber": data.departmentNumber,
        "projectNumber": data.projectNumber,
        "eventDescription": data.eventDescription,
        "estAttendance": data.estAttendance,
        "audienceDescription": data.audienceDescription,
        "costBreakdown": data.costBreakdown,
        "alternateFunding": data.alternateFunding,
        "receiptSubmitted": false
    };

    return insertData;
}

var sendEmails = function(data) {
    const adminSetting = JCCCSettingsDB.findOne();
    const from = "Finance Committee <" + adminSetting.pocEmail + ">";

    //send form response to JCCC-Head
    var to = adminSetting.pocEmail;
    var subject = adminSetting.emailTag + " Application Form Receipt";
    var body = data.studentGroup + " requests $" + data.requestedAmount + " for the following: \n\n" + JSON.stringify(data)

    Meteor.call('sendEmail', to, from, subject, body);
    
    //send additional information to student group POC
    to = data.contactEmail;
    subject = "JCCC Application Additional Information";
    body = "Hi!\n\n"
         + "Thank you for beginning the application for JCCC! There are still a few parts to the application, so please make sure you’ve completed the following instructions by Saturday at noon, to be considered in time.\n\n"
         + "Instructions: \n"
         + "1. Visit the following links to generate your budget template:\n"
         + "https://docs.google.com/a/columbia.edu/spreadsheets/d/1ZKnZHOTIjYitDcCLDU38x2HPNZGcOLgdWzVNnvU3Q30/copy\n"
         + "2. Fill in the templates! If you have any questions, feel free to reach out to us at treasurers@columbia.edu and we will help as best we can.\n"
         + "3. Share the documents with us at treasurers@columbia.edu and with your club advisor.\n"
         + "4. Sign up for a presentation slot here:\n"
         + "https://docs.google.com/a/columbia.edu/spreadsheets/d/1cZcaCNRXHdtgDBiOrkeVho2H0JnuMJDcfa6ul0CZ0ug/edit?usp=sharing\n\n"
         + "Good luck, and we look forward to reviewing your application!\n\n"
         + "Best Regards,\n"
         + "JCCC\n";

    Meteor.call('sendEmail', to, from, subject, body);
}

var testEmail = function() {
    const to = "saarthak.sarup+esctest@gmail.com";
    const from = "ss4754@columbia.edu";
    const subject = "TEST";
    const body = "EMPTY";

    Meteor.call('sendEmail', to, from, subject, body);
}

var submitForm = function(template) {
    $('.ui.form').form({ fields: validationRules, inline: true });

    if( $('.ui.form').form('is valid') ) {
        const data = $('.ui.form').form('get values');
        const insertData = parseResponse(data);
        try {
            Meteor.call('jccc-requests.insert', insertData);
            sendEmails(data);
            $('.ui.form').form('clear');
        } catch (e) {
            console.log(e);
            // TODO:
            // Modal should say there was an error and the applicant should
            // contact XXX@XXX.XXX
        }
    } else {
        $('.ui.form').form('validate rules');
    }
}

Template.JCCCApplyLayout.events({
    'submit form': function(e, template) {
        console.log(JCCCRequests.find({}).fetch());
        e.preventDefault();
        //testEmail();
        submitForm(template);
        return false;
    }
});

Template.JCCCApplyLayout.rendered = function() {
    this.$('.ui.selection.dropdown').dropdown();
}
