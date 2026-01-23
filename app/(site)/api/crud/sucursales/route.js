import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const mapBranchToLegacy = (branch) => ({
  SUCURSAL_ID: branch.id,
  EMPRESA_ID: branch.company_id,
  DIRECCION: branch.address,
  TELEFONO: branch.phone,
  CIUDAD: branch.city,
  CORREO_CONTACTO: branch.contact_email, // Campo nuevo si la tabla branches no lo tiene, se ignora
  ESTADO: 1,
});

// Obtener todas las sucursales
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("branches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const legacyFormat = data.map(mapBranchToLegacy);

    return NextResponse.json(legacyFormat);
  } catch (error) {
    console.error("Error al obtener las sucursales:", error);
    return new Response("Error al obtener las sucursales", { status: 500 });
  }
}

// Crear una nueva sucursal
export async function POST(req) {
  const { empresaId, direccion, telefono, correoContacto, ciudad } =
    await req.json();

  try {
    const { data, error } = await supabase
      .from("branches")
      .insert([
        {
          company_id: parseInt(empresaId),
          address: direccion,
          phone: telefono,
          city: ciudad,
          // contact_email: correoContacto // Habilitar si la tabla branches tiene email
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: "Sucursal creada exitosamente" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al crear la sucursal:", error);
    return NextResponse.json(
      { message: "Error al crear la sucursal" },
      { status: 500 },
    );
  }
}

// Actualizar una sucursal
export async function PUT(req) {
  const { empresaId, direccion, telefono, correoContacto, ciudad } =
    await req.json();
  // NOTA FRONTEND: Al igual que en convenios, el frontend manda el ID de la sucursal en "empresaId" para el PUT/DELETE
  const sucursalId = parseInt(empresaId);

  try {
    const { error } = await supabase
      .from("branches")
      .update({
        address: direccion,
        phone: telefono,
        city: ciudad,
      })
      .eq("id", sucursalId);

    if (error) throw error;

    return NextResponse.json({ message: "Sucursal actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar la sucursal:", error);
    return NextResponse.json(
      { message: "Error al actualizar la sucursal", error: error.message },
      { status: 500 },
    );
  }
}

// Eliminar una sucursal
export async function DELETE(req) {
  const { empresaId } = await req.json();
  // NOTA FRONTEND: El prop se llama empresaId pero contiene el ID de la SUCURSAL a borrar
  const sucursalId = parseInt(empresaId);

  try {
    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", sucursalId);

    if (error) throw error;

    return new Response("Sucursal eliminada exitosamente", { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la sucursal:", error);
    return new Response("Error al eliminar la sucursal", { status: 500 });
  }
}
