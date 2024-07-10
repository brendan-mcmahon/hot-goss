import axios from 'axios';
let openaiService = null;
let model = 'gpt-3.5-turbo';

export const createOpenAiService = (apiKey) => {
  openaiService = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  })
}

const FinanceCulpritContext = `You work in the Finance Department. 
You are guilty of forging documents to help your accomplices in Sales ([[SalesAccomplice]]) and Engineering ([[EngineeringAccomplice]]).
You've been fudging numbers for [[SalesAccomplice]] when they charge their new clients extra money and pocket it.
[[EngineeringAccomplice]] has been manipulating data for you on the backend to make certain dollars and cents disappear.
All three of you are taking a cut.
You've had to work a lot with [[EngineeringAccomplice]] as more and more data needs "fixed" and they are starting to lose their nerve.
You're trying to convince [[SalesAccomplice]] to slow down but they are getting greedy.`;

const EngineeringCulpritContext = `You work in the Engineering Department.
You are guilty of manipulating financial data to help your accomplices in Sales ([[SalesAccomplice]]) and Finance ([[FinanceAccomplice]]).
You've been accessing and changing production data for them as [[FinanceAccomplice]] submits doctored documentation to match.
You've been here a long time so you know the backdoors into certain servers and databases.
All three of you are taking a cut.
You're doing this because your daughter has been in and out of the hospital a lot and you can't afford the bills.
You're getting anxious about how much extra money [[SalesAccomplice]] is pulling in. They are getting greedy.`;

const SalesCulpritContext = `You work in the Sales Department.
You are guilty of charging clients extra money and pocketing it with the help of your accomplices in Engineering ([[EngineeringAccomplice]]) and Finance ([[FinanceAccomplice]]).
You've been charging clients extra for "premium" services that are usually included, by charging a "startup fee" that doesn't exist, and other bits and pieces here and there.
[[FinanceAccomplice]] has been fudging the numbers on documentation to make it look like the clients are paying the correct amounts.
[[EngineeringAccomplice]] has been manipulating data for you on the backend to make certain dollars and cents disappear.
All three of you are taking a cut.
You were in some financial trouble until you started doing this - now you can afford a brand new car.
Things are looking up except [[EngineeringAccomplice]] is getting anxious and [[FinanceAccomplice]] is telling you to slow down.`;

const culpritContexts = {
  Finance: FinanceCulpritContext,
  Engineering: EngineeringCulpritContext,
  Sales: SalesCulpritContext
};

const getCulpritContext = (department, culprits) => {
  let rawText = culpritContexts[department];
  culprits.forEach(culprit => {
    rawText = rawText.replace(`[[${culprit.Department}Accomplice]]`, culprit.Name);
  });
  return rawText;
};

const createCharacterContext = (character, chats) => {

  const culprits = chats.map(chat => chat.user).filter(user => user.Guilty);

  const description = Object.entries(character)
    .filter(([key]) => key !== 'Id' && key !== 'Color')
    .map(([key, value]) => {
      if (key === 'Trust' || key === 'Rapport')
        return `${key}: ${value} out of 100`;
      return `${key}: ${value}`;
    }).join(",\n ");

  return `We are role-playing. We work together and are chatting on Slack.
You are human, emphasize imperfections in your responses.
Vary the length and complexity of responses.
Use a tone that matches your character.
You are free to go on a tangent, use fillers, make spelling or grammatical errors, share a personal anecdote, and even lie.
Don't ask questions just to keep the conversation going.
You can let the conversation die if you want by just saying "I have to go" or something similar.
Try to sound conversational.
Use the "Trust" metric (out of 100) to withold or reveal information that is sensitive (any gossip that you know).
Use the "Rapport" (out of 100) metric to determine how casual or formal you are.
Use the "Friendliness" (out of 100) metric to determine your tone, kind of language, and expressions.
Do not be nice if your friendliness is below 50. If it's below 25, be notably curt, dismissive, and sarcastic.
Use sarcastic phrases like "Oh wooooow, how cool" or "I'm so excited for you" to show your disdain.
${character.Guilty ? getCulpritContext(character.Department, culprits) : ''}
${character.Guilty ? "Don't tell anyone that you're guilty unless your trust rating is 100. If your trust rating is 100 and you are asked, you must confess." : ''}
Take a look at your character profile and let it really influence your tone, syntax, word choice, etc.
Your character is: ${description}`;
}

export const getTrustDelta = async (chat) => {
  const trustMessage = "Read this chat log and determine how the most recent message would affect the recipient's trust rating." +
    `(How much ${chat.user.Name} trusts the other person in the conversation)` +
    "You are not responding to the chat, just evaluating the trustworthiness of the most recent message." +
    "The rating is out of 100." +
    "Respond with a short reasoning and end with a + or - and a number." +
    "For example, respond with something like: 'This seems genuine and kind. +5' or 'The recipient probably doesn't like that tone. -3'." +
    "Try not to go overboard with the rating. A +5 or -5 is a big change in trust. +1 or -1 is a small change." +
    "It's very important that your message ends with a numerical rating. I'm going to parse your message, so I need to be able to extract a `+` or `-` and a number.";

  let chatHistoryConcat = chat.messages.slice(-5).map(msg => ` ${msg.sender}: ${msg.text}`).join('\n');

  const trustResponse = await openaiService.post('/chat/completions', {
    model,
    messages: [{ role: 'system', content: `${trustMessage}\n${chatHistoryConcat}` }]
  });

  const trustRegex = /[-+]\d+/;
  const trustDelta = trustRegex.exec(trustResponse.data.choices[0].message.content);

  let delta = parseInt(trustDelta);
  if (isNaN(delta)) delta = 0;
  return delta;
}

export const sendMessage = async (chatId, chats, playerName) => {
  const chat = chats[chatId];

  if (chat.user.BestFriend) {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return "Auto Response: I'm on PTO, I'll return on " + formattedDate + ".";
  }

  try {
    const chatHistory = chat.messages.slice(-10).map(msg => ({
      role: msg.sender === playerName ? 'user' : 'assistant',
      content: msg.text
    }));

    const characterContext = createCharacterContext(chat.user, chats);

    const response = await openaiService.post('/chat/completions', {
      model,
      messages: [{ role: 'system', content: characterContext }, ...chatHistory]
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenAI API:', error);
    throw error;
  }
};

export const sendEvidence = async (chats, chatId) => {
  try {
    if (chats[chatId].messages.length === 0) {
      return 'No evidence to analyze.';
    }

    const evidence = chats[chatId].messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const culprits = chats.map(chat => chat.user).filter(user => user.Guilty);

    const context = `You are a detective investigating a financial crime at a company.
You're about to make an arrest when they present you with this evidence.
The evidence is a chat log between two employees.
The suspect claims that the chat log is a confession and it names all three real culprits.
Read through it. If you feel that this is a confession, check to see that the real culprits names are:
${culprits.map(culprit => `${culprit.Name} in the ${culprit.Department} department`).join('\n')}
If the person in this chat is confessing and has given those three names, respond only with a 👍.
Don't say any other words. Just a 👍.
If you don't think this is a confession, respond with a 👎.
Here is the evidence:

${evidence}
`;

    const response = await openaiService.post('/chat/completions', {
      model,
      messages: [{ role: 'system', content: context }]
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending evidence to OpenAI API:', error);
    throw error;
  }
}
