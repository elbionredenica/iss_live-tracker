import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl';

import './App.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoibm90ZWxiaW9uIiwiYSI6ImNqdDF3b2ZsbzBmMjk0YnAzcWIwaW9jc2UifQ.VsQ_49cngtGm9kApyXFCkw'

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.431297);
  const [lat, setLat] = useState(37.773972);
  const [zoom, setZoom] = useState(9);
  const [location, setLocation] = useState({});
  
  useEffect(() => {
    if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });
  
  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
      map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch('https://api.wheretheiss.at/v1/satellites/25544')
        .then(response => response.json())
        .then(data => {
          const longitude = data.longitude;
          const latitude = data.latitude;
          setLocation({longitude, latitude});
        });
    }, 4000);
  
    return () => clearInterval(intervalId);
    
  }, []);

  let currentMarker = null;
const pastMarkers = [];

useEffect(() => {
    if (!map.current || !location.longitude) return;
    const el = document.createElement('div');
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/1042/1042820.png')";
    el.style.backgroundSize = 'cover';

    if (currentMarker) {
        currentMarker.remove();
    }

    currentMarker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map.current);

    pastMarkers.push(currentMarker);
    if (pastMarkers.length > 1) {
        pastMarkers.shift().remove();
    }

    const popup = new mapboxgl.Popup()
        .setHTML('<div style="overflow-y: scroll; height: 300px"><h1> ISS Location Tracker </h1><img height="200" width="100%" src="https://www.nasa.gov/sites/default/files/s132e012209_sm.jpg"></img><h2>This marker is the current location of the International Space Station.</h2><h3>Data updates every 10 seconds. </h3><p> The International Space Station (ISS) is a habitable artificial satellite that orbits the Earth at an altitude of between 330 and 435 km. It is the largest human-made object in space and can often be seen from the Earth with the naked eye. The ISS is a collaboration between NASA (United States), Roscosmos (Russia), JAXA (Japan), ESA (Europe), and CSA (Canada). The ISS has been continuously occupied by humans since 2000, making it the longest continuously occupied human-made object in space. The space station serves as a research laboratory in low Earth orbit and enables long-duration human spaceflight. It has a pressurized volume of 916 cubic meters, which is equivalent to the interior space of a Boeing 747. The ISS is equipped with numerous scientific instruments, including the Alpha Magnetic Spectrometer, which is searching for evidence of dark matter and antimatter, and the COLBERT treadmill, which allows astronauts to exercise while in space. The ISS also serves as a platform for studying the effects of long-duration spaceflight on the human body, as well as the effects of microgravity on various materials and biological systems. The ISS is visited regularly by spacecraft from NASA and other international partners, including the Russian Soyuz and Progress spacecraft, the European Automated Transfer Vehicle, and the Japanese H-II Transfer Vehicle. The space station is also visited by commercial spacecraft, such as the SpaceX Dragon and the Boeing CST-100 Starliner. The ISS is expected to continue operating until at least 2030, although plans for its eventual decommissioning and replacement are currently under development.</p></div>')
        .setMaxWidth("400px")
    currentMarker.setPopup(popup)
    currentMarker.getElement().addEventListener('click', () => {
        currentMarker.togglePopup();
    });

}, [location]);



// <div style="overflow-y: scroll; height: 300px"><h1> ISS Location Tracker </h1><img height="200" width="100%" src="https://www.nasa.gov/sites/default/files/s132e012209_sm.jpg"></img><h2>This marker is the current location of the International Space Station.</h2><h3>Data updates every 10 seconds. </h3><p> The International Space Station (ISS) is a habitable artificial satellite that orbits the Earth at an altitude of between 330 and 435 km. It is the largest human-made object in space and can often be seen from the Earth with the naked eye. The ISS is a collaboration between NASA (United States), Roscosmos (Russia), JAXA (Japan), ESA (Europe), and CSA (Canada). The ISS has been continuously occupied by humans since 2000, making it the longest continuously occupied human-made object in space. The space station serves as a research laboratory in low Earth orbit and enables long-duration human spaceflight. It has a pressurized volume of 916 cubic meters, which is equivalent to the interior space of a Boeing 747. The ISS is equipped with numerous scientific instruments, including the Alpha Magnetic Spectrometer, which is searching for evidence of dark matter and antimatter, and the COLBERT treadmill, which allows astronauts to exercise while in space. The ISS also serves as a platform for studying the effects of long-duration spaceflight on the human body, as well as the effects of microgravity on various materials and biological systems. The ISS is visited regularly by spacecraft from NASA and other international partners, including the Russian Soyuz and Progress spacecraft, the European Automated Transfer Vehicle, and the Japanese H-II Transfer Vehicle. The space station is also visited by commercial spacecraft, such as the SpaceX Dragon and the Boeing CST-100 Starliner. The ISS is expected to continue operating until at least 2030, although plans for its eventual decommissioning and replacement are currently under development.</p></div>
  useEffect(() => {
    if (!map.current || !location.longitude) return;
    map.current.setCenter([location.longitude, location.latitude]);
  }, [location]);
  
  
  

  return (
    <div className="App">
      <header className="App-header">
        <p> Live Delivery Tracker System </p>
      </header>
      
      <div className="main">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    
    </div>
  );
}

export default App;
