import { InvokeArgs, invoke } from "@tauri-apps/api/tauri";

export const apiCall = async <T>(
  name: string,
  parameters?: InvokeArgs
): Promise<T[]> => 
  new Promise((resolve, reject) =>
    invoke(name, parameters)
      .then((result) => {
        try {
          // Intentamos convertir el resultado JSON en un arreglo
          const parsedResult = JSON.parse(result as string);
          // Si no es un arreglo, lo envolvemos en uno
          resolve(Array.isArray(parsedResult) ? parsedResult : [parsedResult]);
        } catch (error) {
          reject(`Error al parsear los datos: ${error}`);
        }
      })
      .catch(reject)
  );

export const onlyUnique  = <T>(value: T, index: number, array: T[]) =>
  array.indexOf(value) === index;
