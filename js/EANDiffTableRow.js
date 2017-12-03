
var EANDiffTableRow = function (rowData) {
    
    if (rowData.state == "accepted") {
        this._state = "accepted";
    } else if (rowData.state == "rejected") {
        this._state = "rejected";
    } else {
        this._state = "unassigned";
    }
	
	this._rowData = rowData;
	this.init();
}

/**
 * Create the row.
 */
EANDiffTableRow.prototype.init = function () {
	
	this._wrapper = $("<tr>");
	
	// First cell will hold the actions.
	
	// First cell will hold the state.
	this._cell1 = $("<td>", {"class" : "StateCell"});
	this._displayState(this._state);
    
    // Second cell will hold the actions
    this._cell2 = $("<td>", {"class" : "ActionsCell"});
	this._displayActions(this._state);
	
	// Second cell will hold the working description.
	var descr1 = $("<p>").text(this._rowData["ecom-wdescr"]);
	var descr2 = $("<p>").text(this._rowData["ean-wdescr"]);
    // Piece the cell together.
	this._cell3 = $("<td>", {"class" : "DescriptionCell"}).append(descr1, descr2);
	
	// The third cell is the levenstein distance.
	this._cell4 = $("<td>").text(this.getSimilarityScore(this._rowData["ecom-wdescr"], this._rowData["ean-wdescr"]));
	
	// Add all to the row
	this._wrapper.append(this._cell1, this._cell2, this._cell3, this._cell4);
}


/**
 * 
 */
EANDiffTableRow.prototype.accept = function () {
	this._state = "accept";
	this._displayState("accept");
    this._displayActions("accept");
}

/**
 * 
 */
EANDiffTableRow.prototype.reject = function () {
	this._state = "reject";
	this._displayState("reject");
    this._displayActions("reject");
}

/**
 * 
 */
EANDiffTableRow.prototype.unassign = function () {
    
    if (this._state == "rejected" || this._state == "accepted") {
        this._state = "unassign";
        this._displayState("unassign");
        this._displayActions("unassign");
    } else {
        this._state = "unassigned";
        this._displayState("unassigned");
        this._displayActions("unassigned");
    }
}


/**
 * Display the row in the specified state.
 * 
 * @param state
 */
EANDiffTableRow.prototype._displayState = function (state) {
	
	this._wrapper.removeClass("Approve");
	this._wrapper.removeClass("Reject");
	this._wrapper.removeClass("Approved");
	this._wrapper.removeClass("Rejected");
	
	// Display the unassigned state
    if (state == "unassign") {
        
         // Add a state label to the cel.
		var stateLabel = this._getStateLabel("Unassign", "Unassign", false);
		this._cell1.html("");
		this._cell1.append(stateLabel);
        
    } else if (state == "unassigned") {
		
        // Add a state label to the cel.
		var stateLabel = this._getStateLabel("Unassigned", "Unassigned", false);
		this._cell1.html("");
		this._cell1.append(stateLabel);
		
	} else if (state == "accept") {
		
        // Add a state label to the cel.
		var stateLabel = this._getStateLabel("Accept", "Accept", true);
		this._cell1.html("");
		this._cell1.append(stateLabel);
        
        // Add a global class to the row.
		this._wrapper.addClass("Accept");
		
		
	} else if (state == "accepted") {
		
        // Add a state label to the cel.
		var stateLabel = this._getStateLabel("Accepted", "Accepted", true);
		this._cell1.html("");
		this._cell1.append(stateLabel);
        
        // Add a global class to the row.
		this._wrapper.addClass("Accepted");
		
		
	} else if (state == "reject") {
		
        // Add a state label to the cel.
		var stateLabel = this._getStateLabel("Reject", "Reject", true);
		this._cell1.html("");
		this._cell1.append(stateLabel);
        
        // Add a global class to the row.
		this._wrapper.addClass("Reject");
    } else if (state == "rejected") {
		
        // Add a state label to the cel.
		var stateLabel = this._getStateLabel("Rejected", "Rejected", true);
		this._cell1.html("");
		this._cell1.append(stateLabel);
        
        // Add a global class to the row.
		this._wrapper.addClass("Rejected");
    }
}
 

