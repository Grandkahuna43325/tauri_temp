import { invoke, Channel } from "@tauri-apps/api/core";

let greetInputEl: HTMLInputElement | null;
let greetMsgEl: HTMLElement | null;

async function greet() {
  if (greetMsgEl && greetInputEl) {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    greetMsgEl.textContent = await invoke("greet", {
      name: greetInputEl.value,
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

// import { listen } from "@tauri-apps/api/event";
//
//

type Event =
  | {
      event: "start";
      data: {
        nwm: String;
      };
    };

export async function setupTempPage() {

  const logParagraph = document.getElementById("log") as HTMLElement | null;

  const onEvent = new Channel<Event>();
  onEvent.onmessage = (message) => {
    if (logParagraph) {
      logParagraph.innerText = message.data.nwm.toString();
    }
  };

  const btn = document.getElementById("btn") as HTMLElement | null;
  btn?.addEventListener("click", async () => {
    await invoke('print_to_screen', {
      onEvent,
    });
  })

}

