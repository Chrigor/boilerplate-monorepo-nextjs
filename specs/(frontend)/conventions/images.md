# Images

Always use `next/image` instead of the native `<img>` HTML tag.

```typescript
import Image from 'next/image'

// correct
<Image src="/avatar.png" alt="User avatar" width={40} height={40} />

// wrong — never use
<img src="/avatar.png" alt="User avatar" />
```

**Why:** Next.js `Image` provides automatic optimization (WebP/AVIF conversion, resizing, lazy loading) and prevents layout shift via reserved space. The raw `<img>` tag bypasses all of these.
