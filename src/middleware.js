import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/customers/:path*",
    "/sale/:path*", 
    "/history/:path*",
  ],
};