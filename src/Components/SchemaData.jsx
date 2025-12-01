"use client";

/**
 * SchemaData Component
 * 
 * Why this component?
 * - Renders JSON-LD structured data in the page head
 * - Search engines read this to understand page content
 * - Enables rich snippets and better search visibility
 * 
 * Usage: <SchemaData schema={schemaObject} />
 */
export default function SchemaData({ schema }) {
  if (!schema) return null;

  try {
    // Validate and stringify schema safely
    const schemaString = JSON.stringify(schema);
    
    // Basic validation - ensure it's valid JSON
    if (!schemaString || schemaString === '{}' || schemaString === 'null') {
      return null;
    }

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaString }}
      />
    );
  } catch (error) {
    // Silently fail in production to prevent rendering errors
    if (process.env.NODE_ENV === 'development') {
      console.error("Error rendering schema data:", error);
    }
    return null;
  }
}

