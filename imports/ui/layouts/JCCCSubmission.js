import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './JCCCSubmissionTemplate.html';

Template.JCCCSubmissionTemplate.helpers({
    logDate: function() {
        const data = Template.instance().data;
        this.date = data.submitted.toLocaleString();
        return this.date;
    },
    groupName: function() {
        const data = Template.instance().data;
        return data.name;
    },
    allocation: function() {
        const data = Template.instance().data;
        return "$" + data.allocation;
    },
    requestedAmount: function() {
        const data = Template.instance().data;
        return "$" + data.requestedAmount;
    },
    eventName: function() {
        const data = Template.instance().data;
        return data.eventName;
    },
    requestType: function() {
        const data = Template.instance().data;
        return data.requestType;
    },
    applicationStatus: function() {
        const data = Template.instance().data;
        return data.applicationStatus;
    },
    decisionDetails: function() {
        const data = Template.instance().data;
        return data.decisionDetails;
    }
});

Template.JCCCSubmissionTemplate.rendered = function() {
    const data = Template.instance().data;
    console.log(data);
    console.log(data._id);
    const statusId = "td#" + data._id + "-status";
    const appStatus = data.applicationStatus;
    $(statusId).addClass('right aligned');

    if (appStatus.toLowerCase().includes("accept")) {
        console.log(appStatus.toLowerCase());
        $(statusId).addClass('positive');
    } else if (appStatus.toLowerCase().includes("reject")) {
        console.log('reject' + appStatus.toLowerCase());
        $(statusId).addClass('negative');
    }

    this.$('i.info.circle.icon').popup();
};

