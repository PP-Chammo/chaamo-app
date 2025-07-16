# Chaamo App

A modern, modular, and scalable mobile app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev), following the [Atomic Design Pattern](https://bradfrost.com/blog/post/atomic-web-design/) for UI components.

---

## 🚀 Project Overview

Chaamo is a feature-rich mobile application designed for seamless user experience and maintainable code. It leverages Expo, React Native, and a modular component architecture to deliver a robust and extensible platform.

---

## ✨ Features

- Atomic Design: Atoms, Molecules, Organisms for reusable UI
- File-based routing with Expo Router
- State management with Zustand
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- Modular, scalable folder structure
- Ready for CI/CD and code quality automation

---

## 🛠️ Tech Stack

- **React Native** (0.79.4) & **Expo** (53.x)
- **TypeScript**
- **Zustand** (state management)
- **Tailwind CSS** (via NativeWind)
- **Expo Router** (file-based navigation)
- **Jest** (recommended for testing)
- **ESLint** & **Prettier** (linting/formatting)

---

## 📁 Folder Structure

- `app/` — Screens, navigation, and routing
- `components/`
  - `atoms/` — Smallest UI elements (Button, Icon, etc.)
  - `molecules/` — Combinations of atoms (Card, InputGroup, etc.)
  - `organisms/` — Complex UI sections (Lists, Forms, etc.)
- `constants/` — App-wide constants
- `domains/` — Type definitions and domain models
- `hooks/` — Custom React hooks
- `stores/` — Zustand stores for state management
- `utils/` — Utility functions
- `assets/` — Images, fonts, SVGs
- `scripts/` — Project scripts (e.g., reset-project)

---

## ⚡ Getting Started

1. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```
2. **Start the app**
   ```bash
   yarn start
   # or
   npx expo start
   ```
3. **Open in simulator or device**
   - Android: `yarn android`
   - iOS: `yarn ios`
   - Web: `yarn web`

---

## 🛰️ GraphQL & Apollo Client (Supabase)

This project supports Supabase GraphQL with Apollo Client and automatic type-safe hooks via GraphQL Code Generator.

### Environment Variables

Add these to your `.env` (not committed):

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_SUPABASE_GRAPHQL_URL=https://your-project-ref.supabase.co/graphql/v1
```

### Apollo Client Setup

Apollo Client is pre-installed. Use `EXPO_PUBLIC_SUPABASE_GRAPHQL_URL` as the endpoint:

```ts
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.EXPO_PUBLIC_SUPABASE_GRAPHQL_URL,
  cache: new InMemoryCache(),
  headers: {
    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  },
});

// Wrap your app with ApolloProvider
```

### GraphQL Codegen

- Place your `.graphql` queries/mutations in `src/`.
- Run `yarn codegen` to generate type-safe hooks and types in `types/graphql.ts`.
- Hooks are auto-generated for each operation (e.g., `useGetUsersQuery`).

### Example Usage

```ts
import { useGetUsersQuery } from '@/types/graphql';

const { data, loading, error } = useGetUsersQuery();
```

---

## 📝 Scripts

- `yarn start` — Start Expo development server
- `yarn android` / `yarn ios` / `yarn web` — Run on device/emulator/web
- `yarn lint` — Run ESLint
- `yarn lint:fix` — Auto-fix lint issues
- `yarn prettier` — Check code formatting
- `yarn prettier:fix` — Auto-format code
- `yarn tsc` — TypeScript type check
- `yarn reset-project` — Reset app to blank state

---

## 🧩 Components & Screens

- **Atoms:** Avatar, Badge, Button, Icon, Label, Tag, etc.
- **Molecules:** AuctionCard, CardItem, Category, Checkbox, OtpInput, People, etc.
- **Organisms:** AuctionList, CategoryList, FeaturedList, PeopleList, PortfolioProfile, etc.
- **Screens:** Auction Detail, Blocked Accounts, Categories, Portfolio Value, Search, Product List, Public Profile, Settings, Onboarding, etc.

> See the `components/` and `app/screens/` folders for full lists and code.

---

## 🗂️ State Management

- Uses [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) for global state.
- Stores are in `stores/`.

---

## 🎨 Styling

- Utility-first styling with [Tailwind CSS](https://tailwindcss.com/) via [NativeWind](https://www.nativewind.dev/).
- Global styles in `global.css`.

---

## 🧪 Linting, Formatting & Testing

### Linting & Formatting

- **Lint:** `yarn lint` (auto-fix: `yarn lint:fix`)
- **Format:** `yarn prettier` (auto-fix: `yarn prettier:fix`)
- **Type Check:** `yarn tsc`

### Testing

Unit tests are already set up using [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/). All required dependencies are pre-installed and configured.

#### How to Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

- Test files are located in `__tests__` folders next to their respective modules (e.g., `components/atoms/__tests__/Button.test.tsx`, `hooks/__tests__/useAuthStore.test.ts`).
- Coverage thresholds are enforced at 90% for branches, functions, lines, and statements (see `jest.config.js`).
- The test structure covers components, hooks, utils, and stores, with a focus on behavior, edge cases, and error handling.
- For advanced patterns, troubleshooting, and best practices, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

#### Example Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../../components/atoms/Button';

describe('Button', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing Best Practices

- Test behavior, not implementation
- Use meaningful test descriptions
- Mock external dependencies
- Test error states and edge cases
- Keep tests simple and focused

For more, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

---

## 🔄 CI/CD

- Recommended: [GitHub Actions](https://github.com/features/actions) for automated lint, type check, prettier, and tests on every PR.
- Example workflow in `.github/workflows/` (add back if deleted).

---

## 🤝 Contributing

1. Fork the repo and create your branch from `main` or `develop`.
2. Run `yarn lint` and `yarn prettier` before committing.
3. Add/Update tests for your changes.
4. Open a Pull Request with a clear description.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://docs.pmnd.rs/zustand/)
