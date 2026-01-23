import { executeQuery } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Consulta para obtener el convenio, empresa, y sucursal asociados al ID
    const query = `
    SELECT 
      o.TITULO, 
      o.FECHA_INICIO, 
      o.FECHA_FIN, 
      o.CONDICIONES, 
      COALESCE(e.NOMBRE, '') AS EMPRESA_NOMBRE, 
      COALESCE(e.LOGO_URL, '') AS LOGO_URL, 
      COALESCE(e.SITIO_WEB, '') AS SITIO_WEB, 
      COALESCE(e.FACEBOOK, '') AS FACEBOOK, 
      COALESCE(e.INSTAGRAM, '') AS INSTAGRAM, 
      COALESCE(e.TWITTER, '') AS TWITTER, 
      COALESCE(e.LINKEDIN, '') AS LINKEDIN, 
      COALESCE(e.ESTADO, 0) AS EMPRESA_ESTADO, 
      COALESCE(s.DIRECCION, '') AS DIRECCION, 
      COALESCE(s.TELEFONO, '') AS TELEFONO, 
      COALESCE(s.CORREO_CONTACTO, '') AS CORREO_CONTACTO, 
      COALESCE(s.CIUDAD, '') AS CIUDAD, 
      COALESCE(s.ESTADO, 0) AS SUCURSAL_ESTADO
    FROM OFERTAS o
    JOIN EMPRESAS e ON o.CONVENIO_ID = e.EMPRESA_ID
    LEFT JOIN SUCURSALES s ON e.EMPRESA_ID = s.EMPRESA_ID
    WHERE o.OFERTA_ID = :id
  `;

    // Llamamos a executeQuery, que devuelve un objeto con 'rows' y 'outBinds'
    const result = await executeQuery(query, [id]);

    // Verificamos si hay resultados
    if (result.rows.length === 0) {
      return new Response("Oferta no encontrada", { status: 404 });
    }

    // Devolvemos el primer resultado de las filas
    return new Response(JSON.stringify(result.rows[0]), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching oferta details", error);
    return new Response("Error al obtener los detalles de la oferta", { status: 500 });
  }
}
