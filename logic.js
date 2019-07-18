var firebaseConfig = {
  apiKey: "AIzaSyALF9yqZqoO6PUUIzkBPFIfaeRl5JB44Ss",
  authDomain: "train-schedule-5dd5f.firebaseapp.com",
  databaseURL: "https://train-schedule-5dd5f.firebaseio.com",
  projectId: "train-schedule-5dd5f",
  storageBucket: "",
  messagingSenderId: "403714069409",
  appId: "1:403714069409:web:2a63427ed9ab817d"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.database();

$("#add-train-btn").on("click", function() {
  event.preventDefault();
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  db.ref().push(newTrain);

  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

db.ref().on("child_added", function(childSnapshot) {
  
  console.log(childSnapshot.val());  
  var interval= childSnapshot.val().frequency;
  console.log(interval);
  var firstTimeConverted = moment(childSnapshot.val().firstTrain, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  var currentTime = moment();
  console.log("Current time: " + moment(currentTime).format("hh:mm"));
  var diff = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("Difference: " + diff);
  var remainder = diff % interval;
  console.log(remainder);
  var minutesAway = interval - remainder;
  console.log("Minutes away: " + minutesAway);
  var nextArrival = moment().add(minutesAway, "minutes");
  console.log("Next Arrival: " + moment(nextArrival).format("hh:mm"));


  var newRow = $(".current-trains").append("<tr>");
  $(newRow).append("<td>" + childSnapshot.val().name);
  $(newRow).append("<td>" + childSnapshot.val().destination);
  $(newRow).append("<td>" + childSnapshot.val().frequency);
  $(newRow).append("<td class=newNextArrival>" + moment(nextArrival).format("hh:mm A"));
  $(newRow).append("<td class=newMinutesAway>" + minutesAway);
  $(".current-trains").append(newRow);

})