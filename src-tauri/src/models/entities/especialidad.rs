use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct EspecialidadMed{
    pub id_especialidad: i32,
    pub nombre_esp: String
}