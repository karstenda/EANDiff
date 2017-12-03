/**
 * Bootstrap WcrOneClick
 */
var WcrOneClick = function () {

    var deployButton = $("#deployButton");
    var startPage = $("#startPage");
    var outputPage = $("#outputPage");
    var deployMessage = $("#deployMessage");
    deployButton.click(function () {

        // Disable the deploy button.
        deployButton.attr("disabled", "disabled");
        
        // Indicate deployment
        deployButton.text("Deploying ...");
        deployButton.append($('<img src="./img/loaderTransparent.gif" style="padding-left: 5px">'))
        deployMessage.show();
        
        // Make a deploy request.
        var params = {"preconfig" : "advanced"};
        $.ajax({
            type: "POST",
            url: "./deploy",
            data: params,
            success: function(data) {
                
                // Hide the start Page
                startPage.hide()

                var outputs = data.Stacks[0].Outputs;
                for (var i=0; i < outputs.length; i++) {
                    outputPage.append(this._getOutputEntry(outputs[i]));
                }

                // Show the output Page
                outputPage.show()
                
            }.bind(this),
            error:   function(jqXHR, textStatus, errorThrown) {
                alert("Error, status = " + textStatus + ", " + "error thrown: " + errorThrown);
            }
        });
    }.bind(this));
}

/**
 * Create an element holding the values of the output.
 */
WcrOneClick.prototype._getOutputEntry = function (output) {
    
    // Create the elements.
    var outputWrapper = $("<div>", {"class" : "Output alert alert-warning"});
    var outputDescription = $("<div>", {"class" : "OutputDescriptions"}).text(output.Description);
    var outputEntry = $("<div>", {"class" : "OutputEntry"});
    var outputKey = $("<b>").text(output.OutputKey+": ");
    var outputValue = $("<span>").text(output.OutputValue);
    
    // Piece it all together
    outputEntry.append(outputKey, outputValue);
    outputWrapper.append(outputDescription, outputEntry);
    
    // Return the element
    return outputWrapper
};

