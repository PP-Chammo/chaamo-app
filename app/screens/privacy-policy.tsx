import { router } from 'expo-router';
import { WebView } from 'react-native-webview';

import { ScreenContainer } from '@/components/atoms';
import { Header, TabView } from '@/components/molecules';
import { privacyPolicyTabs } from '@/constants/tabs';

export default function PrivacyPolicyScreen() {
  return (
    <ScreenContainer>
      <Header title="Privacy Policy" onBackPress={router.back} />
      <TabView tabs={privacyPolicyTabs}>
        <WebView
          source={{ uri: 'https://chaamo.com/privacy-policy#content' }}
        />
        <WebView
          source={{ uri: 'https://chaamo.com/terms-of-service#content' }}
        />
        <WebView
          source={{
            uri: 'https://docs.google.com/document/d/11BRKuwUYs-FIB1RLvzchkIiu-HEYbY9evhX3ZBsMCpE',
          }}
        />
      </TabView>
    </ScreenContainer>
  );
}
