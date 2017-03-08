function requestNotification() {
  if (!('Notification' in window)) {
    return;
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

function spawnNotification(title,body) {
  let options = {
    body: body,
    icon: 'http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac7cdb45b.png'
  };
  new Notification(title,options);
}

function scrollToBottom(query) {
  let chat = document.querySelector(query);
  let height = chat.scrollHeight;
  chat.scrollTop = height;
}

function mapNewTime(messages) {
  return messages = messages.map(function(message) {
    return message.time = convertToLocaleTime(message.time);
  });
}

function convertToLocaleTime(date) {
  return new Date(date).toLocaleTimeString();
}

const utils = {
  requestNotification,
  spawnNotification,
  scrollToBottom,
  mapNewTime,
  convertToLocaleTime
};

export default utils;
