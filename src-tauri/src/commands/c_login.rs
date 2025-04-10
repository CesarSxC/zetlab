use crate::db::connection::conn_db;
use serde::{Serialize, Deserialize};
use sqlx::{MySql, Pool, Row};

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    id_usuario: i32,
    id_rol: i32,
    nombre_rol: String,
}

#[tauri::command]
pub async fn login(username: String, password: String) -> Result<LoginResponse, String> {
    let db: Pool<MySql> = conn_db().await.map_err(|e| e.to_string())?;

    let result = sqlx::query("CALL SP_LOGIN_USUARIO(?, ?)")
        .bind(&username)
        .bind(&password)
        .fetch_one(&db) 
        .await
        .map(|row| LoginResponse {
            id_usuario: row.get(0),
            id_rol: row.get(1),
            nombre_rol: row.get(2),
        })
        .map_err(|e| e.to_string())?;

    Ok(result)
}
