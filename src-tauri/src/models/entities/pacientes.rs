use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct Paciente{
    pub id_paciente: i32,
    pub id_persona: i32,
}
