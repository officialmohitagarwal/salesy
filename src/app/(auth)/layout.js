export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0B1220] flex items-center justify-center px-4">
      {children}
    </div>
  );
}