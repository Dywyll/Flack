document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);

    let room = 'general';

    joinRoom(room);

    // Display messages
    socket.on('message', data => {
        if (data.messages) {
            data.messages.forEach(message => {
                appendMessage(message);
            })
        }
        else {
            printSystemMessage(data.message);
        }

        updateScrollToBottom();
    });

    // Send message
    document.querySelector('#send-message').onclick = () => {
        socket.send({
            'message': document.querySelector('#user-message').value,
            'username': username,
            'room': room
        });

        // Clear input area
        document.querySelector('#user-message').value = '';
    };

    // Room selection
    document.querySelectorAll('.select-room').forEach(paragraph => {
        paragraph.onclick = () => {
            let newRoom = paragraph.innerHTML;

            if (newRoom === room) {
                const message = `You are already in this room.`;
                printSystemMessage(message);
            }
            else {
                leaveRoom(room);
                joinRoom(newRoom);
                room = newRoom;
            }
        };
    });

    // Append message
    function appendMessage(context) {
        const paragraph = document.createElement('p');
        const span = document.createElement('span');
        const timestamp = document.createElement('span');
        const line = document.createElement('br');

        span.innerHTML = context.username;
        timestamp.innerHTML = context.timestamp;

        timestamp.style.fontSize = 'small';

        paragraph.innerHTML = span.outerHTML + line.outerHTML + context.message + line.outerHTML + timestamp.outerHTML;

        document.querySelector('#display-message-section').append(paragraph);
    }

    // Update scroll to bottom
    function updateScrollToBottom() {
        const element = document.querySelector('#display-message-section');

        element.scrollTop = element.scrollHeight;
    }

    // Leave room
    function leaveRoom(room) {
        socket.emit('leave', {
            'username': username,
            'room': room
        })
    }

    // Join room
    function joinRoom(room) {
        socket.emit('join', {
            'username': username,
            'room': room
        });

        // Clear message area
        document.querySelector('#display-message-section').innerHTML = '';

        // Autofocus on input
        document.querySelector('#user-message').focus();
    }

    // Print system message
    function printSystemMessage(message) {
        const paragraph = document.createElement('p');

        paragraph.innerHTML = message;

        document.querySelector('#display-message-section').append(paragraph);

        updateScrollToBottom();
    }
});