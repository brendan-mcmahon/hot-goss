import axios from 'axios';
let openaiService = null;
let model = 'gpt-3.5-turbo';
import contextSnippets from './openAIPromptContext.json';

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

  const coworkerSummary = characters.filter(c => c.Id !== character.Id).map(c => `${c.Name}: ${c.Job}`).join('\n');

  return `${contextSnippets.mainContext}
${character.Guilty ? contextSnippets.guiltyContext : ''}
Your character is:
${description}
You work with the following characters:
${coworkerSummary}`;
}

export const getTrustDelta = async (chat) => {
  const trustMessage = contextSnippets.trustJudgementContext.replace('[[NAME]]', chat.user.Name);
  let chatHistoryConcat = chat.messages.slice(-5).map(msg => ` ${msg.sender}: ${msg.text}`).join('\n');

  const response = await send([{ role: 'system', content: `${trustMessage}\n${chatHistoryConcat}` }]);

  const trustDelta = /[-+]\d+/.exec(response);

  let delta = parseInt(trustDelta);
  return (isNaN(delta)) ? 0 : delta;
}

export const sendMessage = async (chatId, chats, playerName) => {
  const chat = chats[chatId];

  if (chat.user.BestFriend) {
    return getBffAutoResponse();
  }

  try {
    const characterContext = createCharacterContext(chats.map(c => c.user), chat.user);

    const chatHistory = chat.messages.slice(-10).map(msg => ({
      role: msg.sender === playerName ? 'user' : 'assistant',
      content: msg.text
    }));

    return await send([{ role: 'system', content: characterContext }, ...chatHistory]);
  } catch (error) {
    console.error('Error sending message to OpenAI API:', error);
    throw error;
  }
};

const getEvidenceContext = (chats, chatId) => {
  const evidenceChat = chats[chatId].messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

  return `${contextSnippets.submitEvidenceContext}\n${evidenceChat}`;
}

export const sendEvidence = async (chats, chatId) => {
  try {
    if (chats[chatId].messages.length === 0) {
      return 'No evidence to analyze.';
    }

    const response = await send([{ role: 'system', content: getEvidenceContext(chats, chatId) }])
    const characterConfessed = response === '👍';
    const characterIsGuilty = chats[chatId].user.Guilty

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

const send = async (messages) => {
  const response = await openaiService.post('/chat/completions', {
    model,
    messages: messages
  });

  return response.data.choices[0].message.content;
}

const getBffAutoResponse = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options);
  return "Auto Response: I'm on PTO, I'll return on " + formattedDate + ".";
}
