import { executeQuery } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Consulta para obtener el convenio, empresa, y sucursal asociados al ID
    const query = `
      SELECT * FROM SUCURSALES WHERE SUCURSAL_ID = :id
    `;

    // Llamamos a executeQuery, que devuelve un objeto con 'rows' y 'outBinds'
    const result = await executeQuery(query, [id]);

    // Verificamos si hay resultados
    if (result.rows.length === 0) {
      return new Response("Sucursal no encontrada", { status: 404 });
    }

    // Devolvemos el primer resultado de las filas
    return new Response(JSON.stringify(result.rows[0]), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching sucursal details", error);
    return new Response("Error al obtener los detalles de la sucursal", { status: 500 });
  }
}
