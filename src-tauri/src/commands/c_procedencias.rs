use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Procedencia {
    pub id_procedencia: i64,
    pub nombre_pro: String,
}

#[tauri::command]
pub async fn get_procedencia() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_PROC()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let procedencias: Vec<Procedencia> = query_result
        .iter()
        .map(|row| Procedencia {
            id_procedencia: row.get(0), 
            nombre_pro: row.get(1),
        })
        .collect();
    
    let encoded_message = serde_json::to_string(&procedencias)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}
