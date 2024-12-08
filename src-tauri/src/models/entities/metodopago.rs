use serde::{Serialize, Deserialize};
#[derive(Debug, Serialize, Deserialize)]

pub struct MetodoPago{
    pub id_metodo_pago: i32,
    pub nombre_metodop: String,
}