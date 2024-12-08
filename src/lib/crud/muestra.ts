import { invoke } from '@tauri-apps/api/tauri';

export interface Muestra {
  id_muestra: number;
  descripcion_mu: string;
}

export async function obtenerMuestras(): Promise<Muestra[]> {
  try {
    return await invoke('get_muestras');
  } catch (error) {
    console.error('Error al obtener muestras:', error);
    throw error;
  }
}