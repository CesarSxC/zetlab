use sqlx::mysql::MySqlPool;
use sqlx::Error;

pub async fn conn_db() -> Result<MySqlPool, Error> {
    dotenv::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Conectar a la base de datos
    MySqlPool::connect(&database_url).await
}