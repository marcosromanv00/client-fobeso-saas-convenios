import { executeQuery } from "@/lib/db";

export const POST = async (req) => {
  try {
    const { cedula, password } = await req.json();

    if (!cedula || !password) {
      return new Response(JSON.stringify({ message: "Cédula y contraseña son requeridas" }), { status: 400 });
    }

    // Consulta para obtener la contraseña del usuario
    const query = `
      SELECT CONTRASENA_HASH FROM ADMINISTRADORES WHERE CEDULA = :cedula
    `;
    const result = await executeQuery(query, [cedula]);

    if (result.rows.length === 0) {
      // Usuario no encontrado
      return new Response(JSON.stringify({ message: "Credenciales incorrectas" }), { status: 401 });
    }

    // Desestructuración del resultado obteniendo la CONTRASENA_HASH desde result.rows
    const { CONTRASENA_HASH } = result.rows[0];

    // Comparar la contraseña enviada con la contraseña en la base de datos
    if (password !== CONTRASENA_HASH) {
      // Contraseña incorrecta
      return new Response(JSON.stringify({ message: "Credenciales incorrectas" }), { status: 401 });
    }

    // Respuesta en caso de éxito
    return new Response(JSON.stringify({ message: "Inicio de sesión exitoso" }), { status: 200 });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return new Response(JSON.stringify({ message: "Error en el servidor" }), { status: 500 });
  }
};
