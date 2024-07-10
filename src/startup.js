import initialCharacters from "./character_builder/characters.json";
import gossip from "./gossip.json";
import bestFriendChat from "./bestFriendChat.json"

const replaceName = (gossipItems, chats) => {
    const culprits = chats.map(chat => chat.user).filter(user => user.Guilty);
    const financeCulprit = culprits.find(culprit => culprit.Department === 'Finance');
    const engineeringCulprit = culprits.find(culprit => culprit.Department === 'Engineering');
    const salesCulprit = culprits.find(culprit => culprit.Department === 'Sales');

    return gossipItems.map(gossipItem => ({
        ...gossipItem,
        gossip: gossipItem.gossip
            .replace(/The Finance Culprit/g, financeCulprit.Name)
            .replace(/The Engineering Culprit/g, engineeringCulprit.Name)
            .replace(/The Sales Culprit/g, salesCulprit.Name)
    }));
};

const distributeGossip = (chats) => {
    const newGossip = replaceName([...gossip], chats);

    newGossip.forEach(gossipItem => {
        const applicableChats = chats.filter(chat =>
            gossipItem.departments.includes(chat.user.Department.toLowerCase())
            && !chat.user.Guilty
            && !chat.user.Gossip.length
        );

        if (applicableChats.length > 0) {
            const randomChat = applicableChats[Math.floor(Math.random() * applicableChats.length)];
            randomChat.user.Gossip.push(gossipItem.gossip);
        }
    });
};

const setCulprits = () => {
    const characters = initialCharacters.map(character => ({ ...character }));
    const departments = ['Engineering', 'Finance', 'Sales'];

    departments.forEach(department => {
        const filtered = characters.filter(c => c.Department === department);
        filtered[Math.floor(Math.random() * filtered.length)].Guilty = true;
    });

    return characters;
};


export default function initialize() {
    let characters = setCulprits();

    const initialChats = characters.map(character => ({
        user: character,
        messages: []
    }));

    const bestFriend = characters.filter(c => !c.Guilty)[Math.floor(Math.random() * 17)];
    initialChats[bestFriend.Id].user.BestFriend = true;
    initialChats[bestFriend.Id].user.Trust = 100;
    initialChats[bestFriend.Id].messages = [...bestFriendChat].map((message, index) => (
        {
            id: index,
            text: message,
            sender: bestFriend.Name
        })
    );

    distributeGossip(initialChats);

    return initialChats;
};
