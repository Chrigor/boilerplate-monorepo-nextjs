import { UserProfileCard } from "features/user/components/user-profile-card";

export default async function UserProfilePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <UserProfileCard />
    </main>
  );
}
