# Aesop Blog

An exceptional social blogging platform where writers, thinkers, and creators come together.

![Aesop Blog](https://img.shields.io/badge/Aesop-Blog-blue?style=for-the-badge)

## Features

### Core Features
- **Full Authentication System** - Secure user signup/login with Supabase Auth
- **Rich Blog Post Editor** - Beautiful editor with cover images, tags, and automatic reading time calculation
- **Dynamic Feed** - Multiple filters (Latest, Trending, Following)
- **Infinite Scroll** - Seamless content discovery
- **Advanced Search** - Find posts, topics, and writers
- **Real-time Notifications** - Stay updated with your activity
- **Nested Comments** - Threaded comment system with replies
- **Social Interactions** - Likes, bookmarks, and follows
- **User Profiles** - Custom avatars, bios, and follower counts
- **Draft System** - Save unfinished posts

### Unique Features
- **Thought Bubbles** - Quick 280-character micro-posts with 6 mood types (Happy, Inspired, Thoughtful, Energized, Loving, Chill)
- **20 Communities** - Students, Scholars, Professionals, Coders, Writers, Artists, and more
- **20 Topics** - Lifestyle, Technology, Science, Art, Philosophy, and more
- **Collaborative Writing Spaces** - Write together in real-time
- **Post Debates** - Pit two posts against each other and vote on the best
- **Community & Topic Filters** - Find content tailored to your interests

### Design
- **Beautiful Gradient Theme** - Blue and cyan gradient design (no purple!)
- **Smooth Animations** - Hover effects and transitions throughout
- **Fully Responsive** - Works perfectly on all devices
- **Modern UI** - Clean spacing and typography

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Editor**: ReactQuill
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router v6
- **Date Formatting**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   cd aesop-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `DATABASE_SCHEMA.sql` in the Supabase SQL Editor
   - Get your project URL and anon key from Project Settings > API

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Database Schema

The application uses a comprehensive PostgreSQL schema with the following tables:

- **profiles** - User profiles with communities and topics
- **posts** - Blog posts with tags, communities, and topics
- **thought_bubbles** - Micro-posts with mood tracking
- **collaborative_spaces** - Real-time collaborative writing
- **debates** - Post debates with voting
- **comments** - Nested comment threads
- **likes** - User likes on posts and thoughts
- **bookmarks** - Saved posts
- **follows** - User following relationships
- **notifications** - Activity notifications

All tables have Row Level Security (RLS) enabled for data protection.

## Project Structure

```
aesop-blog/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── PostCard.tsx
│   │   ├── ThoughtBubbleCard.tsx
│   │   ├── CreateThoughtBubble.tsx
│   │   ├── CommentThread.tsx
│   │   └── LoadingScreen.tsx
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── FeedPage.tsx
│   │   ├── WritePage.tsx
│   │   ├── PostPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ExplorePage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── BookmarksPage.tsx
│   │   ├── CollaborativeSpacesPage.tsx
│   │   └── DebatesPage.tsx
│   ├── lib/                 # Third-party configurations
│   │   └── supabase.ts
│   ├── stores/              # State management
│   │   └── authStore.ts
│   ├── types/               # TypeScript types
│   │   └── database.ts
│   ├── utils/               # Utility functions
│   │   ├── date.ts
│   │   └── readingTime.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── DATABASE_SCHEMA.sql      # Supabase database schema
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features in Detail

### Thought Bubbles
Quick micro-posts with mood tracking:
- 6 mood types: Happy, Inspired, Thoughtful, Energized, Loving, Chill
- 280 character limit
- Beautiful gradient cards
- Can be attached to posts

### Communities
Choose from 20 communities:
🎓 Students, 📚 Scholars, 💼 Professionals, 💻 Coders, ⚙️ Engineers, 🤓 Geeks, 🛠️ Service Providers, ✍️ Writers, 🎨 Artists, 🚀 Entrepreneurs, 🏛️ Government Workers, 🎬 Entertainment, ⚕️ Healthcare, 👨‍🏫 Educators, ✨ Creatives, 🔬 Scientists, 📈 Business, 🌟 Freelancers, 🔍 Researchers, 👥 Others

### Topics
Filter by 20 topics:
🌺 Lifestyle, 📖 Educational, 🏥 Medical, ⚛️ Physics, 🌌 Cosmology, 🧪 Chemistry, 🧬 Biology, 📱 Technology, 🔌 Electrical Devices, 🤖 AI Tools, 🌍 Culture, 🌱 Environment, 🖼️ Art, 👫 Socialization, 💭 Philosophy, 🎥 Movies, 📺 TV Shows, 🗳️ Politics, 🎮 Gaming, 🔖 Others

### Collaborative Spaces
- Create public or private writing spaces
- Invite collaborators
- Real-time collaborative editing
- Track contributors

### Post Debates
- Create debates between two posts
- Community voting
- Track voting progress
- Conclude debates and declare winners

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Supabase

<!-- Build: 2025-10-27-v2 -->
