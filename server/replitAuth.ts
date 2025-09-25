// Referenced from javascript_log_in_with_replit integration
import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.REPLIT_DOMAINS && process.env.REPL_ID !== 'local-dev') {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

  let sessionStore;
  if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev') {
    // Use memory store for local development
    const MemStore = MemoryStore(session);
    sessionStore = new MemStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  } else {
    // Use PostgreSQL store for production
    const pgStore = connectPg(session);
    sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: false,
      ttl: sessionTtl,
      tableName: "sessions",
    });
  }

  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Local development mode - skip Replit Auth
  if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev') {
    console.log("🔧 Running in LOCAL DEVELOPMENT mode");

    // Simple local login endpoint
    app.get("/api/login", (req: any, res) => {
      req.login({
        claims: {
          sub: "test-user-123",
          email: "admin@school.com",
          first_name: "Test",
          last_name: "Admin"
        }
      }, (err: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.redirect("/");
      });
    });

    app.get("/api/signup", (req: any, res) => {
      req.login({
        claims: {
          sub: "test-user-123",
          email: "admin@school.com",
          first_name: "Test",
          last_name: "Admin"
        }
      }, (err: any) => {
        if (err) return res.status(500).json({ error: err.message });
        res.redirect("/");
      });
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect("/");
      });
    });

    return;
  }


  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: any, cb) => {
    // Only serialize the user ID for security and to avoid serialization issues
    cb(null, user.claims?.sub);
  });

  passport.deserializeUser(async (id: string, cb) => {
    if (process.env.NODE_ENV === 'development' && process.env.REPL_ID === 'local-dev') {
      // For local dev, return the test user without db lookup
      const user = {
        claims: {
          sub: id,
          email: "admin@school.com",
          first_name: "Test",
          last_name: "Admin"
        }
      };
      cb(null, user);
    } else {
      try {
        // Reconstruct the user object from the database
        const dbUser = await storage.getUser(id);
        if (!dbUser) {
          return cb(new Error('User not found'), null);
        }

        // Create a minimal user object for the session
        // Note: We don't store tokens in session for security
        const user = {
          claims: {
            sub: id,
            email: dbUser.email,
            first_name: dbUser.firstName,
            last_name: dbUser.lastName
          }
        };

        cb(null, user);
      } catch (error) {
        cb(error, null);
      }
    }
  });

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/signup", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "create",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
