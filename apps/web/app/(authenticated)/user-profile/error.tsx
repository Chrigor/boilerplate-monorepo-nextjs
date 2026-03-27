'use client'

interface UserProfileErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function UserProfileError({ error, reset }: UserProfileErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-red-200 p-6">
        <h2 className="text-lg font-semibold text-red-600">
          Erro ao carregar perfil
        </h2>
        <p className="text-sm text-gray-600">
          {error.message || "Ocorreu um erro inesperado."}
        </p>
        <button
          onClick={reset}
          className="self-start rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
