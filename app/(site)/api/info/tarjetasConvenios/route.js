import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        c.CONVENIO_ID, 
        c.EMPRESA_ID, 
        e.NOMBRE AS NOMBRE_EMP, 
        e.LOGO_URL, 
        s.DIRECCION, 
        s.CIUDAD, 
        s.TELEFONO, 
        c.CATEGORIA_ID, 
        cat.NOMBRE AS NOMBRE_CAT, 
        c.TITULO, 
        c.CONDICIONES
      FROM CONVENIOS c
      JOIN EMPRESAS e ON c.EMPRESA_ID = e.EMPRESA_ID
      JOIN SUCURSALES s ON e.EMPRESA_ID = s.EMPRESA_ID
      JOIN CATEGORIAS cat ON c.CATEGORIA_ID = cat.CATEGORIA_ID
    `;
    
    // Ejecutar la consulta utilizando executeQuery
    const { rows } = await executeQuery(query); // Obtener solo las filas de la consulta
    
    // Verificar si se obtuvieron convenios
    if (!rows || rows.length === 0) {
      return new Response('No se encontraron convenios', { status: 404 });
    }

    // Formateamos los resultados en la estructura deseada
    const formattedConvenios = rows.map((convenio) => ({
      convenio_id: convenio.CONVENIO_ID,
      empresa_id: convenio.EMPRESA_ID,
      nombre_emp: convenio.NOMBRE_EMP,
      logo_url: convenio.LOGO_URL,
      direccion: convenio.DIRECCION,
      ciudad: convenio.CIUDAD,
      categoria_id: convenio.CATEGORIA_ID,
      nombre_cat: convenio.NOMBRE_CAT,
      titulo: convenio.TITULO,
      condiciones: convenio.CONDICIONES,
    }));

    // Retornar la respuesta formateada como JSON
    return new Response(JSON.stringify(formattedConvenios), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error al obtener los convenios:", error);
    return new Response('Error al obtener los convenios', { status: 500 });
  }
}
