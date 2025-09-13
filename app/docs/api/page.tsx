export const metadata = { title: "API Reference • Cogent" };

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1>API Reference</h1>
        <p>Use the REST API to manage agents and make calls.</p>

        <h2>Authentication</h2>
        <pre><code>{`Authorization: Bearer <api_key>`}</code></pre>

        <h2>List Agents</h2>
        <pre><code>{`GET /v1/agents`}</code></pre>

        <h2>Create Call</h2>
        <pre><code>{`POST /v1/calls`}</code></pre>
      </div>
    </div>
  );
}


