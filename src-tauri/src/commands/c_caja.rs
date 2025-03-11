use sqlx::{MySql, Pool, Row};
use serde::{Deserialize, Serialize};
use chrono::NaiveDateTime;

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct SesionCajaResult {
    pub id_sesion_caja: i64,
    pub mensaje: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CierreSesionResult {
    pub id_sesion_caja: i64,
    pub monto_inicial: f64,
    pub total_ventas: f64,
    pub monto_final: f64,
    pub diferencia: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DetallesSesionCaja {
    pub id_sesion_caja: i64,
    pub id_usuario: i64,
    pub monto_inicial: f64,
    pub fecha_apertura: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SesionCaja {
    pub id_sesion_caja: i64,
    pub nombre_usuario: String,
    pub monto_inicial: f64,
    pub monto_final: Option<f64>,
    pub fecha_apertura: NaiveDateTime,
    pub fecha_cierre: Option<NaiveDateTime>,
    pub estado: String,
}

#[tauri::command]
pub async fn aperturar_caja(id_usuario: i32, monto_inicial: f64) -> Result<SesionCajaResult, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    
    let rows = sqlx::query("CALL sp_abrir_sesion_caja(?, ?)")
        .bind(id_usuario)
        .bind(monto_inicial)
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;

    if let Some(row) = rows.get(0) {
        let id_sesion_caja: i64 = row.get::<i64, _>(0);
        let mensaje: String = row.get::<String, _>(1);

        Ok(SesionCajaResult {
            id_sesion_caja,
            mensaje,
        })
    } else {
        Err("No se encontraron datos de la sesión de caja".to_string())
    }
}

#[tauri::command]
pub async fn cerrar_caja(id_sesion_caja: i32, monto_final: f64) -> Result<CierreSesionResult, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let rows = sqlx::query("CALL sp_cerrar_sesion_caja(?, ?)")
        .bind(id_sesion_caja)
        .bind(monto_final)
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;

    if let Some(row) = rows.get(0) {
        let id_sesion_caja: i64 = row.get::<i64, _>(0);
        let monto_inicial: f64 = row.get::<f64, _>(1);
        let total_ventas: f64 = row.get::<f64, _>(2);
        let monto_final: f64 = row.get::<f64, _>(3);
        let diferencia: f64 = row.get::<f64, _>(4);

        Ok(CierreSesionResult {
            id_sesion_caja,
            monto_inicial,
            total_ventas,
            monto_final,
            diferencia,
        })
    } else {
        Err("No se encontraron datos del cierre de caja".to_string())
    }
}

#[tauri::command]
pub async fn obtener_detalles_sesion_caja() -> Result<DetallesSesionCaja, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let rows = sqlx::query("CALL sp_obtener_detalles_sesion_caja()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;

    if let Some(row) = rows.get(0) {
        let id_sesion_caja: i64 = row.get::<i64, _>(0);
        let id_usuario: i64 = row.get::<i64, _>(1);
        let monto_inicial: f64 = row.get::<f64, _>(2);
        let fecha_apertura: NaiveDateTime = row.get::<NaiveDateTime, _>(3);

        Ok(DetallesSesionCaja {
            id_sesion_caja,
            id_usuario,
            monto_inicial,
            fecha_apertura,
        })
    } else {
        Err("No se encontraron detalles de la sesión de caja abierta".to_string())
    }
}

#[tauri::command]
pub async fn mostrar_cajas() -> Result<Vec<SesionCaja>, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let rows = sqlx::query("CALL SP_MOSTRAR_SESIONES_CAJA()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;

    let sesiones_caja: Vec<SesionCaja> = rows
        .iter()
        .map(|row| SesionCaja {
            id_sesion_caja: row.get(0),
            nombre_usuario: row.get(1),
            monto_inicial: row.get(2),
            monto_final: row.get(3),
            fecha_apertura: row.get(4),
            fecha_cierre: row.get(5),
            estado: row.get(6),
        })
        .collect();
    Ok(sesiones_caja)
}
