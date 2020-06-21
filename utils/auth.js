import cookie from "js-cookie";
import Router from "next/router";

export const handleLogin = (token) => {
  cookie.set("token", token);
  Router.push("/account");
};

export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    // We are on the server
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    // We are on the client
    Router.push(location);
  }
};
