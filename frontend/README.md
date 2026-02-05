# Profile Site Frontend

A Next.js application with shadcn/ui components recreating a profile site with separated components.

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   └── card.tsx
│   └── profile/               # Custom profile components
│       ├── ProfileHeader.tsx  # Profile image, name, and title
│       ├── SocialLinks.tsx    # Social media links
│       ├── ActionButtons.tsx  # Action buttons (View Proof, Meetup, etc.)
│       ├── Gallery.tsx        # Gallery section
│       └── TelegramNotification.tsx # Telegram notification popup
└── app/
    └── page.tsx              # Main page component

```

## Components

### ProfileHeader
- Displays profile image with pink border
- Shows name and title
- Uses shadcn/ui Avatar component

### SocialLinks
- Renders social media icons as buttons
- Configurable links and icons

### ActionButtons
- Displays action buttons in a vertical layout
- Customizable colors and click handlers

### Gallery
- Simple gallery section with title and description

### TelegramNotification
- Floating notification card
- Dismissible with close button
- Join button functionality

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Technologies Used

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components