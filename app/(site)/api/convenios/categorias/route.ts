import { executeQuery } from "@/lib/db"; // Asume que tienes una función de ejecución de consultas como la que mencionaste previamente

// Función para obtener todas las categorías
const getCategorias = async () => {
  try {
    // Consulta para obtener todas las categorías
    const categoriasQuery = "SELECT CATEGORIA_ID, NOMBRE FROM CATEGORIAS";
    const categorias = await executeQuery(categoriasQuery);

    // Devolver las categorías como respuesta en formato JSON
    return new Response(JSON.stringify(categorias), { status: 200 });
  } catch (error) {
    console.error("Error al obtener las categorías: ", error);
    return new Response(JSON.stringify({ message: "Error al obtener las categorías" }), { status: 500 });
  }
};

// Controlador para la API de categorías
export async function GET() {
  try {
    return await getCategorias();
  } catch (error) {
    // Si el método no es GET, respondemos con un error 405 (Método no permitido)
    return new Response(JSON.stringify({ message: "Método no permitido" }), { status: 405 });
  }
}
