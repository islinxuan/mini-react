function commitRoot(wipRoot) {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  const domParent = fiber.parent.dom;
  domParent.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

export { commitRoot };
