export interface IEvent {
    id: number;
    title: string;
    lobby: string;
    address: string;
    beginDate: string, //lebo serializacia https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants
    prices: string; //ukladanie ako number[] spôsobovalo problémy s validáciou
    numOfRows: number;
    numOfSeats: number;
}