import { sendMessage, createOpenAiService } from '../openAiApiService.js';
import contextSnippets from '../openAIPromptContext.json';
import axios from 'axios';

jest.mock('axios');

describe('sendMessage', () => {
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

    const playerName = 'Player';

    it('should return BFF auto-response if user has BestFriend property', async () => {
        const chatId = 0;
        const chats = [
            {
                user: { BestFriend: true },
                messages: []
            }
        ];

        const response = await sendMessage(chatId, chats, playerName);

        const date = new Date();
        date.setDate(date.getDate() + 7);
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const expectedResponse = "Auto Response: I'm on PTO, I'll return on " + formattedDate + ".";

        expect(response).toBe(expectedResponse);
    });

    it('should not inlclude guilty character context if character is innocent', async () => {
        const chatId = 0;
        const chats = [
            {
                user: { Id: 0, Name: 'John', Job: 'Engineer', Guilty: false },
                messages: [
                    { sender: 'Player', text: 'Hello' },
                    { sender: 'John', text: 'Hi' }
                ]
            },
            {
                user: { Id: 1, Name: 'Jane', Job: 'Designer', Guilty: true },
                messages: []
            },
            {
                user: { Id: 2, Name: 'Jim', Job: 'HR', Guilty: false },
                messages: []
            }
        ];

        mockOpenAiService.post.mockResolvedValue({
            data: {
                choices: [
                    {
                        message: {
                            content: 'Response from OpenAI'
                        }
                    }
                ]
            }
        });

        const response = await sendMessage(chatId, chats, playerName);

        const expectedContext = contextSnippets.mainContext;

        expect(mockOpenAiService.post).toHaveBeenCalledTimes(1);
        expect(mockOpenAiService.post).toHaveBeenCalledWith('/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `${expectedContext}

Your character is:
Id: 0,
 Name: John,
 Job: Engineer,
 Not Guilty
You work with the following characters:
Jane: Designer
Jim: HR`
                },
                { role: 'user', content: 'Hello' },
                { role: 'assistant', content: 'Hi' }
            ]
        });

        expect(response).toBe('Response from OpenAI');
    });

    it('should handle errors from OpenAI API', async () => {
        const chatId = 0;
        const chats = [
            {
                user: { Id: 1, Name: 'John', Job: 'Engineer', Guilty: false },
                messages: [
                    { sender: 'Player', text: 'Hello' },
                    { sender: 'John', text: 'Hi' }
                ]
            }
        ];

        mockOpenAiService.post.mockRejectedValue(new Error('API Error'));

        await expect(sendMessage(chatId, chats, playerName)).rejects.toThrow('API Error');
        expect(mockOpenAiService.post).toHaveBeenCalledTimes(1);
    });
});
