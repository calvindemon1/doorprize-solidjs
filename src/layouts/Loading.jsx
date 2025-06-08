import { createSignal, onMount } from "solid-js";
import logo from "../assets/img/asuslogo.png";
import styles from "../App.module.css";

function Loading(background) {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  });

  return (
    <div
      class="min-h-screen w-full flex flex-col items-center justify-center text-center space-y-6 transition-all duration-500 ease-in-out mt-[-70px] md:pt-0"
      style={{ backgroundImage: background }}
    >
      <div class={`flex flex-col items-center shadow-none ${styles.fadeIn}`}>
        <img
          src={logo}
          alt="Logo"
          class="w-52 md:w-72 rounded-lg mb-5"
        />
        <p class="text-4xl md:text-5xl font-extrabold uppercase text-white tracking-wide animate-pulse font-mono">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default Loading;
