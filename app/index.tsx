import { Redirect } from 'expo-router';

export default function StartPage() {
  return <Redirect href="/(setup-profile)/(upload-identity)/proof-identity" />;
}
