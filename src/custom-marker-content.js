const createHTMLMapMarkerContent = ({ ...args }) => {
  class CustomMarkerContent extends google.maps.OverlayView {
    constructor() {
      super();
      let self = this;
      self.setValues(args);
      self.element = document.createElement("div");
      self.element.className = args.cssClass ? args.cssClass : "marker-content";
    }

    onAdd() {
      let self = this;
      self.getPanes().overlayImage.appendChild(self.element);
    }

    getVisible() {
      return true;
    }

    onRemove() {
      this.element.parentNode.removeChild(this.element);
      this.element = null;
    }

    draw() {
      var pixel = this.getProjection().fromLatLngToDivPixel(
        this.get("position")
      );
      this.element.innerHTML = this.html;
      this.element.style.position = "absolute";
      this.element.style.left = pixel.x + "px";
      this.element.style.top = pixel.y + "px";
    }
  }

  return new CustomMarkerContent();
};

export default createHTMLMapMarkerContent;
