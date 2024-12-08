use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, NaiveDate};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Medico{
    pub id_persona: i64,
    pub nombre_p: String,
    pub apellido_p: String,
    pub id_sexo: i32,
    pub id_tipo_doc: i32,
    pub num_doc: String,
    pub direccion: String,
    pub correo: String,
    pub fecha_nacimiento: NaiveDate,
    pub observacion: String,
    pub num_telf: String,
    pub id_especialidad: i64,
    pub codigo_cmp: String,
    pub comision: i32
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MedicoGet{
    pub id_medico: i64,
    pub codigo_cmp: String,
    pub nombre_esp: String,
    pub comision: i32,
    pub nombre_p: String,
    pub apellido_p: String,
    pub nombre_sx: String,
    pub nombre_tdoc: String,
    pub num_doc: String,
    pub num_telf: String,
    pub direccion: String,
    pub correo: String,
    pub fecha_nacimiento: NaiveDate,
    pub observacion: String,
    pub fecha_registrado: NaiveDateTime,
    pub fecha_actualizado: NaiveDateTime,
}

#[tauri::command]
pub async fn get_medico() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_MEDICO()")
        .fetch_all(&db)
        .await
        .map_err(|e|e.to_string())?;

    let medico: Vec<MedicoGet> = query_result 
        .iter()
        .map(|row| MedicoGet{
            id_medico: row.get(0),
            codigo_cmp: row.get(1),
            nombre_esp: row.get(2),
            comision: row.get(3),
            nombre_p: row.get(4),
            apellido_p: row.get(5),
            nombre_sx: row.get(6),
            nombre_tdoc: row.get(7),
            num_doc: row.get(8),
            num_telf: row.get(9),
            direccion: row.get(10),
            correo: row.get(11),
            fecha_nacimiento: row.get(12),
            observacion: row.get(13),
            fecha_registrado: row.get(14),
            fecha_actualizado: row.get(15)
        })
        .collect();

    let encoded_message = serde_json::to_string(&medico)
    .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message) 
}

#[tauri::command]
pub async fn insert_medico(
    nombre_p: &str,
    apellido_p: &str,
    id_sexo: i64,
    id_tipo_doc: i64,
    num_doc: &str,
    direccion: &str,
    correo: &str,
    fecha_nacimiento: NaiveDate,
    observacion: &str,
    num_telf: &str,
    id_especialidad: i64, 
    codigo_cmp: String,
    comision: i32,
) -> Result<(), String>{
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_GUARDAR_MEDICO(?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(nombre_p)
        .bind(apellido_p)
        .bind(id_sexo)
        .bind(id_tipo_doc)
        .bind(num_doc)
        .bind(direccion)
        .bind(correo)
        .bind(fecha_nacimiento)
        .bind(observacion)
        .bind(num_telf)
        .bind(id_especialidad)
        .bind(codigo_cmp)
        .bind(comision)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn delete_medico(id_medico: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_MEDICO(?)")
        .bind(id_medico)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_medico(
    id_persona: i64,
    nombre_p: &str,
    apellido_p: &str,
    id_sexo: i64,
    id_tipo_doc: i64,
    num_doc: &str,
    direccion: &str,
    correo: &str,
    fecha_nacimiento: NaiveDate,
    observacion: &str,
    num_telf: &str, 
    id_especialidad: i64,
    codigo_cmp: &str,
    comision: i32,
) -> Result<(), String>{
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_MEDICO(?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
        .bind(id_persona)
        .bind(nombre_p)
        .bind(apellido_p)
        .bind(id_sexo)
        .bind(id_tipo_doc)
        .bind(num_doc)
        .bind(direccion)
        .bind(correo)
        .bind(fecha_nacimiento)
        .bind(observacion)
        .bind(num_telf)
        .bind(id_especialidad)
        .bind(codigo_cmp)
        .bind(comision)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}
