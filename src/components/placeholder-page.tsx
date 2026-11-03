type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="mb-3 text-sm font-semibold tracking-wide text-emerald-800">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-700">
        {description}
      </p>
      <div className="mt-8 h-1 w-28 rounded-full bg-gradient-to-r from-emerald-500 to-sky-600" />
    </main>
  );
}
