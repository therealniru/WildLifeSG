// import { View, Text } from 'react-native';

// const AddSpotting = () => {
//   return (
//     <View>
//       <Text>
//         Add Spotting Screen
//       </Text>
//     </View>
//   );
// }

// export default AddSpotting;

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
// import { WebView, WebViewMessageEvent } from 'react-native-webview';
// import { db } from '../../FirebaseConfig';
// import { ref, push, set } from "firebase/database";

// // creating a sighting reference in our firebase database
// const sightingsRef = ref(db, 'sightings');

// // const TILE_URL =
// //   'https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png';

// // google maps api below(works)

// const TILE_URL =
//   'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyAcTLwR-ahTo_io_aRiPmOPwmxbO3z4IzU';

// // the html content for webview 
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
//     window.map = L.map('map').setView([1.3521,103.8198],12)
//     L.tileLayer('${TILE_URL}', { maxZoom: 19 }).addTo(window.map);

//     // Sending coordinatives to react native when user clicks on the map
//     window.map.on('click', e => {
//       window.ReactNativeWebView.postMessage(
//         JSON.stringify({ lat: e.latlng.lat, lng: e.latlng.lng })
//       );
//     });

//     // Adding marker to the map
//     window.addMarker = ({ lat, lng, labelHtml }) => {
//       window.map.setView([lat, lng], 14);
//       L.marker([lat, lng])
//         .addTo(window.map)
//         .bindPopup(labelHtml)
//         .openPopup();
//     };
//   </script>
// </body></html>`;

// const AddSpotting = () => {
//   const webRef = useRef<WebView>(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalVisibleCurr, setModalVisibleCurr] = useState(false);
//   const [coords, setCoords] = useState<{ lat: number; lng: number }>();
//   const [coordsUser, setCoordsUser] = useState<{ lat: number; lng: number }>();
//   const [name, setName] = useState('');
//   const [desc, setDesc] = useState('');
//   const [locating, setLocating] = useState(false);

//   // defining what actions shoudl happen when user clicks on screen
//   const onMessage = (e: WebViewMessageEvent) => {
//     const { lat, lng } = JSON.parse(e.nativeEvent.data);
//     setCoords({ lat, lng });
//     setModalVisible(true);
//   };

//   // unable to ope location user location as map opens so 
//   // the code below is not used for now 
//   // to recenter map to user location before adding marker in current location
//   // useEffect(() => {
//   //   (async () => {
//   //     // Gaining permission from user to access location
//   //     const { status } = await Location.requestForegroundPermissionsAsync();
//   //     if (status !== 'granted') return;

//   //     // Getting user's location if permision is granted
//   //     const { coords } = await Location.getCurrentPositionAsync({});

//   //     // code to be injected into webview to change to user's location
//   //     const js = `
//   //       // centering to user location
//   //       window.map.setView([${coords.latitude}, ${coords.longitude}], 16);
//   //     `;
//   //     webRef.current?.injectJavaScript(js);
//   //   })();
//   // }, []);

//   // Adding marker for locations clicked
//   const addMarker = () => {
//     if (!coords) return;
//     const labelHtml = `${"Sighting: " + name}<br/>${"Landmark: " + desc}`;
//     const inj = `
//       window.addMarker({
//         lat: ${coords.lat},
//         lng: ${coords.lng},
//         labelHtml: ${JSON.stringify(labelHtml)}
//       });
//       true; 
//     `;
//     webRef.current?.injectJavaScript(inj);
//     //adding sighting to our realtime firebase database
//     const newSightingRef = push(sightingsRef);
//     set(newSightingRef, {
//       lat: coords.lat,
//       lng: coords.lng,
//       name: name,
//       desc: desc, 
//       timestamp: Date.now(),
//     });
//     setModalVisible(false);
//     setName('');
//     setDesc('');
//   };

//   // Adding marker for current location
//   const addMarkerCurr = () => {
//     //console.log("print me first");
//     //console.log('addMarkerCurr', coordsUser);
//     if (!coordsUser) return;
//     const labelHtml = `${"Sighting: " + name}<br/>${"Landmark: " + desc}`;
//     const inj = `
//       window.addMarker({
//         lat: ${coordsUser.lat},
//         lng: ${coordsUser.lng},
//         labelHtml: ${JSON.stringify(labelHtml)}
//       });
//       true;
//     `;
//     webRef.current?.injectJavaScript(inj);
//     //adding sighting to our realtime firebase database
//     const newSightingRef = push(sightingsRef);
//     set(newSightingRef, {
//       lat: coordsUser.lat,
//       lng: coordsUser.lng,
//       name: name,
//       desc: desc, 
//       timestamp: Date.now(),
//     });
//     setModalVisibleCurr(false);
//     setName('');
//     setDesc('');
//   };

