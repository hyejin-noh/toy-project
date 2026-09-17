const VERIFY_TIMEOUT_MS = 8000;

type VerifyRequestBody = {
  baseUrl?: unknown;
  token?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as VerifyRequestBody | null;
  const baseUrl = typeof body?.baseUrl === "string" ? body.baseUrl.trim() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!baseUrl || !token) {
    return Response.json(
      { ok: false, reason: "unknown" },
      { status: 400 }
    );
  }

  let myselfUrl: URL;
  try {
    myselfUrl = new URL("/rest/api/2/myself", baseUrl);
  } catch {
    return Response.json({ ok: false, reason: "unreachable" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

  try {
    const res = await fetch(myselfUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (res.status === 401 || res.status === 403) {
      return Response.json({ ok: false, reason: "unauthorized" });
    }

    if (!res.ok) {
      return Response.json({ ok: false, reason: "unknown" });
    }

    const data = await res.json().catch(() => null);
    const accountName =
      (typeof data?.displayName === "string" && data.displayName) ||
      (typeof data?.name === "string" && data.name) ||
      undefined;

    return Response.json({ ok: true, accountName });
  } catch {
    // 주소가 해석되지 않거나 응답이 없는 경우로, 사내망 밖에서는 이 경로만 검증된다.
    return Response.json({ ok: false, reason: "unreachable" });
  } finally {
    clearTimeout(timeout);
  }
}
