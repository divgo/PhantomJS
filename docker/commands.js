window.findTarget = function(item) { // helper function to find a DOM node based on input settings
    var target;
    
    if ( item.id != undefined) {
        console.log("field by id: " + item.id);
        target = document.getElementById(item.id);
    } else if ( item.name != undefined) {
        console.log("field by name: " + item.name);
        target = document.getElementsByName(item.name);
    } else if ( item.classname != undefined) {
        console.log("field by classname: " + item.classname);
        target = document.getElementsByClassName(item.classname);
    } else if ( item.selector != undefined) {
        console.log("field by selector: " + item.selector);
        target = document.querySelectorAll(item.selector);
    }

    if ( target.length > 1 && item.targetIndex != undefined ) {
        target = target[item.targetIndex];
    } else if (target.length != undefined ) {
        target = target[0]
    }
    // console.log(target);
    return target;
}
window.setFieldValues = function(fieldInfo) {

    var field = findTarget(fieldInfo);
    if ( fieldInfo.value != undefined ) {
        field.value = fieldInfo.value;
    } else if (fieldInfo.global != undefined ) {
        field.value = TestGlobals[fieldInfo.global];
    }

};
window.performAction = function(actionInfo, pageRef) {
    console.log("performAction called");

    if ( actionInfo.wait) {
        setTimeout(performAction, actionInfo.wait, actionInfo);
    }

    switch(actionInfo.action) {
        case "click":
            findTarget(actionInfo).click();
            break;
        case "upload":
            pageRef.uploadFile(actionInfo.name, actionInfo.content)
            break;
    }
    
};
window.printLine = function(msg) {
    console.log("Print Line: " + msg);
};