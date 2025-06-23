import MapView, { Region } from 'react-native-maps';
import tw from 'twrnc';

export interface MapProps {
  location: Region;
  hasPermission: boolean;
}

const Map = ({ location, hasPermission }: MapProps) => {
  // Marina Bay, Singapore coordinates fallback
  const MARINA_BAY_REGION: Region = {
    latitude: 1.2834,
    longitude: 103.8607,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mapStyle = [
    tw`flex-1 w-full h-full`
  ];

  return (
    <MapView
      style={mapStyle}
      initialRegion={location || MARINA_BAY_REGION}
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
    />
  );
};

//export default Map;
