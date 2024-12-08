use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Muestra {
    pub id_muestra: i64,
    pub nombre_muestra: String,
}

#[tauri::command]
pub async fn get_muestras() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_MUESTRA()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let muestras: Vec<Muestra> = query_result
        .iter()
        .map(|row| Muestra {
            id_muestra: row.get(0), 
            nombre_muestra: row.get(1),
        })
        .collect();

    
    let encoded_message = serde_json::to_string(&muestras)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn insert_muestras(nombre_muestra: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_GUARDAR_MUESTRA(?)")
        .bind(nombre_muestra)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn delete_muestras(id_muestra: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_MUESTRA(?)")
        .bind(id_muestra)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_muestras(id_muestra: i64, nombre_muestra: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_MUESTRA(?,?)")
        .bind(id_muestra).bind(nombre_muestra)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}