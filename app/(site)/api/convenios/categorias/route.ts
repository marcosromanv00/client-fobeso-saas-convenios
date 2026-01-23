import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    // Map to legacy format expected by frontend components (if any)
    // Based on previous code: CATEGORIA_ID, NOMBRE
    const formattedCategories = categories.map((cat) => ({
      CATEGORIA_ID: cat.id,
      NOMBRE: cat.name,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return new Response(
      JSON.stringify({ message: "Error al obtener las categorías" }),
      { status: 500 },
    );
  }
}
