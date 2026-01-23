import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import EmpresaDetailClient from "./EmpresaDetailClient";

export const dynamic = "force-dynamic";

// --- Data Fetching Logic (Reused from API) ---
async function getConvenioDetails(id: string) {
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
        facebook,
        instagram,
        twitter,
        linkedin,
        is_active,
        branches (
          address,
          phone,
          city,
          contact_email
        )
      )
    `,
    )
    .eq("company_id", id)
    .limit(1);

  if (error || !deals || deals.length === 0) {
    return null;
  }

  const deal = deals[0];
  const company = (
    Array.isArray(deal.companies) ? deal.companies[0] : deal.companies
  ) as any;
  const branches = company?.branches || [];
  const branch = (branches.length > 0 ? branches[0] : {}) as any;

  return {
    titulo: deal.title,
    fechaInicio: deal.start_date,
    fechaFin: deal.end_date,
    condiciones: deal.conditions,
    empresaNombre: company?.name || "",
    logoUrl: company?.logo_url || "",
    sitio_web: company?.website || "",
    facebook: company?.facebook || "",
    instagram: company?.instagram || "",
    twitter: company?.twitter || "",
    linkedin: company?.linkedin || "",
    direccion: branch.address || "",
    telefono: branch.phone || "",
    correo_contacto: branch.contact_email || "",
    ciudad: branch.city || "",
  };
}

// --- Metadata Generation ---
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const data = await getConvenioDetails(params.id);

  if (!data) {
    return {
      title: "Convenio no encontrado",
    };
  }

  return {
    title: `${data.empresaNombre} - Convenios FOBESO`,
    description: `Aprovecha el convenio con ${data.empresaNombre}: ${data.titulo}. ${data.condiciones}`,
    openGraph: {
      title: `${data.empresaNombre} - Convenios FOBESO`,
      description: data.condiciones,
      images: data.logoUrl ? [data.logoUrl] : [],
    },
  };
}

// --- Server Component ---
export default async function EmpresaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getConvenioDetails(params.id);

  if (!data) {
    return (
      <div className="pt-40 text-center">
        <h1 className="text-2xl font-bold">Convenio no encontrado</h1>
      </div>
    );
  }

  return <EmpresaDetailClient empresaDetails={data} />;
}
