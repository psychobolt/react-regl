export default class Collection {
  children = [];

  constructor(props, context) {
    this.context = context;
    this.props = props;
  }

  updateProps(props) {
    this.props = {
      ...this.props,
      ...props,
    };
  }

  update(args, context) {
    this.children.forEach(child => child.update && child.update(args, context));
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
    this.children.forEach(child => child.destroy && child.destroy());
  }
}
