use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct Unidades{
    pub id_unidades: i32,
    pub nombre_unidad: String
}