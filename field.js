/*
	Authored by : Adk96r
	Licensed under: Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
	
	You are free to:
		Share — copy and redistribute the material in any medium or format
		Adapt — remix, transform, and build upon the material

	The licensor cannot revoke these freedoms as long as you follow the license terms.
	Complete License : https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

	Thankyou.
*/

// Variables for fgrid.
var fgrid;
var fgridHeight;
var fgridWidth;
var fgrid_x;
var fgrid_y;
var fgridClassArray;

// Variables for fdot.
var fdots;
var fgrid_max_col;
var fgrid_max_row;
var margin;
var size;
var spread;
var dot_size;
var fdotClassArray;
var rgba_state_true;
var rgba_state_false;

var state_false_col_val;

// Variables used for animation.
var space = new Array(0);
var space_upd = new Array(0);
var space_temp = new Array(0);
var FieldEqn = changeField;

// Few Variables for calc.
var y, y1, y2, x, x1, x2, theta, current_row, current_col, fdot_obj, temp, kemp, i, j, dotCol, dotRow, col_sens, r, g, b, opa;

/*
 * Initiates the .fgrid element using a unique
 * ID provided through settings.
 */
function initGrid(settings) {

    if (!settings) {
        console.log("Default settings not provided.");
        return;
    }

    fgridHeight = 300;
    fgridWidth = 300;
    margin = 5;
    size = 4;
    spread = 10;
    FieldEqn = sensitivityVal;
    fgridClassArray = new Array(0);
    fdotClassArray = new Array(0);
    
    rgba_state_true = [255, 150, 255, 255];
    rgba_state_false = [0, 190, 145, 255];
    rgba_state_dif = [];
    

    if (!('fgrid' in settings)) {
        console.log("fgrid ID not provided.")
        return;
    } else{
        if (settings.hasOwnProperty('fieldHeight')) fgridHeight = settings.fieldHeight;
        if (settings.hasOwnProperty('fieldWidth')) fgridWidth = settings.fieldWidth;
        if (settings.hasOwnProperty('dotMargin')) margin = settings.dotMargin;
        if (settings.hasOwnProperty('dotSize')) size = settings.dotSize;
        if (settings.hasOwnProperty('forceSpread')) spread = settings.forceSpread;
        if (settings.hasOwnProperty('fieldEqn')) FieldEqn = settings.fieldEqn;
        if (settings.hasOwnProperty('fgridClassArray')) fgridClassArray = settings.fgridClassArray;
        if (settings.hasOwnProperty('fdotClassArray')) fdotClassArray = settings.fdotClassArray;
        if (settings.hasOwnProperty('rgbaStateTrue')) rgba_state_true = settings.rgbaStateTrue;
        if (settings.hasOwnProperty('rgbaStateTrue')) rgba_state_false = settings.rgbaStateFalse;
    }

    dot_size = 2 * margin + size;
    state_false_col_val = 'rgba(' + rgba_state_false[0] + ',' + rgba_state_false[1] + ',' + rgba_state_false[2] + ',' + rgba_state_false[3] + ')';
    rgba_state_dif = [
        rgba_state_false[0] - rgba_state_true[0],
        rgba_state_false[1] - rgba_state_true[1],
        rgba_state_false[2] - rgba_state_true[2],
        rgba_state_false[3] - rgba_state_true[3],
    ]

    fgrid = $("#" + settings.fgrid);

    /*
     *  Some standard settings.
     */
    fgrid.css({
        'width' : fgridWidth,
        'height' : fgridHeight,
        'overflow' : 'hidden',
        'margin-top' : 20,
        'margin-left' : 20,
        'position' : 'relative'
    });

    // Attach any specified classes in fgridClassArray.
    fgridClassArray.forEach(function(className) {
        $(fgrid).addClass(className);
    });

    // Calculate the no. of rows and coloums of .fdot elements
    // for the given height and width.

    n = fgridWidth / dot_size - (fgridWidth / dot_size) % 1;
    m = fgridHeight / dot_size - (fgridHeight / dot_size) % 1;

    // Generate .fdot elements
    for (i=0; i<m; i++) {
        temp = document.createElement("div");
        temp.className = "frow";
        kemp = document.createElement("div");
        kemp.className = "fdot";

        for(j=0; j<n; j++){
            // In a row
            kemp = document.createElement("div");
            kemp.className = "fdot";
            $(kemp).css({
                'background-color' : state_false_col_val,
                'margin' : margin + 'px',
                'left' : j * dot_size + 'px',
                'top' : i * dot_size + 'px',
                'width' : size + 'px',
                'height' : size + 'px',
                'border-radius' : Number(size / 2) + 'px',
                'position' : 'absolute'
            });
            
            // Attach any specified classes in fgridClassArray.
            fdotClassArray.forEach(function (className) {
                $(kemp).addClass(className);
            });
            
            // Add it to the row.
            $(temp).append(kemp);    
        }
        
        // Add the row to the fgrid.
        $(fgrid).append(temp);
    }

    // Get the position of fgrid
    fgrid_x = Number($(fgrid).css('margin-left').split('px')[0]);
    fgrid_y = Number($(fgrid).css('margin-top').split('px')[0]);

    // Save the max cols and rows of fgrid.
    fgrid_max_col = n;
    fgrid_max_row = m;

    // Save the location of each .fdot elements in its data.
    // Also save its count (id) among the m*n .fdots ( which 
    // can be used as an array index ).
    $("#" + settings.fgrid + " .fdot").each(function(index){
        $(this).data("Pos", new Object({
            'col' : index % fgrid_max_col,
            'row' : index / fgrid_max_row - ( index / fgrid_max_row ) % 1,
            'count' : index,
            'x' : Math.max(0, $(this).offset().left - fgrid_x),
            'y' : Math.max(0, $(this).offset().top - fgrid_y)
        }));
    });

    fdots = $("#" + settings.fgrid + " .fdot");

    // Associate the listener to animate the field upon moving
    // the mouse.
    $(document).mousemove(changeField);
}

