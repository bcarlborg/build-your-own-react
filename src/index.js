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
 * Create a dom node for a fiber.
 */
function createDom(fiber) {
  // Create a dom node for this fiber
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  // add each property from our element to our dom node
  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

// =================================================================
// Helpers for executing work loop on idle callback
// =================================================================

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  //
  // Create a dom node for this fiber and add it to the dom
  //
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  //
  // Create fibers for this fiber's children
  // ensure each fiber references this fiber as its parent and the
  // next fiber as its sibling
  //
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  //
  // Return the next unit of work
  // TODO(beau): Go over this algorithm and internalize how we traverse the fiber tree
  //
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// =================================================================
// Exporting our library
// =================================================================

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
