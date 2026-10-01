import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const { data: users, error } =
    await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#070b14",
          color: "#fff",
          padding: "30px",
        }}
      >
        <h1>Gagal mengambil data users</h1>
        <p>{error.message}</p>
      </main>
    );
  }

  return (
    <UsersClient
      initialUsers={users || []}
    />
  );
}
