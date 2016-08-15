// Accessible Grid jQuery Plugin 
//
// VERSION = 0.09, 12 November 2014
//
// Revision history:
// 
// 0.08 - Mary McShane added colstyle parameter.
// 0.08 - Added record, rowIndex, colIndex, and store parameters to 
//        parameters passed to renderer functions.
// 0.07 - Converted to jQuery plugin; successor to CtpsAccessibilityLib.Grid.
// 0.06 - Added support for thcls and cls options in columns descriptor.
//        Tightend up the code a bit.
// 0.05 - Interface change: Renamed constructor 'AccessibleGrid' simply to 'Grid',
//        in belated recognition of encapsulation by the CtpsAccessibilityLib object. 
//        "prototype" functions made explicit members of Grid.prototype object.
//        Added col1th, scopeAttrs, and style configuration options.
//        Added versionID string.
// 0.04 - Interface change: Introduced CtspAccessibilityLib object to minimize impact
//        on the global name space.
//        Added datatable attribute to <table> element; set its value to "1".
//        Ran through JsLint.
// 0.03 - Documented column descriptor object.
// 0.02 - Added support for renderer option in column descriptor object.
//        loadArrayData clears contents of <tbody> before loading data.
//        Added clearBody method.
// 0.01 - Baseline version - first cut, rough implementation.
//
// *****************************************************************************************
//
// The semi-colon before the function invocation is a safety net against concatenated scripts 
// and/or other plugins that are not closed properly.
;(function($, window, document, undefined) {
		// undefined is used here as the undefined global variable in ECMAScript 3 and is mutable 
		// (i.e. it can be changed by someone else). undefined isn't really being passed in so we
		// can ensure that its value is truly undefined. In ES5, undefined can no longer be modified.
		//   
		// window and document are passed through as local variables rather than as globals, 
		// because this (slightly) quickens the resolution process and can be more efficiently 
		// minified (especially when both are regularly referenced in the plugin).
		
	$.fn.accessibleGrid = function(colDesc, options, aData) {
		// Parameters: colDesc, options, aData
		//
		// Options in "coldesc" (columns descriptor object) Parameter:
		//     cls        - CSS class to assign to "data" elements for this colum (<td> or <th>).
		//     dataIndex  - name of field in input data object to be mapped to this column (REQUIRED)
		//     header     - column header text
		//     renderer   - user-provided function to call to render each data value (optional).
		//                  See below for the list of parameters passed to renderers.
		//     style      - value of style attribute to be assigned to the table header (<th>) element
		//                  created for the column; this is specified as a string, e.g., style="width:50"
		//     thcls      - CSS class to assign to column header <th> element
		//
		// Options in "options" parameter:
		//     divId      - id of the <div> in which to create the table (REQUIRED)
		//     tableId    - id of the <table> to be created
		//     ariaLive   - value of aria-live attribute of the <div>; defaults to 'assertive'
		//     caption    - string for the table's <caption>
		//     colDesc    - columns descriptor object (see above)
		//     col1th     - generate a <th> element (rather than a <td> element) for the first  
		//                  data cell in each row; defaults to false
		//     scopeAttrs - generate a scope="col" attribute for the <th> element for each column
		//                  in the table and a scope="row" for the first element (<td> or <th>) in 
		//                  each row in the table; defaults to true
		//     style      - value of style attribute to be assigned to the <table> created;
		//                  this is specified as a string, e.g., style="width:500"
		//     summary    - string for summary attribute of the <table>
		//     tablecls   - CSS class to assign to <table> element
		//     capcls     - CSS class to assgin to <caption> element
		//     theadcls   - CSS class to assign to <thead> element
		//     tbodycls   - CSS class to assign to <tbody> element
		//
		// "aData" Parameter - JavaScript array of objects containing the data to load into the table.
		//
		// The following parameters are passed to "renderer" functions:
		// 1. value  - the value of the data cell in question
		// 2. record - the entire record in which "value" resides, i.e., the row in "aData" containing "value".
		// 3. rowIndex - ZERO-based index of the row in "aData" containing "value".
		// 4. colIndex - ZERO-based index of the column in "aData" containing "value".
		// 5. store    - the entire data store, i.e., "aData".
	
		var defaults = {	tableId 	: '',
							ariaLive	:'assertive',
							caption		: '',
							col1th		: false,
							scopeAttrs	: true,
							style 		: '',
							summary		: '',
							tablecls	: '',
							capcls		: '',
							theadcls	: '',
							tbodycls	: ''                           
						};
		var settings = $.extend(defaults, options || {});
			
		var divId = this.attr('id');
		var tableId = (options.tableId !== undefined) ? options.tableId : divId + '_table';
		
		var theadId = tableId + '_head';
		var tbodyId = tableId + '_body';
	
		var col1th = options.col1th || false;
		var scopeAttrs = (options.scopeAttrs !== undefined) ? options.scopeAttrs : true;
		var nRows = 0; // Number of rows in the body of the table.
		
		var szCaption  = options.caption || '';
		var szSummary  = options.summary || '';
		var szAriaLive = options.ariaLive || 'assertive';
		
		var szTablecls = options.tablecls || '';
		var szTheadcls = options.theadcls || '';
		var szTbodycls = options.tbodycls || '';
		var szCapcls   = options.capcls || '';
 //       var szColStyle = options.colstyle || '';
       
		
		var szTemp = '';
		var i;
	  
		szTemp  = '<table id="' + tableId + '"' ;
		szTemp += ' datatable="1"' + ' summary="' + szSummary + '"' ;
		szTemp += (options.tablecls !== undefined) ? ' class="' + options.tablecls + '"' : '';
		szTemp += (options.style !== undefined) ? ' style="' + options.style + '"' : '';
		szTemp += ' aria-live="' + szAriaLive + '"' + ' role="grid">';

		szTemp += '<caption '; 
		szTemp += (options.capcls !== undefined) ? ' class="' + options.capcls + '"' : '';
		szTemp += '>' + szCaption + '</caption>';
	  
		szTemp += '<thead id="' + theadId;
		szTemp += (options.theadcls !== undefined) ? ' class="' + options.theadcls + '"' : '';
		szTemp += '">';
		
		szTemp += '<tr>';
		for (i = 0; i < colDesc.length; i++) {
			szTemp += '<th id="' + tableId + '_' + colDesc[i].dataIndex + '"' ;
			szTemp += (colDesc[i].thcls !== undefined) ? ' class="' + colDesc[i].thcls + '"' : '';
			szTemp += (colDesc[i].style !== undefined) ? ' style="' + colDesc[i].style + '"' : '';       //      NOTE:  this only sets style for column HEADER--if you want to change the style of ROWS--see below
			szTemp += (scopeAttrs === true) ? ' scope="col"' : '';
			szTemp += ' role="gridcell">'; 
			szTemp += colDesc[i].header + '</th>';
		}
		szTemp += '</tr>';
		szTemp += '</thead>';
	  
		szTemp += '<tbody ' + 'id="' + tableId + '_body"' 
		szTemp += (options.tbodycls !== undefined) ? ' class="' + options.tbodycls + '"' : '';
		szTemp += '>';
		szTemp += '</tbody>';
		szTemp += '</table>';	

		this.empty(); // To be safe.
		this.append(szTemp);
		
		var thisObj = this;
		var count;
					
		// Iterate over all the records in the array, i.e., all the rows in the table.
		count = 0;
		$.each(aData, function(ndx, record) {
			count = count + 1;
			var szRow = '<tr>';
			var szRowId = tableId + '_row_' + count;
			var i;
			var szTd;
			var szHeaders;

			// Iterate over all the columns in a row.
			for (i = 0; i < colDesc.length; i++) {
				if (i === 0) {
					szTd = (col1th === true) ? '<th ' : '<td '; 
					szTd += 'id="' + szRowId + '"';
					if (colDesc[i].cls !== undefined) {
						szTd += ' class="' + colDesc[i].cls + '"';
					}
					if (scopeAttrs === true) {
						szTd += ' scope="row"';
					}
					szTd += ' role="gridcell">';      
				} else {
					szHeaders = tableId + '_' + colDesc[i].dataIndex + ' ' + szRowId;                    
     
                    
					szTd = '<td ';
					if (colDesc[i].cls !== undefined) {
						szTd += ' class="' + colDesc[i].cls + '"';                       
					}
                    if (colDesc[i].colstyle !== undefined) {                                            //      ADDED IN SO THAT I COULD RIGHT-JUSTIFY DATA IN COLUMNS, NOT JUST HEADER....
						szTd += ' style="' + colDesc[i].colstyle + '"';                                 //      MPM, November 10, 2014                         
					}
                    
					szTd += ' headers="' + szHeaders + '" role="gridcell">';
				}
				szRow += szTd;   
				szRow += (colDesc[i].renderer === undefined) ? record[colDesc[i].dataIndex] 
															 : colDesc[i].renderer(record[colDesc[i].dataIndex],
															                       record,
																				   count-1, // Convert to ZERO-based row index.
																				   i, 
																				   aData);
				szRow += ((i === 0) && (col1th === true)) ? '</th>' : '</td>';
			} // for loop over columns
			szRow += '</tr>';
			$('#' + tbodyId).append(szRow);
		});
		nRows = count;
	};
}(jQuery, window, document));