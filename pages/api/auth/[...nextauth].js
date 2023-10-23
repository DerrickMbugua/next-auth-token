import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
// ** Cookies
import Cookies from 'js-cookie'

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const res = await fetch("http://127.0.0.1:8000/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "password",
            client_id: "2",
            client_secret: 'uLVri3w4fl0g6EH8ZkIulXeepReVzzpldGjDyXps',
            username: credentials?.username,
            password: credentials?.password,
            scope: "",
          }),
        })

        const token = await res.json()
        console.log(token)

        if (token.access_token) {
          const userToken = token.access_token; // Assuming your token object has an 'access_token' property
          Cookies.set('accessToken', userToken)
          const userResponse = await fetch("http://localhost:8000/api/user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });

          if (userResponse.ok) {
            const user = await userResponse.json();
            console.log("User Data:",user)
            // return {
            //   ...user,
            //   accessToken: userToken,
            // };
            return user;
            // Process the user data as needed
          } else {
            // Handle errors, e.g., userResponse.status contains the HTTP status code
            console.error(`Failed to fetch user data: ${userResponse.status}`);
          }
          // Any object returned will be saved in `user` property of the JWT
          // return token
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        // console.log("Access Token2:", accessToken);
        const filteredUser = {
          email: user.email,
          accessToken: user.accessToken,
          user_id: user.user_id,
        };
  
        token = { ...token, ...filteredUser };
        console.log("the filtered value is " + token);
      }
      return token;
    },
  
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      let customUser = { ...token };
      session = { user: customUser };
      console.log("Your session", session);
      return session;
    },
  },
  pages: {
    signIn: "/login"
  }
 

 
 
}
export default NextAuth(authOptions)