// Root layout — intentionally minimal.
// The real html/body is in app/[locale]/layout.tsx, served after middleware locale rewrite.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children as React.ReactElement;
}
