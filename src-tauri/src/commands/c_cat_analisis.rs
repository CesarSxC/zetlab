use sqlx::{MySql, Pool, Row};
use serde::{Serialize, Deserialize};

use crate::db::connection::conn_db;

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoriaAnalisis {
    pub id_categoria_ana: i64,
    pub nombre_categoria_ana: String,
}

#[tauri::command]
pub async fn get_cat_analisis() -> Result<String, String> {
    let db: Pool<MySql> = conn_db().await.unwrap();

    let query_result = sqlx::query("CALL SP_MOSTRAR_CAT_AN()")
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;

    let cat_an: Vec<CategoriaAnalisis> = query_result
        .iter()
        .map(|row| CategoriaAnalisis {
            id_categoria_ana: row.get(0), 
            nombre_categoria_ana: row.get(1),
        })
        .collect();
    
    let encoded_message = serde_json::to_string(&cat_an)
        .map_err(|e| e.to_string())?;

    db.close().await;
    Ok(encoded_message)
}

#[tauri::command]
pub async fn insert_cat_analisis(nombre_categoria_ana: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_GUARDAR_CAT_AN(?)")
        .bind(nombre_categoria_ana)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn delete_cat_analisis(id_categoria_ana: i64) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ELIMINAR_CAT_AN(?)")
        .bind(id_categoria_ana)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}

#[tauri::command]
pub async fn update_cat_analisis(id_categoria_ana: i64, nombre_categoria_ana: &str) -> Result<(), String> {
    let db: Pool<MySql> = conn_db().await.unwrap();
    sqlx::query("CALL SP_ACTUALIZAR_CAT_AN(?,?)")
        .bind(id_categoria_ana).bind(nombre_categoria_ana)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    db.close().await;
    Ok(())
}