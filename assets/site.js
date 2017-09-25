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

// create Firebase DB var
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

    // test inputs for validity
    let testValid = checkSubmit(newTrain);
    if (testValid) {
        // push object to DB
        database.ref().push(newTrain);
    }
    else {
        console.log('Submission not valid');
    }

    // clear form data
    $('#inputTrainName').val('');
    $('#inputDestination').val('');
    $('#inputFirstTime').val('');
    $('#inputFrequency').val('');
});

// listen for children being added to DB
// update train table with new children
// automatically generates children when page loaded
database.ref().on('child_added',
    function (snapshot) {

        let rightNow = moment();
        let trackerTime = moment(snapshot.val().start, 'HH:mm');
        let freqMin = snapshot.val().freq;

        // add freq time until tracker is later
        // this handles next train and trains that haven't started
        // admitted;y more computationally intensive though...
        while (rightNow.diff(trackerTime, 'minutes') > 0) {
            trackerTime.add(freqMin, 'minutes');
        }

        // calc difference for remaining time
        let minUntil = trackerTime.diff(rightNow, 'minutes');

        // create jquery tr for new child
        let trainRow = $('<tr>');
        // add row data
        $(trainRow).append(`<td>${snapshot.val().name}</td>`);
        $(trainRow).append(`<td>${snapshot.val().dest}</td>`);
        $(trainRow).append(`<td>${freqMin}</td>`);
        $(trainRow).append(`<td>${trackerTime.format('HH:mm')}</td>`);
        $(trainRow).append(`<td>${minUntil}</td>`);
        // add row to DOM
        $('#trainTable').append(trainRow);
    },
    // handle errors with child_added
    function (error) {
        console.log(error);
});

// data validation function
function checkSubmit (submitted) {
    // character length check
    if (submitted.name.length < 1 || submitted.dest.length < 1 ||
        submitted.start.length < 4 || submitted.name.length < 1) {
        return false;
    }

    // freq can't be 0
    if (submitted.freq == 0) {
        return false;
    }

    return true;
}