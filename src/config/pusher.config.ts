import Pusher from 'pusher';

export const pusher = new Pusher({
    appId: "2161077",
    key: "a7ccab20d24c2a7d2f0b",
    secret: "480f7a30d610d562cfb6",
    cluster: "ap1",
    useTLS: true
});
