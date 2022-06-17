console.log("script executing");
const request = new XMLHttpRequest()



document.addEventListener("DOMContentLoaded", function(event) {
document.getElementById('addButton').onclick = (event) =>{showNewNoteForm(event.target)} 
  getData();
});

function getData(){
	request.open('GET', 'http://localhost:3000/notes', true)
	request.onload = function () {
  	// Begin accessing JSON data here
  		const data = JSON.parse(this.response)
  		if (request.status >= 200 && request.status < 400) {
    	displayData(data);
  		} else {
    	console.log('error')
  		}
	}
  request.send();
};

function deleteNote(id){
  console.log("delete function called");
  request.open('DELETE', 'http://localhost:3000/notes/' + id, true)
  request.onload = function () {
    // Begin accessing JSON data here
      if (request.status >= 200 && request.status < 400) {
        console.log("deleted Note " + id);
        location.reload();
      } else {
        console.log('error')
      }
  }
  request.send();
}

function getNote(id){
  request.open('GET', 'http://localhost:3000/notes/' + id, true);
  console.log("getting note " + id);
  let note;
  request.onload = function () {
    // Begin accessing JSON data here
      const data = JSON.parse(this.response);

      if (request.status >= 200 && request.status < 400) {
        note = data;
        console.log("successfully retrieved note " + note._id);
        console.log("title is " + note.title);
      } 
      else {
          console.log('error');
          note = null;
      }
  }
  request.send();
  return note;
}

function showNewNoteForm(element){
  element.outerHTML = 
    "<div>" +
      "<input type='text' placeholder='Title...' class='title_input'></input><br>" +
      "<input type='text' placeholder='Content...' class='content_input'></input>" +
      "<button onclick='onAddButtonClicked()'>Add Note</button>" +
    "</div>";
}

function onAddButtonClicked(){
  const title = document.querySelector('.title_input').value;
  const content = document.querySelector('.content_input').value;
  addNote(title, content);
}

function onSaveButtonClicked(event){
  // console.log("onclick method called");
  const div =  event.target.parentElement;
  const divId = div.id;
  // console.log("div id = " + divId);
  // const titleInput = document.querySelector('.title_input');
  // const contentInput = document.querySelector('.content_input');
  // console.log("titleInput class is: " +  titleInput.class);
  // const title = titleInput.value;
  // const content = contentInput.value;
  const title = document.querySelector('.title_input').value;
  const content = document.querySelector('.content_input').value;
  const noteId = divId.substr(4);
  putNote(title, content, noteId);
}

function addNote(title, content){
  console.log("add function called");
  request.open('POST', 'http://localhost:3000/notes/', true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.onload = function () {
    // Begin accessing JSON data here
      if (request.status >= 200 && request.status < 400) {
        console.log("added Note ");
      } else {
        console.log('error')
      }
      if (request.status >= 200 && request.status < 400) {
        console.log("added note");
        location.reload();
      } else {
        console.log('error adding note')
      }
  }
  request.send(JSON.stringify({"title": title, "content": content}));
}

function putNote(title, content, id){
  request.open('PUT', 'http://localhost:3000/notes/' + id, true);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.onload = function () {
    // Begin accessing JSON data here
      if (request.status >= 200 && request.status < 400) {
        console.log("added Note ");
      } else {
        console.log('error')
      }
      if (request.status >= 200 && request.status < 400) {
        console.log("added note " + id);
        location.reload();
      } else {
        console.log('error adding note')
      }
  }
  request.send(JSON.stringify({"title": title, "content": content}));
}

function editNote(note){
  // const note = getNote(noteId);
  console.log("object passed to editNote function: " + note.toString());
  const node = document.getElementById('div_' + note._id);
  console.log("fetched div using id " + 'div_' + note._id);
  node.innerHTML = "<input type='text' value='" + note.title + "'" + " class='title_input'></input><br>" +
    "<input type='text' value='" + note.content + "'" + " class='content_input'></input>" +
    "<button onclick='onSaveButtonClicked(event)'>Save</button>";
}

function displayData(data){
	data.forEach(note => {
      console.log("title = " + note.title + " content = " + note.content)
      
      const h2 = document.createElement("H2");
      const title = document.createTextNode(note.title);
      h2.appendChild(title);
      h2.id = "title_" + note.id;

      const p = document.createElement("p");
      const content = document.createTextNode(note.content);
      p.appendChild(content);
      p.id = "content_" + note.id;


      const dButton = document.createElement("BUTTON");
      const dButtonText = document.createTextNode("Delete");
      dButton.appendChild(dButtonText);
      dButton.onclick = (event) => {deleteNote(note._id)};

      const eButton = document.createElement("BUTTON");
      const eButtonText = document.createTextNode("Edit");
      eButton.appendChild(eButtonText);
      eButton.onclick = (event) => {editNote(note)};

      

      const div = document.createElement("DIV");
      div.id = 'div_' + note._id;
      console.log("creating div with id " + div.id);
      div.appendChild(h2);
      div.appendChild(dButton);
      div.appendChild(eButton);
      div.appendChild(p);

      const parent = document.getElementById("all_notes");
      parent.appendChild(div);

    });
}

/* Currently the app just modifies the database whenever changes are made,
then reloads the page. A more  approach might be to keep a copy of
the data in memory, and update it everytime a method is called that
modifes the dataase, or after an interval of time. I could then add
an onChangeListener to the local copy of the data, and modify the page
as neccessary every time the data changes. */