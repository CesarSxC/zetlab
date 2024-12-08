use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct SesionCaja {
    pub id_sesion_caja: i32,
    pub id_usuario: String,
    pub monto_inicial: f32,
    pub monto_final: f32,
    pub fecha_apertura: NaiveDateTime,
    pub fecha_cierre: NaiveDateTime,
}

