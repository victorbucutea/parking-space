window.google = window.google || {};
google.maps = google.maps || {};
(function () {

    function getScript(src, key) {
        var url = src + '?key=' + key+'&libraries=geometry&sensor=false';
        document.write('<script src="' + url + '" type="text/javascript"></script>');
    }

    var key = 'AIzaSyDPUL3kus7j_yLmVBvj0UO7XIQww2yKJEg';

    var url = 'https://maps.googleapis.com/maps/api/js';
    getScript(url, key);

    url = 'https://apis.google.com/js/client.js?onload=handleClientLoad';
    getScript(url, key);
})()
;