import initialCharacters from "./character_builder/characters.json";
import gossip from "./gossip.json";
import bestFriendChat from "./bestFriendChat.json";

const createNameMap = (characters) => {
    return {
        'A': characters.find(c => c.CodeName === 'A').Name,
        'B': characters.find(c => c.CodeName === 'B').Name,
        'C': characters.find(c => c.CodeName === 'C').Name,
        'D': characters.find(c => c.CodeName === 'D').Name,
        'E': characters.find(c => c.CodeName === 'E').Name,
        'X': characters.find(c => c.Guilty).Name
    };
};

const replaceNamesInGossip = (gossipItems, nameMap) => {
    return gossipItems?.map(gossipItem =>
        gossipItem
            .replace(/{A}/g, nameMap['A'])
            .replace(/{B}/g, nameMap['B'])
            .replace(/{C}/g, nameMap['C'])
            .replace(/{D}/g, nameMap['D'])
            .replace(/{E}/g, nameMap['E'])
            .replace(/{X}/g, nameMap['X'])
    );
};

const distributeGossip = (chats) => {
    const nameMap = createNameMap(chats.map(c => c.user));
    chats.forEach(chat => {
        chat.user.Gossip = replaceNamesInGossip(gossip[chat.user.CodeName], nameMap);
    });
};

const assignCulprit = (characters) => {
    const charactersCopy = characters.map(character => ({ ...character }));
    const salesTeam = charactersCopy.filter(c => c.Department === 'Sales');

    salesTeam[Math.floor(Math.random() * salesTeam.length)].Guilty = true;
    return charactersCopy;
};

const assignCodeNames = (characters) => {
    const codeNames = ['A', 'B', 'C', 'D', 'E'];
    const shuffledCodeNames = codeNames.sort(() => Math.random() - 0.5);

    const guiltyCharacter = characters.find(c => c.Guilty);
    guiltyCharacter.CodeName = 'X';

    characters.filter(c => !c.Guilty && !c.BestFriend).forEach((character, index) => {
        character.CodeName = shuffledCodeNames[index];
    });

    return characters;
};

const initializeChats = (characters) => {
    return characters.map((character, index) => ({
        user: character,
        messages: [],
        profile: `Icons_${(index + 1).toString().padStart(2, '0')}.png`
    }));
};

const assignBestFriend = (characters) => {
    const nonGuiltyCharacters = characters.filter(c => !c.Guilty);
    const bestFriend = nonGuiltyCharacters[Math.floor(Math.random() * nonGuiltyCharacters.length)];
    bestFriend.BestFriend = true;

    return characters.map(character => ({ ...character }));
};

const setBestFriendChat = (chats) => {
    const bff = chats.find(chat => chat.user.BestFriend);
    bff.user.BestFriend = true;
    bff.user.Trust = 100;
    bff.messages = bestFriendChat.map((message, index) => ({
        id: index,
        text: message,
        sender: bff.Name
    }));
}

export default function initialize() {
    let characters = assignCulprit(initialCharacters);
    characters = assignBestFriend(characters);
    characters = assignCodeNames(characters);

    const initialChats = initializeChats(characters);
    setBestFriendChat(initialChats);

    distributeGossip(initialChats);

    return initialChats;
}
