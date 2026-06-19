import "./globals.css";

export const metadata = {
  title: "Marquis Living | Premium Architecture & Interior Design Studio",
  description: "Bringing globally recognized design standards, meticulous craftsmanship, and structural excellence to contemporary Dubai residences. Crafting bespoke luxury interiors.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/logowhite.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
