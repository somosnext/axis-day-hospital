import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
export default function Page() {
  return (
    <main className="grid min-h-screen bg-off-white lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/RCZ_2303.jpg"
          alt="Recepção do Axis Day Hospital"
          fill
          priority
          loading="eager"
          className="object-cover"
          sizes="50vw"
        />
      </div>
      <div className="grid place-items-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-navy p-6">
            <Image
              src="/brand/axis-logo-white.png"
              alt="Axis Day Hospital"
              width={200}
              height={60}
              className="h-11 w-auto"
            />
          </div>
          <p className="eyebrow mt-10 text-navy">Área restrita</p>
          <h1 className="mt-3 font-editorial text-5xl text-navy">
            Painel administrativo
          </h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
