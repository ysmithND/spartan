'use strict';
var inquirer = require('inquirer');

 function question(){

     console.log("Thanks for using _spartan! Here's how it works: \n\n * After answering a few questions, _spartan will generate a policy file (security.json).\n\n * Based upon the contents, _spartan generates the basic boilerplate code (security.js) which can be referenced in your application.\n\n * _spartan will also update the application's package.json file if additional dependencies are required.\n\n");

    var nq = [
      {
        // why ask this? Because the response may change the response headers that are set on the application
        type : 'confirm',
        name : 'exposure',
        message : "Q1. Application Exposure : Will your application be available over the internet or will it only be internally accessible? \n **Hint** : if this is a possibility in the future, say 'Yes'",
        default : true
      },
      {
        type : 'confirm',
        name : 'access',
        message : "Q2. Application Access : Will your application require any kind of sign-in or authentication functionality in order for users to access certain routes or services? \n **Hint** : if this is a possibility in the future, say 'Yes'",
        default : true
      },
      {
        type : 'confirm',
        name : 'sessions',
        message : "Q3. Sessions : Will the application have predetermined session lengths? \n **Hint** : if this is a possibility in the future, say 'Yes'",
        default : true
      },
      {
        type : 'input',
        name : 'sessionLength',
        message : "Q3.1 What is the default session length (TTL) in seconds?",
        default : 600,
        when : function(answers){
          return answers.sessions
        },
        filter : Number
      },
      {
        type : 'confirm',
        name : 'secureTransport',
        message : "Q4. Secure Transport : Do you plan to use secure transport (HTTPS) throughout the application? \n **Hint** : if your application offers HTTP service on any route say 'No'",
        default : true
      },
      {
        type : 'list',
        name : 'content',
        message : "Q5. Content Acquisition : Is all of the data/content generated and processed within your application? \n **Hint** if you plan to use externally sourced APIs at any point, choose the second answer. You'll have the opportunity to specify these sources later\n",
        default : 0,
        choices : [
          "All of the data and content comes from sources that I own or control\n",
          "Some of the data and content comes from sources that I don't own or control\n"
        ]
      },
      {
        type : 'editor',
        name : 'contentSources',
        message : "Q5.1. Content Sources: Sweet! What are those sources? (JSON)\n **Hint** While specificity is more secure, it's also limiting. Use '*' operand for more flexible options. Use the formatting in the default",
        default : '{"default" : ["self", "www.redit.com"], "media" : ["self, *.pinterest.com", "https://*.flickr.com", "ftp://video.domain.com:21"], "images" : ["self"], "styles" : ["*.bootstrap.com", "https://materializecss.com", "self"], "scripts" : ["self"], "frames" : ["none"]}',
        when : function(answers){
          return answers.content == "Some of the data and content comes from sources that I don't own or control\n"
        },
        filter : function(value, e){
          try {
            return JSON.parse(value);
          }
          catch (e) {
           return "Unable to successfully format this object => " + e;
          }
        }
      },
      {
        type : 'confirm',
        name : 'forms',
        message : "Q6. Forms: Will your application utilize input forms for data collection?\n **Hint** Consider collection of ratings, feedback, reviews, search, profiles etc...\n",
        default : true
      },
      {
        //why ask about cache? Because some generated data and user-provided data may be considered sensitive, and we want to make sure that we DON'T cache that information
        type : 'confirm',
        name : 'cacheStrategy',
        message : "Q7. Caching Strategy: Is any of the data or pages generated in your application publicly accessible via caching services or geographically dispersed Content Delivery Network (CDN)?\n **Hint** If this is a possibility in the future, choose 'yes'.",
        default : false

      },
      {
        type : 'input',
        name : 'cacheTtl',
        message : "Q7.1. Cache Time To Live (TTL): For MOST public data generated by the application, how long (in seconds) should this information be cached?\n**Hint** Shorter TTLs will require more requests of the application origin; longer TTLs may result in stale, invalid data. You can override this on a per-route basis",
        default : 15780000,
        when : function(answers){
          return answers.cacheStrategy
        },
        validate: function(value) {
          var valid = !isNaN(parseFloat(value));
          return valid || 'Please enter a number';
        },
        filter: Number
      },
      {
        type : 'input',
        name : 'logging',
        message : "Q8. Logging and Auditing: Where will application logs be stored? (absolute path)",
        default : '/var/log/appName/'
      },
    ]
    inquirer.prompt(nq).then(answers => {
      console.log('\n Here is your application security policy:\n');
      console.log(JSON.stringify(answers, null, '  '));
    });
    // .then(inquirer.prompt([
    //     {
    //       type : 'confirm',
    //       name : 'confirmValues',
    //       message : 'Is this correct?',
    //       default : true
    //     }
    //   ]).then(answers => {
    //     if (answers.confirmValues){
    //       console.log ("security.json was created")
    //     }
    //     else {
    //       console.log("security.json was not written")
    //     }
    //   })
}
module.exports.question = question;