import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from "react-geocode";
import { useState, useRef, useEffect } from "react";
import AutoComplete from "react-google-autocomplete";

Geocode.setApiKey("AIzaSyDGyok70ayGPpyAyxeyAwcVdoQ0rzW5bCo");

function GoogleMapBasic() {
  const [state, setState] = useState({
    address: "",
    city: "",
    area: "",
    state: "",
    zoom: 15,
    height: 400,
    mapPosition: {
      lat: 0,
      lng: 0,
    },
    markerPosition: {
      lat: 0,
      lng: 0,
    },
  });
  // const state = {
  //   address: "",
  //   city: "",
  //   area: "",
  //   state: "",
  //   zoom: 15,
  //   height: 400,
  //   mapPosition: {
  //     lat: 0,
  //     lng: 0,
  //   },
  //   markerPosition: {
  //     lat: 0,
  //     lng: 0,
  //   },
  // };

  useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setState(
            {
              mapPosition: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              markerPosition: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
            () => {
              Geocode.fromLatLng(
                position.coords.latitude,
                position.coords.longitude
              ).then(
                (response) => {
                  console.log(response);
                  const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = getCity(addressArray),
                    area = getArea(addressArray),
                    state = getState(addressArray);
                  console.log("city", city, area, state);
                  setState({
                    address: address ? address : "",
                    area: area ? area : "",
                    city: city ? city : "",
                    state: state ? state : "",
                  });
                },
                (error) => {
                  console.error(error);
                }
              );
            }
          );
        });
      } else {
        console.error("Geolocation is not supported by this browser!");
      }
  }, []);

  // componentDidMount()

  const getCity = (addressArray) => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };

  const getArea = (addressArray) => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };

  const getState = (addressArray) => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };

  const onMakerDragEnd = (event) => {
    let newLat = event.latLng.lat(),
      newLng = event.latLng.lng();

    Geocode.fromLatLng(newLat, newLng).then((response) => {
      console.log(response);
      const address = response.results[0].formatted_address,
        addressArray = response.results[0].address_components,
        city = getCity(addressArray),
        area = getArea(addressArray),
        state = getState(addressArray);

      setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: newLat,
          lng: newLng,
        },
        mapPosition: {
          lat: newLat,
          lng: newLng,
        },
      });
    });
  };

  const onPlaceSelected = (place) => {
    console.log("plc", place);
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = getCity(addressArray),
      area = getArea(addressArray),
      state = getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();

    console.log("latvalue", latValue);
    console.log("lngValue", lngValue);

    // Set these values in the state.
    setState({
      address: address ? address : "",
      area: area ? area : "",
      city: city ? city : "",
      state: state ? state : "",
      markerPosition: {
        lat: latValue,
        lng: lngValue,
      },
      mapPosition: {
        lat: latValue,
        lng: lngValue,
      },
    });
  };

  const MapWithAMarker = withScriptjs(
    withGoogleMap((props) => (
      <GoogleMap
        defaultZoom={16}
        defaultCenter={{
          lat: state.mapPosition.lat,
          lng: state.mapPosition.lng,
        }}>
        <Marker
          draggable={true}
          onDragEnd={onMakerDragEnd}
          position={{
            lat: state.markerPosition.lat,
            lng: state.markerPosition.lng,
          }}>
          <InfoWindow>
            <div>{state.address}</div>
          </InfoWindow>
          <AutoComplete
            types={["(regions)"]}
            onPlaceSelected={onPlaceSelected}
          />
        </Marker>
      </GoogleMap>
    ))
  );

  return (
    <div>
      <MapWithAMarker
        googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyDGyok70ayGPpyAyxeyAwcVdoQ0rzW5bCo &v=3.exp&libraries=geometry,drawing,places'
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      <br />
      <br />
      <div>{state.city}</div>
      <div>{state.area}</div>
      <div>{state.state}</div>
      <div>{state.address}</div>
    </div>
  );
}

export default GoogleMapBasic;
