/* eslint-disable no-undef */

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Link: 'Link',
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'http://localhost:3000',
    },
  },
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('expo-camera', () => ({
  Camera: 'Camera',
  CameraType: {
    front: 'front',
    back: 'back',
  },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Circle: 'Circle',
  Ellipse: 'Ellipse',
  G: 'G',
  Text: 'Text',
  TSpan: 'TSpan',
  TextPath: 'TextPath',
  Path: 'Path',
  Polygon: 'Polygon',
  Line: 'Line',
  Rect: 'Rect',
  Use: 'Use',
  Image: 'Image',
  Symbol: 'Symbol',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
  ClipPath: 'ClipPath',
}));

jest.mock('react-native-svg-charts', () => ({
  LineChart: 'LineChart',
  AreaChart: 'AreaChart',
  BarChart: 'BarChart',
  PieChart: 'PieChart',
}));

jest.mock('react-native-phone-number-input', () => 'PhoneInput');

jest.mock('react-native-otp-entry', () => ({
  OtpInput: 'OtpInput',
}));

jest.mock(
  'react-native-keyboard-aware-scroll-view',
  () => 'KeyboardAwareScrollView',
);

jest.mock('react-native-pager-view', () => 'PagerView');

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');

  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    TouchableHighlight: TouchableOpacity,
    TouchableNativeFeedback: TouchableOpacity,
    TouchableOpacity: TouchableOpacity,
    TouchableWithoutFeedback: TouchableOpacity,
    TouchableBounce: TouchableOpacity,
    Touchable: TouchableOpacity,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((component) => component),
    Directions: {},
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaView: 'SafeAreaView',
}));

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: 'Screen',
  ScreenContainer: 'ScreenContainer',
}));

jest.mock('react-native-webview', () => 'WebView');

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
  FontAwesome: 'FontAwesome',
  FontAwesome5: 'FontAwesome5',
  FontAwesome6: 'FontAwesome6',
  AntDesign: 'AntDesign',
  Feather: 'Feather',
  Entypo: 'Entypo',
  EvilIcons: 'EvilIcons',
  Foundation: 'Foundation',
  Octicons: 'Octicons',
  SimpleLineIcons: 'SimpleLineIcons',
  Zocial: 'Zocial',
}));

jest.mock('nativewind', () => ({
  cssInterop: jest.fn((component) => component),
  styled: (Component) => Component,
}));

jest.mock('react-native-css-interop', () => ({
  cssInterop: jest.fn((component) => component),
}));

jest.mock('@/assets/svg/ebay.svg', () => 'EBayLogo');
jest.mock('@/assets/svg/boost.svg', () => 'BoostIcon');
jest.mock('@/assets/svg/id-verification.svg', () => 'IdVerificationIcon');
jest.mock('@/assets/svg/otp-success.svg', () => 'OtpSuccessIcon');
jest.mock(
  '@/assets/svg/verification-failed.svg',
  () => 'VerificationFailedIcon',
);
jest.mock(
  '@/assets/svg/verification-in-progress.svg',
  () => 'VerificationInProgressIcon',
);

jest.mock('@/assets/svg/categories/dc.svg', () => 'DcIcon');
jest.mock('@/assets/svg/categories/digimon.svg', () => 'DigimonIcon');
jest.mock('@/assets/svg/categories/fortnite.svg', () => 'FortniteIcon');
jest.mock('@/assets/svg/categories/futera.svg', () => 'FuteraIcon');
jest.mock(
  '@/assets/svg/categories/garbage-pail-kids.svg',
  () => 'GarbagePailKidsIcon',
);
jest.mock(
  '@/assets/svg/categories/magic-the-gathering.svg',
  () => 'MagicTheGatheringIcon',
);
jest.mock('@/assets/svg/categories/marvel.svg', () => 'MarvelIcon');
jest.mock('@/assets/svg/categories/meta-zoo.svg', () => 'MetaZooIcon');
jest.mock('@/assets/svg/categories/panini.svg', () => 'PaniniIcon');
jest.mock('@/assets/svg/categories/pokemon.svg', () => 'PokemonIcon');
jest.mock('@/assets/svg/categories/poker.svg', () => 'PokerIcon');
jest.mock('@/assets/svg/categories/topps.svg', () => 'ToppsIcon');
jest.mock('@/assets/svg/categories/wrestling.svg', () => 'WrestlingIcon');
jest.mock('@/assets/svg/categories/yugioh.svg', () => 'YugiohIcon');

jest.mock('d3-shape', () => ({
  line: () => ({
    x: () => ({}),
    y: () => ({}),
  }),
  area: () => ({
    x: () => ({}),
    y0: () => ({}),
    y1: () => ({}),
  }),
}));

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to') &&
      args[0].includes('inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
