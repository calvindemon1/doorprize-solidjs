import { onMount, onCleanup } from "solid-js";

export default function ShortcutWrapper(props) {
  const handleKeyDown = (e) => {
    switch (e.key) {
      case "1":
        // window.history.pushState(null, "", "/");
        window.location.href = "/";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "2":
        // window.history.pushState(null, "", "/3-persons");
        window.location.href = "/3-persons";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "3":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/1";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "4":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/2";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "5":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/3";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "6":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/4";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "7":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/5";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "8":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/6";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "9":
        // window.history.pushState(null, "", "/stop-watch-first");
        window.location.href = "/stop-watch-first/7";
        window.dispatchEvent(new PopStateEvent("popstate"));
        break;
      case "0":
        // window.history.pushState(null, "", "/404");
        window.location.href = "/404";
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
