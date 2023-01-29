function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter((key) => key !== "children")
    .forEach((key) => (dom[key] = fiber.props[key]));

  return dom;
}

// Start working on the root.
function render(container, element) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
}

// React doesn’t use requestIdleCallback anymore.
// Now it uses the scheduler package.

// Concurrent Mode
// ===============
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
  // 1. add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  if (fiber.parent) {
    fiber.parent.dom.append(fiber.dom);
  }

  // 2. create new fibers
  const elements = fiber.props.children;
  let index = 0;
  let prevSibing = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    // whether it's the 1st child or not
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibing.sibling = newFiber;
    }

    prevSibing = newFiber;
    index++;
  }

  // 3. return next unit of work
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

export { render };
