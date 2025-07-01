import { Redirect } from 'expo-router';

export default function StartPage() {
  return <Redirect href="/(setup-profile)/(id-verification)/id-verification" />;
}
