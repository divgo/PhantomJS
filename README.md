# PhantomJS
Headless browser testing using PhantomJS

 - phantom-step-runner.js = JS script which performs automated browser testing using PhantomJS. Expects jQuery to be included in your application.
 - commands.js = JS file injected into every "page" containing methods that interprete the test "steps" 
 - test_sample.json = an test case sample file containing a few examples of different steps.
 
 # How to run
 phantomjs phantom-step-runner.js http://your-domain-name.com/test_sample.json [Some Machine Name]
 