/**
 * Create a label for a state.
 */
EANDiffTableRow.prototype._getStateLabel = function (text, className, hasUndo) {
    
    // Create a state label
	var textLabel = $("<div>", {"class" : "Text"}).text(text);
    var clearfix = $("<div>", {"style" : "clear: both;"});
    var stateLabel = $("<div>", {"class" : "State "+className});
    
    // Does the state label has an undo?
    if (hasUndo) {
        // Add an undo label to the state.
        var undoLabel = $("<div>", {"class" : "Undo"}).append($("<i>", {"class" : "glyphicon glyphicon-remove"}));
        stateLabel.append(textLabel, undoLabel, clearfix);
        
        // Register the clickhandler.
        stateLabel.click(function () {
            this.unassign();
        }.bind(this));
        
    } else {
        // The state label just has text.
        stateLabel.append(textLabel, clearfix);
    }
    
    return stateLabel;
}


/**
 *
 */
EANDiffTableRow.prototype._displayActions = function (state) {
    
    if (state == "unassigned" || state == "unassign") {
		
		// Create approve and reject buttons
		var acceptLabel = $("<i>", {"class" : "glyphicon glyphicon-ok"});
		var acceptButton = $("<button>", {"class" : "AcceptButton", "type" : "button"}).append(acceptLabel);
		var rejectLabel = $("<i>", {"class" : "glyphicon glyphicon-remove"});
		var rejectButton = $("<button>", {"class" : "RejectButton", "type" : "button"}).append(rejectLabel);
		
		// Add some click handlers.
		acceptButton.click(function () {
			this.accept();
		}.bind(this))
		rejectButton.click(function () {
			this.reject();
		}.bind(this))
		
		this._cell2.html("");
		this._cell2.append(acceptButton, rejectButton);
        
	} else {
        
        this._cell2.html("");
    }
}

/**
 * 
 */
EANDiffTableRow.prototype.activate = function () {
	this._wrapper.addClass("Active");
}

/**
 * 
 */
EANDiffTableRow.prototype.deactivate = function () {
	this._wrapper.removeClass("Active");
}


/**
 * Return the row
 * 
 * @returns
 */
EANDiffTableRow.prototype.getElement = function () {
	return this._wrapper;
}

/**
 * Calculate the Levenshtein distance between two strings.
 */
EANDiffTableRow.prototype.getSimilarityScore = function (a, b) {
    
    // Make sure we get two valid strings
    if (typeof a != "string" || typeof b != "string") {
        return "?";
    }

    // Calc the score.
    var maxLength = Math.max(a.length, b.length);
    var levenshteinDistance = this.calcLevenshteinDistance(a,b);
    var score = (maxLength - levenshteinDistance) / maxLength * 100;
    
    // Round the score and add a percentage.
    return Math.round(score)+"%";
}

/**
 * Calculate the Levenshtein distance between two strings.
 */
EANDiffTableRow.prototype.calcLevenshteinDistance = function (a, b) {
    /*
    Copyright (c) 2011 Andrei Mackenzie
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */

    // Compute the edit distance between the two given strings
    
      if(a.length == 0) return b.length; 
      if(b.length == 0) return a.length; 

      var matrix = [];

      // increment along the first column of each row
      var i;
      for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
      }

      // increment each column in the first row
      var j;
      for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
      }

      // Fill in the rest of the matrix
      for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
          if(b.charAt(i-1) == a.charAt(j-1)){
            matrix[i][j] = matrix[i-1][j-1];
          } else {
            matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                    Math.min(matrix[i][j-1] + 1, // insertion
                                             matrix[i-1][j] + 1)); // deletion
          }
        }
      }

      return matrix[b.length][a.length];
};