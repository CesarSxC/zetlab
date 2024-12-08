/* use sqlx::{MySql, Pool, Row};
use crate::models::users::User;
use crate::controllers::db::conn_db;

#[derive(Debug, Serialize)]
struct LoginResponse {
    id_usuario: i32,
    id_rol: i32,
    nombre_rol: String,
}

pub async fn login_user(username: &str, password: &str) -> Result<Option<LoginResponse>, sqlx::Error> {
    
    let pool: Pool<MySql> = conn_db().await?;
    
    let row = sqlx::query(
        "CALL SP_LOGIN_USUARIO(?, ?)"
    )
    .bind(username)
    .bind(password)
    .fetch_optional(&pool)
    .await?;
    
    // Verificar si se encontró un usuario
    if let Some(row) = row {
        let user = User {
            id_usuario: row.try_get("id_usuario").unwrap_or(0),
            id_rol: row.try_get("id_rol").unwrap_or(0),
            descripcion_rol: row.try_get("descripcion_rol").unwrap_or_default(),
        };
        Ok(Some(user))
    } else {
        Ok(None)
    }
}
 */