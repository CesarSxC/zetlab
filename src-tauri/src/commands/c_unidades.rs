use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Unidades {
    pub id_unidades: i64,
    pub abreviatura_unidad: String,
    pub nombre_unidad: String,

}

#[tauri::command]
pub async fn get_unidades() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_UNID()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let unidades: Vec<Unidades> = query_result
        .iter()
        .map(|row| Unidades {
            id_unidades: row.get(0), 
            abreviatura_unidad: row.get(1),
            nombre_unidad: row.get(2),
        })
        .collect();

    
    let encoded_message = serde_json::to_string(&unidades)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn insert_unidades(abreviatura_unidad: &str, nombre_unidad: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_GUARDAR_UNID(?,?)")
        .bind(abreviatura_unidad).bind(nombre_unidad)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn delete_unidades(id_unidades: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_UNID(?)")
        .bind(id_unidades)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_unidades(id_unidades: i64, abreviatura_unidad: &str, nombre_unidad: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_UNID(?,?,?)")
        .bind(id_unidades).bind(abreviatura_unidad).bind(nombre_unidad)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}