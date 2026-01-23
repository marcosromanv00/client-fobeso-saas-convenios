import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

// Obtener todos los ofertas
export async function GET() {
    try {
        const query = `
            SELECT * FROM OFERTAS
        `;
        const ofertas = await executeQuery(query);
        return new Response(JSON.stringify(ofertas.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error al obtener las ofertas:", error);
        return new Response('Error al obtener las ofertas', { status: 500 });
    }
}

// Crear un nuevo convenio
export async function POST(req) {
    const { convenioId, categoriaId, titulo, fechaInicio, fechaFin, condiciones } = await req.json();

    const convenioIdNum = parseInt(convenioId);

    // Asegurar que las fechas estén en el formato 'YYYY-MM-DD'
    const fechaInicioISO = new Date(fechaInicio).toISOString().split('T')[0];
    const fechaFinISO = new Date(fechaFin).toISOString().split('T')[0];

    try {
        const query = `
            INSERT INTO OFERTAS (OFERTA_ID, CONVENIO_ID, CATEGORIA_ID, TITULO, FECHA_INICIO, FECHA_FIN, CONDICIONES, ESTADO)
            VALUES (convenio_seq.NEXTVAL, :convenioIdNum, :categoriaId, :titulo, TO_DATE(:fechaInicio, 'YYYY-MM-DD'), TO_DATE(:fechaFin, 'YYYY-MM-DD'), :condiciones, 1)
        `;
        await executeQuery(query, [convenioIdNum, categoriaId, titulo, fechaInicioISO, fechaFinISO, condiciones]);

        // Devolvemos una respuesta correctamente formateada
        return new Response(
            JSON.stringify({ message: 'Oferta creada exitosamente' }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("Error al crear la oferta:", error);
        return new Response('Error al crear la oferta', { status: 500 });
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
            UPDATE OFERTAS
            SET CATEGORIA_ID = :categoriaIdNum, TITULO = :titulo, 
                FECHA_INICIO = TO_DATE(:formattedFechaInicio, 'YYYY-MM-DD'), FECHA_FIN = TO_DATE(:formattedFechaFin, 'YYYY-MM-DD'), 
                CONDICIONES = :condiciones
            WHERE OFERTA_ID = :empresaIdNum
        `;

        // Asegúrate de incluir todos los valores posicionales en este array
        const result = await executeQuery(query, [categoriaIdNum, titulo, formattedFechaInicio, formattedFechaFin, condiciones, empresaIdNum]);

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: 'Oferta no encontrada' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Oferta actualizada exitosamente' }, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar la oferta:", error);
        return NextResponse.json({ message: 'Error al actualizar la oferta', error: error.message }, { status: 500 });
    }
}

// Eliminar un convenio
export async function DELETE(req) {
    const { empresaId } = await req.json();

    const empresaIdNum = parseInt(empresaId);

    try {
        const query = `
            DELETE FROM OFERTAS
            WHERE OFERTA_ID = :empresaIdNum
        `;
        const result = await executeQuery(query, [empresaIdNum]);

        if (result.affectedRows === 0) {
            return new Response('Oferta no encontrada', { status: 404 });
        }

        return new Response('Oferta eliminada exitosamente', { status: 200 });
    } catch (error) {
        console.error("Error al eliminar la oferta:", error);
        return new Response('Error al eliminar la oferta', { status: 500 });
    }
}
