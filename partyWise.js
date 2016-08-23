window.onload = init;

//set global varables
var text = "[]";
var SenatorsJson = JSON.parse(text);

//set a get id global function 
function getID(ID) {
    return document.getElementById(ID);
}

//mian function 
function init() {
    //load the data from the local storage, but if local data does not exsist, load them from ajax file.
    if (localStorage.getItem("senators") === null) {
        getAjaxData();
       
    } else {
        getLocalStorageData();
    }
    //set public varables
    this.target = getID("dropLists");
    this.src = getID("members");
    this.msg = getID("msg");
    //Add event handlers for the source
    src.ondragstart = dragDropEventHandler.dragStart;
    src.ondragend = dragDropEventHandler.dragEnd;
    src.ondrag = dragDropEventHandler.dragHandler;

    //Add event handlers for the target
    target.ondragenter = dragDropEventHandler.dragEnter;
    target.ondragover = dragDropEventHandler.dragOver;
    target.ondrop = dragDropEventHandler.dropHandler;
}

//encapsulate all drag and drop event handler as an object
var dragDropEventHandler = {
        dragStart: function dragStartHandler(e) {
            e.dataTransfer.setData("Text", e.target.id);
        },
        dragEnd: function dragEndHandler(e) {
           
        },
        dragHandler: function dragHandler(e) {
            msg.innerHTML = "Dragging " + e.target.id;
        },
        dragEnter: function dragEnterHandler(e) {
            e.preventDefault();
        },
        dragOver: function dragOverHandler(e) {
            msg.innerHTML = "Drag Over " + e.target.id;
            e.preventDefault();
        },
        dropHandler: function dropHandler(e) {
            var sourceId = e.dataTransfer.getData("Text");
            // parse local storage to JSON format
            data = JSON.parse(localStorage["senators"]);
            var partyMatch = false;
            for (i = 0; i < data.length; i++) {
                //if the name mathes name id and part matches party id.
                if (data[i].name == sourceId && ((data[i].party == "Republican" && e.target.id == "republicans") || (data[i].party == "Democrat" && e.target.id == "democrats"))) {
                    //if not vote
                    if (!data[i].vote) {
                        var sourceElement = getID(sourceId);
                        var newElement = sourceElement.cloneNode(true);
                        getID(e.target.id).appendChild(newElement);
                        //set the vote attribute to true
                        data[i].vote = true;
                        //change data back to string format
                        senators = JSON.stringify(data);
                        //store the data into local storage
                        window.localStorage.setItem("senators", senators);
                        partyMatch = true;
                        break;
                    }
                }
            }
            //throw a match exception
            if (partyMatch == false) {
                    msg.innerHTML = '<span style="color:red;"> Party does not match or you selected already. Please choose another one!<span>';
                }
                else {
                    msg.innerHTML = "Drag ended"
                }
            
            e.preventDefault();
        }
}

function getAjaxData() {
    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        //for old brower
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    request.open('GET', 'partyList.xml');
    request.onreadystatechange = function () {
        if ((request.readyState === 4) && (request.status === 200)) {
            //get name and party attributes from ajax file
            var nameAjax = request.responseXML.getElementsByTagName('name');
            var partyAjax = request.responseXML.getElementsByTagName('party');
            //set vote status to false
            var voteAjax = false;
            //create a senator object
            var Senators = function (name, party, vote) {
                this.name = name;
                this.party = party;
                this.vote = vote;
            }
            // loop through the ajax file and dispaly the info on html page
            for (var i = 0; i < nameAjax.length; i++) {
                var senator = new Senators(nameAjax[i].firstChild.nodeValue,
                    partyAjax[i].firstChild.nodeValue,
                    voteAjax);
                getID("members").innerHTML += "<li draggable = 'true' id='" + senator.name + "'>" + senator.name + '</li>';
                SenatorsJson.push(senator);
                
            }
            //transfer the data from JSON format to string format
            text = JSON.stringify(SenatorsJson);
            //store the data into localstorage
            window.localStorage.setItem("senators", text);
            msg.innerHTML = "<strong>Status: </strong> from AJAX loaded " + SenatorsJson.length + " Senators.";
        }
    }
    request.send();
    
}
//get the data from local storage and display on the html page
function getLocalStorageData() {
    {
        data = JSON.parse(localStorage["senators"]);
        for (i = 0; i < data.length; i++) {
            getID("members").innerHTML += "<li draggable='true' id='" + data[i].name + "' >" + data[i].name + "</li>";
            if (data[i].vote == true) {
                var sourceId = data[i].name;
                var sourceElement = getID(sourceId);
                var newElement = sourceElement.cloneNode(true);

                if (data[i].party == "Republican") {
                    getID("republicans").appendChild(newElement);
                }
                else if (data[i].party == "Democrat") {
                    getID("democrats").appendChild(newElement);
                }
            }
        }
        getID("msg").innerHTML = "<strong>Status: </strong> from local storage loaded " + data.length + " senators." ;
    }
}

//Clear local storage info
function clearItems() {
    window.localStorage.clear();
}


