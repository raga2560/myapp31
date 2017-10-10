'use strict';

module.exports = {
  validate_email: function(email, validationid, mailOptions) {
    mailOptions.html = 
      'Hi <br/>' +
      'Use the validation-id : ' + validationid + '<br/>' +
      'to validate email-id for ptpconnect <br/>' + 
	  'Regards <br/>' +
	  'admin' + '<br/>';
      
    
    mailOptions.subject = 'validation id for ptpconnect';
    return mailOptions;
  },
  mytest : function() {
	  console.log("in mytest");
  }
};
