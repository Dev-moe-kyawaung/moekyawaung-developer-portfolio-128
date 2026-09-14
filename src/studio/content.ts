export const OWNER = {
  name: 'Moe Kyaw Aung',
  role: 'Senior Android Developer',
  avatar: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778527878/IMG_20260430_053105_uef0yr.png',
  bio: 'https://pastebin.com/mQF1iP5P',
  github: 'https://github.com/Dev-moe-kyawaung/',
  gravatar: 'https://gravatar.com/moekyawaung2026',
  linkedin: 'https://www.linkedin.com/in/moe-kyaw-aung-2653093a1',
  email: 'moekyawaung@engineer.com',
  phone: '+95 9 889 000 889',
  alternatePhone: '+95 9 666 000 050',
};

export type ModuleCategory = 'Android' | 'Web / PWA' | 'Games';
export type ModuleVisual = 'media' | 'dashboard' | 'pos' | 'web' | 'games' | 'weather';
export interface Module {
  id: string;
  name: string;
  category: ModuleCategory;
  visual: ModuleVisual;
  description: string;
  repository: string;
  tags: string[];
  accent: string;
  objective: string;
  decisions: string[];
  targets: { label: string; value: number; unit: string; max: number }[];
}

// Repositories come from the supplied bio. Performance values below are
// explicitly design targets, not telemetry or claims about those repositories.
export const MODULES: Module[] = [
  {
    id: 'video-player', name: 'Video Player', category: 'Android', visual: 'media',
    repository: 'https://github.com/moekyawaung-tech/video-player',
    description: 'A focused media experience. Smooth playback, clear controls, and nothing between you and the content.',
    tags: ['Media', 'Playback', 'Mobile'], accent: '#ba77ff',
    objective: 'Keep playback responsive while media loading, navigation, and user input happen concurrently.',
    decisions: ['Separate player lifecycle from the screen lifecycle.', 'Model loading, playback, and failure as explicit states.', 'Test playback interruption and recovery on a real device.'],
    targets: [{ label: 'Frame rate', value: 60, unit: 'fps', max: 60 }, { label: 'Frame budget', value: 16.7, unit: 'ms', max: 33.4 }],
  },
  {
    id: 'social-dashboard', name: 'Social Dashboard', category: 'Web / PWA', visual: 'dashboard',
    repository: 'https://github.com/moekyawaung-tech/social-dashboard',
    description: 'Complex information, made clear. An at-a-glance workspace for the signals that actually matter.',
    tags: ['Analytics', 'Data UI', 'Dashboard'], accent: '#6bd4f1',
    objective: 'Make frequently changing data readable without interrupting exploration or causing unnecessary screen updates.',
    decisions: ['Keep view state independent from network response models.', 'Render cached content before refreshing remote data.', 'Limit redraws to the chart or module that changed.'],
    targets: [{ label: 'UI response', value: 100, unit: 'ms', max: 200 }, { label: 'Frame rate', value: 60, unit: 'fps', max: 60 }],
  },
  {
    id: 'pos-ultimate-pro-max', name: 'POS Ultimate', category: 'Android', visual: 'pos',
    repository: 'https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max',
    description: 'A practical point-of-sale workspace. Products, transactions, and daily operations in one place.',
    tags: ['Commerce', 'Inventory', 'POS'], accent: '#faac70',
    objective: 'Treat transaction integrity as the first requirement, even when connectivity is unreliable.',
    decisions: ['Use atomic local transactions for related inventory changes.', 'Give retried operations a stable idempotency key.', 'Keep price calculation separate from presentation logic.'],
    targets: [{ label: 'Input response', value: 100, unit: 'ms', max: 200 }, { label: 'Frame rate', value: 60, unit: 'fps', max: 60 }],
  },
  {
    id: 'pwa-app', name: 'PWA App', category: 'Web / PWA', visual: 'web',
    repository: 'https://github.com/moekyawaung-tech/pwa-app',
    description: 'The reach of the web with an app-like feel. A lightweight, installable experience for everyday use.',
    tags: ['PWA', 'Web', 'Responsive'], accent: '#f277ad',
    objective: 'Deliver a useful first interaction without requiring an app-store installation.',
    decisions: ['Separate the app shell cache from frequently changing data.', 'Offer a clear offline state instead of an indefinite spinner.', 'Make controls work with keyboard, touch, and pointer.'],
    targets: [{ label: 'Interaction', value: 200, unit: 'ms', max: 400 }, { label: 'LCP budget', value: 2.5, unit: 's', max: 5 }],
  },
  {
    id: 'game-collection', name: 'Game Collection', category: 'Games', visual: 'games',
    repository: 'https://github.com/moekyawaung-tech/game-collection',
    description: 'Small worlds, carefully built. Arcade experiments exploring responsive input and playful interaction.',
    tags: ['Arcade', 'Game loop', 'Experiments'], accent: '#9ccd88',
    objective: 'Keep input and game state predictable across different frame rates and screen sizes.',
    decisions: ['Advance simulation from elapsed time, not frame count.', 'Keep the game state serializable for restart and replay.', 'Pause work when the page is hidden or the game is inactive.'],
    targets: [{ label: 'Frame rate', value: 60, unit: 'fps', max: 60 }, { label: 'Frame budget', value: 16.7, unit: 'ms', max: 33.4 }],
  },
  {
    id: 'weather-app', name: 'Weather App', category: 'Android', visual: 'weather',
    repository: 'https://github.com/moekyawaung-tech/Weather-app',
    description: 'A calmer way to check the forecast. Useful information, considered hierarchy, and a little atmosphere.',
    tags: ['Weather', 'APIs', 'Mobile'], accent: '#85adef',
    objective: 'Show a useful forecast quickly while being honest about location access and data freshness.',
    decisions: ['Show the timestamp of cached data so stale information is clear.', 'Allow manual location selection without permission prompts.', 'Keep formatting and unit conversion outside network code.'],
    targets: [{ label: 'UI response', value: 100, unit: 'ms', max: 200 }, { label: 'Frame rate', value: 60, unit: 'fps', max: 60 }],
  },
];

