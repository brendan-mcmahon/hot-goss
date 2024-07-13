const mockCharacters = [
    { Id: 0, Name: 'Alice', Department: 'Engineering', CodeName: '', Guilty: false },
    { Id: 1, Name: 'Bob', Department: 'Sales', CodeName: '', Guilty: false },
    { Id: 2, Name: 'Charlie', Department: 'Marketing', CodeName: '', Guilty: false },
    { Id: 3, Name: 'Dave', Department: 'HR', CodeName: '', Guilty: false },
    { Id: 4, Name: 'Eve', Department: 'Finance', CodeName: '', Guilty: false },
    { Id: 5, Name: 'Mallory', Department: 'Sales', CodeName: '', Guilty: false },
    { Id: 6, Name: 'Walter', Department: 'Engineering', CodeName: '', Guilty: false }
];

jest.mock('./character_builder/characters.json', () => mockCharacters);
jest.mock('./gossip.json', () => ({
    'A': ['{A} and {B} are friends.'],
    'B': ['{B} and {C} had a meeting.'],
    'C': ['{C} is working on a project.'],
    'D': ['{D} is on vacation.'],
    'E': ['{E} loves coding.'],
    'X': ['{X} is the culprit.']
}));
jest.mock('./bestFriendChat.json', () => ['Hey, how are you?', 'Wanna grab lunch?']);

describe('initialize function', () => {
    let initialize;

    beforeEach(() => {
        // Reset modules before each test to apply fresh mocks
        jest.resetModules();
        initialize = require('./startup.js').default;
    });

    it('should assign a guilty character', () => {
        const initialChats = initialize();
        const guiltyCharacter = initialChats.find(chat => chat.user.Guilty);
        console.log("Initial Chats:", initialChats);

        expect(guiltyCharacter).toBeDefined();
        expect(guiltyCharacter.user.CodeName).toBe('X');
    });

    it('should assign code names to characters', () => {
        const initialChats = initialize();
        const codeNames = initialChats.map(chat => chat.user.CodeName);

        expect(codeNames).toContain('A');
        expect(codeNames).toContain('B');
        expect(codeNames).toContain('C');
        expect(codeNames).toContain('D');
        expect(codeNames).toContain('E');
        expect(codeNames).toContain('X');
    });

    // should not assign a code name to Best Friend
    it('should not assign a code name to the best friend', () => {
        const initialChats = initialize();
        const bestFriendChat = initialChats.find(chat => chat.user.BestFriend);

        expect(bestFriendChat.user.CodeName).toBe('');
    });

    it('should replace names in gossip', () => {
        const initialChats = initialize();
        const gossipWithNames = initialChats.flatMap(chat => chat.user.Gossip);

        // 'A': ['Alice and Bob are friends.'],
        // 'B': ['Bob and Charlie had a meeting.'],
        // 'C': ['Charlie is working on a project.'],
        // 'D': ['Dave is on vacation.'],
        // 'E': ['Eve loves coding.'],
        // 'X': ['{X} is the culprit.']


    });

    it('should assign a best friend and set trust to 100', () => {
        const initialChats = initialize();
        const bestFriendChat = initialChats.find(chat => chat.user.BestFriend);

        expect(bestFriendChat).toBeDefined();
        expect(bestFriendChat.user.Trust).toBe(100);
        expect(bestFriendChat.messages.length).toBeGreaterThan(0);
    });
});
