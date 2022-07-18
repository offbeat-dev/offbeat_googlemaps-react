const createHTMLMapMarker = ({ ...args }) => {
  class HTMLMapMarker extends google.maps.OverlayView {
    constructor() {
      super();
      this.anchor = args.offset ? args.offset : { x: 0, y: 0 };
      this.setValues(args);
      this.marker = new google.maps.Marker(args);
      this.marker.setVisible(false);
      this.marker.map = this.map;
      this.latlng = new google.maps.LatLng(args.position);
      this.setMap(args.map);
    }

    createDiv() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      this.div.style.cursor = "pointer";
      if (this.html) {
        this.div.innerHTML = this.html;
      } else {
        this.div.innerHTML = `<img id="parrot" src="https://cultofthepartyparrot.com/parrots/hd/parrot.gif">`;
      }
      google.maps.event.addDomListener(this.div, "click", (e) => {
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        google.maps.event.trigger(this, "click");
      });
    }

    setPosition(position) {
      if (position instanceof google.maps.LatLng) {
        // this.marker?.setPosition(position);
        position = { lat: position.lat(), lng: position.lng() };
      } else {
        // this.marker?.setPosition(
        //   new google.maps.LatLng(position.lat, position.lng)
        // );
      }
      this.set("position", position);
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    positionDiv() {
      this.latlng = new google.maps.LatLng(this.position);

      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);

      if (point) {
        this.div.style.left = `${point.x - this.anchor.x}px`;
        this.div.style.top = `${point.y - this.anchor.y}px`;
      }
    }

    appendDivToOverlay() {
      const panes = this.getPanes();
      panes.overlayImage.appendChild(this.div);
    }

    getDraggable() {
      return false;
    }

    getVisible() {
      return true;
    }

    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    toggleDOM(map) {
      if (this.getMap()) {
        this.setMap(null);
      } else {
        this.setMap(map);
      }
    }

    getPosition() {
      return this.latlng;
    }

    getZIndex() {
      return this.marker.getZIndex();
    }

    setZIndex(zIndex) {
      this.marker.setZIndex(zIndex);
    }
  }

  return new HTMLMapMarker();
};

export default createHTMLMapMarker;
