var config = {
  apiKey: "AIzaSyBI5Fe4MghaHJ9Icqllh2agANLxRnBUdEM",
  authDomain: "train-scheduler-666.firebaseapp.com",
  databaseURL: "https://train-scheduler-666.firebaseio.com",
  projectId: "train-scheduler-666",
  storageBucket: "train-scheduler-666.appspot.com",
  messagingSenderId: "533332328102"
};
firebase.initializeApp(config);

var database = firebase.database()


var name;
var destination;
var firstTrain;
var frequency = 0;

document.querySelector("#train-form").addEventListener("submit", function () {
  event.preventDefault();

  name = document.querySelector("#train-name").value.trim();
  destination = document.querySelector("#destination").value.trim();
  firstTrain = document.querySelector("#first-train").value.trim();
  frequency = document.querySelector("#frequency").value.trim();

  if (!moment(firstTrain, "HH:mm", true).isValid()) {
    return
  }


  addTrain(name, parseInt(frequency), firstTrain, destination)

  document.querySelector("#train-name").value = ""
  document.querySelector("#destination").value = ""
  document.querySelector("#first-train").value = ""
  document.querySelector("#frequency").value = ""
});


function addTrain(name, frequency, firstTrain, destination) {
  var trainData = {
    name: name,
    frequency: frequency,
    firstTrain: firstTrain,
    destination: destination
  };

  var newKey = firebase.database().ref().child('trains').push()
    .key;

  var updates = {};
  updates['/trains/' + newKey] = trainData;

  return firebase.database().ref().update(updates);
}


var trainsRef = firebase.database().ref('trains/');
trainsRef.on('child_added', function (data) {
  console.log(data.val())

  var train = data.val()

  var trainTime = moment(train.firstTrain, "HH:mm").subtract(1, "years")

  var now = moment()

  var minutesElapsed = trainTime.diff(now) / 1000 / 60

  var minutesAway = train.frequency - Math.abs(minutesElapsed % train.frequency)

  var nextTrainArrival = now.add(minutesAway, "minutes")

  var trainHTML = buildHTMLrow(train.name, train.destination, train.frequency, nextTrainArrival.format("HH:mm"), Math.ceil(minutesAway))



  document.querySelector("#trainTable tbody").appendChild(trainHTML)
});

function buildHTMLrow(name, destination, frequency, nextArrival, minutesAway) {

  var trElement = document.createElement("tr")

  var rowHTML = `
    <td>${name}</td>
    <td>${destination}</td>
    <td>${frequency}</td>
    <td>${nextArrival}</td>
    <td>${minutesAway}</td>
  `
  trElement.innerHTML = rowHTML

  return trElement
}