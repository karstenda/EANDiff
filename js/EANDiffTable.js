
/**
 * Create an EANDiff
 */
var EANDiffTable = function (placeholder) {
	this._placeholder = placeholder;
	this._data = undefined;
	this._eanDiffRows = [];
	this._activeEanDiffRow = undefined;
	this._activeEanDiffRowIndex = 0;
	this.init();
}


/**
 * Init the EANDiff.
 */
EANDiffTable.prototype.init = function () {
	// First get the data.
	$.getJSON("./data/data.json", function (json) {
		// Assign data to internal private var.
		this._data = json;
		// Now we're ready to render our table.
		this.renderTable();
	}.bind(this));
};

/**
 * Render the table.
 */
EANDiffTable.prototype.renderTable = function () {
	
	var table = $("<table>", {"class": "EANDiffTable"});
	this._placeholder.append(table);
	
	// Create the header
	var header = $("<thead>");
	var headerRow = $("<tr>");
	
	// First collumn will hold the states
	var th1 = $("<th>").text("State").attr("width", "110px");
    // Second collumn will hold the actions
	var th2 = $("<th>").attr("width", "100px");
	// Third collumn will hold the working description
	var th3 = $("<th>").text("Comparison")
	// Fourth collumn will hold the levenstein distance
	var th4 = $("<th>").text("Accuracy").attr("width", "100px");
	
	// Piece the header together
	header.append(headerRow.append(th1, th2, th3, th4));
	table.append(header);
	
	// Generate a table body.
	var tbody = $("<tbody>");
	table.append(tbody);
	
	for (var i=0; i < this._data.length; i++) {
		// Create a row.
		var eanDiffRow = new EANDiffTableRow(this._data[i]);
        
		// Add the actual row element to the table.
		tbody.append(eanDiffRow.getElement());
		
		// Remember the row.
		this._eanDiffRows.push(eanDiffRow);
	}
	
	// Now determine the active row.
	if (this._eanDiffRows.length > 0) {
		// First row is active
		this._activeEanDiffRow = this._eanDiffRows[0];
		this._activeEanDiffRowIndex = 0;
		// Tell the row it's active.
		this._activeEanDiffRow.activate();
	}
    
    $(window).keydown(function (event) {
        if (event.keyCode == 17) {
            // The "Ctrl" key has been pressed
            
            this._commandKeyDown = true;
        }
    }.bind(this));
	
	$(window).keyup(function (event) {
        
        // Check whether the command key has been pressed ...
        if (this._commandKeyDown) {
            // If the command key is also down ... ignore shortcuts.
            return;
        }
		
		if (event.keyCode == 38) {
			// Keyup pressed
			
			// Deactivate the old active row.
			this._activeEanDiffRow.deactivate();
			
			// Find the new active row.
			var index = Math.max(this._activeEanDiffRowIndex-1, 0);
			this._activeEanDiffRow = this._eanDiffRows[index];
			this._activeEanDiffRowIndex = index;
			
			// Activate the new active row.
			this._activeEanDiffRow.activate();
			
		} else if (event.keyCode == 40) {
			// Keydown pressed
			
			// Deactivate the old active row.
			this._activeEanDiffRow.deactivate();
			
			// Find the new active row.
			var index = Math.min(this._activeEanDiffRowIndex+1, this._eanDiffRows.length-1);
			this._activeEanDiffRow = this._eanDiffRows[index];
			this._activeEanDiffRowIndex = index;
			
			// Activate the new active row.
			this._activeEanDiffRow.activate();
			
		} else if (event.keyCode == 65) {
			// The letter A is pressed 
			
			// Accept the active row.
			this._activeEanDiffRow.accept();
		} else if (event.keyCode == 82) {
			// The letter R is pressed 
			
			// Accept the active row.
			this._activeEanDiffRow.reject();
		} else if (event.keyCode == 85) {
			// The letter U is pressed 
			
			// Accept the active row.
			this._activeEanDiffRow.unassign();
		} else if (event.keyCode == 17) {
            // The "Ctrl" key has been pressed
            
            this._commandKeyDown = false;
        }
	}.bind(this));
	
    // EANDiffrow on click.
    var self = this;
    tbody.find("> tr").click(function () {
        
        // What is the clicked row element?
        var index = this.rowIndex-1;
        
        // Deactivate the old active row.
        self._activeEanDiffRow.deactivate();
        
        // Find the new active row.
        self._activeEanDiffRow = self._eanDiffRows[index];
        self._activeEanDiffRowIndex = index;
        
        // Activate the new active row.
        self._activeEanDiffRow.activate();
    });
}
