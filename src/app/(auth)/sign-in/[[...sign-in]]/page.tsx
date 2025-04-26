import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-background">
      <SignIn />
    </main>
  );
};

export default SignInPage;
