import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Cliente Supabase con privilegios de administrador (Service Role) para bypass de RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// Mapeo auxiliar de nombres de campos Database -> Frontend Legacy
const mapDealToLegacy = (deal) => ({
  CONVENIO_ID: deal.id,
  EMPRESA_ID: deal.company_id,
  CATEGORIA_ID: deal.category_id,
  TITULO: deal.title,
  CONDICIONES: deal.conditions,
  FECHA_INICIO: deal.start_date,
  FECHA_FIN: deal.end_date,
  ESTADO: deal.is_active ? 1 : 0,
  // Agregamos campos extra si el frontend los usa para mostrar nombres
  NOMBRE_EMPRESA: deal.companies?.name,
  NOMBRE_CATEGORIA: deal.categories?.name,
});

// Obtener todos los convenios (Admin)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("deals")
      .select(
        `
                *,
                companies (name),
                categories (name)
            `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Mapeamos para que el frontend existente no se rompa
    const legacyFormat = data.map(mapDealToLegacy);

    return NextResponse.json(legacyFormat);
  } catch (error) {
    console.error("Error al obtener convenios (Supabase):", error);
    return new Response("Error al obtener los convenios", { status: 500 });
  }
}

// Crear un nuevo convenio
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      empresaId,
      categoriaId,
      titulo,
      fechaInicio,
      fechaFin,
      condiciones,
    } = body;

    // Validación básica
    if (!empresaId || !titulo) {
      return new Response("Faltan datos requeridos", { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("deals")
      .insert([
        {
          company_id: parseInt(empresaId),
          category_id: parseInt(categoriaId),
          title: titulo,
          conditions: condiciones,
          start_date: fechaInicio, // Supabase acepta strings ISO o YYYY-MM-DD
          end_date: fechaFin,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Convenio creado exitosamente", data });
  } catch (error) {
    console.error("Error al crear convenio:", error);
    return new Response("Error al crear el convenio", { status: 500 });
  }
}

// Actualizar un convenio
export async function PUT(req) {
  try {
    const body = await req.json();
    // PRECAUCIÓN: El frontend actual envía "empresaId" como el ID del registro a editar según el código legacy auditado.
    // En el código original: WHERE CONVENIO_ID = :empresaIdNum (Línea 63 del original).
    // Esto confirma que el frontend llama "empresaId" al ID del convenio en el PUT. Mantendremos esa lógica confusa pero funcional.
    const {
      empresaId,
      categoriaId,
      titulo,
      fechaInicio,
      fechaFin,
      condiciones,
    } = body;

    const dealId = parseInt(empresaId); // ID del convenio realmente

    const { error } = await supabaseAdmin
      .from("deals")
      .update({
        category_id: parseInt(categoriaId),
        title: titulo,
        conditions: condiciones,
        start_date: fechaInicio,
        end_date: fechaFin,
      })
      .eq("id", dealId);

    if (error) throw error;

    return NextResponse.json({ message: "Convenio actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar convenio:", error);
    return NextResponse.json(
      { message: "Error al actualizar el convenio", error: error.message },
      { status: 500 },
    );
  }
}

// Eliminar un convenio
export async function DELETE(req) {
  try {
    const { empresaId } = await req.json(); // Nuevamente, el frontend manda el ID bajo la prop empresaId
    const dealId = parseInt(empresaId);

    // FIX CRÍTICO: Borramos por ID de convenio, no por ID de empresa.
    const { error } = await supabaseAdmin
      .from("deals")
      .delete()
      .eq("id", dealId);

    if (error) throw error;

    return new Response("Convenio eliminado exitosamente", { status: 200 });
  } catch (error) {
    console.error("Error al eliminar convenio:", error);
    return new Response("Error al eliminar el convenio", { status: 500 });
  }
}