/*
 * Animates the .fdot elements surrounding the
 * mouse pointer. The spread (or span) of this
 * effect is controlled by the 'spread' variable.
 */
function changeField(event){

    // Get the current mouse pointer position
    // relative to the fgrid element.
    x = event.pageX - fgrid_x;
    y = event.pageY - fgrid_y;

    // First get the new mouse loc dots
    current_row = Math.min(fgrid_max_row, Math.max(0, y/dot_size - y/dot_size%1));
    current_col = Math.min(fgrid_max_col, Math.max(0, x/dot_size - x/dot_size%1));

    // Get the elements which will be effected by the current
    // mouse position.
    space_upd = new Array(0);
    for(var i=Math.max(0, current_col-spread); i<Math.min(fgrid_max_col, current_col+spread); i++){
        for(var j=Math.max(0, current_row-spread); j<Math.min(fgrid_max_row, current_row+spread); j++){
            space_upd.push($(fdots[fgrid_max_col*j + i]).data('Pos').count);
        }
    }

    // Now remove the elements (from the last mouse position) which will (now) not be affected.
    space.forEach(function(obj){
        if(space_upd.indexOf(obj) == -1){
            space_temp.push(obj);
        }
    });

    // space_temp has the objects to be deleted.
    // This rgba color is applied when the fdot is
    // not under the effect of the mouse.
    space_temp.forEach(function(obj){
        $(fdots[obj]).css({
            'background-color' : state_false_col_val,
            'margin' : margin
        });
    });
    // Clear the space_temp array.
    space_temp = new Array(0);

    // Refer space_upd as space ( current space )
    space = space_upd;

    // Start animating the fdots in the space array ( having indices of the various fdots ).
    space.forEach(function(obj){
        fdot_obj = $(fdots[obj]);

        x1 = fdot_obj.data('Pos').x;
        y1 = fdot_obj.data('Pos').y;

        delta_x = x - x1;
        delta_y = y - y1;
        theta = delta_y/delta_x;

        sensitivity = FieldEqn(delta_x, delta_y);

        dotCol = fdot_obj.data('Pos').col;
        dotRow = fdot_obj.data('Pos').row;
        
        col_sens =  1 - Math.abs(dotCol - current_col)/spread;
             
        // Blend the colour for the fdots
        r = Math.min(255, rgba_state_false[0] - rgba_state_dif[0] * col_sens);
        g = Math.min(255, rgba_state_false[1] - rgba_state_dif[1] * col_sens);
        b = Math.min(255, rgba_state_false[2] - rgba_state_dif[2] * col_sens);
        opa = Math.min(255, rgba_state_false[3] - rgba_state_dif[3] * col_sens);

        fdot_obj.css({
            'background-color' : 'rgba(' + r + ',' + g + ',' + b + ',' + rgba_state_true[3] + ')',
            'margin-left': sensitivity,
            'margin-top': sensitivity,
        });
    });
    space_upd = new Array(0);

}


/*
 * Returns the offset of each .fdot element.
 * Provide a different function in settings 
 * for a different behaviour.
 */
function sensitivityVal(delta_x, delta_y){
    return margin + 10*Math.max(0, 7 + Math.log(1/Math.pow(Math.hypot(delta_x, delta_y),1.6)));
}
