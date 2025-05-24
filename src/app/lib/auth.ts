import { getServerSession } from "next-auth";
import { authOptions } from "../../app/api/auth/[...nextauth]/authOptions";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}
