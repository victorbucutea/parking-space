$(() => {
    function load_places_script() {
        let s = document.createElement('script');
        s.onload = function () {
            window.loadMaps()
        };
        s.src = 'https://maps.googleapis.com/maps/api/js?key=AI' +
            'zaSyDy3JRKga_1LyeTVgWgmnaUZy5rSNcTzvY&libraries=ge' +
            'ometry,places&language=ro';
        document.body.appendChild(s);
        window.gmapLoaded = true;
    }

    window.gmapLoaded = false;

    function lazyLoadApi(key) {
        let deffered = $.Deferred();
        window.loadMaps = function () {
            deffered.resolve();
        };
        return deffered.promise();
    }

    function searchClick() {
        let location = '/app/index.html#!/home/search?';
        if (!window.searchLocation) {
            window.location = location;
        } else {
            let coords = window.searchLocation;
            location += 'lat=' + coords.lat() + '&lng=' + coords.lng();
            window.location = location;
        }
    }

    function initPlacesAutocomplete() {
        let input = $('#pac-input');
        let options = {componentRestrictions: {country: 'ro'}};

        // Bias the autocomplete object to bucharest for now
        let bnds = new google.maps.Circle({
            center: {
                lat: 44.4115726,
                lng: 26.11414
            },
            radius: 35000 //35 km
        });
        let searchBox = new google.maps.places.Autocomplete(input[0], options);
        searchBox.setBounds(bnds.getBounds());

        searchBox.addListener('place_changed', function () {
            let place = searchBox.getPlace();
            if (place)
                searchClick({
                    place: place.address_components,
                    location: place.geometry.location
                });
        });

        if ($(window).width() <= 768)
            input.focus(() => {
                $('body').scrollTo($('.search-block'));
            });

    }


    if (window.google && window.google.maps) {
        initPlacesAutocomplete();
    } else {
        if (!gmapLoaded) {
            load_places_script();
        }
        lazyLoadApi().then(function () {
            if (window.google && window.google.maps) {
                initPlacesAutocomplete();
            } else {
                console.log('gmaps not loaded');
            }
        }, function () {
            console.log('promise rejected');

        });
    }

    setTimeout(() => {
        $('#announcement').addClass('slide-in');
    }, 5000);
});
