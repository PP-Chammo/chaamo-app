export const dummyFeaturedCardList = [
  {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Elly De La Cruz 1',
    currentPrice: '$200.00',
    bidPrice: '$70.00',
    market: 'eBay',
    indicator: 'down',
    boosted: true,
  },
  {
    id: '2',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Elly De La Cruz 2',
    currentPrice: '$200.00',
    bidPrice: '$70.00',
    market: 'eBay',
    indicator: 'up',
    boosted: false,
  },
  {
    id: '3',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Elly De La Cruz 3',
    currentPrice: '$200.00',
    bidPrice: '$70.00',
    market: 'eBay',
    indicator: 'down',
    boosted: false,
  },
];

export const dummyAuctionCardList = [
  {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Elly De La Cruz 1',
    price: '$200.00',
  },
  {
    id: '2',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Elly De La Cruz 2',
    price: '$200.00',
  },
  {
    id: '3',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Elly De La Cruz 3',
    price: '$200.00',
  },
];

export const dummyDiscoverPeopleList = [
  {
    id: '1',
    fullname: 'John Doe',
    imageUrl: 'https://dummyimage.com/600x400/000/fff',
  },
  {
    id: '2',
    fullname: 'Jane Smith',
    imageUrl: 'https://example.com/image2.jpg',
  },
  {
    id: '3',
    fullname: 'Alice Johnson',
    imageUrl: 'https://example.com/image3.jpg',
  },
];

export const COUNTRIES = [
  'USA',
  'India',
  'Canada',
  'Australia',
  'China',
  'Pakistan',
];

export const STATES = ['USD', 'Euro', 'Pound', 'PKR', 'CAD', 'AUD'];

export const dummyEvents = [
  {
    title: 'The London Card Show',
    date: '2 Nov 2025',
    location: 'TBA',
    image: undefined,
    // image: require('@/assets/events/london-card-show.png'),
  },
  {
    title: 'Card Con',
    date: '29 March 2025',
    location: 'TBA',
    image: undefined,
    // image: require('@/assets/events/card-con.png'),a
  },
  {
    title: 'The London Show',
    date: '30 March 2025',
    location: 'TBA',
    image: undefined,
    // image: require('@/assets/events/card-con.png'),a
  },
];

export const dummyPosts = [
  {
    id: 1,
    user_id: 1,
    user: {
      name: 'Shireen Walker',
    },
    date: '2025-05-03',
    image: 'https://cdn.chaamo.com/card1.jpg',
    text: 'Super excited, just bought a few Merlin Blasterz boxes and managed to pack and auto /50 🎉🎉',
    comments: 2,
    likes: 5,
  },
  {
    id: 2,
    user_id: 1,
    user: {
      name: 'Shireen Walker',
    },
    date: '2025-03-04',
    text: "I'm wondering if anyone can help me out , I want to send a few cards off too get graded, which I will then look to sell, where is the best place to send?",
    comments: 1,
    likes: 2,
  },
  {
    id: 3,
    user_id: 1,
    user: {
      name: 'Shireen Walker',
    },
    date: '2025-02-03',
    text: 'Looking at heading to the London Card Show, is anyone attending? Be great to meet up and say hi👋',
    comments: 0,
    likes: 1,
  },
  {
    id: 4,
    user_id: 1,
    user: {
      name: 'Shireen Walker',
    },
    date: '2025-01-01',
    image: 'https://cdn.chaamo.com/card2.jpg',
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. See more...",
    comments: 3,
    likes: 4,
  },
];

export const dummyChatList = [
  {
    id: 1,
    name: 'John Doe',
    message: 'Hello, how are you?',
    time: '2025-07-08T12:00:00Z',
    unreadCount: 5,
    imageUrl: '',
  },
  {
    id: 2,
    name: 'Jane Smith',
    message: 'Hello, how are you?',
    time: '2025-07-07T14:30:00Z',
    unreadCount: 0,
    imageUrl: '',
  },
];

export const dummyChatMessages = [
  {
    id: 1,
    message: 'Hey! How are you doing?',
    time: '2025-01-15T09:30:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 2,
    message: "Hi Shireen! I'm doing great, thanks for asking. How about you?",
    time: '2025-01-15T09:32:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 3,
    message:
      'Pretty good! Just got back from the card show. Found some amazing deals!',
    time: '2025-01-15T09:35:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 4,
    message: 'That sounds awesome! What did you pick up?',
    time: '2025-01-15T09:37:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 5,
    message:
      'Got a few Pokemon cards and some vintage baseball cards. The prices were incredible!',
    time: '2025-01-15T09:40:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 6,
    message: "Nice! Any specific cards you're excited about?",
    time: '2025-01-15T09:42:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 7,
    message:
      "Yeah! Found a Charizard in really good condition for only $50. Couldn't believe it!",
    time: '2025-01-15T09:45:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 8,
    message: "Wow, that's a steal! You should definitely get it graded.",
    time: '2025-01-15T09:47:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 9,
    message:
      "That's exactly what I was thinking! Planning to send it off next week.",
    time: '2025-01-15T09:50:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 10,
    message:
      'Perfect timing! I heard PSA is running a special promotion this month.',
    time: '2025-01-15T09:52:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 11,
    message: "Really? I'll have to check that out. Thanks for the tip!",
    time: '2025-01-15T09:55:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 12,
    message: 'No problem! Let me know how the grading goes.',
    time: '2025-01-15T09:57:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 13,
    message:
      'Will do! By the way, are you going to the London Card Show next month?',
    time: '2025-01-15T10:00:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 14,
    message: "I'm thinking about it! Have you been before?",
    time: '2025-01-15T10:03:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 15,
    message:
      "Yes, it's fantastic! Great vendors and amazing deals. You should definitely come!",
    time: '2025-01-15T10:05:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 16,
    message: 'Sounds like a plan! Maybe we can meet up there.',
    time: '2025-01-15T10:08:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 17,
    message: "Absolutely! That would be great. I'll send you the details.",
    time: '2025-01-15T10:10:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 18,
    message: 'Perfect! Looking forward to it.',
    time: '2025-01-15T10:12:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 19,
    message: 'Same here! Talk to you later!',
    time: '2025-01-15T10:15:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 111,
    message: 'Same here! Talk to you later!',
    time: '2025-01-15T10:15:00Z',
    sender: 'Shireen Walker',
    receiver: 'John Doe',
  },
  {
    id: 20,
    message: 'Okay! 👋',
    time: '2025-01-15T10:16:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
  {
    id: 21,
    message: 'Take care! 👋',
    time: '2025-01-15T10:16:00Z',
    sender: 'John Doe',
    receiver: 'Shireen Walker',
  },
];

export const dummyNotifications = [
  {
    id: 1,
    category: 'Order Shipped',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-06-10T09:00:00Z',
  },
  {
    id: 2,
    category: 'New Bid',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-06-10T10:00:00Z',
  },
  {
    id: 3,
    category: 'Bid Ending',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-06-10T11:00:00Z',
  },
  {
    id: 4,
    category: 'New Bid',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-06-09T15:00:00Z',
  },
  {
    id: 5,
    category: 'Order Shipped',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-06-09T16:00:00Z',
  },
  {
    id: 6,
    category: 'Bid Ending',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-06-08T18:00:00Z',
  },
  {
    id: 7,
    category: 'Bid Ending',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-07-07T18:00:00Z',
  },
  {
    id: 8,
    category: 'Bid Ending',
    message:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    date: '2025-07-08T06:00:00Z',
  },
];
