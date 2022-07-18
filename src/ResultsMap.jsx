import React, { useEffect, useRef } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Loader } from "@googlemaps/js-api-loader";
import "./info-window-styles.css";
import createHTMLMapMarker from "./google-custom-marker";
import { OverlappingMarkerSpiderfier } from "ts-overlapping-marker-spiderfier";

const ResultsMap = () => {
  let overlapSpiderifier = null;
  const mapRef = useRef();
  const [viewInfoWindow, setViewInfoWindow] = React.useState(false);
  const [mapInstance, setMapInstance] = React.useState(false);
  const [markers, setMarkers] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const containerStyle = {
    width: "400px",
    height: "400px",
  };
  let infoWindow;
  const center = { lat: -28.024, lng: 140.887 };
  const locations = [
    { lat: -31.56391, lng: 147.154312 },
    { lat: -31.56391, lng: 147.154312 },
    { lat: -31.56391, lng: 147.154312 },
    { lat: -31.56391, lng: 147.154312 },
    { lat: -31.56391, lng: 147.154312 },
    { lat: -31.56391, lng: 147.154312 },

    { lat: -33.718234, lng: 150.363181 },
    { lat: -33.727111, lng: 150.371124 },
    { lat: -33.848588, lng: 151.209834 },
    { lat: -33.851702, lng: 151.216968 },
    { lat: -34.671264, lng: 150.863657 },
    // { lat: -35.304724, lng: 148.662905 },
    // { lat: -36.817685, lng: 175.699196 },
    // { lat: -36.828611, lng: 175.790222 },
    // { lat: -37.75, lng: 145.116667 },
    // { lat: -37.759859, lng: 145.128708 },
    // { lat: -37.765015, lng: 145.133858 },
    // { lat: -37.770104, lng: 145.143299 },
    // { lat: -37.7737, lng: 145.145187 },
    // { lat: -37.774785, lng: 145.137978 },
    // { lat: -37.819616, lng: 144.968119 },
    // { lat: -38.330766, lng: 144.695692 },
    // { lat: -39.927193, lng: 175.053218 },
    // { lat: -41.330162, lng: 174.865694 },
    // { lat: -42.734358, lng: 147.439506 },
    // { lat: -42.734358, lng: 147.501315 },
    // { lat: -42.735258, lng: 147.438 },
    // { lat: -43.999792, lng: 170.463352 },
  ];

  // const options = {
  //   imagePath:
  //     "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  // };

  const handleGoogleLoaded = (google) => {
    infoWindow = new google.maps.InfoWindow({});
    const instance = new google.maps.Map(mapRef.current, {
      center: center,
      zoom: 2,
    });
    google.maps.event.addListener(instance, "click", function (event) {
      console.log(event);
      infoWindow.close();
    });

    overlapSpiderifier = new OverlappingMarkerSpiderfier(instance, {
      keepSpiderfied: true,
      ignoreMapClick: true,
      legWeight: 0,
      spiralLengthFactor: 10,
      spiralFootSeparation: 50,
      circleFootSeparation: 50,
    });
    handleMapLoaded(instance);
  };

  const handleMapLoaded = (instance) => {
    console.log("map loaded");
    const markers = [];
    locations.map((location, i) => {
      // const marker = new google.maps.Marker({
      //   position: location,
      //   map: instance,
      // });
      let marker = createHTMLMapMarker({
        position: location,
        anchor: { x: 0, y: 15 },
      });

      const hasRepeats = locations.some(
        (loc, index) =>
          loc.lat === location.lat && loc.lng === location.lng && index !== i
      );

      if (hasRepeats) marker.firstClick = true;

      marker.addListener("click", (e) => {
        handleMarkerClick(location, marker);
      });

      overlapSpiderifier.addMarker(marker);
      markers.push(marker);
    });

    const markerCluster = new MarkerClusterer({
      markers,
    });
    markerCluster.setMap(instance);
  };

  const handleMarkerClick = (location, marker) => {
    if (marker.firstClick) {
      marker.firstClick = false;
      return;
    }

    if (infoWindow.getMap() !== undefined && infoWindow.getMap() !== null) {
      console.log("close", infoWindow.getMap());
      infoWindow.close();
      return;
    }

    const contentString = `<div id="content" class="info-window__items">${location.lat}</div>`;
    infoWindow.setContent(contentString);
    infoWindow.open(marker.getMap(), marker);
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyCs2ax90g4pVVd17c7cL_yE9opoGg6Mt4Q",
    });
    loader
      .load()
      .then((google) => {
        handleGoogleLoaded(google);
      })
      .catch((e) => {
        // do something
      });
  }, []);
  return <div ref={mapRef} style={{ height: 500 }}></div>;
};

export default ResultsMap;
