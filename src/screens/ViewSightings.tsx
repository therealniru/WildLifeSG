// mock screen to revert back to if required
// import { View, Text } from 'react-native';

// const ViewSightings = () => {
//   return (
//     <View>
//       <Text>
//         View Sightings Screen
//       </Text>
//     </View>
//   );
// }

// export default ViewSightings;

// import * as Location from 'expo-location';
// import React, { useRef, useState, useEffect } from 'react';
// import {
//   ActivityIndicator,
//   Button,
//   Modal,
//   Platform,
//   StyleSheet,
//   TextInput,
//   View,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { db } from '../../FirebaseConfig';
// import { ref, push, set, onValue } from "firebase/database";

// // creating a sighting reference in our firebase database
// const sightingsRef = ref(db, 'sightings');
// // const TILE_URL =
// //   'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';

// // google maps api below(works)

// const TILE_URL =
//   'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyAcTLwR-ahTo_io_aRiPmOPwmxbO3z4IzU';

// const html = `<!DOCTYPE html>
// <html><head>
//   <meta name="viewport" content="initial-scale=1.0"/>
//   <link
//     rel="stylesheet"
//     href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"/>
//   <style>html,body,#map{height:100%;margin:0;padding:0}</style>
// </head><body>
//   <div id="map"></div>
//   <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
//   <script>
//     // Create Map
//     window.map = L.map('map').setView([1.3521,103.8198],12);

//     // Adding Tile Layer
//     L.tileLayer('${TILE_URL}', { maxZoom: 19 }).addTo(window.map);

//     // Sending coordinates to react native when user clicks on the map
//     window.map.on('click', e => {
//       window.ReactNativeWebView.postMessage(
//         JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng })
//       );
//     });
//     window.addMarker = ({ lat, lng, labelHtml }) => {
//     window.map.setView([lat, lng], 12);
//     L.marker([lat, lng])
//         .addTo(window.map)
//         .bindPopup(labelHtml)
//         .openPopup();
//     };
//     window.ReactNativeWebView.postMessage('READY');
//   </script>
// </body></html>`;

// const ViewSightings = () => {
//   const webRef = useRef<WebView>(null);
//   const [sightings, setSightings] = useState<Sighting[]>([]);
//   const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
//   const [webReady, setWebReady] = useState(false);
//   const [locating, setLocating] = useState(false);
//   const [radius, setRadius] = useState(Number.MAX_SAFE_INTEGER);

//   type Sighting = {
//       lat: number;
//       lng: number;
//       name: string;
//       desc: string;
//       timestamp: number;
//     };
  
//   // recieving a message from webview to trigger the map to show markers
//   // without this, map was not showing filters, need to figure out why
//   const onMessage = (e: { nativeEvent: { data: string; }; }) => {
//     if (e.nativeEvent.data === 'READY') {
//       setWebReady(true);
//     }
//   };

//   useEffect(() => {
//       (async () => {
//         // Request for permission
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') return;
  
//         // obtain current location of user
//         const { coords } = await Location.getCurrentPositionAsync({});
//         console.log("user lcoation found");
//         setUserLocation({ lat: coords.latitude, lng: coords.longitude });
  
//         // code to be injected into webview to change to user's location
//         const js = `
//           // centering to user location
//           window.map.setView([${coords.latitude}, ${coords.longitude}], 16);
//         `;
//         //webRef.current?.injectJavaScript(js);
//       })();
//   }, []);
  
//   // monitoring changes in the database to updating sightings state
//   useEffect(() => {
//     const sightingsRef = ref(db, "sightings");
//     const unsubscribe = onValue(sightingsRef, snapshot => {
//       const data = snapshot.val() || {};
//       const list = Object.entries(data).map(
//         ([id, val]) => ({ id, ...(val as any) })
//       ) as Sighting[];
//       setSightings(list);
//     });
//     return () => unsubscribe();
//   }, [userLocation]);

//   //looping through sightings to add markers to map
//   useEffect(() => {
//     if (!webReady || sightings.length === 0) return;
//     for (const sighting of sightings) {
//         //console.log("in loop");
//         const labelHtml = `${"Sighting: " + sighting.name}<br/>${"Landmark: " + sighting.desc}`;
//         const inj = `
//           window.addMarker({
//             lat: ${sighting.lat},
//             lng: ${sighting.lng},
//             labelHtml: ${JSON.stringify(labelHtml)}
//           });
//           true;
//         `;
//         webRef.current?.injectJavaScript(inj);  
//     } 
//   }, [webReady,sightings]);

  
//   return (  
//     <View style={{ flex: 1 }}>
//       <WebView
//         ref={webRef}
//         originWhitelist={['*']}
//         onMessage={onMessage}
//         source={{ html }}
//         style={{ flex: 1 }}
//         geolocationEnabled={true}
//       />
//     </View>
//   );      
// }

// // copied from AddSpotting.tsx in case neded later

// const styles = StyleSheet.create({
//   buttonContainer: {
//     position: 'absolute',
//     top: Platform.OS === 'ios' ? 60 : 20,
//     right: 20,
//     backgroundColor: '#0066cc',
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   backdrop: {
//     flex: 1,
//     backgroundColor: '#00000055',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modal: {
//     width: '80%',
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//   },
//   input: {
//     borderBottomWidth: 1,
//     marginBottom: 12,
//     paddingVertical: 10,
//   },
// });

// export default ViewSightings;


import {
  ActivityIndicator,
  Button,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {useState, useEffect} from 'react';
import MapView, {Marker} from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import tw from 'twrnc';
import { db } from '../../FirebaseConfig';
import { ref, push, set, onValue } from "firebase/database";
// creating a sighting reference in our firebase database
const sightingsRef = ref(db, 'sightings');

const AddSpotting = () => {
  const { location, hasPermission, requestPermission } = useLocation();
  const [sightings, setSightings] = useState<Sighting[]>([]);
  // the following states might be used later
  // const [modalVisible, setModalVisible] = useState(false);
  // const [name, setName] = useState('');
  // const [desc, setDesc] = useState('');
  // const [names, setNames] = useState<string[]>([]);
  // const [descs, setDescs] = useState<string[]>([]);
  // const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null); 
  // Deifning a type called Sighting
  type Sighting = {
      id: string;
      lat: number;
      lng: number;
      name: string;
      desc: string;
      timestamp: number;
      userId: string;
    };
  console.log(hasPermission); 

  // monitoring changes in the database to updating sightings state
  useEffect(() => {
    const sightingsRef = ref(db, "sightings");
    const unsubscribe = onValue(sightingsRef, snapshot => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(
        ([id, val]) => ({ id, ...(val as any) })
      ) as Sighting[];
      setSightings(list);
    });
    return () => unsubscribe();
  }, [location]);

  return (
    <View style={tw`flex-1`}>
      <MapView
        style={tw`flex-1 w-full h-full`}
        initialRegion={location}
        showsUserLocation={hasPermission}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        showsScale={true}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
      >
      {sightings.map((marker, index) => { 
        console.log(index);
        console.log(marker);
        return (
        <Marker key = {index} coordinate = {{latitude: marker.lat, longitude: marker.lng}} title = {"Sighting: " + marker.name} description = {"Description: " + marker.desc}/>
      )})}
      </MapView>
    </View>
  );
}
//copied over from Addspottings in case needed for later
const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 70 : 60,
    right: 10,
    backgroundColor: '#0066cc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingVertical: 10,
  },
});
export default AddSpotting;