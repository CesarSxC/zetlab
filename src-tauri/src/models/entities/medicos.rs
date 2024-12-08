use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct Medicos{
    pub id_medico: i32,
    pub id_persona: i32,
    pub id_especialidad: i32,
}
