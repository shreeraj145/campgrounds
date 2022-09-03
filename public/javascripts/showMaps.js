mapboxgl.accessToken = mapToken;
campground = JSON.parse(campground);


const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: campground.geometry.coordinates,
    zoom: 15,
    projection: 'globe'
});

const marker1 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>4${campground.location}</p>`
            )
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());