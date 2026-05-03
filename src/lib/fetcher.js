export async function safeFetch(url, options = {}) {
  try {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 8000); // 8 seconds timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    let data;

    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid server response" };
    }

    if (!res.ok) {
      return { error: data.error || "Request failed" };
    }

    return data;

  } catch (err) {
    console.error("Fetch error:", err.message);

    return {
      error:
        err.name === "AbortError"
          ? "Request timeout"
          : err.message || "Something went wrong",
    };
  }
}