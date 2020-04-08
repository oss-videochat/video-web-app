import React from 'react';
import {observer} from "mobx-react"
import {ChatParticipant} from "./ChatParticipant";
import RoomStore from "../../../stores/RoomStore";
import ParticipantsStore from "../../../stores/ParticipantsStore";
import MyInfo from "../../../stores/MyInfo";
import ChatStore from "../../../stores/ChatStore";
import {SearchBar} from "./SearchBar";
import './ChatParticipantList.css';
import UIStore from "../../../stores/UIStore";

@observer
export class ChatParticipantList extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            searchText: null,
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    handleSearchChange(searchText: string) {
        if (searchText.length > 0) {
            this.setState({searchText});
        } else {
            this.setState({searchText: null});
        }
    }

    getLastMessage(id: string) {
        const store = ChatStore.chatStore[id];
        let lastMessage = undefined;
        if (store) {
            lastMessage = store[store.length - 1]?.content;
        }
        return lastMessage;
    }

    render() {
        return (
            <div className={"chat-participant-wrapper " + (UIStore.store.participantPanel ? "open" : "")}>
                <div className={"chat-participant-wrapper--content"}>
                    <SearchBar onChange={this.handleSearchChange}/>
                    {RoomStore.room ?
                        <div className={"chat-participant-list"}>
                            {
                                (!this.state.searchText || RoomStore.room.name.toLowerCase().includes(this.state.searchText.toLowerCase())) ?
                                    <ChatParticipant onChosen={this.props.onUserSelect} key={"chat-everyone"}
                                                     selected={this.props.selectedUser === "everyone"}
                                                     name={RoomStore.room.name}
                                                     lastMessage={this.getLastMessage("everyone")}/> :
                                    null
                            }
                            {ParticipantsStore.participants
                                .filter(participant => {
                                    return participant.id !== MyInfo.info?.id
                                })
                                .filter(participant => {
                                    if (this.state.searchText) {
                                        return participant.name.toLowerCase().includes(this.state.searchText.toLowerCase());
                                    }
                                    return true;
                                })
                                .map(participant => {
                                    const lastMessage = this.getLastMessage(participant.id);
                                    return <ChatParticipant onChosen={this.props.onUserSelect}
                                                            selected={this.props.selectedUser === participant.id}
                                                            key={"chat-" + participant.id} lastMessage={lastMessage}
                                                            participant={participant}/>
                                })
                            }
                        </div>
                        : null
                    }
                </div>
            </div>
        );
    }
}