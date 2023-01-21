import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

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
      fetch('https://api.n2yo.com/rest/v1/satellite/positions/25544/41.702/-76.014/0/2/&?apiKey=34L9R7-JTXEVV-8BFG5B-4ZC0')
        .then(response => response.json())
        .then(data => {
          const position = data.positions[0];
          const longitude = position.satlongitude;
          const latitude = position.satlatitude;
          setLocation({longitude, latitude});
        });
    }, 6000);
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!map.current || !location.longitude) return;
    const marker = new mapboxgl.Marker()
      .setLngLat([location.longitude, location.latitude])
      .addTo(map.current);
  }, [location]);

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
