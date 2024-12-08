#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod models;
mod commands;
mod data;
mod db;

use commands::c_muestras::*;
use commands::c_especialidad::*;
use commands::c_cat_analisis::*;
use commands::c_unidades::*;
use commands::c_analisis::*;
use commands::c_pacientes::*;
use commands::c_medicos::*;
use commands::c_venta::*;
use commands::c_login::login;

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // GET
            get_muestras,
            get_especialidad,
            get_cat_analisis,
            get_unidades,
            get_analisis,
            get_paciente,
            get_medico,
            get_sexo,
            get_tidoc,
            // POST
            insert_muestras,
            insert_especialidad,
            insert_cat_analisis,
            insert_unidades,
            insert_analisis,
            insert_paciente,
            insert_medico,
            insert_venta,
            // DELETE
            delete_muestras,
            delete_especialidad,
            delete_cat_analisis,
            delete_unidades,
            delete_cat_analisis,
            delete_analisis,
            delete_paciente,
            delete_medico,
            // PUT
            update_muestras,
            update_especialidad,
            update_unidades,
            update_cat_analisis,
            update_analisis,
            update_paciente,
            update_medico,

            login
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
