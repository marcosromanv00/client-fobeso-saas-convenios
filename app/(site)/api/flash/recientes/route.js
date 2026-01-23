import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Consulta para obtener todos los convenios junto con los datos de la empresa y sucursal.
    const query = `
      SELECT 
        o.OFERTA_ID, 
        o.CONVENIO_ID, 
        e.NOMBRE AS NOMBRE_EMP, 
        e.LOGO_URL, 
        s.DIRECCION, 
        s.CIUDAD, 
        s.TELEFONO, 
        o.CATEGORIA_ID, 
        cat.NOMBRE AS NOMBRE_CAT, 
        o.TITULO, 
        o.CONDICIONES
      FROM OFERTAS o
      JOIN EMPRESAS e ON o.CONVENIO_ID = e.EMPRESA_ID
      JOIN SUCURSALES s ON e.EMPRESA_ID = s.EMPRESA_ID
      JOIN CATEGORIAS cat ON o.CATEGORIA_ID = cat.CATEGORIA_ID
      ORDER BY 
        o.FECHA_INICIO DESC
      FETCH FIRST 6 ROWS ONLY
    `;

    const result = await executeQuery(query);

    // Asegúrate de acceder a `rows` del resultado
    const ofertas = result.rows || [];  // Default to empty array if no rows

    // Formateamos los resultados en la estructura de la tarjeta de oferta
    const formattedOfertas = ofertas.map((oferta) => ({
      oferta_id: oferta.CONVENIO_ID,
      empresa_id: oferta.EMPRESA_ID,
      nombre_emp: oferta.NOMBRE_EMP,
      logo_url: oferta.LOGO_URL,
      direccion: oferta.DIRECCION,
      ciudad: oferta.CIUDAD,
      categoria_id: oferta.CATEGORIA_ID,
      nombre_cat: oferta.NOMBRE_CAT,
      titulo: oferta.TITULO,
      condiciones: oferta.CONDICIONES,
    }));

    return new Response(JSON.stringify(formattedOfertas), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error al obtener las ofertas:", error);
    return new Response('Error al obtener las ofertas', { status: 500 });
  }
}
