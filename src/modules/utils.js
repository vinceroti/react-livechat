function requestNotification() {
  if (!('Notification' in window)) {
    return;
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission();
  }
}

function findAndRemove(array, name){
  let i = array.indexOf(name);
  if (i !== -1){
    array.splice(i, 1);
  }
  return array;
}

function spawnNotification(title,body,url) {
  let options = {
    body: body,
    icon: 'http://www.iconsfind.com/wp-content/uploads/2015/10/20151012_561bac7cdb45b.png',
  };
  let notification = new Notification(title,options);
  notification.onclick = function(event) {
    event.preventDefault();
    window.open(url, '_blank');
    notification.close();
  };

  return notification;
}

function scrollToBottom(query) {
  let elm = document.querySelector(query);
  let height = elm.scrollHeight;
  elm.scrollTop = height;
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
  convertToLocaleTime,
  findAndRemove
};

export default utils;
