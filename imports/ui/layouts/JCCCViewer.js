import { Template } from 'meteor/templating';

import { JCCCRequests } from '../../api/jccc-requests.js';

import './JCCCViewerTemplate.html';

Template.JCCCViewer.onCreated( function() {
    this.viewing = new ReactiveVar(false);
    this.requestInView = new ReactiveVar(undefined);
});

Template.JCCCViewer.rendered = function() {
    $('.ui.selection.dropdown').dropdown();
}

Template.JCCCViewer.events({
    'click .item': function(e, template) {
        Template.instance().viewing.set(true);
        Template.instance().requestInView.set(e.target.id);
        console.log(e.target.id);
    }
});

Template.JCCCViewer.helpers({
    requests: function() {
        return JCCCRequests.find({}, {sort: {'submitted': -1}});
    },
    isViewing: function() {
        return Template.instance().viewing.get();
    },
    requestInView: function() {
        return JCCCRequests.findOne({ _id: Template.instance().requestInView.get() });
    },
    strReceiptSubmitted: function() {
        return this.receiptSubmitted.toString();
    }
});
