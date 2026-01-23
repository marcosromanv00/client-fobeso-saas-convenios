import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate unique file path
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload using Admin Client (Bypassing RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("logos")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      throw uploadError;
    }

    // Get Public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("logos")
      .getPublicUrl(filePath);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error uploading file" },
      { status: 500 },
    );
  }
}
