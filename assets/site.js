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

    // create new train object for entry into DB
    let newTrain = {
        name: $('#inputTrainName').val().trim(),
        dest: $('#inputDestination').val().trim(),
        start: $('#inputFirstTime').val().trim(),
        freq: $('#inputFrequency').val().trim(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // push object to DB
    database.ref().push(newTrain);
});

// listen for children being added to DB
// update train table with new children
// automatically generates children when page loaded
database.ref().on('child_added',
    function (snapshot) {
        // create jquery tr for new child
        let trainRow = $('<tr>');

        // while arrive unix less than current unix, add freq
        // once arrive unix greater than current unix you have next time
        // subtract now from arrive to get minUntil
        let rightNow = moment();
        let startTime = moment(snapshot.val().start, 'HH:mm');
        let freqMin = snapshot.val().freq;

        let timeDiff = rightNow.diff(startTime, 'minutes');
        let remainderMin = timeDiff % freqMin;
        let minUntil = freqMin - remainderMin;
        let nextArrive = rightNow.add(remainderMin, 'minutes').format('HH:mm');

        console.log(timeDiff);
        console.log(freqMin);
        console.log(minUntil);

        // add row data
        $(trainRow).append(`<td>${snapshot.val().name}</td>`);
        $(trainRow).append(`<td>${snapshot.val().dest}</td>`);
        $(trainRow).append(`<td>${freqMin}</td>`);
        $(trainRow).append(`<td>${nextArrive}</td>`);
        $(trainRow).append(`<td>${minUntil}</td>`);

        // add row to DOM
        $('#trainTable').append(trainRow);
    },
    // handle errors with child_added
    function (error) {
        console.log(error);
});