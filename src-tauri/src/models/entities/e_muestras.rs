use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Muestra{
    pub id_muestra: i32,
    pub nombre_muestra: String
}