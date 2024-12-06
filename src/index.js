// ======================================================================
// FUNCTIONS TO CREATE REACT ELEMENT NODES FROM JSX
//
// type ReactElement = ReactObjectElement | ReactTextElement
//
// type ReactObjectElement = {
//   type: HTML_NODE_TAG_NAME (div, b, p, a, etc...)
//   props: {
//      [propName extends string]: unknown
//      children: ReactElement[]
//   }
//
// type ReactTextElement = {
//   type: "TEXT_ELEMENT"
//   props: {
//     nodeValue: string
//     children: []
//   }
//
// ======================================================================

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      // nodeValue is
      nodeValue: text,
      children: [],
    },
  };
}

// ======================================================================
// RENDER FUNCTIONS
// Traverse our react element state and call the browser APIs to actually
// add the dom nodes
// ======================================================================

function render(element, container) {
  debugger;
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));

  container.append(dom);
}

const Didact = {
  createElement,
  render,
};

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <h1>Test page</h1>
    <p>
      This is my <em>test page</em>! Do you like it?
    </p>
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
