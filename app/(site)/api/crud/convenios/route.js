import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

// Obtener todos los convenios
export async function GET() {
    try {
        const query = `
            SELECT * FROM CONVENIOS
        `;
        const convenios = await executeQuery(query);
        return new Response(JSON.stringify(convenios.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error al obtener los convenios:", error);
        return new Response('Error al obtener los convenios', { status: 500 });
    }
}

// Crear un nuevo convenio
export async function POST(req) {
    const { empresaId, categoriaId, titulo, fechaInicio, fechaFin, condiciones } = await req.json();

    // Asegurar que las fechas estén en el formato 'YYYY-MM-DD'
    const fechaInicioISO = new Date(fechaInicio).toISOString().split('T')[0];
    const fechaFinISO = new Date(fechaFin).toISOString().split('T')[0];

    try {
        const query = `
            INSERT INTO CONVENIOS (CONVENIO_ID, EMPRESA_ID, CATEGORIA_ID, TITULO, FECHA_INICIO, FECHA_FIN, CONDICIONES, ESTADO)
            VALUES (convenio_seq.NEXTVAL, :empresaiD, :categoriaId, :titulo, TO_DATE(:fechaInicio, 'YYYY-MM-DD'), TO_DATE(:fechaFin, 'YYYY-MM-DD'), :condiciones, 1)
        `;
        await executeQuery(query, [empresaId, categoriaId, titulo, fechaInicioISO, fechaFinISO, condiciones]);

        // Devolvemos una respuesta correctamente formateada
        return new Response(
            JSON.stringify({ message: 'Convenio creado exitosamente' }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error al crear el convenio:", error);
        return new Response('Error al crear el convenio', { status: 500 });
    }
}

// Actualizar un convenio
export async function PUT(req) {
    const { empresaId, categoriaId, titulo, fechaInicio, fechaFin, condiciones } = await req.json();

    // Asegurarse de que `empresaId` sea numérico
    const empresaIdNum = parseInt(empresaId);
    const categoriaIdNum = parseInt(categoriaId);

    const formattedFechaInicio = fechaInicio.split('T')[0]; // Extraer la parte 'YYYY-MM-DD'
    const formattedFechaFin = fechaFin.split('T')[0];

    try {
        const query = `
            UPDATE CONVENIOS
            SET CATEGORIA_ID = :categoriaIdNum, TITULO = :titulo, 
                FECHA_INICIO = TO_DATE(:formattedFechaInicio, 'YYYY-MM-DD'), FECHA_FIN = TO_DATE(:formattedFechaFin, 'YYYY-MM-DD'), 
                CONDICIONES = :condiciones
            WHERE CONVENIO_ID = :empresaIdNum
        `;

        // Asegúrate de incluir todos los valores posicionales en este array
        const result = await executeQuery(query, [categoriaIdNum, titulo, formattedFechaInicio, formattedFechaFin, condiciones, empresaIdNum]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Convenio no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Convenio actualizado exitosamente' }, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar el convenio:", error);
        return NextResponse.json({ message: 'Error al actualizar el convenio', error: error.message }, { status: 500 });
    }
}

// Eliminar un convenio
export async function DELETE(req) {
    const { empresaId } = await req.json();

    const empresaIdNum = parseInt(empresaId);

    try {
        const query = `
            DELETE FROM CONVENIOS
            WHERE EMPRESA_ID = :empresaIdNum
        `;
        const result = await executeQuery(query, [empresaIdNum]);

        if (result.affectedRows === 0) {
            return new Response('Convenio no encontrado', { status: 404 });
        }

        return new Response('Convenio eliminado exitosamente', { status: 200 });
    } catch (error) {
        console.error("Error al eliminar el convenio:", error);
        return new Response('Error al eliminar el convenio', { status: 500 });
    }
}
