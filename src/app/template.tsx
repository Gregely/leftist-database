/** Re-mounted on every navigation: a quiet fade-and-rise as the new page arrives. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-enter">{children}</div>;
}
