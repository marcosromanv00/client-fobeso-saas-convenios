import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

// Obtener todas las sucursales
export async function GET() {
    try {
        const query = `
      SELECT * FROM SUCURSALES
    `;
        const sucursales = await executeQuery(query);
        return new Response(JSON.stringify(sucursales.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error al obtener las sucursales:", error);
        return new Response('Error al obtener las sucursales', { status: 500 });
    }
}

// Crear una nueva sucursal
export async function POST(req) {
    const { empresaId, direccion, telefono, correoContacto, ciudad } = await req.json();

    try {
        const query = `
            INSERT INTO SUCURSALES (SUCURSAL_ID, EMPRESA_ID, DIRECCION, TELEFONO, CORREO_CONTACTO, CIUDAD, ESTADO)
            VALUES (sucursal_seq.NEXTVAL, :empresaiD, :direccion, :telefono, :correoContacto, :ciudad, 1)
        `;
        const result = await executeQuery(query, [empresaId, direccion, telefono, correoContacto, ciudad]);
        console.log("Resultado de la consulta:", result);

        // Responder con un JSON en vez de un texto plano
        return new Response(
            JSON.stringify({ message: 'Sucursal creada exitosamente' }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error al crear la sucursal:", error);
        return new Response(
            JSON.stringify({ message: 'Error al crear la sucursal' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Actualizar una sucursal
export async function PUT(req) {
    const { empresaId, direccion, telefono, correoContacto, ciudad } = await req.json();

    const empresaIdNum = parseInt(empresaId);

    try {
        const query = `
            UPDATE SUCURSALES
            SET DIRECCION = :direccion, TELEFONO = :telefono, 
                CORREO_CONTACTO = :correoContacto, CIUDAD = :ciudad
            WHERE SUCURSAL_ID = :empresaIdNum
        `;

        // Asegúrate de que el array incluye exactamente 7 parámetros en el orden correcto
        const result = await executeQuery(query, [direccion, telefono, correoContacto, ciudad, empresaIdNum]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Sucursal no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Sucursal actualizada exitosamente' }, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar la sucursal:", error);
        return NextResponse.json({ message: 'Error al actualizar la sucursal', error: error.message }, { status: 500 });
    }
}

// Eliminar una sucursal
export async function DELETE(req) {
    const { empresaId } = await req.json();

    const empresaIdNum = parseInt(empresaId);

    try {
        const query = `
            DELETE FROM SUCURSALES
            WHERE EMPRESA_ID = :empresaIdNum
        `;
        const result = await executeQuery(query, [empresaIdNum]);

        if (result.affectedRows === 0) {
            return new Response('Sucursal no encontrada', { status: 404 });
        }

        return new Response('Sucursal eliminada exitosamente', { status: 200 });
    } catch (error) {
        console.error("Error al eliminar la sucursal:", error);
        return new Response('Error al eliminar la sucursal', { status: 500 });
    }
}
