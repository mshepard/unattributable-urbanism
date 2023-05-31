function initMap() {
  // Create a new map instance
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 42.8933609, lng: -78.8731212 }, // Set the initial map center
    zoom: 12 // Set the initial zoom level
  });

  // Add additional map customization or functionality here
  // Add click event listener
  var startPoint;
  var endPoint;

  google.maps.event.addListener(map, 'click', function(event) {
    var clickedLatLng = event.latLng;
    var clickedLatitude = clickedLatLng.lat();
    var clickedLongitude = clickedLatLng.lng();

    if (!startPoint) {
      startPoint = clickedLatLng;
      document.getElementById('start-lat-lng').textContent = `Lat: ${clickedLatitude}, Lng: ${clickedLongitude}`;
    }
    else if (!endPoint) {
      endPoint = clickedLatLng;
      document.getElementById('end-lat-lng').textContent = `Lat: ${clickedLatitude}, Lng: ${clickedLongitude}`;
      calculateRoute(startPoint, endPoint);

      // Reset startPoint and endPoint
      startPoint = null;
      endPoint = null;
    };
    // console.log("LatLon: ", clickedLatLng);
    // console.log("Lat: ", clickedLatitude, "Lon: ", clickedLongitude);
    });
}

function calculateRoute(startLocation, endLocation) {
  imageUrls = [];

  // Clear the existing Street View images
  clearStreetViewImages();

  var directionsService = new google.maps.DirectionsService();

  var request = {
    origin: startLocation, // Start point
    destination: endLocation, // End point
    travelMode: google.maps.TravelMode.DRIVING // Specify the travel mode
  };

  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var route = result.routes[0]; // Get the first route from the result
      var legs = route.legs; // Get the array of route legs
      // console.log("LEGS: ", legs)

      // Calcualate the total number of steps
      var totalSteps = 0;
      for (var i = 0; i < legs.length; i++) {
        totalSteps += legs[i].steps.length;
      }

      // Calculate the number of images per step
      var numberOfImagesPerStep = Math.ceil(parseInt(document.getElementById("number-imgs").value, 10) / totalSteps);

      for (var i = 0; i < legs.length; i++) {
        var leg = legs[i];
        var steps = leg.steps;
        // console.log("STEPS: ", steps)

        for (var j = 0; j < steps.length; j++) {
          var step = steps[j];
          var stepStartLocation = step.start_location;
          var stepEndLocation = step.end_location;

          retrieveStreetViewImages(stepStartLocation, stepEndLocation, numberOfImagesPerStep);
        }
      } 
   }
  else {
      // Handle the route calculation failure
    }
  });
}


function retrieveStreetViewImages(startLocation, endLocation, numberOfImages) {
  var streetViewService = new google.maps.StreetViewService();

  // Define the number of images to retrieve along the step
  // var numberOfImages = parseInt(document.getElementById("number-imgs").value, 10);

  // Calculate the step distance
  var stepDistance = google.maps.geometry.spherical.computeDistanceBetween(startLocation, endLocation)

  // Calculate the distance interval for retrieving Street View images
  var distanceInterval = stepDistance / numberOfImages;

  // Retrieve Street View images interval for retrieiving Street View images
  for (var i = 0; i < numberOfImages; i++) {
    // Delay the request to ensure that each image has time to load
    (function(i) {
      setTimeout(function() {
        var distance = distanceInterval * i;
        var fraction = distance / stepDistance;
        // Add a small offset to the first fraction to ensure a valid heading
        if (i == 0 && fraction === 0) {
          fraction += 0.01;
        }

        var position = google.maps.geometry.spherical.interpolate(startLocation, endLocation, fraction);

        streetViewService.getPanorama({ location: position, radius: 50 }, function(data, status) {
          if (status === 'OK') {
            // Handle the Street View image data
            var panorama = data.location.pano;
            var heading = google.maps.geometry.spherical.computeHeading(startLocation, endLocation);

            // Adjust the heading 90 degrees to the right
            heading += 90;
            if (heading >= 360) {
              heading -= 360;
            }

            // Display the Street View image or perform any desired actions
            displayStreetViewImage(panorama, heading);
          } else {
            // Handle the failure to retrieve a Street View image
          }
        });
      }, i * 1000); // 1 second delay between each request
    })(i);
  }
  setTimeout(function() {
    console.log(imageUrls);
    fetch('http://localhost:5000/process_images', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageUrls: imageUrls })
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }, numberOfImages * 1000);
}


var imageUrls = [];

function displayStreetViewImage(panorama, heading) {
  var container = document.getElementById('street-view-container');

  // Construct the Street View image URL
  var streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?pano=${panorama}&heading=${heading}&size=256x256&key=AIzaSyA0drspSVOInUWxyP_w0vVTID8oBJHyYOs`;

  // Create a new img element and set the src attribute to the Street View image URL
  var img = document.createElement('img');
  img.src = streetViewUrl;

  container.appendChild(img);


  // Add the Street View image URL to the imageUrls array
  imageUrls.push(streetViewUrl);
}

function clearStreetViewImages() {
  var container = document.getElementById('street-view-container');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

// Call the initMap function to initialize the map
initMap();

