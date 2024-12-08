use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Especialidad {
    pub id_especialidad: i64,
    pub nombre_esp: String,
}

#[tauri::command]
pub async fn get_especialidad() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_ESP()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let especialidades: Vec<Especialidad> = query_result
        .iter()
        .map(|row| Especialidad {
            id_especialidad: row.get(0), 
            nombre_esp: row.get(1),
        })
        .collect();
    
    let encoded_message = serde_json::to_string(&especialidades)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn insert_especialidad(nombre_esp: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_GUARDAR_ESP(?)")
        .bind(nombre_esp)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn delete_especialidad(id_especialidad: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_ESP(?)")
        .bind(id_especialidad)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_especialidad(id_especialidad: i64, nombre_esp: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_ESP(?,?)")
        .bind(id_especialidad).bind(nombre_esp)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}