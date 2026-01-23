import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: deals, error } = await supabase
      .from("deals")
      .select(
        `
        id,
        company_id,
        category_id,
        title,
        conditions,
        created_at,
        companies (
          id,
          name,
          logo_url,
          branches (
            address,
            city,
            phone
          )
        ),
        categories (
          id,
          name
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    if (!deals || deals.length === 0) {
      return new Response("No se encontraron convenios", { status: 404 });
    }

    const formattedConvenios = deals.map((deal) => {
      const company = Array.isArray(deal.companies)
        ? deal.companies[0]
        : deal.companies;
      const category = Array.isArray(deal.categories)
        ? deal.categories[0]
        : deal.categories;
      const branches = company?.branches || [];
      const branch = branches.length > 0 ? branches[0] : {};

      return {
        convenio_id: deal.company_id,
        empresa_id: deal.company_id,
        nombre_emp: company?.name,
        logo_url: company?.logo_url,
        direccion: branch.address || null,
        ciudad: branch.city || null,
        categoria_id: deal.category_id,
        nombre_cat: category?.name,
        titulo: deal.title,
        condiciones: deal.conditions,
      };
    });

    return NextResponse.json(formattedConvenios);
  } catch (error) {
    console.error("Error al obtener los convenios:", error);
    return new Response("Error al obtener los convenios", { status: 500 });
  }
}
