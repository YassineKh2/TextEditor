// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Menu,Submenu,MenuItem,CustomMenuItem};
use std::fs;

fn create_app_menu() -> Menu {
  return Menu::new()
  .add_submenu(Submenu::new(
    "File"
    ,Menu::new()
                .add_item(CustomMenuItem::new("open".to_string(),"Open"))
                .add_item(CustomMenuItem::new("new".to_string(),"New"))
                .add_item(CustomMenuItem::new("save".to_string(),"Save"))
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Quit)
    ))
    .add_submenu(Submenu::new(
        "Edit",
        Menu::new().add_item(CustomMenuItem::new("font".to_string(),"Font"))

    ));
}

fn main() {
  tauri::Builder::default()
    .menu(create_app_menu())
    .on_menu_event(| event | match event.menu_item_id() {
        "open" => {
          event.window().emit("open_file", "").unwrap();
        }
        "new" => {
          event.window().emit("new_file", "").unwrap();
        }
        "save" => {
          event.window().emit("save_file", "").unwrap();
        }
        "font" => {
          event.window().emit("change-font", "").unwrap();
        }
        _ => {}
      })
    .invoke_handler(tauri::generate_handler![save_file])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}


#[tauri::command]
fn save_file(path: String,content:String) {
    fs::write(path, content).unwrap();
}