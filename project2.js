$(function start() {
  initButtons();
  makeDropdown1();
  makeDropdown2();
  makeDropdown3();
});
  
function initButtons() {
  $("#search1").on("click", getLanguage);
  $("#search2").on("click", getProjects);
  $("#search3").on("click", getStudyAbroad);
}

function formatString(str) {
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
}

//this is terrible
function getUnique(arr, field) {
  return [...new Set(arr.map((obj) => {return formatString(obj[field])}))];
}

function filterIt(data, dropdownstr, field) {
  let choice = document.getElementById(dropdownstr).value;
  let dataOut;
  if (choice == "Any") {
    dataOut = data;
  } else {
    dataOut = data.filter(
      function (obj) {
        return choice == formatString(obj[field]);
      }
    );
  }
  return dataOut;
}

function makeDropdown1() {
  $.ajax({
    url: 'http://cs.appstate.edu/jas/3440/project/data_language.php',
    dataType: 'jsonp',
    success: function(data) {
      let $dd = $("#Dropdown1-1");
      $dd.empty();
      $dd.append($("<option>").text("Any"));
      const uniqueLanguages = getUnique(data, "Language");
      for (let obj of uniqueLanguages) {
        $dd.append($("<option>").text(obj));
      }
    }
  }); 
}

function makeDropdown2() {
  $.ajax({
    url: 'https://cs.appstate.edu/jas/3440/project/data_projects.php',
    dataType: 'jsonp',
    success: function(data) {
      let $department = $("#Dropdown2-1");
      for (let obj of getUnique(data, "AcademicDepartment")) {
        $department.append($("<option>").text(obj));
      }
      let $college = $("#Dropdown2-2");
      for (let obj of getUnique(data, "AcademicCollege")) {
        $college.append($("<option>").text(obj));
      }
      let $country = $("#Dropdown2-3");
      for (let obj of getUnique(data, "Country")) {
        $country.append($("<option>").text(obj));
      }
      let $last = $("#Dropdown2-4");
      for (let obj of getUnique(data, "Lastname")) {
        $last.append($("<option>").text(obj));
      }
    }
  }); 
}

function makeDropdown3() {
  $.ajax({
    url: 'https://cs.appstate.edu/jas/3440/project/data_study_abroad.php',
    dataType: 'jsonp',
    success: function(data) {
      let $term = $("#Dropdown3-1");
      for (let obj of getUnique(data, "Term")) {
        $term.append($("<option>").text(obj));
      }
      let $program = $("#Dropdown3-2");
      for (let obj of getUnique(data, "ProgramName")) {
        $program.append($("<option>").text(obj));
      }
      let $country = $("#Dropdown3-3");
      for (let obj of getUnique(data, "Countries")) {
        $country.append($("<option>").text(obj));
      }
      let $department = $("#Dropdown3-4");
      for (let obj of getUnique(data, "Department")) {
        $department.append($("<option>").text(obj));
      }
      let $dates = $("#Dropdown3-5");
      for (let obj of getUnique(data, "Dates")) {
        $dates.append($("<option>").text(obj));
      }
    }
  }); 
}

function getLanguage(){
  $.ajax({
    url: 'http://cs.appstate.edu/jas/3440/project/data_language.php',
    dataType: 'jsonp',
    success: function(data) {

      let d2 = filterIt(data, "Dropdown1-1", "Language");

      //filter proficiency is unique
      let prof = document.getElementById("Dropdown1-2").value;
      let d3;
      if (prof == "Low") {
        d3 = d2;
      } else if (prof == "Med") {
        d3 = d2.filter(
          function (obj) {
            return obj.Proficiency != "low";
          }
        );
      } else {
        d3 = d2.filter(
          function (obj) {
            return obj.Proficiency == "high";
          }
        );
      }

      //finish up
      const table = makeTable(["First Name", "Last Name", "Language",
         "Proficiency", "Email", "Website"], d3);
      $("#language").html(table);
    }
  });  
}

function getProjects(){
  $.ajax({
    url: 'http://cs.appstate.edu/jas/3440/project/data_projects.php',
    dataType: 'jsonp',
    success: function(data) { 

      let d2 = filterIt(data, "Dropdown2-1", "AcademicDepartment");
      let d3 = filterIt(d2, "Dropdown2-2", "AcademicCollege");
      let d4 = filterIt(d3, "Dropdown2-3", "Country");
      let d5 = filterIt(d4, "Dropdown2-4", "Lastname");

      let table = makeTable(["First Name", "Last Name", "Academic Department", 
        "Academic College", "Country", "Travelled", "Collaboration", "Location"
      ], d5);
      $("#project").html(table);
    }
  });  
}

function getStudyAbroad(){
  $.ajax({
    url: 'http://cs.appstate.edu/jas/3440/project/data_study_abroad.php',
    dataType: 'jsonp',
    success: function(data) {

      let d2 = filterIt(data, "Dropdown3-1", "Term");
      let d3 = filterIt(d2, "Dropdown3-2", "ProgramName");
      let d4 = filterIt(d3, "Dropdown3-3", "Countries");
      let d5 = filterIt(d4, "Dropdown3-4", "Department");
      let d6 = filterIt(d5, "Dropdown3-5", "Dates");

      const table = makeTable(["Term", "Program Name", "Countries",	"College",
         "Department", "Dates", "Level", "Credits", "Availability"]
         , d6);
      $("#study_abroad").html(table);
    }
  });  
}

function makeTable(headers, data) {
  let table = document.createElement('table');
  let thead = document.createElement('thead');
  let row = document.createElement('tr');
  for (let obj of headers) {
    let cell = document.createElement('th');
    cell.textContent = obj;
    row.appendChild(cell);
  }
  thead.appendChild(row);
  table.appendChild(thead);
  for (let obj of data) {
    addRow(table, obj);
  }
  return table;
}

function addRow(table, obj) {
  let row = document.createElement('tr');
  for (let field in obj) {
    let cell = document.createElement('td');
    cell.textContent = obj[field];
    row.appendChild(cell);
  }
  table.appendChild(row);
}
