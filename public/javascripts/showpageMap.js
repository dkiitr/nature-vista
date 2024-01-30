mapboxgl.accessToken = mapBoxToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11",
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());
// create the popup
const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
  `<h5>${campground.title}</h5> <p>${campground.location}</p>`
);
// Create a new marker.
new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);
