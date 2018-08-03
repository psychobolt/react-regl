export default class Collection {
  children = [];

  draw() {
    this.children.forEach(child => child.draw());
  }

  addChild(child) {
    this.children.push(child);
  }

  removeChild(child) {
    child.destroy();
    this.children.splice(this.children.indexOf(child), 1);
  }

  destroy() {
    this.children.forEach(child => child.destroy());
  }
}
