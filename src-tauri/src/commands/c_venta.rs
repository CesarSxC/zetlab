use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Venta {
    pub id_venta: Option<i64>,
    pub total_final: Option<f64>,
}

#[tauri::command]
pub async fn insert_venta(
    codigo_barra: &str,
    id_paciente: i64,
    id_sesion_caja: i64,
    observacion: &str,
    total_importe: f64,
    descuento: f64,
    id_metodo_pago: i64,
    id_medico: i64,
    estado_venta: &str
) -> Result<Venta, String> {
    let db: Pool<MySql> = conn_db().await.map_err(|_| "Error al conectar con la base de datos")?;
    
    let resultado = sqlx::query(
        "CALL SP_INSERTAR_VENTA(?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(codigo_barra)
    .bind(id_paciente)
    .bind(id_sesion_caja)
    .bind(observacion)
    .bind(total_importe)
    .bind(descuento)
    .bind(id_metodo_pago)
    .bind(id_medico)
    .bind(estado_venta)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;

    let venta = Venta {
        id_venta: resultado.get("id_venta"),
        total_final: resultado.get("total_final"),
    };

    db.close().await;
    
    Ok(venta)
}