export const MORE_REPOS = [
  ['Job Portal App', 'https://github.com/moekyawaung-tech/Job-Portal-App'],
  ['Daily Planner', 'https://github.com/moekyawaung-tech/Daily-planner-app'],
  ['Lens Lite', 'https://github.com/moekyawaung-tech/Lens-lite'],
  ['Thailand Travel', 'https://github.com/moekyawaung-tech/thailand-travel'],
  ['Snake Game', 'https://github.com/moekyawaung-tech/Snake-Game-App'],
  ['JavaScript Todo', 'https://github.com/moekyawaung-tech/javascript-todo'],
  ['Hospital Lists', 'https://github.com/Moekyawaung-cyber/Hospital-Lists'],
  ['Myanmar Postcodes', 'https://github.com/Moekyawaung-cyber/My_postcode-My-web_project'],
];

export const EXPERTISE = [
  { id: '01', title: 'Native, by design.', description: 'Android experiences with a platform-first feel and a maintainable foundation.', tags: 'Kotlin / Jetpack Compose / Material 3', icon: 'mobile' },
  { id: '02', title: 'Architecture that lasts.', description: 'Clear boundaries. Predictable state. Code a team can confidently build on.', tags: 'MVVM / Clean Architecture / KMP', icon: 'layers' },
  { id: '03', title: 'Connected. Resilient.', description: 'APIs and local persistence that remain useful beyond the perfect connection.', tags: 'Firebase / REST APIs / Room', icon: 'network' },
  { id: '04', title: 'Intelligence, considered.', description: 'Exploring AI experiences with practical privacy and performance constraints.', tags: 'On-device ML / TFLite / Claude API', icon: 'ai' },
];