use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct Analisis{
    pub id_analisis: i32,
    pub id_categoria_ana: i32,
    pub nombre_analisis: String,
    pub precio: f32,
    pub id_muestra: i32,
    pub id_unidades: i32,
    pub rango_referencial: bool
}