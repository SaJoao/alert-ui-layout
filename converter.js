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

/**
 * Map screen areas with new model area ids
 */
pathMap = { '1': '3', '2': '10', '3': '5.1', '4': '5.2', '6': '1', '7': '12', '8': '4', '10': '11.1', '11': '11.2' }

/**
 * Properties by area
 */
areaMap = { 
    '1': {'msg': 'Personal settings area', 'pos': 6 },
    '3': {'msg': 'Logout button area', 'pos': 1 },
    '4': {'msg': 'Alerts area', 'pos': 8 },     
    '5': {'msg': 'Top menu', 'pos': 3 }, 
  '5.1': {'msg': 'Top menu left', 'pos': 3 },
  '5.2': {'msg': 'Top menu right', 'pos': 4 },
    '10': {'msg': 'Back button area', 'pos': 2 },            
    '11': {'msg': 'Bottom menu', 'pos': 10 },
  '11.1': {'msg': 'Bottom menu left', 'pos': 10 },
  '11.2': {'msg': 'Bottom menu left', 'pos': 11 },
    '12': {'msg': 'Ok area', 'pos': 7 }            
}

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
            this.buttonsPos.splice(pos, 0, button.id); 
        } else {
            this.buttonsPos.push(button.id);
        }

        this.buttons[button.id] = button;
    }

    delButton(button) {
        // TODO: IMPLEMENT
    } 

   /**
     * Add object area to the area specified by parentPath. 
     * If the parentPath is not provided then add it to this area.
     * Returns the path of the added area or null if the provided parentPath does not exist.
     * 
     * Note that the parentPath is relative to the current area (See findArea method description).
     */
    addArea(area, parentPath) {

        if(!area) {
            return null;
        }

        if(!parentPath || !parentPath.getId()) {
            // If parent is not provided then add to current  
            this.areas[area.id] = area;
        } else {

            let parentArea = this.findArea(parentPath);
            if(parentArea) {

                parentArea.addArea(area);
                path = new Path(parentPath.toString());
                path.append(area.id)
                return path;

            } else {
                console.log('addArea: path does not exist, returning...');
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

        // Clone path object before calling _findAreaRec because it is changed in 
        return this._findAreaRec(new Path(path.toString()));
  
    }

    _findAreaRec(path) {
        for (var key in this.areas) {
            if (this.areas.hasOwnProperty(key)) {

                let childArea = this.areas[key];
                if(path.getHead() === childArea.id) {
                    // Remove path head
                    path.removeHead();
                    if(path.toString() === '') {
                        // Id matches at last level: Found!
                        return childArea;
                    } else {
                        // Proceed with search at next level removing the first position of the array
                        return childArea.findArea(path);
                    }
                }
            }
        }

        // List of areas ended without a match: Not Found.
        return null;
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
    constructor(id, label, icon, action) {

        if(!this.validateParams()) {
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

        if(!validateParams()) {
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

   
    processArea(lineArr);
    //processButton(lineArr);

}

/** */
processArea = function(lineArr) {

    areaPath = new Path(pathMap[lineArr[6]]);

    path = new Path('')
    
    areaPath.toArray().forEach(function(e){
        
        path.append(e);
        parentPath = areaPath.getParent();

        if(!topArea.findArea(path)) {
            let area = getArea(path);
            topArea.addArea(area, parentPath);
        } 

    });
}

class Path {
    
    

    constructor(path) {
        
        this.PATH_SEPARATOR = '.';

        if(!this.validateParams(path)) {
          throw 'Invalid parameters.';
        }
        this.path = path;
    }

    /**
     * Returns the string represnetation of this path object
     */
    toString() {
        return this.path;
    }

    /**
     * Returns the segments of the path as an array
     */
    toArray() {
        return(this.path.split(this.PATH_SEPARATOR));
    }

    /**
     * Return last segment 
     * For instance, if path is 'a.b.c.d', returns d. If path is 'a' returns 'a'
     * If path is not defined returns ''
     */
    getId() {

        if(!this.path)
            return '';

        return this.path.slice(-1)[0];
    }

    /**
     * Return all path except last dot and last segment
     * For instance, if path is 'a.b.c.d' returns 'a.b.c.d'. If path is 'a' returns ''
     */
    getParent() {
        let parentPathArr = this.toArray();
        parentPathArr.pop()
        return new Path(parentPathArr.join(this.PATH_SEPARATOR));
    }

    /**
     * Append the provided segment to this path
     * For instance, if this path is 'a.b' and the segment is 'c.d', this path becomes 'a.b.c.d'
     */
    append(segment) {

        if(!this.path) 
            this.path = segment;
        else 
            this.path = this.path + this.PATH_SEPARATOR + segment;

        return this;
    }

    /**
     * Get the head (top most segment) from this path
     * For instance, if this path is 'a.b.c' if returns 'a'
     * If it is 'a' it returns ''
     * If it is '' it returns ''
     */
    getHead() {

        let pathArr = this.toArray();
        return pathArr[0];
    }

    /**
     * Remove the head (top most segment) from this path
     * For instance, if this path is 'a.b.c' if becomes 'a.b'
     * If it is 'a' it becomes ''
     */
    removeHead() {

        let pathArr = this.toArray();
        pathArr.shift()
        this.setFromArray(pathArr);
        return this;
    }

    /**
     * Updates the value of path from the segments in the provided array
     */
    setFromArray(pathArray) {
        this.path = pathArray.join(this.PATH_SEPARATOR);
        return this;
    }

    validateParams(path) {
        if( typeof path === 'string') 
            return  true;
        
        return false;
    }    
}
/**
 * Get area
 */
getArea = function(path) {

    // The area id is the last segment of the path
    let areaId = path.getId();
    return new Area(areaId, areaMap[path.toString()].msg, areaMap[path.toString()].pos);
}




/** */
processButton = function(lineArr) {

    button = getButton(lineArr);

    areaPath = new Path(pathMap[lineArr[6]]);

    //console.log('searching area: ', areaPath);
    area = topArea.findArea(areaPath);
    //console.log('area: ', area);
    area.addButton(button);
}

camelize = function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

getButton = function(lineArr) {

    // TODO: Based on the existence of icon: Review!
    let icon = lineArr[4];
    if(icon) {
        button = new Button(camelize(icon), lineArr[11], icon);
    }
    return button;
}




// Input file 
// let file = process.argv[2];
let file = 'tmp002.txt';
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

