function render(container, element) {
  const dom = element.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type);

  Object.keys(element.props)
    .filter((key) => key !== "children")
    .forEach((key) => (dom[key] = element.props[key]));

  element.props.children.forEach((child) => {
    render(dom, child);
  });

  container.appendChild(dom);
}

export { render };
