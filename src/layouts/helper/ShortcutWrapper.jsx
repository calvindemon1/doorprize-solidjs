import { onMount, onCleanup } from "solid-js";

export default function ShortcutWrapper(props) {
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "1":
        window.history.pushState(null, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "2":
        window.history.pushState(null, "", "/3-persons");
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "3":
        window.history.pushState(null, "", "/stop-watch-first");
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "4":
        window.history.pushState(null, "", "/404");
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      default:
        break;
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  return props.children;
}
