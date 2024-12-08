use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct CategoriaAnalisis{
    pub id_categoria_ana: i32,
    pub nombre_categoria_ana: String
}
