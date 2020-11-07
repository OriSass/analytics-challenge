import React, {useState, useEffect} from 'react'
import { GoogleMap, Marker, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import { Event, Location } from "../../models/event";
import { isPropertyAccessChain } from 'typescript';
import axios from "axios";
require('dotenv').config(); 
const containerStyle = {
  width: '450px',
  height: '400px'
};
 
const defaultCenter = {
  lat: 31.45,
  lng: 35
};

const GoogleMapEvents: React.FC = () => {
    const [map, setMap] = useState(null)
    const [events, setEvents] = useState<Event[]>();

    useEffect(() => {
        fetchEvents();
    },[])
    
  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])
 

  const fetchEvents = async() => {
      const {data} = await axios.get('http://localhost:3001/events/all');
      setEvents(data);
  }
  const options = {
    imagePath:
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  }
  
  
  const MapWithMarkerClusterer = () => {
    if(events){
    return (
        <GoogleMap id='marker-example' mapContainerStyle={containerStyle} zoom={3} center={defaultCenter}>
          <MarkerClusterer options={options}>
            {(clusterer) =>
              events.map((e:Event, index:number) => (
                <Marker key={index} position={e.geolocation.location} clusterer={clusterer} />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
    )}
  }
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAjAfRuRjqW0T6_15JTEv523-8IWNk4l3o"
    >
      {MapWithMarkerClusterer()}
    </LoadScript>
  )
  };

export default GoogleMapEvents;

