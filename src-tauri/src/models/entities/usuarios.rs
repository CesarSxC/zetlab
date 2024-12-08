use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct Usuario {
    pub id_usuario: i32,
    pub id_rol: i32,
    pub id_persona: i32,
    pub nombre_usuario: String,
    pub password_usuario: String,
}