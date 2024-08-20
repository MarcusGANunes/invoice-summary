import { getSession } from "next-auth/react"

export async function validateSession(context) {
  const session = await getSession(context)

  if (!session) return {
                          redirect: {
                            destination: "/login",
                            permanent: false
                          }
                        }

  return {
    props: { session }
  }
}
