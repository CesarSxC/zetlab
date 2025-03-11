use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};
use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct VentaRequest {
    pub id_paciente: i32,
    pub id_procedencia: i32,
    pub id_metodo_pago: i32,
    pub id_medico: i32,
    pub id_desc: Option<i32>,
    pub observacion: String,
    pub total_importe: f64,
    pub detalles: Vec<VentaDetalle>, 
}


#[derive(Debug, Serialize, Deserialize)]
pub struct VentaResponse {
    pub id_venta: i32,
    pub codigo_barra: String,
    pub mensaje: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VentaDetalle {
    pub id_analisis: i32,
    pub resultado: String,
    pub precio: f64,
    pub total: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VentaCargada {
    pub id_venta: i32,
    pub codigo_barra: String,
    pub id_paciente: i32,
    pub id_procedencia: i32,
    pub id_metodo_pago: i32,
    pub id_medico: i32,
    pub observacion: String,
    pub total_importe: f64,
    pub estado_venta: String,
    pub fecha_regis: String,
    pub detalles: Vec<VentaDetalle>,
}


#[derive(Debug, Serialize)]
pub struct VentaListar {
    pub id_venta: i32,
    pub codigo_barra: String,
    pub nombres_p: String,
    pub apellidos_p: String,
    pub num_doc: String,
    pub nombre_pro: String,
    pub observacion: Option<String>,
    pub total_importe: f64,
    pub estado_venta: String,
    pub fecha_regis: chrono::NaiveDateTime,
    pub total_analisis: i32,
    pub analisis_completos: f64,
    pub resumen_analisis: String,
}


#[tauri::command]
pub async fn registrar_venta(venta: VentaRequest) -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let detalles_json = serde_json::to_string(&venta.detalles)
        .map_err(|e| format!("Error serializando los detalles: {}", e))?;

    let query_result = sqlx::query(
        "CALL sp_registrar_venta(?, ?, ?, ?, ?, ?, ?,?)"
    )
    .bind(venta.id_paciente)
    .bind(venta.id_procedencia)
    .bind(venta.id_metodo_pago)
    .bind(venta.id_medico)
    .bind(venta.id_desc)
    .bind(venta.observacion)
    .bind(venta.total_importe)
    .bind(detalles_json) 
    .fetch_all(&db)
    .await
    .map_err(|e| format!("Error ejecutando el procedimiento almacenado: {}", e))?;

    let response = VentaResponse {
        id_venta: query_result[0].get(0),
        codigo_barra: query_result[0].get(1),
        mensaje: query_result[0].get(2),
    };
    let encoded_message = serde_json::to_string(&response)
        .map_err(|e| format!("Error serializando la respuesta: {}", e))?;

    db.close().await; 
    Ok(encoded_message)
}

#[tauri::command]
pub async fn guardar_resultados(id_venta: i32, detalles: String) -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_GUARDAR_RESULTADOS(?, ?)")
        .bind(id_venta)
        .bind(detalles)
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let mensaje: String = query_result[0].get(0);

    let encoded_message = serde_json::to_string(&mensaje)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn listar_ventas_por_sesion_caja(id_sesion_caja: i32) -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_LISTAR_VENTAS_POR_SESION_CAJA(?)")
        .bind(id_sesion_caja)
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let ventas: Vec<VentaListar> = query_result
            .iter()
            .map(|row| VentaListar {
            id_venta: row.get::<i32, _>(0),
            codigo_barra: row.get::<String, _>(1),
            nombres_p: row.try_get::<String, _>(2).unwrap_or_default(),
            apellidos_p: row.try_get::<String, _>(3).unwrap_or_default(),
            num_doc: row.try_get::<String, _>(4).unwrap_or_default(),
            nombre_pro: row.try_get::<String, _>(5).unwrap_or_default(),
            observacion: row.try_get::<Option<String>, _>(6).unwrap_or(None),
            total_importe: row.get::<f64, _>(7),
            estado_venta: row.get::<String, _>(8),
            fecha_regis: row.get::<chrono::NaiveDateTime, _>(9),
            total_analisis: row.get::<i32, _>(10),
            analisis_completos: row.get::<f64, _>(11),
            resumen_analisis: row.get::<String, _>(12),
        })
        .collect();

    let encoded_message = serde_json::to_string(&ventas)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}