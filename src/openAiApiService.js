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

const createCharacterContext = (characters, character) => {
  const description = Object.entries(character)
    .filter(([key]) => key !== 'Id' && key !== 'Color')
    .map(([key, value]) => {
      switch (key) {
        case 'Trust':
        case 'Rapport':
        case 'Friendliness':
          return `${key}: ${value} out of 100`;
        case 'Guilty':
          return value ? 'Guilty' : 'Not Guilty';
        case 'BestFriend':
        case 'CodeName':
          return;
        case 'Gossip':
          return `${key}: ${value.join('\n')}`;
        default:
          return `${key}: ${value}`;
      }
    }).join(",\n ");

    const coworkerSummary = characters.map(c => `${c.Name}: ${c.Job}`).join('\n');

  return `We are role-playing. We work together and are chatting on Slack.
You are human, emphasize imperfections in your responses.
Vary the length and complexity of responses.
Use a tone that matches your character.
You are free to go on a tangent, use fillers, make spelling or grammatical errors, share a personal anecdote, and even lie.
Don't ask questions just to keep the conversation going.
You can let the conversation die if you want by just saying "I have to go" or something similar.
Try to sound conversational.
Use the "Trust" metric (out of 100) to withold or reveal information that is sensitive (any gossip that you know).
Do not reveal any gossip if your trust rating is below 50. If it's below 25, be notably secretive and evasive.
Only give the most interesting gossip if your trust rating is above 75.
Use the "Rapport" (out of 100) metric to determine how casual or formal you are.
Use the "Friendliness" (out of 100) metric to determine your tone, kind of language, and expressions.
Do not be nice if your friendliness is below 50. If it's below 25, be notably curt, dismissive, and sarcastic.
Use sarcastic phrases like "Oh wooooow, how cool" or "I'm so excited for you" to show your disdain.
${character.Guilty ? "Don't tell anyone that you're guilty unless your trust rating is 100. If your trust rating is 100 and you are asked, you must confess." : ''}
Take a look at your character profile and let it really influence your tone, syntax, word choice, etc.
Your character is: ${description}`;
}

export const getTrustDelta = async (chat) => {
  const trustMessage = "Read this chat log and determine how the most recent message would affect the recipient's trust rating." +
    `(How much ${chat.user.Name} trusts the other person in the conversation)` +
    "You are not responding to the chat, just evaluating the trustworthiness of the most recent message." +
    "If someone is giving out gossip, the trust should go up proportional to how dramatic the gossip is." +
    "The rating is out of 100." +
    "Respond with a short reasoning and end with a + or - and a number." +
    "For example, respond with something like: 'This seems genuine and kind. +5' or 'The recipient probably doesn't like that tone. -3'." +
    "Try not to go overboard with the rating. A +10 or -10 is a big change in trust. +3 or -3 is a small change." +
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

    const characterContext = createCharacterContext(chats.map(c => c.users), chat.user);

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

const getEvidenceContext = (chats, chatId) => {
  const evidenceChat = chats[chatId].messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

  return `You are a detective investigating a financial crime at a company.
You're about to make an arrest when they present you with this evidence.
The evidence is a chat log between two employees.
The suspect claims that the chat log is a confession.
Read through it. If the person in this chat is confessing, respond only with a 👍.
Don't say any other words. Just a 👍.
If you don't think this is a confession, respond with a 👎.
Here is the evidence:

${evidenceChat}
`;
}

export const sendEvidence = async (chats, chatId) => {
  try {
    if (chats[chatId].messages.length === 0) {
      return 'No evidence to analyze.';
    }

    const characterIsGuilty = chats[chatId].user.Guilty

    const response = await openaiService.post('/chat/completions', {
      model,
      messages: [{ role: 'system', content: getEvidenceContext(chats, chatId) }]
    });
    const characterConfessed = response.data.choices[0].message.content === '👍';

    if (characterIsGuilty && characterConfessed) {
      return { success: true, message: 'You got it! The suspect has confessed.' };
    } else if (!characterIsGuilty && characterConfessed) {
      return { success: false, message: 'You somehow got the wrong person to confess. How does that feel?' };
    } else if (characterIsGuilty && !characterConfessed) {
      return { success: false, message: 'You found the culprit, but failed to get a confession.' }
    } else if (!characterIsGuilty && !characterConfessed) {
      return { success: false, message: 'You failed to get a confession from the suspect, and this wasn\'t even the right person!' };
    }
  } catch (error) {
    console.error('Error sending evidence to OpenAI API:', error);
    throw error;
  }
}
