import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";
export const dynamic = "force-dynamic";

function isAdminEmail(email) {
  const adminEmails =
    process.env.ADMIN_EMAILS
      ?.split(",")
      .map((value) =>
        value.trim().toLowerCase()
      )
      .filter(Boolean) || [];

  return (
    !!email &&
    adminEmails.includes(
      email.trim().toLowerCase()
    )
  );
}

export async function GET() {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user ||
      !isAdminEmail(user.email)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: transactions,
      error,
    } = await supabaseAdmin
      .from("balance_transactions")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(500);

    if (error) {
      throw error;
    }

    const userIds = [
      ...new Set(
        (transactions || [])
          .map(
            (transaction) =>
              transaction.user_id
          )
          .filter(Boolean)
      ),
    ];

    let users = [];

    if (userIds.length > 0) {
      const {
        data,
        error: usersError,
      } = await supabaseAdmin
        .from("users")
        .select(
          "id, email, first_name, telegram_id"
        )
        .in("id", userIds);

      if (usersError) {
        throw usersError;
      }

      users = data || [];
    }

    const userMap = new Map();

    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    const enrichedTransactions =
      (transactions || []).map(
        (transaction) => ({
          ...transaction,
          user:
            userMap.get(
              transaction.user_id
            ) || null,
        })
      );

    return NextResponse.json({
      success: true,
      transactions:
        enrichedTransactions,
    });
  } catch (error) {
    console.error(
      "ADMIN TRANSACTIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Gagal mengambil transaksi.",
      },
      {
        status: 500,
      }
    );
  }
}
