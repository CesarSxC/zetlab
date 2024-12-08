use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, NaiveDate};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Paciente{
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
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PacienteGet{
    pub id_paciente: i64,
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
pub async fn get_paciente() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_PACIENTE()")
        .fetch_all(&db)
        .await
        .map_err(|e|e.to_string())?;

    let paciente: Vec<PacienteGet> = query_result
        .iter()
        .map(|row| PacienteGet{
            id_paciente: row.get(0),
            nombre_p: row.get(1),
            apellido_p: row.get(2),
            nombre_sx: row.get(3),
            nombre_tdoc: row.get(4),
            num_doc: row.get(5),
            num_telf: row.get(6),
            direccion: row.get(7),
            correo: row.get(8),
            fecha_nacimiento: row.get(9),
            observacion: row.get(10),
            fecha_registrado: row.get(11),
            fecha_actualizado: row.get(12)
        })
        .collect();

    let encoded_message = serde_json::to_string(&paciente)
    .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message) 
}

#[tauri::command]
pub async fn insert_paciente(
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
) -> Result<(), String>{
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_GUARDAR_PACIENTE(?,?,?,?,?,?,?,?,?,?)")
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
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await; 
    Ok(())
}

#[tauri::command]
pub async fn delete_paciente(id_paciente: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_PACIENTE(?)")
        .bind(id_paciente)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_paciente(
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
) -> Result<(), String>{
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_PACIENTE(?,?,?,?,?,?,?,?,?,?,?)")
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
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Sexo {
    pub id_sexo: i64,
    pub nombre_sx: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TipoDoc {
    pub id_tipo_doc: i64,
    pub nombre_tdoc: String,
}

#[tauri::command]
pub async fn get_sexo() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_SX()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let sx: Vec<Sexo> = query_result
        .iter()
        .map(|row| Sexo {
            id_sexo: row.get(0), 
            nombre_sx: row.get(1),
        })
        .collect();

    
    let encoded_message = serde_json::to_string(&sx)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn get_tidoc() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_TIDOC()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let tipodoc: Vec<TipoDoc> = query_result
        .iter()
        .map(|row| TipoDoc {
            id_tipo_doc: row.get(0), 
            nombre_tdoc: row.get(1),
        })
        .collect();

    
    let encoded_message = serde_json::to_string(&tipodoc)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}