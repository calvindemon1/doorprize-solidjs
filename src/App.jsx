import { createSignal, onCleanup, onMount } from "solid-js";
import { Router, Route } from "@solidjs/router";
import DoorprizeOnePerson from "./layouts/components/DoorprizeOnePerson";
import Loading from "./layouts/Loading";
import NotFoundPage from "./layouts/NotFoundPage";
import backgroundPhotobooth from "./assets/img/bgphotobooth.webp";
import DoorprizeThreeWinners from "./layouts/components/DoorprizeThreePerson";
import DoorprizeThreePersons from "./layouts/components/DoorprizeThreePerson";
import StopWatchFirst from "./layouts/components/StopWatchFirst";
import ShortcutWrapper from "./layouts/helper/ShortcutWrapper";
import MobileViewCMS from "./layouts/components/MobileViewCMS";
let bgmAudio;

function App() {
  const [loading, setLoading] = createSignal(true);
  const [hasPlayed, setHasPlayed] = createSignal(false);

  const handleUserInteraction = () => {
    // if (!hasPlayed()) {
    //   bgmAudio = new Audio(bgmPhotobooth);
    //   bgmAudio.loop = true;
    //   bgmAudio.volume = 0.5;
    //   bgmAudio
    //     .play()
    //     .then(() => {
    //       console.log("BGM started after user interaction");
    //       setHasPlayed(true);
    //     })
    //     .catch((err) => {
    //       console.warn("Play failed after interaction:", err);
    //     });
    //   document.removeEventListener("click", handleUserInteraction);
    // }
  };

  // Pasang event listener 1x aja
  document.addEventListener("click", handleUserInteraction);

  // Cleanup biar gak double listener kalau komponen re-mount
  onCleanup(() => {
    document.removeEventListener("click", handleUserInteraction);
  });

  setTimeout(() => {
    setLoading(false);
  }, 1500);

  return (
    <div
      class="flex flex-col items-center bg-[#66ff66] min-h-screen bg-cover bg-center"
      // style={{
      //   "background-image": `url(${backgroundPhotobooth})`,
      //   "background-size": "cover",
      //   "background-position": "center",
      // }}
    >
      {loading() ? (
        <Loading />
      ) : (
        <Router>
          <ShortcutWrapper>
            <Route path="/" component={DoorprizeOnePerson} />
            <Route path="/3-persons" component={DoorprizeThreePersons} />

            <Route path="/stop-watch-first/:id" component={StopWatchFirst} />

            <Route path="/mobile-cms" component={MobileViewCMS} />

            <Route path="/loading" component={Loading} />

            <Route path="/*" component={NotFoundPage} />
          </ShortcutWrapper>
        </Router>
      )}
    </div>
  );
}

export default App;
