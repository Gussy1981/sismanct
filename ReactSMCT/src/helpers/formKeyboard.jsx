// Evita que Enter dispare el submit del formulario: en su lugar, mueve el
// foco al siguiente campo (como Tab), para respetar el hábito de navegar
// formularios con Enter en vez de con el mouse.
export const handleEnterAsTab = (event) => {
  if (event.key !== "Enter") return;

  const target = event.target;
  if (target.tagName === "BUTTON" || target.type === "submit" || target.type === "button") {
    return;
  }

  event.preventDefault();

  const form = event.currentTarget;
  const campos = Array.from(form.querySelectorAll("input, select, textarea")).filter(
    (el) => !el.disabled && !el.readOnly && el.type !== "hidden" && el.tabIndex !== -1
  );

  const indiceActual = campos.indexOf(target);
  if (indiceActual > -1 && indiceActual < campos.length - 1) {
    campos[indiceActual + 1].focus();
  }
};
