// import {
//   useJsApiLoader,
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   Autocomplete
// } from "@react-google-maps/api";
// import { useState, useRef } from "react";


// const center = { lat: 44, lng: -80 };
// function GoogleMapTest() {

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: ,
//     libraries:['places']
//   });

//   const [map,setMap]=useState(null)
//   const [distance,setDistance]=useState('')
//   const originRef = useRef()
  
//   if (!isLoaded) {
//     return <div>nonono!</div>;
//   }
//   return (
//     <div>
//       123
//       <Autocomplete>
//         <input type='text' ref={originRef}/>
//       </Autocomplete>
//       <GoogleMap
//         zoom={15}
//         mapContainerStyle={{ width: "60%", height: "60vh" }}
//         center={center}
//         options={{
//           zoomControl: false,
//           streetViewControl: false,
//           mapTypeControl: false,
//           fullscreenControl: false,
//         }}
//         onLoad={(map) => setMap(map)}>
//         <Marker position={{ lat: 44, lng: -80 }}></Marker>
//       </GoogleMap>
//     </div>
//   );
// }

// export default GoogleMapTest;
