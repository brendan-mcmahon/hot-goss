import { getTrustDelta, createOpenAiService } from '../openAiApiService.js';
import axios from 'axios';
import contextSnippets from '../openAIPromptContext.json';

jest.mock('axios');

describe('getTrustDelta', () => {
  let mockOpenAiService;
  const apiKey = 'test-api-key';

  beforeAll(() => {
    axios.create.mockReturnValue({
      post: jest.fn()
    });

    createOpenAiService(apiKey);
    mockOpenAiService = axios.create();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const chat = {
    user: { Name: 'John' },
    messages: [
      { sender: 'John', text: 'Message 1' },
      { sender: 'Player', text: 'Message 2' },
      { sender: 'John', text: 'Message 3' },
      { sender: 'Player', text: 'Message 4' },
      { sender: 'John', text: 'Message 5' },
    ]
  };

  it('should correctly construct trust judgement context and chat history', async () => {
    const trustJudgementContext = contextSnippets.trustJudgementContext.replace('[[NAME]]', 'John');
    const chatHistoryConcat = ' John: Message 1\n Player: Message 2\n John: Message 3\n Player: Message 4\n John: Message 5';

    mockOpenAiService.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: '+5'
            }
          }
        ]
      }
    });

    const trustDelta = await getTrustDelta(chat);

    expect(mockOpenAiService.post).toHaveBeenCalledTimes(1);
    expect(mockOpenAiService.post).toHaveBeenCalledWith('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `${trustJudgementContext}\n${chatHistoryConcat}`
        }
      ]
    });

    expect(trustDelta).toBe(5);
  });

  it('should return 0 if the trust delta is not a valid number', async () => {
    mockOpenAiService.post.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: 'Invalid response'
            }
          }
        ]
      }
    });

    const trustDelta = await getTrustDelta(chat);

    expect(trustDelta).toBe(0);
  });

  it('should handle errors from OpenAI API', async () => {
    mockOpenAiService.post.mockRejectedValue(new Error('API Error'));

    await expect(getTrustDelta(chat)).rejects.toThrow('API Error');
    expect(mockOpenAiService.post).toHaveBeenCalledTimes(1);
  });
});
