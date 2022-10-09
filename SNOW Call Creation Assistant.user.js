// ==UserScript==
// @name         SNOW Call Creation Assistant
// @namespace    https://{tenant}.service-now.com/
// @version      0.1
// @description  try to take over the world!
// @author       Jimmybear217
// @match        https://{tenant}.service-now.com/new_call.do*
// https://skx.service-now.com/nav_to.do?uri=%2Fnew_call.do
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Controls Container
    var asstParent = document.createElement('div');
    asstParent.style.display = 'inline-block';
    asstParent.style.width = '40%';
    asstParent.style.textAlign = 'right';

    // Store Number
    var storeButton = document.createElement("button");
    storeButton.setAttribute("class", "btn btn-default");
    storeButton.appendChild(document.createTextNode("Set Store"));
    storeButton.addEventListener("click", () => {
        var storeNumber = prompt("Store Number?");
        while (storeNumber.length < 4) { storeNumber = "0" + storeNumber; }
        document.getElementById("new_call.short_description").value = "Store " + storeNumber + " - ";
        document.getElementById("sys_display.new_call.caller").value = "*" + storeNumber;
        document.getElementById("sys_display.new_call.caller").dispatchEvent(new Event("blur"));
        document.getElementById("new_call.call_type").value = "incident";
        if (document.getElementById("tm-header-commonIssuesBtn")) {
            if (document.getElementById("tm-header-commonIssuesBtn").hasAttribute("disabled")) {
                document.getElementById("tm-header-commonIssuesBtn").removeAttribute("disabled");
            }
        }
    });
    asstParent.appendChild(storeButton);

    // Assign to Me Controls
    var assignButton = document.createElement("button");
    assignButton.setAttribute("class", "btn btn-default");
    assignButton.appendChild(document.createTextNode("Assign to me"));
    assignButton.addEventListener("click", () => {
        document.getElementById("sys_display.new_call.u_assignment_group").value = "USMB SN SDESK";
        //document.getElementById("sys_display.new_call.u_assignment_group").dispatchEvent(new Event("blur"));
        //document.getElementById("sys_display.new_call.u_assignment_group").dispatchEvent(new Event("change"));
        document.getElementById("sys_display.new_call.u_assignment_group").focus();
        document.getElementById("sys_display.new_call.u_assigned_to").value = "jimmy.gorokhoff";
        //document.getElementById("new_call.u_assigned_to").value = "";
        document.getElementById("sys_display.new_call.u_assigned_to").dispatchEvent(new Event("blur"));
        //document.getElementById("sys_display.new_call.u_assigned_to").dispatchEvent(new Event("change"));
        setTimeout( () => {document.getElementById("sys_display.new_call.u_assigned_to").focus();}, 50);
        setTimeout( () => {document.getElementById("new_call.description").focus();}, 100);
    });
    asstParent.appendChild(assignButton);

    // Common Assignments Control
    var commonAssignButton = document.createElement("button");
    commonAssignButton.setAttribute("id", "tm-header-commonAssignBtn");
    commonAssignButton.setAttribute("class", "btn btn-default");
    commonAssignButton.appendChild(document.createTextNode("Common Assignments"));
    commonAssignButton.addEventListener("click", () => {
        if (document.getElementById("tm-header-commonAssignDiv").style.display == "block") {
            document.getElementById("tm-header-commonAssignDiv").style.display = "none";
        } else {
            document.getElementById("tm-header-commonAssignDiv").style.display = "block";
            document.getElementById("tm-header-commonIssuesDiv").style.display = "none";
        }
    });
    asstParent.appendChild(commonAssignButton);

    // Common Issues Control
    var commonIssuesButton = document.createElement("button");
    commonIssuesButton.setAttribute("id", "tm-header-commonIssuesBtn");
    commonIssuesButton.setAttribute("class", "btn btn-default");
    commonIssuesButton.setAttribute("disabled", "");
    commonIssuesButton.appendChild(document.createTextNode("Common Issues"));
    commonIssuesButton.addEventListener("click", () => {
        if (document.getElementById("tm-header-commonIssuesBtn").hasAttribute("disabled")) {
            document.getElementById("tm-header-commonIssuesBtn").removeAttribute("disabled");
        } else {
            if (document.getElementById("tm-header-commonIssuesDiv").style.display == "block") {
                document.getElementById("tm-header-commonIssuesDiv").style.display = "none";
            } else {
                document.getElementById("tm-header-commonIssuesDiv").style.display = "block";
                document.getElementById("tm-header-commonAssignDiv").style.display = "none";
            }
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
    assign1.appendChild(document.createTextNode("SDESK"));
    assign1.addEventListener("click", () => {
        document.getElementById("sys_display.new_call.u_assignment_group").value = "USMB SN SDESK";
        document.getElementById("new_call.u_assignment_group").dispatchEvent(new Event("blur"));
    });
    commonAssign.appendChild(assign1);
    // Common Assignment #2: RCS
    var assign2 = document.createElement('button');
    assign2.setAttribute('class', 'btn btn-default');
    assign2.appendChild(document.createTextNode("RCS"));
    assign2.addEventListener("click", () => {
        document.getElementById("sys_display.new_call.u_assignment_group").value = "USMB SN RCS";
        document.getElementById("sys_display.new_call.u_assignment_group").dispatchEvent(new Event("blur"))
    });
    commonAssign.appendChild(assign2);

    // Most Common Issues
    var commonIssues = document.createElement('div');
    commonIssues.id = 'tm-header-commonIssuesDiv';
    commonIssues.style.display = 'none';
    commonIssues.style.width = '90%';
    commonIssues.style.textAlign = 'center';
    document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].appendChild(commonIssues);
    commonIssues.appendChild(document.createTextNode("issues"));

    // Most Common Issues Group #1: Okta
    var issue1 = document.createElement('button');
    issue1.setAttribute('class', 'btn btn-default');
    issue1.appendChild(document.createTextNode("Okta"));
    issue1.addEventListener("click", () => {
        if (document.getElementById("tm-header-commonIssuesDiv1").style.display == "block") {
            document.getElementById("tm-header-commonIssuesDiv1").style.display = "none";
        } else {
            document.getElementById("tm-header-commonIssuesDiv1").style.display = "block";
            document.getElementById("new_call.short_description").value += "Okta - ";
            var employeeID = prompt("EmployeeID/Username:");
            navigator.clipboard.writeText(employeeID).then(
                () => {
                    console.log('copied employeeID', employeeID, 'to clipboard');
                }, (e) => {
                    console.error('unable to copy employeeID', employeeID, 'to clipboard:', e);
                    alert('Unable to copy employeeID:\n', employeeID);
                }
            );
            document.getElementById("new_call.description").value = "EmployeeID: " + employeeID + "\nStatus: ";

            document.getElementById("new_call.description").focus();
        }
    });
    commonIssues.appendChild(issue1);

    // Most Common Issues Group #2: Aptos
    var issue2 = document.createElement('button');
    issue2.setAttribute('class', 'btn btn-default');
    issue2.appendChild(document.createTextNode("Aptos"));
    issue2.addEventListener("click", () => {
        if (document.getElementById("tm-header-commonIssuesDiv2").style.display == "block") {
            document.getElementById("tm-header-commonIssuesDiv2").style.display = "none";
        } else {
            document.getElementById("tm-header-commonIssuesDiv2").style.display = "block";
            document.getElementById("new_call.short_description").value += "Aptos - ";
        }
    });
    commonIssues.appendChild(issue2);

    // Most Common Issues Group #2: Apropos
    var issue3 = document.createElement('button');
    issue3.setAttribute('class', 'btn btn-default');
    issue3.appendChild(document.createTextNode("Apropos"));
    issue3.addEventListener("click", () => {
        if (document.getElementById("tm-header-commonIssuesDiv3").style.display == "block") {
            document.getElementById("tm-header-commonIssuesDiv3").style.display = "none";
        } else {
            document.getElementById("tm-header-commonIssuesDiv3").style.display = "block";
        }});
    commonIssues.appendChild(issue3);


    // Most Common Okta Issues
    var commonIssues1 = document.createElement('div');
    commonIssues1.id = 'tm-header-commonIssuesDiv1';
    commonIssues1.style.display = 'none';
    commonIssues1.style.width = '90%';
    commonIssues1.style.textAlign = 'center';
    document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].appendChild(commonIssues1);
    commonIssues1.appendChild(document.createTextNode("Common Issues > OKTA"));

    var issue1_1 = document.createElement('button');
    issue1_1.setAttribute('class', 'btn btn-default');
    issue1_1.appendChild(document.createTextNode("Activation"));
    issue1_1.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Activation";
        document.getElementById("new_call.description").value += "pending, sent\n";
        document.getElementById("new_call.description").focus();
    });
    commonIssues1.appendChild(issue1_1);

    var issue1_2 = document.createElement('button');
    issue1_2.setAttribute('class', 'btn btn-default');
    issue1_2.appendChild(document.createTextNode("Locked out"));
    issue1_2.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Locked out";
        document.getElementById("new_call.description").value += "locked out, unlocked\n";
        document.getElementById("new_call.description").focus();
    });
    commonIssues1.appendChild(issue1_2);

    var issue1_3 = document.createElement('button');
    issue1_3.setAttribute('class', 'btn btn-default');
    issue1_3.appendChild(document.createTextNode("Reset Pwd"));
    issue1_3.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Reset Pwd";
        document.getElementById("new_call.description").value += "sent reset password email\n";
        document.getElementById("new_call.description").focus();
    });
    commonIssues1.appendChild(issue1_3);

    var issue1_4 = document.createElement('button');
    issue1_4.setAttribute('class', 'btn btn-default');
    issue1_4.appendChild(document.createTextNode("E.C. Login Method"));
    issue1_4.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Cannot Sign into E.C.";
        document.getElementById("new_call.description").value += "Wrong E.C. Login Method\nCorrected " + prompt("Previous Login Method") + " to SSO.\n";
        document.getElementById("new_call.description").focus();
    });
    commonIssues1.appendChild(issue1_4);

    var issue1_5 = document.createElement('button');
    issue1_5.setAttribute('class', 'btn btn-default');
    issue1_5.appendChild(document.createTextNode("Wrong email in E.C."));
    issue1_5.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "No account in okta";
        document.getElementById("new_call.description").value += "Not in Okta. Corrected main email address.\n";
        document.getElementById("new_call.description").focus();
    });
    commonIssues1.appendChild(issue1_5);

    var issue1_6 = document.createElement('button');
    issue1_6.setAttribute('class', 'btn btn-default');
    issue1_6.appendChild(document.createTextNode("Cannot Sign into Okta"));
    issue1_6.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Cannot Sign into Okta";
        document.getElementById("new_call.description").focus();
    });
    commonIssues1.appendChild(issue1_6);

    // Most Common Aptos Issues
    var commonIssues2 = document.createElement('div');
    commonIssues2.id = 'tm-header-commonIssuesDiv2';
    commonIssues2.style.display = 'none';
    commonIssues2.style.width = '90%';
    commonIssues2.style.textAlign = 'center';
    document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].appendChild(commonIssues2);
    commonIssues2.appendChild(document.createTextNode("Common Issues > Aptos"));

    var issue2_1 = document.createElement('button');
    issue2_1.setAttribute('class', 'btn btn-default');
    issue2_1.appendChild(document.createTextNode("Reset Password"));
    issue2_1.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Password Reset";
        document.getElementById("new_call.description").value = "EmployeeID: " + prompt("employeeID") + "\n";
        if (confirm("Is the user also locked out?")) {
            document.getElementById("new_call.description").value += "Reset password and unlocked account from DB\nHad user change their password at r*99.";
        } else {
            document.getElementById("new_call.description").value += "Reset password using DCN";
        }
        document.getElementById("new_call.description").focus();
    });
    commonIssues2.appendChild(issue2_1);

    var issue2_2 = document.createElement('button');
    issue2_2.setAttribute('class', 'btn btn-default');
    issue2_2.appendChild(document.createTextNode("Locked out"));
    issue2_2.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Locked out";
        document.getElementById("new_call.description").value = "EmployeeID: " + prompt("employeeID") + "\nUnlocked account in DB. Pushed changes to other registers.";
        document.getElementById("new_call.description").focus();
    });
    commonIssues2.appendChild(issue2_2);

    var issue2_3 = document.createElement('button');
    issue2_3.setAttribute('class', 'btn btn-default');
    issue2_3.appendChild(document.createTextNode("Return to Windows Desktop"));
    issue2_3.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Stuck on Return to Windows View";
        var register;
        var working = false;
        if (register = prompt("Which register is it? (99 = back office)") == 99) {
            document.getElementById("new_call.description").value = "r*99 stuck on return to windows view\n"
            if (confirm("Advise to press ALT+TAB, did it work?")) {
                document.getElementById("new_call.description").value += "Advised to use ALT+TAB, worked";
                working = true;
            } else {
                document.getElementById("new_call.description").value += "Avised to use ALT+TAB, didn't work";
            }
        } else {
            document.getElementById("new_call.description").value = "r*0" + register + " stuck on return to windows view\n"
            if (confirm("Advise to use open virtual keyboard")) {
                if (confirm("Advise to press ALT+TAB, did it work?")) {
                    document.getElementById("new_call.description").value += "Advised to press ALT+TAB, worked";
                    working = true;
                } else {
                    document.getElementById("new_call.description").value += "Avised to press ALT+TAB, didn't work";
                }
            }
            if (!working) {
                if (register > 9) {
                    alert("Please Connect to register " + register + ": SW0" + document.getElementById("new_call.short_description").value.slice(6,10) + "000" + register);
                } else {
                    alert("Please Connect to register " + register + ": SW0" + document.getElementById("new_call.short_description").value.slice(6,10) + "0000" + register);
                }
                confirm("can you alt+tab back to the application?");
                confirm("go to windows desktop.\nDo you need me to open the daily passwords?")
                // https://{tenant}.service-now.com/nav_to.do?uri=%2Fkb_view.do%3Fsysparm_article%3DKB0010500
                confirm("are you able to start Desktop?")
                confirm("are all the services running?")
                confirm("are you able to start all services?")
                confirm("can you start desktop again?")
                confirm("try to restart windows")
                alert("Please take over")
            }
        }
        document.getElementById("new_call.description").value += "";
        document.getElementById("new_call.description").focus();
    });
    commonIssues2.appendChild(issue2_3);

    // Most Common Apropos Issues
    var commonIssues3 = document.createElement('div');
    commonIssues3.id = 'tm-header-commonIssuesDiv3';
    commonIssues3.style.display = 'none';
    commonIssues3.style.width = '90%';
    commonIssues3.style.textAlign = 'center';
    document.getElementsByTagName("nav")[0].getElementsByClassName("container-fluid")[0].appendChild(commonIssues3);
    commonIssues3.appendChild(document.createTextNode("Common Issues > Apropos"));

    var issue3_1 = document.createElement('button');
    issue3_1.setAttribute('class', 'btn btn-default');
    issue3_1.appendChild(document.createTextNode("Register Frozen"));
    issue3_1.addEventListener("click", () => {
        var register = "";
        while (register == "") { register = prompt("which register is it?") }
        document.getElementById("new_call.short_description").value += "r00" + register + " frozen";
        document.getElementById("new_call.description").value = "r00" + register + " frozen\n";
        if (prompt("did zapping it work?")){
            document.getElementById("new_call.description").value += "zapped r00" + register + "\n";
        } else {
            if (prompt("did zapping all register work?")) {
                document.getElementById("new_call.description").value += "zapped all registers\n";
            } else {
                if (prompt("did restarting the server work?")) {
                    document.getElementById("new_call.description").value += "restarted r001\n";
                } else {
                    if (prompt("did restarting all registers work?")) {
                        document.getElementById("new_call.description").value += "restarted all registers\n";
                    } else {
                        alert("please take over");
                    }
                }
            }
        }
        document.getElementById("new_call.description").focus();
    });
    commonIssues3.appendChild(issue3_1);


    var issue3_2 = document.createElement('button');
    issue3_2.setAttribute('class', 'btn btn-default');
    issue3_2.appendChild(document.createTextNode("Register Frozen"));
    issue3_2.addEventListener("click", () => {
        var register = "";
        while (register == "") { register = prompt("which register is it?") }
        document.getElementById("new_call.short_description").value += "multiple POS sessions open";
        document.getElementById("new_call.description").value = "r00" + register + ": multiple POS sessions open\n";
        if (prompt("did zapping it work?")){
            document.getElementById("new_call.description").value += "zapped r00" + register + "\n";
        } else {
            if (prompt("did zapping all register work?")) {
                document.getElementById("new_call.description").value += "zapped all registers\n";
            } else {
                if (prompt("did restarting the server work?")) {
                    document.getElementById("new_call.description").value += "restarted r001\n";
                } else {
                    if (prompt("did restarting all registers work?")) {
                        document.getElementById("new_call.description").value += "restarted all registers\n";
                    } else {
                        alert("please take over");
                    }
                }
            }
        }
        document.getElementById("new_call.description").focus();
    });
    commonIssues3.appendChild(issue3_2);

    var issue3_3 = document.createElement('button');
    issue3_3.setAttribute('class', 'btn btn-default');
    issue3_3.appendChild(document.createTextNode("Forgot Password"));
    issue3_3.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Forgot Password";
        document.getElementById("new_call.description").value = "EmployeeID: " + prompt("EmployeeID:") + "\n";
        var lvl = prompt("Security Level");
        document.getElementById("new_call.description").value += "Security Level: " + lvl + "\n";
        if (lvl > 3) {
            if (prompt("Are you sure you want to privde their password to this user?")){
                document.getElementById("new_call.description").value += "Securely provided password"
            } else {
                document.getElementById("new_call.description").value += "Reset password for user and assisted them in changing it"
            }
        } else {
            document.getElementById("new_call.description").value += "Provided password"
        }
        document.getElementById("new_call.description").focus();
    });
    commonIssues3.appendChild(issue3_3);

    var issue3_4 = document.createElement('button');
    issue3_4.setAttribute('class', 'btn btn-default');
    issue3_4.appendChild(document.createTextNode("Power outage"));
    issue3_4.addEventListener("click", () => {
        document.getElementById("new_call.short_description").value += "Recovering from power outage";
        document.getElementById("new_call.description").value = "Store had power outage\n";
        if (confirm("Is r001 Off?")) document.getElementById("new_call.description").value =+ "Advised to turn on r001"
        if (confirm("Is r001 asknig to press F1 to continue?")) document.getElementById("new_call.description").value =+ "Advised to turn on r001"
        if (confirm("Is r001 showing disk boot failure")) document.getElementById("new_call.description").value =+ "Advised to restart using CTRL+ALT+DELETE"
        if (confirm("Is r001 showing wong time")) document.getElementById("new_call.description").value =+ "Corrected date/time and restarted server"
        document.getElementById("new_call.description").focus();
    });
    commonIssues3.appendChild(issue3_4);

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
        if (document.getElementById(id)) {
            document.getElementById(id).appendChild(closeBtn);
        }
    });
})();