'use client'

import Image from "next/image";
import { useUserStore } from "features/providers/user-provider/stores/user-store.context";

export function UserProfileCard() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-lg border p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl font-semibold text-amber-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ProfileField label="Função" value={user.role} />
        <ProfileField label="ID da Conta" value={user.accountId} />
        {user.isInternal !== undefined && (
          <ProfileField label="Interno" value={user.isInternal ? "Sim" : "Não"} />
        )}
        {user.createdAt && (
          <ProfileField
            label="Criado em"
            value={new Date(user.createdAt).toLocaleDateString("pt-BR")}
          />
        )}
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-none last:pb-0">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}
