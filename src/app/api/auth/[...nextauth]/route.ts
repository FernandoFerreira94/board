import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRRET as string,
    }),
  ],
  secret: process.env.JWT_SECRET as string,
};

const handle = NextAuth(authOptions);

export { handle as GET, handle as POST };
