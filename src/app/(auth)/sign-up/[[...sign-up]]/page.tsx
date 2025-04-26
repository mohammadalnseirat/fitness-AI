import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-background">
      <SignUp />
    </main>
  );
};

export default SignUpPage;
