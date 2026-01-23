import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Mapeo auxiliar de nombres de campos Database -> Frontend Legacy
const mapCompanyToLegacy = (company) => ({
  EMPRESA_ID: company.id,
  NOMBRE: company.name,
  LOGO_URL: company.logo_url,
  SITIO_WEB: company.website,
  FACEBOOK: company?.facebook, // Asumiendo que agregaremos redes sociales a la tabla 'companies'
  INSTAGRAM: company?.instagram,
  TWITTER: company?.twitter,
  LINKEDIN: company?.linkedin,
  ESTADO: company.is_active ? 1 : 0,
});

// Obtener todas las empresas
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Mapeamos para que el frontend existente no se rompa
    const legacyFormat = data.map(mapCompanyToLegacy);

    return NextResponse.json(legacyFormat);
  } catch (error) {
    console.error("Error al obtener las empresas (Supabase):", error);
    return new Response("Error al obtener las empresas", { status: 500 });
  }
}

// Crear una nueva empresa
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      nombre,
      logoUrl,
      sitio_web,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = body;

    const { data, error } = await supabase
      .from("companies")
      .insert([
        {
          name: nombre,
          logo_url: logoUrl,
          website: sitio_web,
          // Nota: Redes sociales no están en la definición SQL original mínima,
          // pero si existen en Supabase se pueden insertar. Si no, se ignoran o se agregan en JSONB.
          // Por ahora asumo que solo name y logo_url son críticos.
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Respuesta compatible con el frontend (espera EMPRESA_ID y message)
    return NextResponse.json(
      {
        EMPRESA_ID: data.id,
        message: `Empresa creada exitosamente con ID: ${data.id}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al crear la empresa:", error);
    return NextResponse.json(
      { error: "Error al crear la empresa" },
      { status: 500 },
    );
  }
}

// Actualizar una empresa
export async function PUT(req) {
  try {
    const body = await req.json();
    const {
      empresaId,
      empresaNombre,
      logoUrl,
      sitio_web,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = body;

    const empresaIdNum = parseInt(empresaId);

    if (!empresaNombre || !empresaNombre.trim()) {
      return NextResponse.json(
        { error: "El nombre de la empresa no puede estar vacío" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("companies")
      .update({
        name: empresaNombre.trim(),
        logo_url: logoUrl,
        website: sitio_web,
      })
      .eq("id", empresaIdNum);

    if (error) throw error;

    return NextResponse.json({ message: "Empresa actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la empresa:", error);
    return NextResponse.json(
      { error: "Error al actualizar la empresa" },
      { status: 500 },
    );
  }
}

// Eliminar una empresa
export async function DELETE(req) {
  try {
    const { empresaId } = await req.json();
    const empresaIdNum = parseInt(empresaId);

    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", empresaIdNum);

    if (error) throw error;

    return new Response("Empresa eliminada exitosamente", { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la empresa:", error);
    return new Response("Error al eliminar la empresa", { status: 500 });
  }
}
