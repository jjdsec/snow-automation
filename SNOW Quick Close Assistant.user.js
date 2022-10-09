// ==UserScript==
// @name         SNOW Quick Close Assistant
// @namespace    https://{tenant}}.service-now.com/
// @version      0.1
// @description  try to take over the world!
// @author       Jimmybear217
// @match        https://{tenant}.service-now.com/incident.do*
// https://skx.service-now.com/nav_to.do?uri=%2Fnew_call.do
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function setCategory(category, subcategory="") {
        document.getElementById("incident.category").value = category;
        document.getElementById("incident.category").dispatchEvent(new Event("change"));
        setTimeout( () => {
            document.getElementById("incident.subcategory").value = subcategory;
            document.getElementById("incident.subcategory").dispatchEvent(new Event("change"));
        }, 300);
    }

    function markSolved(minutes) {
        // finding the timer and acting on it
        Array.from(document.getElementById("element.incident.time_worked").getElementsByTagName("input")).forEach( (elem) => {
            if (elem.id.match(/tmr_[0-9a-f]*_min/)) {
                elem.value = minutes;
                elem.dispatchEvent(new Event("change"));
            }
        });
        // setting the other closing fields.
        document.getElementById("incident.close_code").value = "Solved (Permanently)";
        document.getElementById("incident.close_code").dispatchEvent(new Event("change"))
        document.getElementById("incident.state").value = 6;
        document.getElementById("incident.state").dispatchEvent(new Event("change"))
    }

    function interpretAptos(shortDescription2) {
        // aptos
        setCategory("aptos_retail")
        if (shortDescription2.search("mpos") != -1) {
            setCategory("aptos_retail", "aptos_one")
        } else if (shortDescription2.search("question") != -1) {
            setCategory("aptos_retail", "procedural")
        } else {
            setCategory("aptos_retail", "store_6")
            switch (shortDescription2) {
                case "Password Reset":
                case "Locked out":
                    var desc = document.getElementById("incident.description").value
                    var descLines = desc.split("\n");
                    if (descLines[descLines.length-1].slice(-1) == "]") {
                        descLines[descLines.length-1] = descLines[descLines.length-1].slice(0, -1)
                    }
                    descLines.slice(1).forEach((li) => { document.getElementById("incident.close_notes").value += li.toString() + "\n"; })
                    document.getElementById("incident.close_code").value = "Solved (Permanently)";
                    markSolved(10)
                    break;
            }
        }
    }

    function interpretOkta() {
        setCategory("Application Services", "Authentication");
        var desc = document.getElementById("incident.description").value
        var descLines = desc.split("\n");
        if (descLines[descLines.length-1].slice(-1) == "]") {
            descLines[descLines.length-1] = descLines[descLines.length-1].slice(0, -1)
        }
        var foundStatus = false;
        descLines.slice(1).forEach((li) => {
            if (li.search("Status") != -1) {
                var action = li.split(", ");
                foundStatus = true;
                switch(action) {
                    default: document.getElementById("incident.close_notes").value += action.toString(); + "\n";
                }
            }
            if (foundStatus) {
                document.getElementById("incident.close_notes").value += li.toString() + "\n";
            }
        })
        markSolved(5)
    }

    function interpretApropos(str) {
        var description = document.getElementById("incident.description").value
        var descLines = description.split("\n");
        if (descLines[descLines.length-1].slice(-1) == "]") {
            descLines[descLines.length-1] = descLines[descLines.length-1].slice(0, -1)
        }

        if (str.search("frozen") != -1) {
            // register frozen
            setCategory("Retail Services", "Computer Terminals & Peripherals");
            descLines.slice(1).forEach((li) => { document.getElementById("incident.close_notes").value += li.toString() + "\n"; })
            markSolved(5)
        } else if (str.search("unable to generate all cashsheet") != -1) {
            //  Unable to generate all cashsheet
            setCategory("Retail Services", "Computer Terminals & Peripherals");
            document.getElementById("incident.close_notes").value = "Generated data for all registers"
            markSolved(5)
        } else if (str.search("r00") != -1) {
            // apropos register
            setCategory("Retail Services", "Computer Terminals & Peripherals");
        } else if (str.search("recovering from power outage") != -1) {
            // recovering from power outage
            setCategory("Retail Services", "Computer Terminals & Peripherals");
            descLines.slice(1).forEach((li) => { document.getElementById("incident.close_notes").value = li.toString() + "\n"; })
            markSolved(5)
        } else if (str.search("ipad") != -1) {
            // ipad
            setCategory("Retail Services", "Retail Operations Ipad (ROI) and Apps");
        } else if (str.search("password") != -1) {
            // POS password
            setCategory("Retail Services", "Password Reset");
            descLines.slice(2).forEach((li) => { document.getElementById("incident.close_notes").value = li.toString() + "\n"; })
            markSolved(5)
        } else if (str.search("report") != -1) {
            // report printer
            setCategory("Retail Services", "");
        } else if (str.search("print") != -1) {
            // printer
            setCategory("Retail Services", "");
        } else if (str.search("receipt") != -1) {
            // reciept printer
            setCategory("Retail Services", "");
        } else {
            // something else
            setCategory("Retail Services", "");
        }
    }


    // Controls Container
    var asstParent = document.createElement('div');
    asstParent.style.display = 'inline-block';
    asstParent.style.width = '40%';
    asstParent.style.textAlign = 'right';

    // Assign to Me Controls
    var assignButton = document.createElement("button");
    assignButton.setAttribute("class", "btn btn-default");
    assignButton.appendChild(document.createTextNode("Assign to me"));
    assignButton.addEventListener("click", () => {
        document.getElementById("sys_display.incident.assignment_group").value = "USMB SN SDESK";
        document.getElementById("sys_display.incident.assignment_group").dispatchEvent(new Event("blur"));
        document.getElementById("sys_display.incident.assigned_to").value = "jimmy.gorokhoff";
        //document.getElementById("incident.assigned_to").value = "";
        document.getElementById("incident.assigned_to").dispatchEvent(new Event("blur"));
    });
    asstParent.appendChild(assignButton);

    // Escalate - (CommonAssignments)
    var commonAssignButton = document.createElement("button");
    commonAssignButton.setAttribute("id", "tm-header-commonAssignBtn");
    commonAssignButton.setAttribute("class", "btn btn-default");
    commonAssignButton.appendChild(document.createTextNode("Escalate"));
    commonAssignButton.addEventListener("click", () => {
        if (document.getElementById("tm-header-commonAssignDiv").style.display == "block") {
            document.getElementById("tm-header-commonAssignDiv").style.display = "none";
        } else {
            document.getElementById("tm-header-commonAssignDiv").style.display = "block";
            document.getElementById("tm-header-commonIssuesDiv").style.display = "none";
        }
    });
    asstParent.appendChild(commonAssignButton);

    // Interpret Issue
    var commonIssuesButton = document.createElement("button");
    commonIssuesButton.setAttribute("id", "tm-header-interpretBtn");
    commonIssuesButton.setAttribute("class", "btn btn-default");
    commonIssuesButton.appendChild(document.createTextNode("Interpret Issue"));
    var selectEventType = "change";
    var subcategoryTimeout = 500
    commonIssuesButton.addEventListener("click", () => {

        var shortDescription = document.getElementById("incident.short_description").value.split("-");
        var str = ""
        if (shortDescription.length >= 3) {
            console.log("The description is 3 sections long");
            str = shortDescription[2].trim().toLocaleLowerCase()
            switch(shortDescription[1].trim().toLocaleLowerCase()) {
                case 'aptos':
                    interpretAptos(str);
                    break;
                case 'okta':
                    // authentification
                    interpretOkta(str)
                    break;
                default:
                    alert('unknown platform:', shortDescription[1].trim().toLocaleLowerCase());
                    break;
                case 'apropos':
                    // retail services
                    interpretApropos(str);
                    break;
            }
        } else if(shortDescription.length == 2) {
            console.log("The description is only 2 sections long")
            str = shortDescription[1].trim().toLowerCase();
            if (str.search("okta") != -1) {
                //okta
                interpretOkta(str)
            } else if (str.search("aptos") != -1) {
                // aptos
                interpretAptos(str);
            } else {
                interpretApropos(str);
            }
        } else {
            alert("malformed description: it contains", shortDescription.length, "parts.");
        }

    });
    asstParent.appendChild(commonIssuesButton);

    document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].insertBefore(asstParent, document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].getElementsByClassName("navbar-right")[0])
    console.warn("Created buttons div", asstParent);

    // List of Common Assignments
    var commonAssign = document.createElement('div');
    commonAssign.id = 'tm-header-commonAssignDiv';
    commonAssign.style.display = 'none';
    commonAssign.style.width = '90%';
    commonAssign.style.textAlign = 'center';
    document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].appendChild(commonAssign);
    // Common Assignment #1 : SDESK
    var assign1 = document.createElement('button');
    assign1.setAttribute('class', 'btn btn-default');
    assign1.appendChild(document.createTextNode("Roger"));
    assign1.addEventListener("click", () => {
        document.getElementById("sys_display.incident.assignment_group").value = "USMB SN SDESK";
        document.getElementById("sys_display.incident.assignment_group").dispatchEvent(new Event("blur"));
        document.getElementById("incident.assigned_to").value = "0b852e53dbb0270081e7e9ec0b961914";
        document.getElementById("sys_display.incident.assigned_to").value = "Roger Huezo Alvarez";
        document.getElementById("sys_display.incident.assigned_to").dispatchEvent(new Event("blur"));
    });
    commonAssign.appendChild(assign1);
    // Common Assignment #2: RCS
    var assign2 = document.createElement('button');
    assign2.setAttribute('class', 'btn btn-default');
    assign2.appendChild(document.createTextNode("RCS"));
    assign2.addEventListener("click", () => {
        document.getElementById("sys_display.incident.assignment_group").value = "USMB SN RCS";
        document.getElementById("sys_display.incident.assignment_group").dispatchEvent(new Event("blur"));
                document.getElementById("incident.assigned_to").value = "";
        document.getElementById("sys_display.incident.assigned_to").value = "";
        document.getElementById("sys_display.incident.assigned_to").dispatchEvent(new Event("blur"));
    });
    commonAssign.appendChild(assign2);

    // add buttons to close each menu
    var closeImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/OOjs_UI_icon_close-ltr-destructive.svg/768px-OOjs_UI_icon_close-ltr-destructive.svg.png"
    var closables = [
        "tm-header-commonIssuesDiv",
        "tm-header-commonIssuesDiv1",
        "tm-header-commonIssuesDiv2",
        "tm-header-commonIssuesDiv3"
    ];
    closables.forEach( (id) => {
        var closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'btn btn-default');
        closeBtn.addEventListener('click', () => { document.getElementById(id).style.display = 'none'; });
        var closeBtnImg = document.createElement('img');
        closeBtnImg.setAttribute('height', '24');
        closeBtnImg.setAttribute('width', '24');
        closeBtnImg.setAttribute('src', closeImage);
        closeBtnImg.setAttribute('type', 'image/png');
        closeBtnImg.setAttribute('alt', 'X');
        closeBtnImg.setAttribute('aria-alt', 'Close menu');
        closeBtn.appendChild(closeBtnImg)
        if (document.getElementById(id)){
            document.getElementById(id).appendChild(closeBtn);
        }
    });
})();