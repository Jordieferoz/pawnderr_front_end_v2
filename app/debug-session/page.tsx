// app/debug-session/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [manualSession, setManualSession] = useState<any>(null);

  useEffect(() => {
    async function fetchSession() {
      const { getSession } = await import("next-auth/react");
      const sess = await getSession();
      setManualSession(sess);
    }
    fetchSession();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Session Debug Page</h1>

      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">useSession Hook:</h2>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <pre className="mt-2 overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">getSession() Call:</h2>
        <pre className="overflow-auto">
          {JSON.stringify(manualSession, null, 2)}
        </pre>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h2 className="text-xl font-semibold mb-2">Quick Checks:</h2>
        <ul className="space-y-2">
          <li>✓ Has Session: {session ? "Yes" : "No"}</li>
          <li>✓ Has User: {session?.user ? "Yes" : "No"}</li>
          <li>
            ✓ Has AccessToken: {(session as any)?.accessToken ? "Yes" : "No"}
          </li>
          <li>✓ User Email: {session?.user?.email || "N/A"}</li>
        </ul>
      </div>
    </div>
  );
}
