var userData;
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    getMessages(user);
    getUserData(user);
    console.log(user)
  } else {
    // No user is signed in.
    window.location.href = "index.html"
  }
});

function getMessages(user) {
  firebase.database().ref("/messages/").on("child_added",(snapSnapshot)=>{
    if(snapSnapshot){
      if(snapSnapshot.val().senderId == user.uid){
        document.getElementById("list").innerHTML += `
        <li class="message right" >
        <span class="message-text blue" >${snapSnapshot.val().message}</span><br>
        <span class="msg-txt">sent by ${snapSnapshot.val().senderName}</span>
      </li>
        `
      }else{
        document.getElementById("list").innerHTML += `
        <li class="message left" >
        <span class="message-text grey" >${snapSnapshot.val().message}</span><br>
        <span class="msg-txt">sent by ${snapSnapshot.val().senderName}</span>

      </li>
        `
      }
     
    }
  })
}
function getUserData(user) {
  firebase.database().ref(`user/userData/${user.uid}`).once('value').then((snapshot) => {
    if (snapshot) {
      userData = snapshot.val();
      console.log(userData)
      document.getElementById("userName").innerHTML = `<h3 id="userName" >Welcome ${userData.firstName} ${userData.lastName} </h3>`
    } else {
      alert("Something Went Wrong")
    }
  })
}

// var name = prompt("Enter your name ");
// var list = document.getElementById("list");

// firebase.database().ref('todos').on('child_added',function(data){
//   console.log(data.val())
//   var li = document.createElement("li");
//   li.style.marginLeft = "300px"
//   var liText = document.createTextNode(data.val().value);
//   li.appendChild(liText);


//   var delBtn = document.createElement('button');
//   var delText = document.createTextNode('Delete');
//   delBtn.setAttribute("class","btn");
//   delBtn.style.backgroundColor = "rgb(255, 138, 101)";
//   delBtn.style.margin = "3px";
//   delBtn.style.margin = "3px";
//   delBtn.style.color = "white"
//   delBtn.style.border = "1px solid white"
//   delBtn.setAttribute('id' , data.val().key)
//   delBtn.setAttribute("onclick","deleteItem(this)");
//   delBtn.appendChild(delText);



//   li.appendChild(delBtn);

//   list.appendChild(li);
// })
// function addTodo() {
//     var todo_item = document.getElementById("todo-item");
//     var database = firebase.database().ref('todos')
//     var key = database.push().key;
//     var todo = {

//       value : todo_item.value,
//       key : key  
//     }
//     database.child(key).set(todo)

//     todo_item.value= "";

// }

// function deleteItem(e){
//   firebase.database().ref('todos').child(e.id).remove()
//             e.parentNode.remove()
// }

// function deleteAll(){
//   firebase.database().ref('todos').remove()
//     list.innerHTML = ""
// }


function sendMessage() {
  var message = document.getElementById("todo-item").value;
  var user = firebase.auth().currentUser;
firebase.database().ref(`/user/userData/${user.uid}`).once("value").then((snapshot)=>{
  firebase.database().ref("/messages/").push({
    senderId: user.uid,
    message: message,
    senderName: `${snapshot.val().firstName} ${snapshot.val().lastName}`
  }).then((result) => {
    message = "" ;
  }).catch((err) => {
    alert(err.message)
  })

})
  
}


signOut = () => {
  firebase.auth().signOut()
    .then(() => {
      window.location.href = "index.html"
    }).catch((err) => {
      console.log(err)
    })
}


