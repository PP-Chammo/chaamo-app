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

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(),
  createHttpLink: jest.fn(),
  ApolloProvider: ({ children }) => children,
  useQuery: jest.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
  useMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  useLazyQuery: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  gql: jest.fn(),
  makeVar: jest.fn((initialValue) => {
    let value = initialValue;
    const getter = () => value;
    const setter = (newValue) => {
      value = newValue;
    };
    return Object.assign(getter, { set: setter });
  }),
  useReactiveVar: jest.fn((varFn) => varFn()),
}));

// Mock generated GraphQL hooks
jest.mock('@/generated/graphql', () => ({
  useGetAuctionListingsQuery: jest.fn(() => ({
    data: {
      listingsCollection: {
        edges: [
          { node: { id: '1', title: 'Auction Item 1' } },
          { node: { id: '2', title: 'Auction Item 2' } },
          { node: { id: '3', title: 'Auction Item 3' } },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useGetFeaturedListingsQuery: jest.fn(() => ({
    data: {
      featured_cardsCollection: {
        edges: [
          {
            node: {
              id: '1',
              name: 'Featured Item 1',
              image_url: 'https://example.com/image1.jpg',
              currency: '$',
              start_price: '200.00',
              listing_type: 'AUCTION',
            },
          },
          {
            node: {
              id: '2',
              name: 'Featured Item 2',
              image_url: 'https://example.com/image2.jpg',
              currency: '$',
              start_price: '150.00',
              listing_type: 'SELL',
            },
          },
          {
            node: {
              id: '3',
              name: 'Featured Item 3',
              image_url: 'https://example.com/image3.jpg',
              currency: '$',
              start_price: '300.00',
              listing_type: 'AUCTION',
            },
          },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useGetRecentlyAddedListingsQuery: jest.fn(() => ({
    data: {
      chaamo_cardsCollection: {
        edges: [
          {
            node: {
              id: '1',
              name: 'Recent Item 1',
              image_url: 'https://example.com/image1.jpg',
              currency: '$',
              start_price: '200.00',
              listing_type: 'SELL',
            },
          },
          {
            node: {
              id: '2',
              name: 'Recent Item 2',
              image_url: 'https://example.com/image2.jpg',
              currency: '$',
              start_price: '150.00',
              listing_type: 'AUCTION',
            },
          },
          {
            node: {
              id: '3',
              name: 'Recent Item 3',
              image_url: 'https://example.com/image3.jpg',
              currency: '$',
              start_price: '300.00',
              listing_type: 'SELL',
            },
          },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useGetNotificationsQuery: jest.fn(() => ({
    data: { notificationsCollection: { edges: [] } },
    loading: false,
    error: null,
  })),
  useGetProfilesQuery: jest.fn(() => ({
    data: {
      profilesCollection: {
        edges: [
          { node: { id: '1', fullname: 'John Doe' } },
          { node: { id: '2', fullname: 'Jane Smith' } },
          { node: { id: '3', fullname: 'Bob Johnson' } },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useGetFollowersQuery: jest.fn(() => ({
    data: { followersCollection: { edges: [] } },
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useGetVwFilteredProfilesQuery: jest.fn(() => ({
    data: {
      vw_filtered_profilesCollection: {
        edges: [
          {
            node: {
              id: '1',
              username: 'John Doe',
              profile_image_url: 'https://example.com/avatar1.jpg',
            },
          },
          {
            node: {
              id: '2',
              username: 'Jane Smith',
              profile_image_url: 'https://example.com/avatar2.jpg',
            },
          },
          {
            node: {
              id: '3',
              username: 'Alice Johnson',
              profile_image_url: 'https://example.com/avatar3.jpg',
            },
          },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useCreateBidsMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  useCreateOffersMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  useGetVwChaamoListingsQuery: jest.fn(() => ({
    data: {
      vw_chaamo_cardsCollection: {
        edges: [
          {
            node: {
              id: '1',
              name: 'Auction Item 1',
              image_url: 'https://example.com/image1.jpg',
              currency: '$',
              start_price: '100',
              listing_type: 'AUCTION',
            },
          },
          {
            node: {
              id: '2',
              name: 'Common Item 2',
              image_url: 'https://example.com/image2.jpg',
              currency: '$',
              price: '200',
              listing_type: 'SELL',
            },
          },
          {
            node: {
              id: '3',
              name: 'Common Item 3',
              image_url: 'https://example.com/image3.jpg',
              currency: '$',
              price: '300',
              listing_type: 'SELL',
            },
          },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useGetVwFeaturedListingsQuery: jest.fn(() => ({
    data: {
      vw_featured_cardsCollection: {
        edges: [
          {
            node: {
              id: '1',
              name: 'Featured Item 1',
              image_url: 'https://example.com/image1.jpg',
              currency: '$',
              price: '100',
              listing_type: 'SELL',
            },
          },
          {
            node: {
              id: '2',
              name: 'Featured Item 2',
              image_url: 'https://example.com/image2.jpg',
              currency: '$',
              start_price: '200',
              listing_type: 'AUCTION',
            },
          },
          {
            node: {
              id: '3',
              name: 'Featured Item 3',
              image_url: 'https://example.com/image3.jpg',
              currency: '$',
              price: '300',
              listing_type: 'SELL',
            },
          },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useCreateFollowersMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  useRemoveFollowersMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  useGetFavoritesQuery: jest.fn(() => ({
    data: {
      favorite_listingsCollection: {
        edges: [
          {
            node: {
              id: '1',
              listing_id: '1',
              user_id: 'test-user-id',
            },
          },
        ],
      },
    },
    loading: false,
    error: null,
  })),
  useInsertFavoritesMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  useRemoveFavoritesMutation: jest.fn(() => [
    jest.fn(),
    { loading: false, error: null, data: null },
  ]),
  ListingType: {
    AUCTION: 'AUCTION',
    SELL: 'SELL',
    EBAY: 'EBAY',
    PORTFOLIO: 'PORTFOLIO',
  },
  UserTier: {
    FREE: 'free',
    GOLD: 'gold',
  },
  CardCondition: {
    RAW: 'RAW',
    GRADED: 'GRADED',
  },
}));

// Mock hooks with reactive behavior
jest.mock('@/hooks/useAuthVar', () => ({
  useAuthVar: jest.fn(() => {
    const mockAuthState = { isAuthenticated: false };
    const mockSetAuthVar = jest.fn((value) => {
      if ('signIn' in value && value.signIn) {
        mockAuthState.isAuthenticated = true;
        // Mock router.replace call
        const router = require('expo-router');
        router.router.replace('/(tabs)/home');
      } else if ('signOut' in value && value.signOut) {
        mockAuthState.isAuthenticated = false;
        // Mock router.replace call
        const router = require('expo-router');
        router.router.replace('/(auth)/sign-in');
      } else {
        Object.assign(mockAuthState, value);
      }
    });
    return [mockAuthState, mockSetAuthVar];
  }),
}));

jest.mock('@/hooks/useSearchVar', () => ({
  useSearchVar: jest.fn(() => {
    const mockSearchState = {
      query: '',
      location: '',
      priceRange: '',
      condition: '',
      adProperties: '',
    };
    const mockSetSearchVar = jest.fn((value) => {
      Object.assign(mockSearchState, value);
    });
    return [mockSearchState, mockSetSearchVar];
  }),
}));

jest.mock('@/hooks/useImageCapturedVar', () => ({
  useImageCapturedVar: jest.fn(() => {
    const mockImageState = {
      uri: '',
      height: 0,
      width: 0,
    };
    const mockSetImageVar = jest.fn((value) => {
      Object.assign(mockImageState, value);
      // Mock router.push call
      const router = require('expo-router');
      router.router.push('/(setup-profile)/(upload-identity)/id-card-captured');
    });
    return [mockImageState, mockSetImageVar];
  }),
}));

jest.mock('@/hooks/useUserVar', () => ({
  useUserVar: jest.fn(() => [
    {
      id: 'test-user-id',
      fullname: 'Shireen',
      user_metadata: { name: 'Shireen' },
      email: 'shireen@example.com',
    },
    jest.fn(),
  ]),
}));

jest.mock('@/hooks/useStorage', () => ({
  useStorage: jest.fn(() => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  })),
}));

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
