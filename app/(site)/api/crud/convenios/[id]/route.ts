import { executeQuery } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Consulta para obtener el convenio, empresa, y sucursal asociados al ID
    const query = `
      SELECT * FROM CONVENIOS WHERE CONVENIO_ID = :id
    `;

    // Llamamos a executeQuery, que devuelve un objeto con 'rows' y 'outBinds'
    const result = await executeQuery(query, [id]);

    // Verificamos si hay resultados
    if (result.rows.length === 0) {
      return new Response("Convenio no encontrado", { status: 404 });
    }

    // Devolvemos el primer resultado de las filas
    return new Response(JSON.stringify(result.rows[0]), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching convenio details", error);
    return new Response("Error al obtener los detalles del convenio", { status: 500 });
  }
}
