fs = require('fs');
readline = require('readline');


/*
Layout
Includes the id, the description and the layout's top level area
*/

/*
class Layout {
    constructor(id, description, area) {

        if(!validateParams) {
            throw 'Invalid parameters.';
        }
        this.id = id;
        this.description = description;
        this.area = area;
    }

    validateParams() {
        return  true;
    }
}
*/

/*
Area
Screen area. Includes an id, its position in the screen, a list of buttons, a list of child areas,
and optionally a component to load
*/
class Area {
    constructor(id, description, pos) {

        if(!this._validateParams()) {
            throw 'Invalid parameters.';
        }
        this.id = id;
        this.description = description;
        this.pos = pos;
        // Buttons map
        this.buttons = {};
        // Array of button ids to keep track of the buttons' position in the area
        this.buttonsPos = [];
        // Child areas map
        this.areas = {};
        this.component = '';
    }





    addButton(button, pos) {
        if(pos) { 
            buttonsPos.splice(pos, 0, button.id); 
        } else {
            buttonsPos.push(button.id);
        }

        buttons[button.id] = button;
    }

    delButton(button) {
        // TODO: IMPLEMENT
    } 

   /**
     * Add object area to the area specified by path. 
     * If the path is not provided then add it to this areas.
     * Returns the path of the added area or null if the provided path does not exist.
     * 
     * Note that the path is relative to the current area (See findArea method description).
     */
    addArea(area, path) {

        if(!area) {
            return null;
        }

        if(!path) {
            // If parent is not provided then add to current  
            this.areas[area.id] = area;
        } else {

            parentArea = this.findArea(path);
            if(parentArea) {
                parentArea.addArea(area);
                return path + "." + area.id;

            } else {
                return null;
            }
        }
    }

    delArea(area) {
        // TODO: IMPLEMENT
    } 

    setComponent(component) {
        this.component = component;
    }  

   
   /**
     * The path to an area is a '.' separated string of the ids of the area ancestors in the areas'
     * tree.
     * 
     * This method expect a path relative to the position of this area in the tree. I.e., the first
     * id on the path must match one of the child areas of this area.
     */    
    findArea(path) {

        return this._findAreaRec(this, path.split('.'));
    
    }

    _findAreaRec(area, pathArr) {

            for (var key in area.areas) {
                if (area.areas.hasOwnProperty(key)) {

                    let childArea = area.areas[key];
                    if(pathArr[0] === childArea.id) {
    
                        if(pathArr.length === 1) {
                            // Id matches at last level: Found!
                            return area;
                        } else {
                            // Proceed with search at next level removing the first position of the array
                            return this._findAreaRec(childArea, pathArr.shift());
                        }
                    }
                }
            }

        // List of areas ended without a match: Not Found.
        return null;
    }

   

    x_findAreaRec(area, pathArr) {
        console.log("pathArr", pathArr);
        if(this.id === pathArr[0] ) {
            if(pathArr.length === 1) {
                // Id matches at last level: Found!
                return area;
            } else {
                if( area.areas ) {
                    for(childArea in area.areas ) {
                        // Proceed with search at next level removing the first position of the array
                        return this._findAreaRec(childArea, pathArr.shift());
                    }
                } else {
                    // No more child areas: Not found
                    return null;
                }
            }
        } else {
            // Ids do not match at current level: Not found
            return null;
        }
    }
    

 
   



    _validateParams() {
        /*
        1. id is of type String and is mandatory
        2. description is of type String and is mandatory
        3. pos is of type int and correspond to a fixed position in the screen
        4. elements of 'buttons' array are of type 'Button'
        5. elements of 'areas' array are of type 'Area'
        6. component is of type string and identifies the element (swf or crate) to load 
        */
        return  true;
    }
}


/*
Button
Button attributes and the screen action it executes when called
*/
class Button {
    constructor(id, label, icon, component) {

        if(!validateParams) {
          throw 'Invalid parameters.';
        }
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.action = action;
    }
  
    validateParams() {
        /*
        1. id is of type String and is mandatory
        2. label is the code of the button description text
        3. icon is the code of the button's Icon
        4. action is of type 'Action'
        */
        return  true;
    }
}

/*
Action
Screen actions, not to be confused with the application actions.
Always corresponds to load an area and, optionally, specify which button to activated in that area.
*/
class Action {
    constructor(areaFqn, button) {

        if(!validateParams) {
          throw 'Invalid parameters.';
        }
        this.areaFqn = areaFqn;
        this.button = button;
    }
  
    validateParams() {
        /*
        1. areaFqn is the full qualified name of an area (area's ids from the top level area, joined by ".")
        2. button is of type string. It is optional. If provided should correspond to a valid button id in the provided area.
        */
        return  true;
    }
}



/** */
processLine = function(line) {

    lineArr = line.split('\t');

   
    processArea(lineArr)

}

/** */
processArea = function(lineArr) {

    area = getArea(lineArr);
    // console.log("topArea: ", JSON.stringify(topArea))
    // Create area if it does not exists yet
    if(!topArea.findArea(area.id)) {
        console.log('Area ' + area.id + ' not found in top area. Creating...');
        topArea.addArea(area);
    } else {
        console.log('Area ' + area.id + ' already exists. Nothing to do...');
    }
}


/**
 * Get area
 */
getArea = function(lineArr) {
    area = {}
    switch(lineArr[6]){
        case '1':
        area = new Area('3', 'Logout button area', 1);
        break;
        case '2':
        area =  new Area('10', 'Back button area', 2);
        break;
        case '3':
        area = new Area('5', 'Top menu', 3);
        area.addArea(new Area('1', 'Top menu left', 3));
        break;
        case '4':
        area = new Area('5', 'Top menu', 3);
        area.addArea(new Area('2', 'Top menu right', 4));
        break;
        case '6':
        area = new Area('1', 'Personal settings area', 6);
        break;
        case '7':
        area = new Area('12', 'Ok area', 7);
        break;
        case '8':
        area = new Area('4', 'Alerts area', 8);
        break;
        case '10':
        area = new Area('11', 'Bottom menu', 10);
        area.addArea(new Area('1', 'Bottom menu left', 10));
        break;
        case '11':
        area = new Area('11', 'Bottom menu', 10);
        area.addArea(new Area('2', 'Bottom menu right', 11));
        break;
    }

    return area;
}


// Input file 
let file = process.argv[2];
let topAreaId = '0';
let topAreaDesc = 'Default layout for EDIS';

// Create top level area 
let topArea = new Area(topAreaId, topAreaDesc, '0');

// Read file lines
var lineReader = readline.createInterface({
    input: fs.createReadStream(file)
  });

lineReader.on('line', function (line) {
    processLine(line);
});  

lineReader.on('close', function(){
    console.log(JSON.stringify(topArea));
});

