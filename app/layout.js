import "./globals.css";

export const metadata = {
  title: "NOKOS STORE",
  description: "Virtual Number & Verifikasi SMS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
