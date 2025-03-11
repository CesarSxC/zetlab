use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, NaiveDate};
use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct VentaDetallada {
    pub id_venta: i32,
    pub codigo_barra: String,
    pub fecha_registro: NaiveDateTime,
    pub total_importe: f64,
    pub estado_venta: String,
    pub nombre_metodop: String,
    pub nombre_desc: String,
    pub valor_desc: f64,
    pub nombre_pro: String,
    pub observacion: String,

    
    pub paciente_dni: String,
    pub paciente_nombres: String,
    pub paciente_apellidos: String,
    pub paciente_sexo: String,
    pub paciente_fecha_nacimiento: NaiveDate,
    
    pub medico_dni: String,
    pub medico_nombres: String,
    pub medico_apellidos: String,
    pub medico_cmp: String,
    pub comision: i32,
    pub nombre_esp: String,
    
    pub id_analisis: i32,
    pub categoria: String,
    pub analisis: String,
    pub resultado: Option<String>,
    pub muestra: String,
    pub unidad_medida: String,
    pub rango_referenciales: String,
    pub estado_analisis: String,
    pub precio_analisis: f64,
    pub total_analisis: f64,
}

#[tauri::command]
pub async fn obtener_detalles_venta(id_venta: i32) -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL sp_obtener_detalles_venta_single(?)")
        .bind(id_venta)
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let detalles: Vec<VentaDetallada> = query_result
        .iter()
        .map(|row| VentaDetallada {
            id_venta: row.get(0),
            codigo_barra: row.get(1),
            fecha_registro: row.get(2),
            total_importe: row.get(3),
            estado_venta: row.get(4),
            nombre_metodop: row.get(5),
            nombre_desc: row.get(6),
            valor_desc: row.get(7),
            nombre_pro: row.get(8),
            observacion: row.get(9),

            paciente_dni: row.get(10),
            paciente_nombres: row.get(11),
            paciente_apellidos: row.get(12),
            paciente_sexo: row.get(13),
            paciente_fecha_nacimiento: row.get(14),
            
            medico_dni: row.get(15),
            medico_nombres: row.get(16),
            medico_apellidos: row.get(17),
            medico_cmp: row.get(18),
            comision: row.get(19),
            nombre_esp: row.get(20),
            
            id_analisis: row.get(21),
            categoria: row.get(22),
            analisis: row.get(23),
            resultado: row.try_get::<Option<String>, _>(24).unwrap_or(None),
            muestra: row.get(25),
            unidad_medida: row.get(26),
            rango_referenciales: row.get(27),
            estado_analisis: row.get(28),
            precio_analisis: row.get(29),
            total_analisis: row.get(30),
        })
        .collect();

    let encoded_message = serde_json::to_string(&detalles)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}



#[tauri::command]
pub async fn editar_resultado(id_venta: i32, id_analisis: i32, resultado: String) -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_ACTUALIZAR_RESULTADOS(?, ?, ?)")
        .bind(id_venta)
        .bind(id_analisis)
        .bind(resultado)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;

    if query_result.rows_affected() > 0 {
        Ok("Resultado editado correctamente".to_string())
    } else {
        Err("No se pudo editar el resultado".to_string())
    }
}
