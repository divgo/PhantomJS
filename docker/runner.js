
var page = require('webpage').create(), // new WebPage(),
    system = require('system'), // imported so we can utilize arguments passed to phantom
    hostname = "unprovided", // default hostname to a string so screenshots still save if variable missing
    step_data_url, // a valid URL where I can download the TestCase json file
    bHasTestCase = false, // do I have a TestCase loaded? needed to avoid accidental step iteration in the onRequestCompleted callback
    testcase = null, // object used to store the JSON object retrieved from the server
    TestGlobals = null;

page.viewportSize = {
    width: 1024,
    height: 768
};

// variables used to manage the step execution of a given testcase
var
    current_step = -1,
    max_step = -1,
    current_step_info = null,
    test_run_id = null;

page.settings.userAgent = "PhantomJS Automation";
// console.log(os.hostname());

// Arg[0] = JS file for PhantomJS to execute.
// Arg[1] = URL of external JSON file containing test steps.
// Arg[2] = Machine name, all screenshots are prepended with a machinename. Allows us to separate screenshots generated when running tests via docker.
if ( system.args.length < 2 ) {
    console.log("address is needed to run this test");
    phantom.exit();
} else {

    step_data_url = system.args[1];
    if ( system.args.length == 3 ) {
        hostname = system.args[2];
    }

    console.log(hostname+"\n" + step_data_url);

    console.log("Loading TestCase");
    page.open(step_data_url, function() {
        console.log("page.plainText");
        console.log(page.plainText);
        testcase = JSON.parse(page.plainText);
        if ( testcase != null ) {

            if ( testcase.globals ) {
                window.TestGlobals = testcase.globals
            };

            if ( testcase.steps != null ) {
                max_step = testcase.steps.length; // Determine the total number of test steps
                console.log("detected " + testcase.steps.length + " test steps");
                startTest();
            }
        } else {
            phantom.exit(); // no test case received, so exiting
        }
    });
}

function startTest() {

    console.log("Starting Test Case");
    // console.log(testcase);

    if ( testcase.url == undefined || testcase.url == null ) {
        console.log("Test Case is missing a URL. Cant do much without so I am exiting... :-(");
        phantom.exit();
    }

    address = testcase.url;
    console.log("logging into " + address);

    page.open(address, function(status) {
        if ( status != "success" ) { // check for failure to load. Step execution will commence when onLoadFinished is triggered
            page.render("screenshot-failure-" + (new Date).getTime() + ".png");
            console.log("failed to open: " + address);
            console.log(status);
            phantom.exit();
        }
    });
}

function interrogateStep(step, pageRef) { // method used to parse a given test step and perform the configured actions
    console.log("interrogating Step: " + step.name);
    console.log(pageRef.title);
    
    page.evaluate(function(step, PR) {

        console.log(step.name);
        console.log(PR.title);
        // printLine("inside"); // method available in the injected commands.js file.

        if ( step.fields != null ) {
            step.fields.map(function(field) {
                console.log(field);
                setFieldValues(field); // method available in the injected commands.js file.
            });
        };

        if ( step.actions != null ) {
            // if ( step.actions[0].action == "upload") {
            //     PR.uploadFile(step.actions[0].name, step.actions[0].content)
            // } else {
            //     performAction(step.actions[0], PR);
            // }            
            step.actions.map(function(action) {
                console.log(action.action);
                return performAction(action, PR); // method available in the injected commands.js file.
            });
        }
    }, step, pageRef); // pass "step" as an argument to the evaluate method
}

function imageName(ident, args) { // method which returns all screenshot names in a consistent manner
    var x = (new Date).getTime();
    console.log("event: " + ident + "-" + x);
    console.log(args);
    return hostname + "-" + ident + "-" + x.toString() + ".png";
    // "screenshots/" + 
}
page.onLoadStarted = function(arg) {
    console.log("event: onLoadStarted");
    console.log(arg);
    //page.render("screenshot-onLoadStarted-" + (new Date).getTime() + ".png");
};
page.onLoadFinished = function(arg) { // callback fired whenever we move from page to page in the webapp. also called when loading the testcase.json file

    if ( testcase != null && !bHasTestCase ) { // condition when we have first loaded the external testcase json file
        bHasTestCase = true;
    } else {

        page.render(imageName("onLoadFinished", arg));

        current_step++;
        if ( current_step < max_step ) {
            current_step_info = testcase.steps[current_step];
            console.log("Current Step: " + current_step_info.name);

            if ( current_step_info.target_frame != undefined ) { // in a frames/iframe application, we must switch context to the desired target frame
                console.log("switching frame context");
                page.switchToFrame(current_step_info.target_frame);
            }

            if (page.injectJs('commands.js')) { // Inject our Commands so we can perform actions configured in testcase.json file
                interrogateStep(current_step_info, page);
            }
        } else {
            console.log("Test is complete, no more steps to run");
            phantom.exit();
        }
    }

};

page.onResourceError = function(arg) {
    console.log("event: onResourceError");
    console.log('Unable to load resource (#' + arg.id + 'URL:' + arg.url + ')');
    console.log('Error code: ' + arg.errorCode + '. Description: ' + arg.errorString);
};
page.onConsoleMessage = function(arg) {
    console.log("event: onConsoleMessage");
    console.log(arg);
    //page.render("screenshot-onConsoleMessage-" + (new Date).getTime() + ".png");
};
// most of the following callbacks probably arent needed. They are uncommented cause I haven't seen them fire yet and they might be interesting
page.onAlert = function(arg) {
    page.render(imageName("onAlert", arg));
};
page.onCallback = function(arg) {
    page.render(imageName("onCallback", arg));
};
page.onClosing = function(arg) {
    page.render(imageName("onClosing", arg));
};
page.onConfirm = function(arg) {
    page.render(imageName("onConfirm", arg));
};
page.onError = function(arg) {
    page.render(imageName("onError", arg));
};
page.onFilePicker = function(arg) {
    console.log(current_step_info.actions[0].content);
    // page.render(imageName("onFilePicker", arg));
    return current_step_info.actions[0].content;
};
page.onInitialized = function(arg) {
    page.render(imageName("onInitialized", arg));
};
page.onPageCreated = function(arg) {
    page.render(imageName("onPageCreated", arg));
};
page.onPrompt = function(arg) {
    page.render(imageName("onPrompt", arg));
};
page.onResourceTimeout = function(arg) {
    page.render(imageName("onResourceTimeout", arg));
};
page.onUrlChanged = function(arg) {
    page.render(imageName("onUrlChanged", arg));
};
// These callbacks are noisy as hell, so I commented them out
// page.onResourceReceived = function(arg) {
//     console.log("event: onResourceReceived");
//     console.log(arg);
//     page.render("screenshot-onResourceReceived-" + (new Date).getTime() + ".png");
// };
// page.onResourceRequested = function(arg) {
//     console.log("event: onResourceRequested");
//     console.log(arg);
//     page.render("screenshot-onResourceRequested-" + (new Date).getTime() + ".png");
// };
// page.onNavigationRequested = function(arg) {
//     console.log("event: onNavigationRequested");
//     console.log(arg);
//     page.render("screenshot-onNavigationRequested-" + (new Date).getTime() + ".png");
// };