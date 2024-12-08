use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]
pub struct EncVenta {
    pub id_venta: i32,
    pub codigo_barra: String,
    pub id_paciente: i32,
    pub id_sesion_caja: i32,
    pub observacion: String,
    pub total_importe: f32,
    pub id_metodo_pago: i32,
    pub id_medico: i32,
    pub fecha_registrado: NaiveDateTime,
}