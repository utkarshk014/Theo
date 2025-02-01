import { IoBookOutline, IoBook } from "react-icons/io5";
import { BsChatLeft, BsChatLeftFill } from "react-icons/bs";
import { FaLock } from "react-icons/fa";
import { Chapter } from "./api";

export const items = [
  {
    title: "Chat",
    url: "/",
    icon: BsChatLeft,
    activeIcon: BsChatLeftFill,
    lock: FaLock,
  },
  {
    title: "Chapters",
    url: "/chapters",
    icon: IoBookOutline,
    activeIcon: IoBook,
    lock: FaLock,
  },
];

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Stock Market Basics",
    description:
      "Your first step into the exciting world of stock markets. Think of this as learning the basic rules of cricket before stepping onto the field.",
    order: 1,
    subtopics: [
      {
        id: 1,
        title: "What is a Stock Market?",
        order: 1,
        content:
          "Let me explain the stock market in cricket terms! Just like how a cricket stadium is a place where teams come to play matches, the stock market is a place where companies and investors meet to trade shares.\n\nWhen I first started, I thought the stock market was just about buying low and selling high. But it's so much more - it's about becoming a partial owner of great businesses.\n\nPicture this: When you buy shares of a company, it's like becoming a tiny part-owner of that team. Just as cricket teams perform well or poorly in different seasons, companies' stock prices go up and down based on their performance and market conditions.\n\nKey points to remember:\n1. Stock market is a regulated marketplace for buying and selling shares\n2. Shares represent ownership in companies\n3. Prices change based on company performance and market sentiment\n4. Trading happens through registered brokers (think of them as your team managers)",
      },
      {
        id: 2,
        title: "Understanding Share Prices",
        order: 2,
        content:
          "Let me share my first trading experience! I bought TCS shares thinking tech stocks only go up! That's when I learned about what actually drives share prices.\n\nThink of share prices like a cricket team's performance rating. Just as a team's rating depends on their wins, player performance, and overall strategy, a company's share price depends on:\n\n1. Company Performance (like team performance):\n   - Profits (runs scored)\n   - Growth (win rate)\n   - Market position (rankings)\n\n2. Market Factors (like pitch conditions):\n   - Economic conditions\n   - Industry trends\n   - Global events\n\nI once panicked when my first stock dropped 5% in a day. Now I know that daily fluctuations are normal - just like how even the best cricket teams don't win every match.",
      },
      {
        id: 3,
        title: "Types of Market Players",
        order: 3,
        content:
          "Just like cricket has batsmen, bowlers, and all-rounders, the stock market has different types of players. Let me share what I learned about each one!\n\n1. Investors (Test Match Players):\n   - Focus on long-term growth\n   - Study company fundamentals\n   - Stay calm during market volatility\n\n2. Traders (T20 Players):\n   - Quick moves for short-term profits\n   - Use technical analysis\n   - Higher risk, higher potential returns\n\n3. Market Makers (Support Staff):\n   - Provide market liquidity\n   - Help in price discovery\n   - Essential for market functioning\n\nI started as a T20-style trader but realized I was better suited to be a Test match-style investor. It's crucial to know your playing style!",
      },
      {
        id: 4,
        title: "Basic Market Terms",
        order: 4,
        content:
          'Let me decode the stock market language for you! Just like cricket has its own terminology (googly, yorker, cover drive), the stock market has its unique terms.\n\nWhen I started, I felt lost when my first broker talked about "bull markets" and "bear markets". Here\'s what you need to know:\n\n1. Bull Market: When markets are rising (like a bull charging upward)\n   Think of it as a winning streak in cricket!\n\n2. Bear Market: When markets are falling (like a bear swiping down)\n   Similar to a losing streak, but remember - even great teams have rough patches\n\n3. Volume: Number of shares traded\n   Like match attendance - higher volume usually means more significant price movements\n\n4. Market Cap: Total value of a company\'s shares\n   Think of it as a team\'s overall ranking and importance in the league',
      },
      {
        id: 5,
        title: "Getting Started With Trading",
        order: 5,
        content:
          "Time to pad up and get ready for your first trade! Let me share what I wish someone had told me when I started.\n\nMy first trade was a mess - I didn't even know how to place an order properly. Here's your essential starter kit:\n\n1. Choose a Reliable Broker:\n   - Like picking the right cricket academy\n   - Look for good customer service\n   - Check for reasonable brokerage fees\n\n2. Start with Small Amounts:\n   - Like practicing in the nets before a match\n   - Begin with well-known, stable companies\n   - Don't invest money you can't afford to lose\n\n3. Use Basic Order Types:\n   - Market Order: Buy/sell at current price\n   - Limit Order: Set your price (like declaring a target score)\n\nRemember: Just like in cricket, in the stock market, defense is as important as offense!",
      },
    ],
    progress: 0,
  },
  {
    id: 2,
    title: "Technical Analysis Fundamentals",
    description:
      "Learn to read the market's scorecard! Technical analysis is like studying pitch conditions and player statistics to make better decisions.",
    order: 2,
    subtopics: [
      {
        id: 6,
        title: "Introduction to Charts",
        order: 1,
        content:
          "Let's dive into the world of charts! Think of stock charts as your market pitch report - they tell you about conditions before you start playing.\n\nI remember staring at my first candlestick chart like it was alien technology. Now I'll help you decode it:\n\n1. Types of Charts:\n   - Line Charts: Simple trajectory (like a ball's path)\n   - Candlestick Charts: More detailed price movement\n   - Bar Charts: Another way to view price action\n\n2. Time Frames:\n   - Intraday: Ball-by-ball commentary\n   - Daily: Match-by-match analysis\n   - Weekly/Monthly: Season performance\n\nRemember: Charts are just tools to visualize price movement and identify patterns!",
      },
      {
        id: 7,
        title: "Price Patterns",
        order: 2,
        content:
          "Just like how certain cricket shots are played in specific situations, price patterns help us identify potential market movements.\n\nI once missed a clear double-top pattern and it taught me an important lesson. Here are the key patterns to watch for:\n\n1. Trend Patterns:\n   - Uptrend: Higher highs (like increasing run rates)\n   - Downtrend: Lower lows (like falling wickets)\n   - Sideways: Consolidation (like a steady middle-overs phase)\n\n2. Reversal Patterns:\n   - Double Top/Bottom\n   - Head and Shoulders\n   - Rounding Bottom\n\nThink of these patterns as reading the game - they help predict what might happen next!",
      },
      {
        id: 8,
        title: "Support and Resistance",
        order: 3,
        content:
          "This is like knowing the par score on a pitch! Support and resistance levels are crucial price points where the market tends to pause or reverse.\n\nA mentor showed me how powerful these levels can be, and it completely changed my trading approach. Here's what you need to know:\n\n1. Support:\n   - Price level where buying interest appears\n   - Like a team's minimum defendable score\n   - Often previous lows or round numbers\n\n2. Resistance:\n   - Price level where selling pressure comes in\n   - Like a chase target that's hard to achieve\n   - Previous highs or psychological levels\n\nThe more times a level is tested, the more significant it becomes!",
      },
      {
        id: 9,
        title: "Moving Averages",
        order: 4,
        content:
          "Moving averages are like your team's running average - they help smooth out daily fluctuations to show the bigger picture.\n\nThe power of the 200-day moving average changed my trading game forever. It's like the Duckworth-Lewis method - it helps you understand the true trend!\n\n1. Types of Moving Averages:\n   - Simple Moving Average (SMA)\n   - Exponential Moving Average (EMA)\n   - Weighted Moving Average (WMA)\n\n2. Popular Periods:\n   - 20-day: Short-term trend\n   - 50-day: Intermediate trend\n   - 200-day: Long-term trend\n\nRemember: Moving averages work best in trending markets, just like how batting averages matter more in longer formats!",
      },
      {
        id: 10,
        title: "Volume Analysis",
        order: 5,
        content:
          "Volume is like crowd attendance in cricket - it tells you how much interest there is in the game! Let me show you why it's crucial.\n\nI once bought a stock breaking out to new highs without checking volume - that was an expensive lesson! Here's what to watch for:\n\n1. Volume Basics:\n   - High volume confirms trends\n   - Low volume suggests weak moves\n   - Volume spikes indicate significant events\n\n2. Volume Patterns:\n   - Rising prices + rising volume = strong uptrend\n   - Rising prices + falling volume = potential reversal\n   - Volume before price (like crowd noise before a wicket!)\n\nAlways remember: Price moves are more reliable when backed by good volume!",
      },
    ],
    progress: 0,
  },
];
