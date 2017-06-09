window.setFieldValues = function(fieldInfo) {
    $("#" + fieldInfo.id).val(fieldInfo.value);
};
window.performAction = function(actionInfo) {

    console.log("performAction called");
    var target = $(actionInfo.selector);
    // if (actionInfo.id != undefined) {
    //     target = $("#" + actionInfo.id);
    // } else if (actionInfo.selector != undefined) {
    //     target = $(actionInfo.selector);
    // }
    console.log(target);
    target.click();
};
window.printLine = function(msg) {
    console.log("Print Line: " + msg);
};