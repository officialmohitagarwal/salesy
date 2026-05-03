import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Salesy",
  description: "Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <StoreProvider>{children}</StoreProvider>
        </Providers>
      </body>
    </html>
  );
}