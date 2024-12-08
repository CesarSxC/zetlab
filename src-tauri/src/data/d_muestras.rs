/* use anyhow::Result;
use sqlx::Row;
use crate::db::connection::conn_db;
use crate::models::entities::e_muestras::Muestra;

pub async fn mostrar_muestras() -> Result<Vec<Muestra>> {
    let pool = conn_db().await?;

    let rows = sqlx::query("CALL SP_MOSTRAR_MUESTRA()")
        .fetch_all(&pool)
        .await
        .map_err(anyhow::Error::from)?;

    let muestras = rows
        .into_iter()
        .map(|row| Muestra {
            id_muestra: row.try_get(0).unwrap_or_default(),
            nombre_muestra: row.try_get(1).unwrap_or_default(),
        })
        .collect();

    Ok(muestras)
} */