use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct MetodoPago {
    pub id_metodo_pago: i64,
    pub nombre_metodop: String,
}

#[tauri::command]
pub async fn get_metodo_pago() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_METPAG()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let metodospagos: Vec<MetodoPago> = query_result
        .iter()
        .map(|row| MetodoPago {
            id_metodo_pago: row.get(0), 
            nombre_metodop: row.get(1),
        })
        .collect();
    
    let encoded_message = serde_json::to_string(&metodospagos)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}
