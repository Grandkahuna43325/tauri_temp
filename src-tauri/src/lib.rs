// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use serde::Serialize;
use tauri::{ipc::Channel, AppHandle, Manager, Runtime};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
enum Event<'a> {
    #[serde(rename_all = "camelCase")]
    Start { nwm: &'a str },
}


#[tauri::command]
fn print_to_screen<R: Runtime>(app: tauri::AppHandle, on_event: Channel<Event>) -> () {
   let home_dir = app.path().home_dir().unwrap();
   let home_dir = tauri::path::PathResolver::home_dir(app).unwrap();

    on_event
        .send(Event::Start {
            nwm: &format!("hello\n {:?}", home_dir),
        })
        .unwrap();
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, print_to_screen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
