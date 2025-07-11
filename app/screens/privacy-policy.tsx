import { router } from 'expo-router';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Label, ScreenContainer } from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer>
      <Header title="Privacy Policy" onBackPress={router.back} />
      <TabView tabs={['Privacy Policy', 'Terms of Service', 'HMRC Guidelines']}>
        <WebView
          source={{ uri: 'https://chaamo.com/privacy-policy#content' }}
        />
        <WebView
          source={{ uri: 'https://chaamo.com/terms-of-service#content' }}
        />
        <View>
          <Label>HMRC Guidelines</Label>
        </View>
      </TabView>
    </ScreenContainer>
  );
}
