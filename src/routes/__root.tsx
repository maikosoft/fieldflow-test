import { createRootRoute, Outlet, type NavigateOptions, type ToOptions, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Alert, Button, Input, Navbar, NavbarBrand, NavbarContent, NavbarItem, Link } from '@heroui/react';
import {HeroUIProvider} from "@heroui/react";

declare module "@react-types/shared" {
  interface RouterConfig {
    href: ToOptions['to'];
    routerOptions: Omit<NavigateOptions, keyof ToOptions>;
  }
}

export const Route = createRootRoute({
  component: () => {
    let router = useRouter();

    return (
      <HeroUIProvider
        navigate={(to, options) => router.navigate({to, ...options})}
        useHref={(to) => router.buildLocation({to}).href}
    >      <Authenticated>
        <Navbar isBordered>
          <NavbarBrand>
            FieldFlow Test
          </NavbarBrand>
          <NavbarContent>
            <NavbarItem>
              <Link href="/">Home</Link>
            </NavbarItem>
            <NavbarContent justify="end">
              <SignOutButton />
            </NavbarContent>
          </NavbarContent>
        </Navbar>
        <main className="container mx-auto p-4">
          <Outlet />
        </main>
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
      <TanStackRouterDevtools />
    </HeroUIProvider>
  );
  },
})

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <Button
          color="primary"
          onPress={() => void signOut()}
        >
          Sign out
        </Button>
      )}
    </>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-8 w-96 p-8 mx-auto">
        <h1 className="text-4xl font-bold text-center">
          FieldFlow Test
        </h1>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            setError(error.message);
          });
        }}
      >
        <Input
          type="email"
          name="email"
          placeholder="Email"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
        />
        <Button
          color="primary"
          type="submit"
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </Button>
        <div className="flex flex-row gap-2">
          <span>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </span>
        </div>
        {error && (
          <Alert color="danger">
              Error signing in: {error}
          </Alert>
        )}
      </form>
    </div>
  );
}