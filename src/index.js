// =================================================================
// Library Code
// =================================================================

/**
 * Create a react element from a type, props, and children.
 * A react element is an object with a type and props.
 * One of the props is children, which is an array of other react elements.
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // some children may already be react elements
      // others may be primitives like text values
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

/**
 * Create a react element from a text value.
 * A text element is an object with a type of "TEXT_ELEMENT" and a props object.
 * The props object has a nodeValue property that is the text value.
 * It also has a children property that is an empty array.
 */
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

/**
 * Render a react element to the DOM.
 */
function render(element, container) {
  // create a dom element for the root of our element
  // tree
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // add each property from our element to our dom node
  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  // recursively render each child node into this
  // dom node
  element.props.children.forEach((child) => render(child, dom));

  container.appendChild(dom);
}

const Didact = { createElement, render };

// =================================================================
// App code
// =================================================================

/** @jsx Didact.createElement */
const element = (
  <div id="foo">
    <h1>Didact!</h1>
    <a href="https://example.com">example.com</a>
    <div>
      <ul>
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
        <li>item 4</li>
        <li>item 4</li>
        <li>item 4</li>
        <li>item 4</li>
      </ul>
    </div>
    <b />
  </div>
);

const container = document.getElementById("root");
Didact.render(element, container);
