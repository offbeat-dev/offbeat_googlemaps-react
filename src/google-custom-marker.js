const createHTMLMapMarker = ({ ...args }) => {
  class HTMLMapMarker extends google.maps.OverlayView {
    constructor() {
      super();
      this.latlng = new google.maps.LatLng(args.position);
      this.setMap(args.map);
    }

    createDiv() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      if (this.html) {
        this.div.innerHTML = this.html;
      } else {
        this.div.innerHTML = `<img id="parrot" src="https://cultofthepartyparrot.com/parrots/hd/parrot.gif">`;
      }
      google.maps.event.addDomListener(this.div, "click", (event) => {
        google.maps.event.trigger(this, "click");
      });
    }

    hide() {
      if (this.div) {
        this.div.style.visibility = "hidden";
      }
    }
    show() {
      if (this.div) {
        this.div.style.visibility = "visible";
      }
    }

    draw() {
      if (!this.div) {
        this.createDiv();
        this.appendDivToOverlay();
      }
      this.positionDiv();
    }

    positionDiv() {
      const point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      let offset = 25;
      if (point) {
        this.div.style.left = `${point.x - offset}px`;
        this.div.style.top = `${point.y - offset}px`;
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

    toggle() {
      if (this.div) {
        if (this.div.style.visibility === "hidden") {
          this.show();
        } else {
          this.hide();
        }
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
  }

  return new HTMLMapMarker();
};

export default createHTMLMapMarker;