//   // Defining what is to to be done when user presses the "Add my Location" button
//   const locateUser = async () => {
//     //console.log('locateUser');
//     setLocating(true);
//     // requesting for permission
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     // if not granted, alerting user and returning
//     if (status !== 'granted') {
//       alert('Location permission denied');
//       setLocating(false);
//       return;
//     }
//     // getting user's position if permission is granted
//     const pos = await Location.getCurrentPositionAsync({});
//     const { latitude: lat, longitude: lng } = pos.coords;
//     setCoordsUser({ lat, lng });
//     const inj = `
//       window.map.setView([${lat}, ${lng}], 16)
//     `;
//     webRef.current?.injectJavaScript(inj);
//     setModalVisibleCurr(true);
//     //console.log('here');
//     setLocating(false);
//   };
//   return (  
//     <View style={{ flex: 1 }}>
//       <WebView
//         ref={webRef}
//         originWhitelist={['*']}
//         source={{ html }}
//         onMessage={onMessage}
//         style={{ flex: 1 }}
//         geolocationEnabled={true}
//       />

//       {/* Add My Location button */}
//       <View style={styles.buttonContainer}>
//         {locating
//           ? <ActivityIndicator color="#fff"/>
//           : <Button 
//               title="Add My Location" 
//               onPress={locateUser} 
//               color="#0066cc"
//             />
//         }
//       </View>

//       {/* Modal for custom markers */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.backdrop}>
//           <View style={styles.modal}>
//             <TextInput
//               placeholder="Sighting"
//               value={name}
//               onChangeText={setName}
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Landmark"
//               value={desc}
//               onChangeText={setDesc}
//               style={styles.input}
//             />
//             <Button title="Add Sighting" onPress={addMarker} />
//             <Button title="Cancel" onPress={() => setModalVisible(false)} />
//           </View>
//         </View>
//       </Modal>
      
//       {/* Modal for current location markers */}
//       <Modal
//         visible={modalVisibleCurr}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setModalVisibleCurr(false)}
//       >
//         <View style={styles.backdrop}>
//           <View style={styles.modal}>
//             <TextInput
//               placeholder="Sighting"
//               value={name}
//               onChangeText={setName}
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Landmark"
//               value={desc}
//               onChangeText={setDesc}
//               style={styles.input}
//             />
//             <Button title="Add Sighting" onPress={addMarkerCurr} />
//             <Button title="Cancel" onPress={() => setModalVisibleCurr(false)} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

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

// export default AddSpotting;

import {
  Alert,
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
import { ref, push, set, get } from "firebase/database";
// creating a sighting reference in our firebase database
const sightingsRef = ref(db, 'sightings');

const AddSpotting = () => {
  const { location, hasPermission, requestPermission, getCurrentLocation } = useLocation();
  const [marker, setMarker] = useState<Sighting[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [descs, setDescs] = useState<string[]>([]);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>(location); 
  type Sighting = {
      lat: number;
      lng: number;
      name: string;
      desc: string;
      timeStamp: number
    };
  console.log(location);
  console.log(hasPermission); 
  // onMapPress to define what happens when someone clicks on a map 
  const onMapPress = (event: any) => {
    setCoords(event.nativeEvent.coordinate);
    setModalVisible(true);
  }
  // function to store marker coordinates in the marker array
  const addMarker = () => { 
    setMarker([...marker, { lat: coords.latitude, lng: coords.longitude, name: name, desc: desc, timeStamp: Date.now() }]);
    setNames([...names, name]);
    setDescs([...descs, desc]);
    console.log("here");
    console.log(name + " " + desc);
    names[names.length] = name;
    descs[descs.length] = desc;
    //console.log(names);
    //console.log(descs);
    setModalVisible(false);
    //adding sighting to our realtime firebase database
    const newSightingRef = push(sightingsRef);
    set(newSightingRef, {
      lat: coords.latitude,
      lng: coords.longitude,
      name: name,
      desc: desc, 
      timestamp: Date.now(),
    });
    setName("");
    setDesc("");
  }
  // function to set marker location to user location
  const setCurrLoc = () => {
    setModalVisible(true);
    //setMarker([...marker, { coordinate: { latitude: location.latitude, longitude: location.longitude } }]);
    setCoords(location)
  }
  

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
        onPress = {(event) => onMapPress(event)}
      >
      {marker.map((marker, index) => { 
        console.log(index);
        console.log(marker);
        return (
        <Marker key = {index} coordinate = {{latitude: marker.lat, longitude: marker.lng}} title = {"Sighting: " + marker.name} description = {"Description: " + marker.desc}/>
      )})}
      
      </MapView>
      {/* Add My Location button */}
       <View style={styles.buttonContainer}>
            <Button 
               title="Add My Location" 
               onPress={setCurrLoc} 
               color="#0066cc"
             />
       </View>
      {/* Modal for custom markers */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <TextInput
              placeholder="Sighting"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Landmark"
              value={desc}
              onChangeText={setDesc}
              style={styles.input}
            />
            <Button title="Add Sighting" onPress={addMarker} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal> 
    </View>
  );
}
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

// extras

{/* <Marker
        coordinate={{
          latitude: 1.3561,
          longitude: 103.8198,
        }}
        title="Marker"
        description="This is a marker"    
      />
      <Marker
        coordinate={{
          latitude: 1.3521,
          longitude: 103.8198,
        }}
        title="Marker"
        description="This is a marker"
      />  */}