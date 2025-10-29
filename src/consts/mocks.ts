export const mockChats = [
  {
    id: "1",
    name: "Alex",
    avatar: "🦊",
    lastMessage: "Hey! How's it going?",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Sarah",
    avatar: "🐱",
    lastMessage: "Thanks for the transfer!",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Mike",
    avatar: "🐺",
    lastMessage: "See you tomorrow",
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "Emma",
    avatar: "🦄",
    lastMessage: "Let's catch up soon",
    unread: 0,
    online: false,
  },
];

export const mockMessages = {
  "1": [
    {
      id: "1",
      sender: "Alex",
      text: "Hey! How's it going?",
      timestamp: "10:30 AM",
      isMine: false,
    },
    {
      id: "2",
      sender: "You",
      text: "All good! Just checking the balance",
      timestamp: "10:31 AM",
      isMine: true,
    },
    {
      id: "3",
      sender: "Alex",
      text: "Nice! Want to grab lunch?",
      timestamp: "10:32 AM",
      isMine: false,
    },
  ],
  "2": [
    {
      id: "1",
      sender: "Sarah",
      text: "Got the payment, thanks!",
      timestamp: "Yesterday",
      isMine: false,
    },
    {
      id: "2",
      sender: "You",
      text: "No problem! 🎉",
      timestamp: "Yesterday",
      isMine: true,
    },
  ],
};
