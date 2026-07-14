import Header from "@/src/components/Header";
import { publicRoutes } from "@/src/constants/routes";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        title="FC PFF Management"
        routes={publicRoutes}
      />

      <main>{children}</main>
    </>
  );
}