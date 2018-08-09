export default class Collection {
  children = [];

  constructor({ args = {}, ...props }, context) {
    this.args = args;
    this.context = context;
    this.props = props;
  }

  updateProps(props) {
    this.props = {
      ...this.props,
      ...props,
    };
  }

  setArgs(args) {
    this.args = args;
  }

  draw(context) {
    this.children.forEach(child => child.draw(context));
  }

  addChild(child) {
    this.children.push(child);
  }

  insertBefore(child, beforeChild) {
    this.children.splice(this.children.indexOf(beforeChild), 0, child);
  }

  removeChild(child) {
    child.destroy();
    this.children.splice(this.children.indexOf(child), 1);
  }

  destroy() {
    this.children.forEach(child => child.destroy());
  }
}
