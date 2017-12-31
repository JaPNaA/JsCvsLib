class JsCvs {
  constructor() {
    this.element = document.createElement("canvas");
    this.context = this.element.getContext("2d");
    
    Object.defineProperties(this, {
      width: {
        get: () => this.element.width,
        set: e => this.element.width = e
      },
      height: {
        get: () => this.element.height,
        set: e => this.element.height = e
      }
    });
  }
  appendTo(e) {
    e.appendChild(this.element);
  }
  set(x, y, c) {
    this.context.fillStyle = c;
    this.context.fillRect(x, y, 1, 1);
  }
}