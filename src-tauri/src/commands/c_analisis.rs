use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};
use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct Analisis {
    pub id_analisis: i64,
    pub id_categoria_ana: i64,
    pub nombre_analisis: String,
    pub precio: f32,
    pub id_muestra: i64,
    pub id_unidades: i64,
    pub rango_referencial: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalisisGet {
    pub id_analisis: i64,
    pub nombre_categoria_ana: String,
    pub nombre_analisis: String,
    pub precio: f32,
    pub nombre_muestra: String,
    pub nombre_unidad: String,
    pub rango_referencial: String,
    pub id_categoria_ana: i64,
    pub id_muestra: i64,
    pub id_unidades: i64,
}

#[tauri::command]
pub async fn get_analisis() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.map_err(|e| e.to_string())?;

    let query_result = sqlx::query("CALL SP_MOSTRAR_ANALISIS()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let analisis: Vec<AnalisisGet> = query_result
        .iter()
        .map(|row| 
            AnalisisGet {
                id_analisis: row.get(0),
                nombre_categoria_ana: row.get(1),
                nombre_analisis: row.get(2),
                precio:row.get(3),
                nombre_muestra: row.get(4),
                nombre_unidad: row.get(5),
                rango_referencial: row.get(6),
                id_categoria_ana: row.get(7),
                id_muestra: row.get(8),
                id_unidades: row.get(9),
        })
        .collect();
    let encoded_message = serde_json::to_string(&analisis)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn insert_analisis(
    id_categoria_ana: i64,
    nombre_analisis: &str,
    precio: f64,
    id_muestra: i64,
    id_unidades: i64,
    rango_referencial: &str,
) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    sqlx::query("CALL SP_GUARDAR_ANALISIS (?,?,?,?,?,?)")
        .bind(id_categoria_ana)
        .bind(nombre_analisis)
        .bind(precio) 
        .bind(id_muestra)
        .bind(id_unidades)
        .bind(rango_referencial)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn delete_analisis(id_analisis: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_ANALISIS(?)")
        .bind(id_analisis)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_analisis(
    id_analisis: i64,
    id_categoria_ana: i64,
    nombre_analisis: &str,
    precio: f64,
    id_muestra: i64,
    id_unidades: i64,
    rango_referencial: &str,
) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_ANALISIS (?,?,?,?,?,?,?)")
        .bind(id_analisis)
        .bind(id_categoria_ana)
        .bind(nombre_analisis)
        .bind(precio)
        .bind(id_muestra)
        .bind(id_unidades)
        .bind(rango_referencial)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(())
}
