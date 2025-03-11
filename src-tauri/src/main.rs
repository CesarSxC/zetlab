#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
use commands::c_procedencias::get_procedencia;
use commands::c_metodos_pago::get_metodo_pago;
use commands::c_descuentos::*;
use commands::c_caja::*;
use commands::c_ventacomp::*;

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
            get_procedencia,
            get_metodo_pago,
            get_descuentos,
            // POST
            insert_muestras,
            insert_especialidad,
            insert_cat_analisis,
            insert_unidades,
            insert_analisis,
            insert_paciente,
            insert_medico,
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

            login,
            aperturar_caja,
            cerrar_caja,
            obtener_detalles_sesion_caja,
            mostrar_cajas,
            registrar_venta,
            guardar_resultados,
            listar_ventas_por_sesion_caja,
            obtener_detalles_venta,
            editar_resultado
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
