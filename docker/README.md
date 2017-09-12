docker build .\ -t phantom

docker run -t phantom  http://192.168.137.1/sample_test.json

Where the sample_test.json file is an externally hosted JSON file containing the steps you want phantomJS to perform. Each "step" in the json file contains information needed to allow PhantomJS to interact with HTML DOM elements using native JS APIs; getElementById, getElementsByName, getElementsByClassName, & querySelectorAll. Familiarity with how each of these 4 methods work will help tremendously when it comes to making a test file.

The JSON file has 2 top level properties;
  "url" - the URL you want to run the test against
  "steps" - an array of 1 or more "Step" objects. 
  
A "Step" object is a JSON document detailing what PhantomJS should do at a particular step in a sequence. This document has the following structure;
  "name" - a name for the step which will be printed out in the console as the step executes. 
  ["description"] - Optional: additional info to make the step meaningful for future people reading the JSON
  ["fields"] - Optional: An Array containing selector details and a value for each HTML field you want to interact with
    [{
      SELECTOR - Required, see below,
      "value" - required: what value should the field be set to
    }]
  ["actions"] - Optional: An Array containing selector details for 1 or more HTML elements you want to interact with.
    [{
      SELECTOR - Required, see below,
      "action" - required: currently only supports "click" as a value,
      ["wait"] - Optional: Amount of time in milliseconds to wait before clicking the desired element
      ["content"] - Optional: the full path to a file on disk to upload to an HTML File Input
    }]


Where SELECTOR in each field or action item is 1 of the following optional attributes
      ["id"] - Optional: getElementById
      ["name"] - Optional: getElementsByName
      ["classname"] - Optional: getElementsByName
      ["selector"] - Optional: querySelectorAll


See the sample_test.json file for a multi-step example.
