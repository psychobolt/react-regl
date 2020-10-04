// @flow
export type Context = {
  regl: any,
  view: HTMLCanvasElement,
};

interface Node {
  props: any,
  children: Array<Node>,
  update(args?: {}, context?: {}): void,
  destroy(): void
}

export default class Collection<P> implements Node {
  children: Array<Node> = [];

  constructor(props: P, context?: Context) {
    this.context = context;
    this.props = props;
  }

  context: ?Context;

  props: P;

  updateProps(props: P) {
    this.props = {
      ...this.props,
      ...props,
    };
  }

  update(args?: {}, context?: {}) {
    this.children.forEach(child => child.update && child.update(args, context));
  }

  addChild(child: Node) {
    this.children.push(child);
  }

  insertBefore(child: Node, beforeChild: Node) {
    this.children.splice(this.children.indexOf(beforeChild), 0, child);
  }

  removeChild(child: Node) {
    child.destroy();
    this.children.splice(this.children.indexOf(child), 1);
  }

  destroy() {
    this.children.forEach(child => child.destroy && child.destroy());
  }
}
