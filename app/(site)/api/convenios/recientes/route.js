import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Asegura que no se cachee estáticamente en build

export async function GET() {
  try {
    // Consulta a Supabase
    const { data: deals, error } = await supabase
      .from("deals")
      .select(
        `
        id,
        title,
        conditions,
        created_at,
        companies:company_id (
          id,
          name,
          logo_url,
          branches (
            address,
            city,
            phone
          )
        ),
        categories:category_id (
          id,
          name
        )
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }

    // Mapeo para mantener compatibilidad con el frontend actual
    const formattedConvenios = deals.map((deal) => {
      // Tomamos la primera sucursal disponible para mostrar dirección (igual que lógica anterior implícita)
      const firstBranch = deal.companies?.branches?.[0] || {};

      return {
        convenio_id: deal.id,
        empresa_id: deal.companies?.id,
        nombre_emp: deal.companies?.name,
        logo_url: deal.companies?.logo_url,
        direccion: firstBranch.address || "Dirección no disponible",
        ciudad: firstBranch.city || "",
        telefono: firstBranch.phone || "",
        categoria_id: deal.categories?.id,
        nombre_cat: deal.categories?.name,
        titulo: deal.title,
        condiciones: deal.conditions,
      };
    });

    return NextResponse.json(formattedConvenios);
  } catch (error) {
    console.error("Error al obtener los convenios recientes:", error);
    return new Response("Error al obtener los convenios", { status: 500 });
  }
}
