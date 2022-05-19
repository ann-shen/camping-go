import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import styled from "styled-components";
import Geocode from "react-geocode";
import { useEffect } from "react";
import Autocomplete from "react-google-autocomplete";

const MapWrap = styled.div`
  width: 100%;
`;

let key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
Geocode.setApiKey(`${key}`);
const MapWithAMarker = withScriptjs(
  withGoogleMap(({ state, onMakerDragEnd, onPlaceSelected }) => (
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
        </Marker>
        <Autocomplete
          style={{
            width: "98%",
            height: "30px",
            margin: "20px 0px 0px 0px",
            backgroundColor: "#F4F4EE",
            border: "1px solid gray",
            borderRadius: "5px",
            padding: "5px",
          }}
          types={["geocode", "establishment"]}
          onPlaceSelected={onPlaceSelected}
        />
      </GoogleMap>
  ))
);

function GoogleMapBasic({ state, setState }) {
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
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = getCity(addressArray),
      area = getArea(addressArray),
      state = getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng();

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

  return (
    <MapWrap>
      <MapWithAMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDGyok70ayGPpyAyxeyAwcVdoQ0rzW5bCo&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
        state={state}
        onMakerDragEnd={onMakerDragEnd}
        onPlaceSelected={onPlaceSelected}
      />
      <br />
      <br />
      <br />
      <br />
      <div>{state.city}</div>
      <div>{state.state}</div>
      <div>{state.address}</div>
    </MapWrap>
  );
}

export default GoogleMapBasic;
