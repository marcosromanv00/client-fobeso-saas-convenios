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
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      throw error;
    }

    const formattedOfertas = deals.map((deal) => {
      // Supabase returns foreign tables as objects or arrays.
      // companies is 1:1 (conceptually here) or 1:N?
      // In schema: deals.company_id -> companies.id. So it's 1 company per deal.
      // Therefore deal.companies should be an object (if using single) or array (if implied).
      // supabase-js usually returns object for Many-to-One.
      // Let's coerce to be safe.
      const company = Array.isArray(deal.companies)
        ? deal.companies[0]
        : deal.companies;
      const category = Array.isArray(deal.categories)
        ? deal.categories[0]
        : deal.categories;

      // branches is nested in company. company is 1:N branches.
      // So company.branches is an array.
      const branches = company?.branches || [];
      const branch = branches.length > 0 ? branches[0] : {};

      return {
        // Preserving legacy mapping quirks
        oferta_id: deal.company_id, // LEGACY: Maps CONVENIO_ID to oferta_id
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

    return NextResponse.json(formattedOfertas);
  } catch (error) {
    console.error("Error al obtener las ofertas:", error);
    return new Response("Error al obtener las ofertas", { status: 500 });
  }
}
