import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const { data: deals, error } = await supabase
      .from("deals")
      .select(
        `
        title,
        start_date,
        end_date,
        conditions,
        companies (
          name,
          logo_url,
          website,
          is_active,
          branches (
            address,
            phone,
            city
          )
        )
      `,
      )
      .eq("company_id", id)
      .limit(1);

    if (error) {
      throw error;
    }

    if (!deals || deals.length === 0) {
      return new Response("Oferta no encontrada", { status: 404 });
    }

    const deal = deals[0];
    const company = (
      Array.isArray(deal.companies) ? deal.companies[0] : deal.companies
    ) as any;
    const branches = company?.branches || [];
    const branch = (branches.length > 0 ? branches[0] : {}) as any;

    const formattedDetail = {
      TITULO: deal.title,
      FECHA_INICIO: deal.start_date,
      FECHA_FIN: deal.end_date,
      CONDICIONES: deal.conditions,
      EMPRESA_NOMBRE: company?.name || "",
      LOGO_URL: company?.logo_url || "",
      SITIO_WEB: company?.website || "",
      FACEBOOK: "",
      INSTAGRAM: "",
      TWITTER: "",
      LINKEDIN: "",
      EMPRESA_ESTADO: company?.is_active ? 1 : 0,
      DIRECCION: branch.address || "",
      TELEFONO: branch.phone || "",
      CORREO_CONTACTO: "", // No email in branches/companies schema seen so far except hidden ones
      CIUDAD: branch.city || "",
      SUCURSAL_ESTADO: 1, // Assuming active
    };

    return new Response(JSON.stringify(formattedDetail), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching oferta details", error);
    return new Response("Error al obtener los detalles de la oferta", {
      status: 500,
    });
  }
}
