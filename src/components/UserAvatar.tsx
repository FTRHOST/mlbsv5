import { useEffect, useState } from "react";

// Avatar pemain berdasarkan user ID.
// File dibaca dari public/assets/user/{userId}.png (.jpg/.jpeg/.webp juga didukung).
// Contoh: user ber-ID "2250377918" -> /assets/user/2250377918.png
// Bila file tidak ada / ID kosong, tampilkan gambar `fallback`.
const USER_AVATAR_EXTS = ["png", "jpg", "jpeg", "webp"];

export default function UserAvatar({
  userId,
  fallback,
  className,
  alt = "",
}: {
  userId: string | number | undefined | null;
  fallback: string;
  className?: string;
  alt?: string;
}) {
  const id = String(userId ?? "").trim();
  const [extIdx, setExtIdx] = useState(0);

  useEffect(() => {
    setExtIdx(0);
  }, [id]);

  if (!id || extIdx >= USER_AVATAR_EXTS.length) {
    return <img alt={alt} className={className} src={fallback} />;
  }

  return (
    <img
      alt={alt}
      className={className}
      src={`/assets/user/${id}.${USER_AVATAR_EXTS[extIdx]}`}
      onError={() => setExtIdx((i) => i + 1)}
    />
  );
}
