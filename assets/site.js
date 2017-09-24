// Initialize Firebase
let config = {
    // api key left blank since security is open and posting to github
    apiKey: "",
    authDomain: "gtcbc-traintimehomework.firebaseapp.com",
    databaseURL: "https://gtcbc-traintimehomework.firebaseio.com",
    projectId: "gtcbc-traintimehomework",
    storageBucket: "gtcbc-traintimehomework.appspot.com",
    messagingSenderId: "333580499441"
};
firebase.initializeApp(config);

let database = firebase.database();

// listen for submit click
// add form inputs to database
$('#submitTrain').on('click', function (event) {
    // ignore default submits / refresh
    event.preventDefault();

    let newTrain = {
        name: $('#inputTrainName').val().trim(),
        dest: $('#inputDestination').val().trim(),
        start: $('#inputFirstTime').val().trim(),
        freq: $('#inputFrequency').val().trim(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(newTrain);
});

