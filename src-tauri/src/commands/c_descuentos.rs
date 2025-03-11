use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Descuentos {
    pub id_desc: i64,
    pub nombre_desc: String,
    pub valor_desc: f64,
}

#[tauri::command]
pub async fn get_descuentos() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_DESCUENTOS()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let descuentos: Vec<Descuentos> = query_result
        .iter()
        .map(|row| Descuentos {
            id_desc: row.get(0), 
            nombre_desc: row.get(1),
            valor_desc: row.get(2),
        })
        .collect();
    
    let encoded_message = serde_json::to_string(&descuentos)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}
