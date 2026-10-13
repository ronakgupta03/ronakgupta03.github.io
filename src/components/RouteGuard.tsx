"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/resources";
import { Flex, Button, Heading, Column, PasswordInput } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  
  const isRouteEnabled = (() => {
    if (!pathname) return true; // Default to true during SSR if pathname is somehow null
    if (pathname in routes) {
      return routes[pathname as keyof typeof routes];
    }
    const dynamicRoutes = ["/blog", "/work"] as const;
    for (const route of dynamicRoutes) {
      if (pathname.startsWith(route) && routes[route]) {
        return true;
      }
    }
    return false;
  })();

  const isProtected = pathname ? protectedRoutes[pathname as keyof typeof protectedRoutes] : false;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(isProtected);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isProtected) {
      setLoading(true);
      fetch("/api/check-auth").then(async (response) => {
        if (response.ok) {
          setIsAuthenticated(true);
        }
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [isProtected, pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  if (isProtected) {
    if (loading) {
      return null;
    }
    
    if (!isAuthenticated) {
      return (
        <Column paddingY="128" maxWidth={24} gap="24" center>
          <Heading align="center" wrap="balance">
            This page is password protected
          </Heading>
          <Column fillWidth gap="8" horizontal="center">
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              errorMessage={error}
            />
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </Column>
        </Column>
      );
    }
  }

  return <>{children}</>;
};

export { RouteGuard };
