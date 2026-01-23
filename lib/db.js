import oracledb from 'oracledb';

export async function executeQuery(query, params = []) { // params ahora tiene un valor por defecto vacío
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECTION_STRING,
    });

    // Si no hay parámetros, pasamos un array vacío
    const result = await connection.execute(query, params.length > 0 ? params : [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Formato de salida
      autoCommit: true,
    });

    // Depuración: Mostrar el resultado completo
    console.log("Resultado de la consulta:", result);

    // Devolver tanto rows como outBinds para que puedas acceder a ambos
    return {
      rows: result.rows,     // Filas de la consulta
      outBinds: result.outBinds, // Parámetros de salida
    };

  } catch (error) {
    console.error("Error en la ejecución de la consulta:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}
