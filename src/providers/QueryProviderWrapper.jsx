import QueryProvider from "./QueryProvider";

export default function QueryProviderWrapper({ children }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
