import { executeQuery } from '@/lib/db';

import oracledb from 'oracledb'; // Importar la librería oracledb
import { NextResponse } from 'next/server';

// Obtener todas las empresas
export async function GET() {
    try {
        const query = `
            SELECT * FROM EMPRESAS
        `;
        const empresas = await executeQuery(query);
        return new Response(JSON.stringify(empresas.rows), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error al obtener las empresas:", error);
        return new Response('Error al obtener las empresas', { status: 500 });
    }
}

// Crear una nueva empresa
export async function POST(req) {
    const { nombre, logoUrl, sitio_web, facebook, instagram, twitter, linkedin } = await req.json();

    const query = `
    INSERT INTO EMPRESAS (EMPRESA_ID, NOMBRE, LOGO_URL, SITIO_WEB, FACEBOOK, INSTAGRAM, TWITTER, LINKEDIN, ESTADO)
    VALUES (empresa_seq.NEXTVAL, :nombre, :logoUrl, :sitio_web, :facebook, :instagram, :twitter, :linkedin, 1)
    RETURNING EMPRESA_ID INTO :empresaId
`;

    // Parámetros con el parámetro de salida para capturar el EMPRESA_ID
    const params = [
        nombre,
        logoUrl,
        sitio_web,
        facebook,
        instagram,
        twitter,
        linkedin,
        { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }  // Parámetro de salida
    ];

    try {
        const result = await executeQuery(query, params);

        if (result.outBinds && result.outBinds[0] && result.outBinds[0][0] !== undefined) {
            const empresaId = result.outBinds[0][0];  // Acceder al primer valor del primer arreglo

            return new Response(
                JSON.stringify({ EMPRESA_ID: empresaId, message: `Empresa creada exitosamente con ID: ${empresaId}` }),
                { status: 201, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            console.error("Error: No se pudo obtener EMPRESA_ID de outBinds.");
            return new Response(
                JSON.stringify({ error: 'Error al obtener el EMPRESA_ID' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error) {
        console.error("Error al crear la empresa:", error);
        return new Response(
            JSON.stringify({ error: 'Error al crear la empresa' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

// Actualizar una empresa
export async function PUT(req) {
    const { empresaId, empresaNombre, logoUrl, sitio_web, facebook, instagram, twitter, linkedin } = await req.json();

    // Asegurarse de que `empresaId` sea numérico
    const empresaIdNum = parseInt(empresaId);
    const empresaNombreTrimmed = empresaNombre ? empresaNombre.trim() : '';
    console.log('Nombre sin espacios: ', empresaNombreTrimmed);
    console.log('Nombre: ', empresaNombre);

    if (!empresaNombre || !empresaNombre.trim()) {
        return new Response(JSON.stringify({ error: 'El nombre de la empresa no puede estar vacío' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (isNaN(empresaIdNum)) {
        return new Response(JSON.stringify({ error: 'ID de empresa inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    console.log('1 Nombre: ', empresaNombre);

    try {
        const query = `
            UPDATE EMPRESAS
            SET NOMBRE = :empresaNombreTrimmed, LOGO_URL = :logoUrl, SITIO_WEB = :sitio_web, FACEBOOK = :facebook, 
                INSTAGRAM = :instagram, TWITTER = :twitter, LINKEDIN = :linkedin
            WHERE EMPRESA_ID = :empresaId
        `;

        const result = await executeQuery(query, [empresaNombreTrimmed, logoUrl, sitio_web, facebook, instagram, twitter, linkedin, empresaIdNum]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'Empresa no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ message: 'Empresa actualizada exitosamente' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error("Error al actualizar la empresa:", error);
        return new Response(JSON.stringify({ error: 'Error al actualizar la empresa' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

// Eliminar una empresa
export async function DELETE(req) {
    const { empresaId } = await req.json();

    const empresaIdNum = parseInt(empresaId);

    try {
        const query = `
            DELETE FROM EMPRESAS
            WHERE EMPRESA_ID = :empresaIdNum
        `;
        const result = await executeQuery(query, [empresaIdNum]);

        if (result.affectedRows === 0) {
            return new Response('Empresa no encontrada', { status: 404 });
        }

        return new Response('Empresa eliminada exitosamente', { status: 200 });
    } catch (error) {
        console.error("Error al eliminar la empresa:", error);
        return new Response('Error al eliminar la empresa', { status: 500 });
    }
}
