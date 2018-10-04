function roomCheck(roomArray, newRoom) {
  var roomCheck = roomArray.filter(el=> {return el.roomName == newRoom})
  if (roomCheck.length > 0) {
    return false
  } else {
    return true
  }

}


function joinGame(roomArray, roomName, userName) {
  var roomIndex = findRoomIndex(roomArray, roomName);
  if(roomIndex !== -1 && !roomArray[roomIndex].full){
    roomArray[roomIndex].client = userName;
    roomArray[roomIndex].full = true;
    return {bool: true, index: roomIndex}
  } else {
    return { bool: false };
  }
}


function deleteRoom(roomArray, roomName) {
  var roomIndex = findRoomIndex(roomArray, roomName);
  roomArray.splice(roomIndex, 1);
}

function findRoomIndex(roomArray, roomName){
  return roomArray.findIndex(function(el){return el.roomName == roomName})
}


module.exports = {
  roomCheck: roomCheck,
  joinGame : joinGame,
  deleteRoom: deleteRoom,
  findRoomIndex: findRoomIndex
}